"use client"

import { createContext, useContext, useState } from "react"

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en") // 'en' = English, 'fil' = Filipino
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage)
    setShowLanguageMenu(false) // Close menu after selection
  }

  const translations = {
    en: {
      ticktrackTitle: "TickTrack",
      welcome: "Welcome",
      createTodo: "Create Todo",
      addNewTodo: "Add New Todo",
      hideForm: "Hide Form",
      showForm: "Show Form",
      addTodo: "Add a new todo...",
      category: "Category",
      priority: "Priority",
      dueDate: "Due Date",
      submit: "Add Todo",
      cancel: "Cancel",
      language: "EN",
      menu: "Menu",
      import: "Import",
      export: "Export",
      logout: "Logout",
      sortBy: "Sort:",
      title: "Title",
      completed: "Completed",
      // Categories
      Chores: "Chores",
      Work: "Work",
      Personal: "Personal",
      // Priorities
      Low: "Low",
      Medium: "Medium",
      High: "High",
      //Task Stats
      show_stats: "Show Stats",
      hide_stats: "Hide Stats",
    },
    fi: {
      ticktrackTitle: "TikTak",
      welcome: "Maligayang Pagdating",
      createTodo: "Gumawa ng Gawain",
      addNewTodo: "Magdagdag ng Bagong Gawain",
      hideForm: "Itago ang Form",
      showForm: "Ipakita ang Form",
      addTodo: "Magdagdag ng bagong gawain...",
      category: "Kategorya",
      priority: "Priyoridad",
      dueDate: "Takdang Petsa",
      submit: "Idagdag",
      cancel: "Kanselahin",
      language: "FI",
      menu: "Menu",
      import: "Mag-import",
      export: "Mag-export",
      logout: "Mag-logout",
      sortBy: "Uriin:",
      title: "Pamagat",
      completed: "Nakumpleto",
      // Categories
      Chores: "Gawaing Bahay",
      Work: "Trabaho",
      Personal: "Pansarili",
      // Priorities
      Low: "Mababa",
      Medium: "Katamtaman",
      High: "Mataas",
      //Task Stats
      show_stats: "Ipakita ang Stats",
      hide_stats: "Itago ang Stats", 
    },
  }

  const t = (key) => {
    return translations[language]?.[key] || key
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        changeLanguage,
        showLanguageMenu,
        setShowLanguageMenu,
        t,
        translations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
