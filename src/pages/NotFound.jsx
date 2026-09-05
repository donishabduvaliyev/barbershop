import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 4000); // Redirect after 4 seconds

    return () => clearTimeout(timer);
  }, [navigate]);
      const { t } = useTranslation();
  

  return (
    <div className="h-screen flex flex-col justify-center items-center text-center px-4 bg-bg">
      <h1 className="text-4xl font-bold mb-4 text-text">{t("ErrorPage")}</h1>
      <p className="mb-6 text-lg text-text-muted">
       {t("movePage")}
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-accent text-black px-6 py-2 rounded-full font-semibold"
      >
      {t("GoHome")}
      </button>
    </div>
  );
}
