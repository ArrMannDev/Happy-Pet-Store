import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Banner from "../assets/img/Banner.png";

const banners = [
  {
    id: 1,
    image:
      "https://www.petso.com.au/cdn/shop/collections/ROYAL_CANIN.jpg?v=1745716155",
    title: "Nurturing Your Family Members with Care",
    subtitle: "Up to 50% Off‼️",
  },
  {
    id: 2,
    image: Banner,
    title: "Best Pet Store For Your Homies",
    subtitle: "Everything Your Furry Friends Need 🐾",
  },
];

export default function Hero() {
  return (
    <div className="w-full p-4">
      <Carousel className="relative w-full">
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="relative h-[550px] w-full overflow-hidden rounded-sm">
                {/* Banner Image */}
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="h-full w-full border shadow-sm"
                />

                {/* Dark Overlay */}
                {/* <div className="absolute inset-0 bg-black/40" /> */}

                {/* Text Content */}
                <div className="absolute left-15 top-100 -translate-y-1/2 text-white">
                  <h1 className="w-[500px] text-4xl font-light leading-10 tracking-wide text-black ">
                    {banner.title}
                  </h1>

                  <p className="mt-5 text-lg text-red-500">{banner.subtitle}</p>

                  <button className="mt-6 rounded-xl bg-[var(--color-bg)] px-6 py-3 text-white font-semibold hover:bg-[#3D6846] transition">
                    Shop Now 🛒
                  </button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons */}
        <CarouselPrevious className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-white text-black hover:bg-gray-200" />

        <CarouselNext className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-white text-black hover:bg-gray-200" />
      </Carousel>
    </div>
  );
}
