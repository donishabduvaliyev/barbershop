import React, { useEffect, useState } from "react";
import { ArrowCircleRightIcon } from "@heroicons/react/outline";
import { useAppContext } from "../context/context";
import { useTranslation } from "react-i18next";
import { CatalogSkeleton } from "./Skeleton";
import FavoriteButton from "./FavoriteButton";




const ServiceCatalog = ({ selectedCategory }) => {
  const { navigate, services, categories, feedData, isLoading } = useAppContext();
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const { t } = useTranslation();

  // const [filteredServices , setFilteredServices] = useState()

  const visibleCategories =
    selectedCategory === "All"
      ? categories
      : categories.filter((cat) => cat.title.en === selectedCategory);


  return (
    <div className="bg-bg text-text-muted">
      {isLoading ? (
        <CatalogSkeleton />
      ) : (
        <div className="pt-2 pb-6 px-4">
          {visibleCategories.map((category) => {
            const filteredServices = feedData.find(
              (service) => service.category === category.title.en
            );

            const shopsForCategory = filteredServices?.shops || [];

            return (
              <div key={category.id} className="mb-7">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-base font-semibold text-text tracking-tight">{category.title[lang]}</h2>
                  <button
                    className="text-xs font-medium text-accent hover:text-accent-hover tracking-wide uppercase press-spring transition-colors"
                    onClick={() => navigate(`/search?category=${encodeURIComponent(category.title.en)}`)}
                  >
                    {t("SeeAll")}
                  </button>
                </div>
                <div className="flex space-x-3.5 overflow-x-auto pb-3 pt-1 scrollbar-hide -mx-4 px-4">
                  {shopsForCategory.length > 0 ? (
                    shopsForCategory.map((shops) => (
                      <div
                        key={shops._id || shops.id}
                        onClick={() => navigate(`/service/${shops._id}`)}
                        className="min-w-[155px] max-w-[155px] bg-surface rounded-2xl overflow-hidden cursor-pointer card-lift press-spring border border-border-soft flex flex-col group select-none"
                      >
                        <div className="relative h-28 w-full bg-surface-2 overflow-hidden">
                          <img
                            src={shops.image || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80'}
                            alt={shops.name[lang] || shops.name.en}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent opacity-50" />
                          <FavoriteButton shopId={shops._id} className="absolute top-2 right-2 w-7 h-7 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white" />
                        </div>
                        <div className="p-3 flex flex-col justify-between flex-1">
                          <div className="text-sm font-medium text-text truncate">
                            {shops.name[lang] || shops.name.en}
                          </div>
                          <div className="flex items-center justify-between mt-2.5">
                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-warning/10 text-warning text-xs font-medium">
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span>{Number(shops.rating || 5.0).toFixed(1)}</span>
                            </div>
                            <div className="text-accent group-hover:translate-x-0.5 transition-transform">
                              <ArrowCircleRightIcon className="h-5 w-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-text-faint italic py-4">
                      {t("no_services_available")}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ServiceCatalog;