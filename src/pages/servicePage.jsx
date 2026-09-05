import React from 'react'
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/context';
import { useTranslation } from "react-i18next";
// import { StarIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { ClockIcon, LocationMarkerIcon, MapIcon, PhoneIncomingIcon } from '@heroicons/react/outline';
import FavoriteButton from '../components/FavoriteButton';


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
    <div className="bg-bg text-text min-h-screen">
      {/* Top Image */}
      <div className="relative w-full h-64 bg-cover bg-center" style={{ backgroundImage: `url(${service.image})` }}>
        <FavoriteButton shopId={service._id} className="absolute top-3 right-3 w-9 h-9 bg-black/30" />
      </div>

      {/* Main Info */}
      <div className="p-4 space-y-2">
        <div className='flex items-center justify-between'>
          <h2 className="text-xl font-semibold">{service.name[lang]}</h2>

          <div className="flex items-center flex-col">
            <div>
              ⭐
              <span>{service.rating}</span>
            </div>
            <span className="text-text-faint text-[12px]">({service.reviewsCount} {t('reviews')})</span>
          </div>
        </div>

        <p className="text-sm text-text-muted">{service.description[lang]}</p>

        <div className='flex items-center justify-between mt-2'>
          <div className='flex items-center justify-between'>
            <div className="text-sm text-text-muted flex items-center gap-2">
              {/* <MapIcon className="w-4 h-4" /> */}
              <LocationMarkerIcon className="w-4 h-4 text-accent" />
              <a
                href={`https://www.google.com/maps?q=${service.location.coordinates[1]},${service.location.coordinates[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className='underline hover:text-accent'
              >{service.address}</a>
            </div>
          </div>

          <div className="text-sm text-text-muted flex items-center gap-2">
            <PhoneIncomingIcon className="w-4 h-4 text-accent" />
            <a href={`tel: ${service.phone}`} className='hover:text-accent underline' >{service.phone}</a>
          </div>
        </div>
        <div>
          <div className=" text-text-muted flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-accent" />
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
            <div key={idx} className="bg-surface p-3 rounded-lg flex justify-between items-center border border-border-soft">
              <div>
                <h4 className="font-medium">{service.name[lang]}</h4>
                <p className="text-xs text-text-muted">
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

      {/* Gallery — only shows once the shop has uploaded extra photos */}
      {service.images?.length > 0 && (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{t("Gallery")}</h3>
          <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
            {service.images.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`${service.name[lang]} ${idx + 1}`}
                className="w-28 h-28 rounded-lg object-cover shrink-0 shadow-sm"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x200/d1d5db/374151?text=Image+Not+Found'; }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Meet the Team — only shows once a shop actually has staff entries */}
      {service.staff?.length > 0 && (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{t("MeetTheTeam")}</h3>
          <div className="flex space-x-4 overflow-x-auto pb-2 no-scrollbar">
            {service.staff.map((member) => (
              <div key={member._id} className="min-w-[96px] flex flex-col items-center text-center">
                <img
                  src={member.photo || 'https://placehold.co/200x200/d1d5db/374151?text=%F0%9F%92%88'}
                  alt={member.name}
                  className="w-16 h-16 rounded-full object-cover shadow-sm"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x200/d1d5db/374151?text=%F0%9F%92%88'; }}
                />
                <p className="text-sm font-medium mt-2 truncate w-full">{member.name}</p>
                {member.title && <p className="text-xs text-text-muted truncate w-full">{member.title}</p>}
                {member.reviewsCount > 0 && (
                  <p className="text-xs text-warning mt-0.5">⭐ {member.rating.toFixed(1)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='flex items-center justify-center mb-3'>
        <button
          onClick={() => navigate(`/booking/${service._id}`, { state: { serviceId: service._id } })}
          className="w-[90%]  sm:w-auto bg-accent text-black text-base sm:text-lg px-3 py-3 rounded-full shadow-md hover:bg-accent-hover transition-colors duration-300 active:scale-95">
          {t("BookNow")}
        </button>

      </div>

    </div>
  )
}

export default ServicePage