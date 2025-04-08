"use client"

import { useLanguage } from "../context/LanguageContext"

const LanguageSwitcher = () => {
  const { language, changeLanguage, showLanguageMenu, setShowLanguageMenu } = useLanguage()

  return (
    <div className="language-menu-container">
      <button className="language-menu-button" onClick={() => setShowLanguageMenu(!showLanguageMenu)}>
        {language === "en" ? "ENG" : "FIL"}
      </button>

      {showLanguageMenu && (
        <div className="language-dropdown">
          <button
            className={`language-option ${language === "en" ? "active" : ""}`}
            onClick={() => changeLanguage("en")}
          >
            ENG
          </button>
          <button
            className={`language-option ${language === "fi" ? "active" : ""}`}
            onClick={() => changeLanguage("fi")}
          >
            FIL
          </button>
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher
