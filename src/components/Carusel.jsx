import React, { useState } from "react";

import { useAppContext } from "../context/context";
import { useTranslation } from "react-i18next";

const ServiceCarousel = ({ selected, onSelect }) => {
  const [selectedId, setSelectedId] = useState("All");
  const { categories } = useAppContext();
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
    const { t } = useTranslation();

  const Buttonclicked = (id, cat) => {
    setSelectedId(id);
    onSelect(cat);
  };
  const ButtonAllclicked = () => {
  onSelect("All");
  setSelectedId("All");
  }


  return (
    <div className="mt-4 px-4 overflow-x-auto whitespace-nowrap">
      <div className="flex space-x-3">
           <button
          onClick={ButtonAllclicked}
          className={`px-4 py-2 rounded-full text-sm flex items-center space-x-1 border transition-all duration-200 whitespace-nowrap active:scale-90
            ${selectedId === "All"
              ? "text-black border-transparent bg-accent shadow-sm"
              : "text-text-muted bg-surface-2 border-transparent"
            }`}
        >
          <span>{t("FullCategories")}</span>
        </button>
        {categories.map((service) => (
          <button
            key={service.id}
            onClick={()=> Buttonclicked(service.id, service.title.en)}
            className={`px-4 py-2 rounded-full text-sm flex items-center space-x-1 border transition-all duration-200 whitespace-nowrap active:scale-90
              ${selectedId === service.id
                ? "text-black border-transparent bg-accent shadow-sm"
                : "text-text-muted bg-surface-2 border-transparent"
              }`}
          >
            <span>{service.icon}</span>
            <span>{service.title[lang]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceCarousel;
