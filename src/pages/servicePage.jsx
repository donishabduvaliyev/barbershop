import React from 'react'
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/context';
import { useTranslation } from "react-i18next";
// import { StarIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { ClockIcon, LocationMarkerIcon, MapIcon, PhoneIncomingIcon } from '@heroicons/react/outline';


const ServicePage = () => {
  const { id } = useParams();
  // const service = serviceData.find((s) => s.id === id);
  const { services, navigate } = useAppContext();
  console.log(services);

  const service = services.find((s) => s._id === id);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  console.log(service , "service in servicePage.jsx");
  




  if (!service) {
    return <div className="p-4">{t('not_found')}</div>;
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Top Image */}
      <div className="w-full h-64 bg-cover bg-center" style={{ backgroundImage: `url(${service.image})` }} />

      {/* Main Info */}
      <div className="p-4 space-y-2">
        <div className='flex items-center justify-between'>
          <h2 className="text-xl font-semibold">{service.name[lang]}</h2>

          <div className="flex items-center flex-col">
            <div>
              ⭐
              <span>{service.rating}</span>
            </div>
            <span className="text-gray-400 text-[12px]">({service.reviewsCount} {t('reviews')})</span>
          </div>
        </div>

        <p className="text-sm text-gray-400">{service.description[lang]}</p>

        <div className='flex items-center justify-between mt-2'>
          <div className='flex items-center justify-between'>
            <div className="text-sm text-gray-400 flex items-center gap-2">
              {/* <MapIcon className="w-4 h-4" /> */}
              <LocationMarkerIcon className="w-4 h-4 text-yellow-300" />
              <a
                href={`https://www.google.com/maps?q=${service.location.coordinates[1]},${service.location.coordinates[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className='underline hover:text-yellow-200'
              >{service.address}</a>
            </div>
          </div>

          <div className="text-sm text-gray-400 flex items-center gap-2">
            <PhoneIncomingIcon className="w-4 h-4 text-yellow-300" />
            <a href={`tel: ${service.phone}`} className='hover:text-yellow-200 underline' >{service.phone}</a>
          </div>
        </div>
        <div>
          <div className=" text-gray-400 flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-yellow-300" />
            <p>
              {service.workingHours.from} - {service.workingHours.to}
            </p>
          </div>
          {/* {
            service.workingHours?.days.map((day, idx) => (
              <span key={idx} className="text-sm text-gray-400">
                {day}
                {idx < service.workingHours.days.length - 1 ? ', ' : ''}
              </span>)
            )
          } */}

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



      <div className='flex items-center justify-center mb-3'>
        <button
          onClick={() => navigate(`/booking/${service._id}`, { state: { serviceId: service._id } })}
          className="w-[90%]  sm:w-auto bg-yellow-300 text-black text-base sm:text-lg px-3 py-3 rounded-full shadow-md hover:bg-yellow-400 transition-colors duration-300 active:scale-95">
          {t("BookNow")}
        </button>

      </div>

    </div>
  )
}

export default ServicePage