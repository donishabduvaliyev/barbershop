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
    <div className="h-[600px] overflow-y-auto bg-white text-[rgba(60,60,67,0.6)] dark:bg-black dark:text-[rgba(235,235,245,0.6)]">
      {isLoading ?
        <CatalogSkeleton />

        :

        <div className="pt-4 pb-4 px-4">
          {visibleCategories.map((category) => {
            const filteredServices = feedData.find(
              (service) => service.category === category.title.en
            );

            const shopsForCategory = filteredServices?.shops || [];

            return (
              <div key={category.id} className="mb-6">
                <div className="flex justify-between items-center mb-2   z-10 py-2">
                  <h2 className="text-base font-semibold">{category.title[lang]}</h2>
                  <button
                    className="text-sm text-accent hover:text-accent/80"
                    onClick={() => navigate(`/search?category=${encodeURIComponent(category.title.en)}`)}
                  >
                    {t("SeeAll")}
                  </button>
                </div>
                <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                  {shopsForCategory.length > 0 ? (
                    shopsForCategory.map((shops) => (

                      <div
                        key={shops.id}
                        onClick={() => navigate(`/service/${shops._id}`)}
                        className="min-w-[140px] bg-zinc-100 dark:bg-zinc-900 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 ease-out"
                      >
                        <div className="relative">
                          <img
                            src={shops.image}
                            alt={shops.name[lang] || shops.name.en}
                            className="h-24 w-full object-cover"
                          />
                          <FavoriteButton shopId={shops._id} className="absolute top-1.5 right-1.5 w-7 h-7 bg-black/30" />
                        </div>
                        <div className="flex justify-between items-center p-2">
                          <div className="p-2">
                            <div className="text-sm font-medium text-zinc-800 dark:text-zinc-50 ">
                              {shops.name[lang] || shops.name.en}
                            </div>
                            <div className="text-xs text-amber-500">
                              ⭐ {shops.rating}
                            </div>
                          </div>
                          <div>
                            <button
                              onClick={() => navigate(`/service/${shops._id}`)}
                              className="p-2 text-accent hover:text-accent/80 transition-colors duration-200"
                            >
                              <ArrowCircleRightIcon className="h-6 w-6" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-zinc-400 italic">
                      {t("no_services_available")}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>


      }
    </div>
  );
};

export default ServiceCatalog;