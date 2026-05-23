import { useEffect, useState } from "react";
import { getAllCategories } from "@/api/category-api";
import dogImage from "../assets/img/dog.jpg";
import { Link } from "react-router-dom";

const categoriesImage = [
  dogImage,
  dogImage,
  dogImage,
  dogImage,
  dogImage,
  dogImage,
  dogImage,
];

export default function ItemCategory() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCategories().then((data) => {
      setCategories(data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <section className="w-full py-16 px-6 bg-white">
      {/* Section Header */}
      <div className="text-center mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#0c381b] mb-2">
          Explore Our Store
        </p>
        <h2 className="text-4xl font-bold text-gray-900">
          Shop By{" "}
          <span
            className="relative inline-block"
            style={{
              backgroundImage: "linear-gradient(135deg, #0c381b, #1a6b36)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Category
          </span>
        </h2>
        <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-[#0c381b] opacity-30" />
      </div>

      {/* Category Grid */}
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : categories.map((category: any, index: number) => (
              <CategoryCard
                key={category.id}
                category={category}
                image={categoriesImage[index % categoriesImage.length]}
              />
            ))}
      </div>
    </section>
  );
}

/* ── Category Card ───────────────────────────────── */
function CategoryCard({ category, image }: { category: any; image: string }) {
  return (
    <Link to={`/category/${category.category}`}>
      <div
        className="group relative w-40 h-40 rounded-2xl overflow-hidden cursor-pointer shadow-md"
        style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform =
            "translateY(-6px) scale(1.03)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 20px 40px rgba(12, 56, 27, 0.25)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform =
            "translateY(0) scale(1)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 4px 12px rgba(0,0,0,0.1)";
        }}
      >
        {/* Background image */}
        <img
          src={image}
          alt={category.category}
          className="w-full h-full object-cover"
          style={{ transition: "transform 0.5s ease" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLImageElement).style.transform =
              "scale(1.1)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")
          }
        />

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(12,56,27,0.85) 0%, rgba(12,56,27,0.1) 55%, transparent 100%)",
          }}
        />

        {/* Label */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
          <span className="text-white text-sm font-semibold tracking-wide drop-shadow-sm">
            {category.category}
          </span>
        </div>

        {/* Hover ring */}
        <div
          className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#0c381b]"
          style={{ transition: "border-color 0.3s ease" }}
        />
      </div>
    </Link>
  );
}

/* ── Skeleton Loader ─────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="w-40 h-40 rounded-2xl overflow-hidden bg-gray-100 animate-pulse shadow-sm" />
  );
}
