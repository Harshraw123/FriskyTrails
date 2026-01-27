import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

import { getCountryWithBlogs } from "../../api/admin.api"
import CardCarousel from "../components/Carousel"
import FriskyLoader from "../../components/Loader"

const CountryPage = () => {
  const { slug } = useParams()

  const [country, setCountry] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCountryWithBlogs = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await getCountryWithBlogs(slug)

        // ApiResponse wrapper handling: result.data contains { country, blogs }
        if (result?.data) {
          setCountry(result.data.country)
          setBlogs(result.data.blogs || [])
        } else {
          setError("Country data not found")
        }
      } catch (error) {
        console.error("Error fetching country:", error)
        setError(error?.response?.data?.message || error?.message || "Failed to fetch country data")
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchCountryWithBlogs()
    }
  }, [slug])

  if (loading) return <FriskyLoader />

  if (error || !country) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">{error || "Country not found"}</p>
          <Link
            to="/"
            className="text-orange-500 hover:text-orange-600 underline"
          >
            Go back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <div
  className="w-full mt-12 lg:mt-[6.7rem]"
        style={{
          marginTop:
            typeof window !== "undefined"
              ? window.innerWidth === 1024 && window.innerHeight === 600
                ? "4.8rem" // Nest Hub → less gap
                : window.innerWidth === 1024 && window.innerHeight === 1366
                ? "10.5rem" // iPad Pro/Tall Screens → more gap
                : undefined
              : undefined,
        }}
      >
        <img
          src={country.image}
          alt={country.name}
          className="w-full h-64 sm:h-80 md:h-96 object-cover object-right sm:object-center"
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* HEADER */}
        <section className="border-b pb-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            {country.name}
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl">
            Experiential journeys will make you a storyteller
          </p>
        </section>

        {/* BLOGS */}
        <h2 className="text-2xl sm:text-3xl font-semibold mt-8 mb-6">
          Top Blogs in {country.name}
        </h2>

        <CardCarousel
          className="mt-2"
          items={blogs.map((blog) => ({
            ...blog,
            imageUrl: blog.image || blog.coverImage || "/placeholder.png",
          }))}
          renderItem={(blog) => (
            <Link
              to={`/blog/${blog.slug}`}
              className="bg-white rounded-2xl shadow overflow-hidden block h-full"
            >
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 font-semibold line-clamp-2">
                {blog.title}
              </div>
            </Link>
          )}
        />

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <Link
            to="/blog"
            className="px-10 py-4 font-semibold bg-white border shadow-xl rounded-full hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-400 hover:text-white transition"
          >
            More Blogs
          </Link>
        </div>
      </main>
    </div>
  )
}

export default CountryPage


