
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;



export const UserInfoPage = ({ onBack, user, t }) => (
    <div className="absolute inset-0 bg-bg z-30 animate-slide-in ">
        <header className="sticky top-0 p-2 bg-bg/80 backdrop-blur-xl flex items-center">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-surface-2 flex items-center text-accent">
                <ChevronLeftIcon /> <span className="font-semibold">{t('Profile')}</span>
            </button>
        </header>
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-text">{t('MyDetails')}</h1>
            <div className="bg-surface rounded-2xl p-4 shadow-sm space-y-2 text-text">
                <p><strong className="text-text">{t('Name')}:</strong> {user.name}</p>
                <p><strong className="text-text">{t('TelegramID')}:</strong> {user.telegramId}</p>
            </div>
        </div>
    </div>
);