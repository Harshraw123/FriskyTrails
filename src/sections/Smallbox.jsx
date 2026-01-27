import { Link } from "react-router-dom";

const Smallbox = () => {
  const data = [
    { name: "Goa", image: "/nextimages/4.png", slug: "goa" },
    { name: "Himachal", image: "/nextimages/5.png", slug: "himachal-pradesh" },
    { name: "Kashmir", image: "/nextimages/2.png", slug: "jammu-and-kashmir" },
    { name: "Kerala", image: "/nextimages/6.png", slug: "kerala" },
    { name: "Arunachal ", image: "/destinations/Arunachal.png", slug: "arunachal-pradesh" },
    { name: "Andaman", image: "/destinations/Andaman.png", slug: "andaman-and-nicobar-islands" },
    { name: "Meghalaya", image: "/nextimages/1.png", slug: "meghalaya" },
    { name: "Rajasthan", image: "/destinations/Rajasthan.png", slug: "rajasthan" },
    { name: "Uttarakhand", image: "/destinations/Uttarakhand.png", slug: "uttarakhand" },
  ];

  return (
    <>
      {data.map((item, index) => (
        <Link
          key={index}
          to={`/state/${item.slug}`}
          className="
            group relative overflow-hidden
            aspect-square
            w-full
            rounded-md md:rounded-lg
            transition-transform duration-300
            hover:scale-[1.03]
          "
          style={{
            backgroundImage: `url(${item.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>

          {/* text */}
          <div className="relative flex items-center justify-center h-full w-full">
            <h3 className="text-gray-200 font-semibold tracking-tight text-[0.6rem] sm:text-xs md:text-sm lg:text-base">
              {item.name}
            </h3>
          </div>
        </Link>
      ))}
    </>
  );
};

export default Smallbox;
