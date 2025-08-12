import React, { useEffect, useState } from "react";
import { ArrowCircleRightIcon } from "@heroicons/react/outline";
import { useAppContext } from "../context/context";
import { useTranslation } from "react-i18next";




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
    <div className="pt-4 pb-4 px-4 h-[600px]  overflow-y-auto  shadow-md bg-black text-gray-400">
      {isLoading ?
        <div>

          <h1>loading data ...</h1>
        </div>



        :

        <div>
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
                    className="text-sm text-yellow-200 hover:text-purple-700"
                    onClick={() => (window.location.href = category.route)}
                  >
                    {t("SeeAll")}
                  </button>
                </div>
                <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                  {shopsForCategory.length > 0 ? (
                    shopsForCategory.map((shops) => (

                      <div
                        key={shops.id}
                        className="min-w-[140px] bg-gray-900 shadow backdrop-blur-xl  rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:border-yellow-200 transition-shadow duration-200"
                      >
                        <img
                          src={shops.image}
                          alt={shops.name[lang] || shops.name.en}
                          className="h-24 w-full object-cover"
                        />
                        <div className="flex justify-between items-center p-2">
                          <div className="p-2">
                            <div className="text-sm font-medium text-gray-50 ">
                              {shops.name[lang] || shops.name.en}
                            </div>
                            <div className="text-xs text-gray-400">
                              ⭐ {shops.rating}
                            </div>
                          </div>
                          <div>
                            <button
                              onClick={() => navigate(`/service/${shops.id}`)}
                              className="p-2 text-gray-500 hover:text-purple-600 transition-colors duration-200"
                            >
                              <ArrowCircleRightIcon className="h-6 w-6 text-yellow-200" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-400 italic">
                      No services available in this category
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