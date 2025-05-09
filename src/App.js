"use client"

import { useState, useEffect, useRef } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LanguageSwitcher from "./components/LanguageSwitcher"
import { useLanguage } from "./context/LanguageContext"
import Login from "./components/Login"
import Signup from "./components/Signup"
import TodoList from "./components/TodoList"
import TodoCreate from "./components/TodoCreate"
import TaskStats from "./components/TaskStats"
import ArchivedTodos from "./components/ArchivedTodos"
import AppNotification from "./components/Notification" // Updated import name
import "./App.css"
import Light from "./light.svg"
import Dark from "./dark.svg"
import DeleteIcon from "./delete.svg"
import DoneIcon from "./g_check.svg"
import ArchiveIcon from "./archive.svg"

// Date utility functions
const formatDateTime = (dateString) => {
  if (!dateString) return "No due date";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    
    // Use built-in formatting for consistency
    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    
    return `${date.toLocaleDateString(undefined, dateOptions)} ${date.toLocaleTimeString(undefined, timeOptions)}`;
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Invalid date";
  }
};

const isDueSoon = (dateString) => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;
    
    const now = new Date();
    const timeDiff = date.getTime() - now.getTime();
    const fiveMinutesInMs = 5 * 60 * 1000;
    
    return timeDiff > 0 && timeDiff <= fiveMinutesInMs;
  } catch (e) {
    return false;
  }
};

const App = () => {
  const [todos, setTodos] = useState([]) // State to store todo items
  const [archivedTodos, setArchivedTodos] = useState([]) // State to store archived todos
  const [isAuthenticated, setIsAuthenticated] = useState(null) // State to track authentication status
  const [darkMode, setDarkMode] = useState(false) // State for dark mode
  const [sortBy, setSortBy] = useState("priority") // State for sorting
  const [showArchived, setShowArchived] = useState(false) // State to toggle archived todos view
  const [selectedTodos, setSelectedTodos] = useState([]) // State to track selected todos
  const isFirstRender = useRef(true) // Ref to prevent saving todos on initial render
  const { t } = useLanguage() // We'll use 't' for translations when needed
  const [showStats, setShowStats] = useState(false)
  const [currentUser, setCurrentUser] = useState(null) // State to track current user
  const [notification, setNotification] = useState(null) // State for in-app notifications

  // ✅ Load todos, archived todos and user authentication from localStorage and sessionStorage on initial render
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos") // Retrieve todos from localStorage
    const storedArchivedTodos = localStorage.getItem("archivedTodos") // Retrieve archived todos
    const storedUser = sessionStorage.getItem("user") // Retrieve user authentication from sessionStorage
    const storedDarkMode = localStorage.getItem("darkMode") === "true"

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setCurrentUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }

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

    if (storedArchivedTodos) {
      try {
        const parsedArchivedTodos = JSON.parse(storedArchivedTodos)
        if (Array.isArray(parsedArchivedTodos)) {
          setArchivedTodos(parsedArchivedTodos)
          console.log("Loaded archived todos:", parsedArchivedTodos)
        }
      } catch (error) {
        console.error("Error parsing archived todos:", error)
        setArchivedTodos([])
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

  // Save archived todos to localStorage
  useEffect(() => {
    if (!isFirstRender.current) {
      localStorage.setItem("archivedTodos", JSON.stringify(archivedTodos))
    }
  }, [archivedTodos])

  // ✅ Notifications & Reminders
  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification")
      return
    }

    if (window.Notification.permission !== "granted") {
      window.Notification.requestPermission().then((permission) => {
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
            const dueDate = new Date(todo.dueDate)
            
            // Skip if invalid date
            if (isNaN(dueDate.getTime())) {
              return
            }

            const timeDiff = dueDate - now
            const fiveMinutesInMs = 5 * 60 * 1000
            
            // Check if due within 5 minutes or overdue (but within last 5 minutes)
            if (timeDiff > 0 && timeDiff <= fiveMinutesInMs) {
              // Show in-app notification
              setNotification({
                message: `Task "${todo.title}" is due in ${Math.ceil(timeDiff / 60000)} minutes!`,
                type: "info",
                duration: 0 // Don't auto-close
              })
              
              // Show browser notification if permitted
              if (window.Notification.permission === "granted") {
                new window.Notification(`Todo Reminder: ${todo.title}`, {
                  body: `Due in ${Math.ceil(timeDiff / 60000)} minutes\nCategory: ${todo.category || "No category"}`,
                  icon: "/todo-icon.png",
                  tag: `todo-reminder-${todo.id}`,
                })
              }
            } else if (timeDiff < 0 && timeDiff > -fiveMinutesInMs) {
              // Overdue notification (only if within 5 minutes of being overdue)
              setNotification({
                message: `Task "${todo.title}" is overdue!`,
                type: "error",
                duration: 0 // Don't auto-close
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
  const handleLogin = (user) => {
    sessionStorage.setItem("user", JSON.stringify(user))
    setCurrentUser(user)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    sessionStorage.removeItem("user")
    setCurrentUser(null)
    setIsAuthenticated(false)
    setTodos([])
    setArchivedTodos([])
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
    // Show success notification
    setNotification({
      message: "Todo created successfully!",
      type: "success",
    })
  }

  // ✅ Remove todo
  const removeTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
    // Show success notification
    setNotification({
      message: "Todo removed successfully!",
      type: "success",
    })
  }

  // ✅ Modify existing todo
  const changeTodo = (id, title, category, priority, dueDate, completed, elapsedTime = 0) => {
    const updatedTodo = { id, title, category, priority, dueDate, completed, elapsedTime }
    setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo)))
    // Show success notification
    setNotification({
      message: "Todo updated successfully!",
      type: "success",
    })
  }

  // Archive a completed todo
  const archiveTodo = (id) => {
    const todoToArchive = todos.find((todo) => todo.id === id)
    if (todoToArchive && todoToArchive.completed) {
      setArchivedTodos((prev) => [...prev, todoToArchive])
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
      // Show success notification
      setNotification({
        message: "Todo archived successfully!",
        type: "success",
      })
    } else {
      // Show error notification if todo is not completed
      setNotification({
        message: "Only completed todos can be archived",
        type: "error",
      })
    }
  }

  // Restore an archived todo
  const restoreTodo = (id) => {
    const todoToRestore = archivedTodos.find((todo) => todo.id === id)
    if (todoToRestore) {
      setTodos((prev) => [...prev, todoToRestore])
      setArchivedTodos((prev) => prev.filter((todo) => todo.id !== id))
      // Show success notification
      setNotification({
        message: "Todo restored successfully!",
        type: "success",
      })
    }
  }

  // Delete an archived todo
  const deleteArchivedTodo = (id) => {
    setArchivedTodos((prev) => prev.filter((todo) => todo.id !== id))
    // Show success notification
    setNotification({
      message: "Archived todo deleted successfully!",
      type: "success",
    })
  }

  // Handle selection of todos
  const handleSelectTodo = (id, isSelected) => {
    if (isSelected) {
      setSelectedTodos((prev) => [...prev, id])
    } else {
      setSelectedTodos((prev) => prev.filter((todoId) => todoId !== id))
    }
  }

  // Select all todos
  const selectAllTodos = () => {
    if (selectedTodos.length === todos.length) {
      setSelectedTodos([])
    } else {
      setSelectedTodos(todos.map((todo) => todo.id))
    }
  }

  // Bulk mark as completed
  const bulkMarkAsCompleted = () => {
    // Only mark non-completed todos
    const nonCompletedSelectedTodos = selectedTodos.filter((id) => !todos.find((todo) => todo.id === id)?.completed)

    if (nonCompletedSelectedTodos.length === 0) {
      // Show error notification
      setNotification({
        message: "No non-completed todos selected",
        type: "error",
      })
      return
    }

    setTodos((prevTodos) =>
      prevTodos.map((todo) => (nonCompletedSelectedTodos.includes(todo.id) ? { ...todo, completed: true } : todo)),
    )
    setSelectedTodos([])

    // Show success notification
    setNotification({
      message: `${nonCompletedSelectedTodos.length} todos marked as completed!`,
      type: "success",
    })
  }

  // Bulk delete todos
  const bulkDeleteTodos = () => {
    // Only delete non-completed todos
    const nonCompletedSelectedTodos = selectedTodos.filter((id) => !todos.find((todo) => todo.id === id)?.completed)

    if (nonCompletedSelectedTodos.length === 0) {
      // Show error notification
      setNotification({
        message: "No non-completed todos selected",
        type: "error",
      })
      return
    }

    setTodos((prevTodos) => prevTodos.filter((todo) => !nonCompletedSelectedTodos.includes(todo.id)))
    setSelectedTodos([])

    // Show success notification
    setNotification({
      message: `${nonCompletedSelectedTodos.length} todos deleted!`,
      type: "success",
    })
  }

  // Bulk archive todos
  const bulkArchiveTodos = () => {
    // Only archive completed todos
    const completedSelectedTodos = selectedTodos.filter((id) => todos.find((todo) => todo.id === id)?.completed)

    if (completedSelectedTodos.length === 0) {
      // Show error notification
      setNotification({
        message: "No completed todos selected",
        type: "error",
      })
      return
    }

    const todosToArchive = todos.filter((todo) => completedSelectedTodos.includes(todo.id))
    setArchivedTodos((prev) => [...prev, ...todosToArchive])
    setTodos((prev) => prev.filter((todo) => !completedSelectedTodos.includes(todo.id)))
    setSelectedTodos([])

    // Show success notification
    setNotification({
      message: `${completedSelectedTodos.length} todos archived!`,
      type: "success",
    })
  }

  // Modify the exportTodos function to include user information
  const exportTodos = () => {
    if (todos.length === 0) {
      // Show error notification
      setNotification({
        message: "No todos to export!",
        type: "error",
      })
      return
    }

    // Get current user from sessionStorage
    const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}")

    // Get the persistent userId from localStorage as a fallback
    const persistentUserId = localStorage.getItem("userId")

    // Ensure we have a user ID one way or another
    const userId = currentUser.id || persistentUserId

    if (!userId) {
      // Show error notification
      setNotification({
        message: "User identification error. Please log out and log in again.",
        type: "error",
      })
      return
    }

    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      todos: todos,
      archivedTodos: archivedTodos,
      user: {
        id: userId,
        exportTime: new Date().toISOString(),
      },
    }

    const dataStr = JSON.stringify(data, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `todos-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)

    // Show success notification
    setNotification({
      message: "Todos exported successfully!",
      type: "success",
    })
  }

  // Modify the importTodos function to check user identity
  const importTodos = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const result = JSON.parse(e.target.result)

        // Check if the file has todos
        if (Array.isArray(result?.todos)) {
          // Get current user from sessionStorage
          const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}")

          // Get the persistent userId from localStorage as a fallback
          const persistentUserId = localStorage.getItem("userId")

          // Check if the file has user information
          if (result.user && result.user.id) {
            // First check if the IDs match directly
            const currentUserId = currentUser.id || persistentUserId

            if (result.user.id !== currentUserId) {
              // Show error notification
              setNotification({
                message: "This todo list belongs to another user and cannot be imported",
                type: "error",
              })
              return
            }
          }

          // If user check passes or no user in file (backward compatibility), proceed with import
          setTodos(result.todos)
          if (Array.isArray(result?.archivedTodos)) {
            setArchivedTodos(result.archivedTodos)
          }

          // Show success notification
          setNotification({
            message: `Imported ${result.todos.length} todos!`,
            type: "success",
          })
        } else {
          throw new Error("Invalid file format")
        }
      } catch (error) {
        // Show error notification
        setNotification({
          message: "Failed to import: " + error.message,
          type: "error",
        })
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

  // Add this function to your App component
  const reorderTodos = (draggedId, targetId) => {
    // Find the indices of the dragged and target todos
    const draggedIndex = todos.findIndex((todo) => todo.id === draggedId)
    const targetIndex = todos.findIndex((todo) => todo.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) {
      return
    }

    // Create a new array with the todos in the new order
    const newTodos = [...todos]
    const [draggedTodo] = newTodos.splice(draggedIndex, 1)
    newTodos.splice(targetIndex, 0, draggedTodo)

    // Update the todos state
    setTodos(newTodos)
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
                          <div className="dropdown-welcome">
                            Welcome, {currentUser?.username || currentUser?.name || "User"}!
                          </div>
                          <label className="import-label">
                            {t("import")}
                            <input type="file" accept=".json" onChange={handleFileChange} style={{ display: "none" }} />
                          </label>
                          <button onClick={exportTodos}>{t("export")}</button>
                          <button
                            onClick={() => {
                              setShowStats(false)
                              setShowArchived(!showArchived)
                            }}
                          >
                            {showArchived ? t("show_active") : t("show_archived")}
                          </button>
                          <button
                            onClick={() => {
                              setShowArchived(false)
                              setShowStats(!showStats)
                            }}
                          >
                            {showStats ? t("hide_stats") : t("show_stats")}
                          </button>
                          <button onClick={handleLogout}>{t("logout")}</button>
                        </div>
                      </div>
                    </div>
                  </header>

                  {/* In-app notification */}
                  {notification && (
                    <AppNotification
                      message={notification.message}
                      type={notification.type}
                      duration={notification.duration}
                      onClose={() => setNotification(null)}
                    />
                  )}

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
                        {darkMode ? (
                          <img src={Light || "/placeholder.svg"} alt="Light mode" title="Light mode" />
                        ) : (
                          <img src={Dark || "/placeholder.svg"} alt="Dark mode" title="Dark mode" />
                        )}
                      </button>
                      <LanguageSwitcher />
                    </div>
                  </div>

                  {/* Selection Controls Bar */}
                  {!showArchived && !showStats && (
                    <div className="selection-controls-bar">
                      <div className="select-all">
                        <input
                          type="checkbox"
                          id="select-all"
                          checked={selectedTodos.length > 0 && selectedTodos.length === todos.length}
                          onChange={selectAllTodos}
                          title={t("select_all")}
                        />
                        <label htmlFor="select-all"></label>
                      </div>
                      <div className="selection-actions">
                        <button
                          className="action-btn done-action"
                          onClick={bulkMarkAsCompleted}
                          disabled={selectedTodos.length === 0}
                          title="Mark selected as done"
                        >
                          <img src={DoneIcon || "/placeholder.svg"} alt="Mark as done" />
                        </button>
                        <button
                          className="action-btn delete-action"
                          onClick={bulkDeleteTodos}
                          disabled={selectedTodos.length === 0}
                          title="Delete selected"
                        >
                          <img src={DeleteIcon || "/placeholder.svg"} alt="Delete" />
                        </button>
                        <button
                          className="action-btn archive-action"
                          onClick={bulkArchiveTodos}
                          disabled={selectedTodos.length === 0}
                          title="Archive selected completed tasks"
                        >
                          <img src={ArchiveIcon || "/placeholder.svg"} alt="Archive" />
                        </button>
                      </div>
                    </div>
                  )}

                  {showStats ? (
                    <div className="listBlock">
                      <TaskStats todos={todos} />
                    </div>
                  ) : showArchived ? (
                    <div className="listBlock">
                      <ArchivedTodos
                        archivedTodos={archivedTodos}
                        restoreTodo={restoreTodo}
                        deleteArchivedTodo={deleteArchivedTodo}
                        sortBy={sortBy}
                      />
                    </div>
                  ) : (
                    <div className="listBlock">
                      <TodoList
                        todos={todos}
                        removeTodo={removeTodo}
                        changeTodo={changeTodo}
                        archiveTodo={archiveTodo}
                        sortBy={sortBy}
                        selectedTodos={selectedTodos}
                        onSelectTodo={handleSelectTodo}
                        reorderTodos={reorderTodos}
                        formatDateTime={formatDateTime}
                        isDueSoon={isDueSoon}
                      />
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