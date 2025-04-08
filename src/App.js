"use client"

import { useState, useEffect, useRef } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LanguageSwitcher from "./components/LanguageSwitcher"
import { useLanguage } from "./context/LanguageContext"
import Login from "./components/Login"
import Signup from "./components/Signup"
import TodoList from "./components/TodoList"
import TodoCreate from "./components/TodoCreate"
import TaskStats from './components/TaskStats';
import "./App.css"
import Light from "./light.svg";
import Dark from "./dark.svg";

const App = () => {
  const [todos, setTodos] = useState([]) // State to store todo items
  const [isAuthenticated, setIsAuthenticated] = useState(null) // State to track authentication status
  const [darkMode, setDarkMode] = useState(false) // State for dark mode
  const [sortBy, setSortBy] = useState("priority") // State for sorting
  const isFirstRender = useRef(true) // Ref to prevent saving todos on initial render
  const { t } = useLanguage() // We'll use 't' for translations when needed
  const [showStats, setShowStats] = useState(false);

  // ✅ Load todos and user authentication from localStorage and sessionStorage on initial render
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos") // Retrieve todos from localStorage
    const storedUser = sessionStorage.getItem("user") // Retrieve user authentication from sessionStorage
    const storedDarkMode = localStorage.getItem("darkMode") === "true"

    if (storedTodos) {
      try {
        const parsedTodos = JSON.parse(storedTodos)
        if (Array.isArray(parsedTodos)) {
          setTodos(parsedTodos)
          console.log("Loaded todos:", parsedTodos)
        }
      } catch (error) {
        console.error("Error parsing todos:", error)
        setTodos([])
      }
    }

    setIsAuthenticated(!!storedUser)
    setDarkMode(storedDarkMode)

    // Apply dark mode to body if needed
    if (storedDarkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", newDarkMode)

    if (newDarkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }

  // ✅ Save todos to localStorage (with initial render check)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  // ✅ Notifications & Reminders
  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification")
      return
    }

    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted")
        }
      })
    }

    const checkReminders = () => {
      const now = new Date()
      todos.forEach((todo) => {
        if (!todo.completed && todo.dueDate) {
          try {
            const dueDate = new Date(todo.dueDate) // ✅ Define dueDate before using it

            if (dueDate.toDateString() !== now.toDateString()) {
              return // Skip if not due today
            }

            const timeDiff = dueDate - now
            if (timeDiff <= 300000 || timeDiff < 0) {
              // 5 minutes or overdue
              new Notification(`Todo Reminder: ${todo.title}`, {
                body: `Due: ${dueDate.toLocaleString()}\nCategory: ${todo.category || "No category"}`,
                icon: "/todo-icon.png",
                tag: `todo-reminder-${todo.id}`,
              })
            }
          } catch (e) {
            console.error("Error processing todo due date:", e)
          }
        }
      })
    }

    checkReminders()
    const interval = setInterval(checkReminders, 60000)

    return () => clearInterval(interval)
  }, [todos])

  // ✅ Prevent rendering before checking authentication
  if (isAuthenticated === null) {
    return <div>Loading...</div>
  }

  // ✅ Handle login/logout
  const handleLogin = () => {
    setIsAuthenticated(true)
    sessionStorage.setItem("user", JSON.stringify({ authenticated: true }))
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    setIsAuthenticated(false)
  }

  // ✅ Create a new todo
  const createTodo = (title, category, priority, dueDate) => {
    const newTodo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      category,
      priority,
      dueDate,
    }
    setTodos((prevTodos) => [...prevTodos, newTodo])
  }

  // ✅ Remove todo
  const removeTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
  }

  // ✅ Modify existing todo
  const changeTodo = (id, title, category, priority, dueDate, completed) => {
    const updatedTodo = { id, title, category, priority, dueDate, completed }
    setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo)))
  }

  const exportTodos = () => {
    if (todos.length === 0) {
      alert("No todos to export!")
      return
    }

    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      todos: todos,
    }

    const dataStr = JSON.stringify(data, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `todos-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importTodos = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const result = JSON.parse(e.target.result)
        if (Array.isArray(result?.todos)) {
          setTodos(result.todos)
          alert(`Imported ${result.todos.length} todos!`)
        } else {
          throw new Error("Invalid file format")
        }
      } catch (error) {
        alert("Failed to import: " + error.message)
      }
    }
    reader.readAsText(file)
  }

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      importTodos(e.target.files[0])
      e.target.value = null // Reset file input
    }
  }

  return (
    <Router>
      <Routes>
        {isAuthenticated ? (
          <>
            <Route
              path="/"
              element={
                <>
                  {/* Main header with app title */}
                  <header className="header">
                    <div className="headerBlock">
                      <div className="icon-container">
                        <img src="/TickTrack_ico.png" alt="App Header" className="app-header" />
                      </div>

                      <div className="app-title">
                        <h1>TickTrack</h1>
                      </div>

                      {/* Menu dropdown on the right */}
                      <div className="dropdown">
                        <button className="dropdown-btn"> ☰ </button>
                        <div className="dropdown-content">
                          <label className="import-label">
                            {t("import")}
                            <input 
                              type="file" 
                              accept=".json" 
                              onChange={handleFileChange} 
                              style={{ display: "none" }} 
                            />
                          </label>
                          <button onClick={exportTodos}>{t("export")}</button>
                          <button onClick={() => setShowStats(!showStats)}>
                            {showStats ? t("hide_stats") : t("show_stats")}
                          </button>
                          <button onClick={handleLogout}>{t("logout")}</button>
                        </div>
                      </div>
                    </div>
                  </header>

                  {/* Controls bar with sort on left, language and dark mode on right */}
                  <div className="controls-bar">
                    <div className="left-controls">
                      <label htmlFor="sort-select">{t("sortBy")}</label>
                      <select id="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="priority">{t("priority")}</option>
                        <option value="dueDate">{t("dueDate")}</option>
                        <option value="category">{t("category")}</option>
                        <option value="title">{t("title")}</option>
                        <option value="completed">{t("completed")}</option>
                      </select>
                    </div>
                    <div className="right-controls">
                      <button
                        className="mode-toggle"
                        onClick={toggleDarkMode}
                        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                      >
                        {darkMode ? 
                          <img
                          src={Light}
                          alt="Light mode"
                          title="Light mode"
                          /> : 
                          <img
                          src={Dark}
                          alt="Dark mode"
                          title="Dark mode"
                          />
                        }
                      </button>
                      <LanguageSwitcher />
                    </div>
                  </div>
                  
                  {showStats ? (
                    <div className="listBlock">
                      <TaskStats todos={todos} />
                    </div>
                  ) : (
                    <div className="listBlock">
                      <TodoList todos={todos} removeTodo={removeTodo} changeTodo={changeTodo} sortBy={sortBy} />
                      <TodoCreate createTodo={createTodo} />
                    </div>
                  )}
                </>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </Router>
  )
}

export default App
