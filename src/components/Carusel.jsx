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
    <div className="mt-2 px-3 overflow-x-auto whitespace-nowrap scrollbar-hide py-1">
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={ButtonAllclicked}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1.5 border press-spring transition-all duration-200 whitespace-nowrap cursor-pointer
            ${selectedId === "All"
              ? "text-bg bg-accent border-accent/60 shadow-sm shadow-accent/25 font-semibold"
              : "text-text-muted bg-surface-2 border-border-soft hover:text-text hover:border-border"
            }`}
        >
          <span>✨</span>
          <span>{t("FullCategories")}</span>
        </button>
        {categories.map((service) => (
          <button
            type="button"
            key={service.id}
            onClick={() => Buttonclicked(service.id, service.title.en)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1.5 border press-spring transition-all duration-200 whitespace-nowrap cursor-pointer
              ${selectedId === service.id
                ? "text-bg bg-accent border-accent/60 shadow-sm shadow-accent/25 font-semibold"
                : "text-text-muted bg-surface-2 border-border-soft hover:text-text hover:border-border"
              }`}
          >
            <span className="text-sm">{service.icon}</span>
            <span>{service.title[lang]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceCarousel;
