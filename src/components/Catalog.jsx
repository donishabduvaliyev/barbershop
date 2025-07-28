import React from "react";
import { ArrowCircleRightIcon } from "@heroicons/react/outline";
import { useAppContext } from "../context/context";
import { useTranslation } from "react-i18next";




const ServiceCatalog = ({ selectedCategory }) => {
const { navigate , services  , categories} = useAppContext();
 const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const { t } = useTranslation();

     const visibleCategories =
    selectedCategory === "All"
      ? categories
      : categories.filter((cat) => cat.title.en === selectedCategory);


   return (
    <div className="pt-4 pb-4 px-4 h-[600px] overflow-y-auto border border-gray-300 rounded-lg shadow-md bg-gray-50">
      {visibleCategories.map((category) => {
        const filteredServices = services.filter(
          (service) => service.category === category.title.en
        );

        return (
          <div key={category.id} className="mb-6">
            <div className="flex justify-between items-center mb-2 sticky top-0 bg-gray-50 z-10 py-2">
              <h2 className="text-base font-semibold">{category.title[lang]}</h2>
              <button
                className="text-sm text-purple-500 hover:text-purple-700"
                onClick={() => (window.location.href = category.route)}
              >
               {t("SeeAll")}
              </button>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="min-w-[140px] bg-white shadow rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  >
                    <img
                      src={service.image}
                      alt={service.name[lang] || service.name.en}
                      className="h-24 w-full object-cover"
                    />
                    <div className="flex justify-between items-center p-2">
                      <div className="p-2">
                        <div className="text-sm font-medium ">
                          {service.name[lang] || service.name.en}
                        </div>
                        <div className="text-xs text-gray-500">
                          ⭐ {service.rating}
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={() => navigate(`/service/${service.id}`)}
                          className="p-2 text-gray-500 hover:text-purple-600 transition-colors duration-200"
                        >
                          <ArrowCircleRightIcon className="h-6 w-6 text-gray-500" />
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
  );
};

export default ServiceCatalog;