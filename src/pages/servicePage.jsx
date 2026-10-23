import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/context';
import { useTranslation } from "react-i18next";
// import { StarIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { ClockIcon, LocationMarkerIcon, MapIcon, PhoneIncomingIcon } from '@heroicons/react/outline';
import FavoriteButton from '../components/FavoriteButton';


const ServicePage = () => {
  const { id } = useParams();
  // const service = serviceData.find((s) => s.id === id);
  const { services, navigate, backEndUrl } = useAppContext();
  console.log(services);

  const service = services.find((s) => s._id === id);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  console.log(service , "service in servicePage.jsx");

  // Fire-and-forget shop-view tracking for the super-admin dashboard — see
  // routes/track.js / models/pageView.js in the backend.
  useEffect(() => {
    if (!service?._id) return;
    fetch(`${backEndUrl}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'shop_view', shopId: service._id }),
    }).catch(() => {});
  }, [service?._id]);




  if (!service) {
    return <div className="p-4">{t('not_found')}</div>;
  }

  return (
    <div className="bg-bg text-text min-h-screen pb-28">
      {/* Top Image with Gradient Overlay & Back Button */}
      <div className="relative w-full h-72 bg-surface-2 overflow-hidden">
        <img
          src={service.image || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80'}
          alt={service.name[lang] || service.name.en}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-black/40" />

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white press-spring cursor-pointer"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <FavoriteButton shopId={service._id} className="absolute top-4 right-4 w-9 h-9 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white" />
      </div>

      {/* Main Info */}
      <div className="px-4 -mt-6 relative z-10 space-y-3">
        <div className="bg-surface p-4 rounded-2xl border border-border-soft shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-text">{service.name[lang] || service.name.en}</h2>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">{service.description[lang] || service.description.en}</p>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-warning/10 border border-warning/20 text-warning text-xs font-semibold shrink-0">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{Number(service.rating || 5.0).toFixed(1)}</span>
              <span className="text-text-faint font-normal">({service.reviewsCount || 0})</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-3 mt-3 border-t border-border-soft text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <LocationMarkerIcon className="w-4 h-4 text-accent shrink-0" />
              <a
                href={`https://www.google.com/maps?q=${service.location?.coordinates?.[1] || 41.311081},${service.location?.coordinates?.[0] || 69.240562}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent truncate underline underline-offset-2"
              >
                {service.address}
              </a>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-accent shrink-0" />
                <span>{service.workingHours?.from || '09:00'} - {service.workingHours?.to || '21:00'}</span>
              </div>

              {service.phone && (
                <div className="flex items-center gap-2">
                  <PhoneIncomingIcon className="w-4 h-4 text-accent shrink-0" />
                  <a href={`tel:${service.phone}`} className="hover:text-accent font-medium">{service.phone}</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="p-4">
        <h3 className="text-base font-bold mb-3 tracking-tight">{t("Services")}</h3>
        <div className="space-y-2.5">
          {service.services.map((item, idx) => (
            <div key={idx} className="bg-surface p-3.5 rounded-xl flex justify-between items-center border border-border-soft card-lift">
              <div>
                <h4 className="font-semibold text-sm text-text">{item.name[lang] || item.name.en}</h4>
                <p className="text-xs text-text-muted mt-0.5">
                  {t("Duration")}: {item.durationMinutes} {t("minutes")}
                </p>
              </div>
              <div className="text-sm font-bold text-accent px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20">
                {(item.price / 1000).toFixed(0)} 000 UZS
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery — only shows once the shop has uploaded extra photos */}
      {service.images?.length > 0 && (
        <div className="p-4">
          <h3 className="text-base font-bold mb-3 tracking-tight">{t("Gallery")}</h3>
          <div className="flex space-x-2.5 overflow-x-auto pb-2 no-scrollbar">
            {service.images.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`${service.name[lang] || service.name.en} ${idx + 1}`}
                className="w-28 h-28 rounded-xl object-cover shrink-0 border border-border-soft shadow-sm"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x200/1a1a1f/d4af5a?text=Gallery'; }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Meet the Team — only shows once a shop actually has staff entries */}
      {service.staff?.length > 0 && (
        <div className="p-4">
          <h3 className="text-base font-bold mb-3 tracking-tight">{t("MeetTheTeam")}</h3>
          <div className="flex space-x-4 overflow-x-auto pb-2 no-scrollbar">
            {service.staff.map((member) => (
              <div key={member._id} className="min-w-[96px] flex flex-col items-center text-center">
                <div className="relative">
                  <img
                    src={member.photo || 'https://placehold.co/200x200/1a1a1f/d4af5a?text=Staff'}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-border-soft shadow-sm"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x200/1a1a1f/d4af5a?text=Staff'; }}
                  />
                  {member.rating && (
                    <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-surface-2 border border-border text-[10px] font-bold text-warning flex items-center gap-0.5">
                      ⭐ {member.rating.toFixed(1)}
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold mt-2.5 truncate w-full text-text">{member.name}</p>
                {member.title && <p className="text-[11px] text-text-muted truncate w-full">{member.title}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Bottom Booking Bar with Glass Backdrop */}
      <div className="fixed bottom-0 inset-x-0 p-3.5 bg-bg/90 backdrop-blur-xl border-t border-border-soft flex items-center justify-center z-30">
        <button
          onClick={() => navigate(`/booking/${service._id}`, { state: { serviceId: service._id } })}
          className="w-full max-w-md bg-accent text-bg font-bold text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-accent/25 hover:bg-accent-hover press-spring flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
        >
          <span>✂️</span>
          <span>{t("BookNow")}</span>
        </button>
      </div>

    </div>
  );
};

export default ServicePage