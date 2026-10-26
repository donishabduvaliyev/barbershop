import React from 'react';

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export const UserInfoPage = ({ onBack, user = {}, bookings = [], t }) => {
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : null;

  return (
    <div className="absolute inset-0 bg-bg z-30 animate-slide-in text-text overflow-y-auto">
      <header className="sticky top-0 p-2 bg-bg/80 backdrop-blur-xl flex items-center border-b border-border-soft">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-surface-2 flex items-center text-accent">
          <ChevronLeftIcon /> <span className="font-semibold text-sm ml-1">{t('Profile', 'Profil')}</span>
        </button>
      </header>

      <div className="p-4 max-w-lg mx-auto space-y-4 pb-20">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text">{t('MyDetails', 'Mening ma\'lumotlarim')}</h1>
          <p className="text-xs text-text-muted mt-0.5">{t('MyDetailsSubtitle', 'Shaxsiy profil va Telegram akkaunt ma\'lumotlari')}</p>
        </div>

        <div className="bg-surface rounded-2xl border border-border-soft p-4 shadow-sm space-y-3 text-sm">
          <div className="p-3 rounded-xl bg-surface-2 border border-border-soft/60">
            <span className="text-[11px] text-text-muted uppercase tracking-wider block font-medium">{t('FullName', 'To\'liq ism')}</span>
            <span className="font-semibold text-text text-base mt-0.5 block">{user.name || '—'}</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-2 border border-border-soft/60">
            <span className="text-[11px] text-text-muted uppercase tracking-wider block font-medium">{t('PhoneNumber', 'Telefon raqam')}</span>
            <span className="font-semibold text-text font-mono mt-0.5 block">{user.phone || t('NoPhone', 'Kiritilmagan')}</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-2 border border-border-soft/60">
            <span className="text-[11px] text-text-muted uppercase tracking-wider block font-medium">{t('TelegramUsername', 'Telegram profil')}</span>
            <span className="font-semibold text-accent mt-0.5 block">
              {user.username ? `@${user.username}` : t('NoUsername', 'Mavjud emas')}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface-2 border border-border-soft/60">
            <span className="text-[11px] text-text-muted uppercase tracking-wider block font-medium">{t('TelegramID', 'Telegram ID')}</span>
            <span className="font-mono text-text-muted mt-0.5 block">{user.telegramId || '—'}</span>
          </div>

          {memberSince && (
            <div className="p-3 rounded-xl bg-surface-2 border border-border-soft/60">
              <span className="text-[11px] text-text-muted uppercase tracking-wider block font-medium">{t('MemberSince', 'A\'zo bo\'lgan sana')}</span>
              <span className="text-text mt-0.5 block font-medium">{memberSince}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-surface-2 border border-border-soft/60 text-center">
              <span className="text-xs text-text-muted block font-medium">{t('TotalVisits', 'Jami tashriflar')}</span>
              <span className="text-lg font-bold text-text tabular-nums mt-0.5 block">{bookings.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-2 border border-border-soft/60 text-center">
              <span className="text-xs text-text-muted block font-medium">{t('Completed', 'Bajarilgan')}</span>
              <span className="text-lg font-bold text-emerald-400 tabular-nums mt-0.5 block">{completedCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};