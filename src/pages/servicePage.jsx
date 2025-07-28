import React from 'react'
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/context';
import { useTranslation } from "react-i18next";
// import { StarIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { MapIcon, PhoneIncomingIcon } from '@heroicons/react/outline';


const ServicePage = () => {
 const { id } = useParams();
  // const service = serviceData.find((s) => s.id === id);
  const { services } = useAppContext();
  const service = services.find((s) => s.id === Number(id));
   const { t, i18n } = useTranslation();
  const lang = i18n.language;

  


  if (!service) {
    return <div className="p-4">Service not found</div>;
  }
    
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Top Image */}
      <div className="w-full h-64 bg-cover bg-center" style={{ backgroundImage: `url(${service.image})` }} />

      {/* Main Info */}
      <div className="p-4 space-y-2">
        <h2 className="text-2xl font-semibold">{service.name[lang]}</h2>

        <div className="flex items-center space-x-2">
       ⭐
          <span>{service.rating}</span>
          <span className="text-gray-400">({service.reviewsCount} reviews)</span>
        </div>

        <p className="text-sm text-gray-400">{service.description[lang]}</p>

        <div className="text-sm text-gray-400 flex items-center gap-2">
          <MapIcon className="w-4 h-4" />
          {service.address}
        </div>

        <div className="text-sm text-gray-400 flex items-center gap-2">
          <PhoneIncomingIcon className="w-4 h-4" />
          {service.phone}
        </div>
      </div>

      {/* Services */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{t("Services")}</h3>
        <div className="space-y-2">
          {service.services.map((service, idx) => (
            <div key={idx} className="bg-gray-900 p-3 rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-medium">{service.name[lang]}</h4>
                <p className="text-xs text-gray-400">
                  {t("Duration")}: {service.durationMinutes} {t("minutes")}
                </p>
              </div>
              <div className="text-sm font-semibold">
                {(service.price / 1000).toFixed(0)} 000 UZS
              </div>
            </div>
          ))}
        </div>
      </div>

     
    </div>
  )
}

export default ServicePage