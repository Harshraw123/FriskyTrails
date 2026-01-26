import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from '../../lib/utils'

const CardCarousel = ({
  items,
  className,
  isLoading = false,
  renderItem,
}) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    checkScrollability();

    const handleResize = () => {
      checkScrollability();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [items?.length]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = container.querySelector(".carousel-card")?.clientWidth || 300;
    const gap = 16; // gap-4 = 16px
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    setTimeout(checkScrollability, 300);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cn("relative", className)}>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="carousel-card flex-shrink-0 w-[280px] sm:w-[300px] lg:w-[calc(25%-12px)]"
            >
              <div className="bg-card rounded-xl overflow-hidden border shadow-sm animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <div className={cn("relative group", className)}>
      {/* Left Arrow */}
      {(canScrollLeft || canScrollRight) && (
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={cn(
            "absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow hover:bg-orange-500 hover:text-white transition",
            "hidden lg:flex lg:items-center lg:justify-center",
            !canScrollLeft && "opacity-30 cursor-not-allowed hover:scale-100"
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Cards */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollability}
        className={cn(
          "flex gap-4 overflow-x-auto scrollbar-hide",
          "snap-x snap-mandatory",
          "pb-2 -mb-2",
          "touch-pan-x"
        )}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.id ?? item.slug ?? index}
            className={cn(
              "carousel-card flex-shrink-0 snap-start",
              "w-[280px] sm:w-[300px]",
              "lg:w-[calc(25%-12px)]"
            )}
          >
            {renderItem ? (
              renderItem(item)
            ) : (
              <div className="bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-card-foreground text-lg mb-2 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      {(canScrollLeft || canScrollRight) && (
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={cn(
            "absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow hover:bg-orange-500 hover:text-white transition",
            "hidden lg:flex lg:items-center lg:justify-center",
            !canScrollRight && "opacity-30 cursor-not-allowed hover:scale-100"
          )}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

CardCarousel.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  renderItem: PropTypes.func,
};

export default CardCarousel;
