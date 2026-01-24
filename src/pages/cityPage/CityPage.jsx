import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import LoadingSpinner from "./Loading"
import { getCityWithBlogs } from "../../api/admin.api"
import CardCarousel from "../components/Carousel"

const CityPage = () => {
  const { slug } = useParams()

  const [city, setCity] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCityWithBlogs = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await getCityWithBlogs(slug)
        
        // ApiResponse wrapper handling: result.data contains { city, blogs }
        if (result?.data) {
          setCity(result.data.city)
          setBlogs(result.data.blogs || [])
        } else {
          setError("City data not found")
        }
      } catch (error) {
        console.error("Error fetching city:", error)
        setError(error?.response?.data?.message || error?.message || "Failed to fetch city data")
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchCityWithBlogs()
    }
  }, [slug])

  if (loading) return <LoadingSpinner />

  if (error || !city) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">{error || "City not found"}</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
    
      <div
  className="w-full mt-20 lg:mt-[7rem]"
  style={{
    marginTop:
      typeof window !== "undefined"
        ? window.innerWidth === 1024 && window.innerHeight === 600
          ? "3.9rem"     // Nest Hub → kam gap
          : window.innerWidth === 1024 && window.innerHeight === 1366
          ? "9.5rem"     // 1024×1366 → thoda zyada gap
          : undefined  // baaki sab Tailwind se
        : undefined,
  }}
>
  <img
    src={city.image}
    alt={city.name}
    className="w-full h-64 sm:h-80 md:h-96 object-cover object-right sm:object-center"
  />
</div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* HEADER */}
        <section className="border-b pb-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            {city.name}
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl">
            Experiential journeys will make you a storyteller
          </p>
          {/* {city.howToReach && (
            <div className="mt-4 p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-700 mb-2">How to Reach</h3>
              <p className="text-gray-700">{city.howToReach}</p>
            </div>
          )} */}
        </section>

        {/* BLOGS */}
        <h2 className="text-2xl sm:text-3xl font-semibold mt-8 mb-6">
          Top Blogs in {city.name}
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

export default CityPage




