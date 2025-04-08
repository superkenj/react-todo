"use client"

import { useState } from "react"
import { useLanguage } from "../context/LanguageContext"

const TodoCreate = ({ createTodo }) => {
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Personal")
  const [priority, setPriority] = useState("Medium")
  const [dueDate, setDueDate] = useState("")
  const { t, language, translations } = useLanguage()

  const handleSubmit = (e) => {
    e.preventDefault()
    createTodo(title, category, priority, dueDate)

    // Reset form fields
    setTitle("")
    setCategory("Personal")
    setPriority("Medium")
    setDueDate("")
    setIsFormVisible(false)
  }

  // Get the current language's translations
  const currentTranslations = translations[language]

  return (
    <div className="create-container">
      {/* Toggle Button */}
      <button className="toggle-form-btn" onClick={() => setIsFormVisible(!isFormVisible)}>
        {t("addNewTodo")}
      </button>

      {/* Form (conditionally visible) */}
      {isFormVisible && (
        <form onSubmit={handleSubmit} className="todo-create">
          <input
            type="text"
            name="title"
            id="title"
            placeholder={t("addTodo")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />

          <div className="todo-row">
            <div className="todo-field">
              <label>{t("category")}</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {Object.keys(currentTranslations)
                  .filter((key) => ["Chores", "Work", "Personal"].includes(key))
                  .map((key) => (
                    <option key={key} value={key}>
                      {currentTranslations[key]}
                    </option>
                  ))}
              </select>
            </div>

            <div className="todo-field">
              <label>{t("priority")}</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                {Object.keys(currentTranslations)
                  .filter((key) => ["Low", "Medium", "High"].includes(key))
                  .map((key) => (
                    <option key={key} value={key}>
                      {currentTranslations[key]}
                    </option>
                  ))}
              </select>
            </div>

            <div className="todo-field">
              <label>{t("dueDate")}</label>
              <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </div>

            <div className="todo-field">
              <button type="submit" className="submit-btn">
                {t("submit")}
              </button>
              <button type="button" className="cancel-btn" onClick={() => setIsFormVisible(false)}>
                {t("cancel")}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default TodoCreate
