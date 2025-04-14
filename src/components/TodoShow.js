"use client"

import { useState, useRef, useEffect } from "react"
import { useLanguage } from "../context/LanguageContext"
import EditIcon from "../edit.svg"
import DeleteIcon from "../delete.svg"
import DoneIcon from "../g_check.svg"
import ArchiveIcon from "../archive.svg"
import PlayIcon from "../play.svg"
import PauseIcon from "../pause.svg"

const TodoShow = ({
  todo,
  removeTodo,
  changeTodo,
  archiveTodo,
  isSelected,
  onSelectTodo,
  draggable,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  isDraggedOver,
  isDragging,
  formatDateTime,
  isDueSoon
}) => {
  const { t } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(todo.title)
  const [category, setCategory] = useState(todo.category)
  const [priority, setPriority] = useState(todo.priority)
  const [dueDate, setDueDate] = useState(todo.dueDate || "")
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(todo.elapsedTime || 0)
  const timerRef = useRef(null)
  const todoRef = useRef(null)
  
  // Check if the todo is due soon
  const dueSoon = isDueSoon ? isDueSoon(todo.dueDate) : false;

  // Determine if the todo is draggable
  const isDraggable = draggable && !todo.completed

  // Set up classes for the todo item
  const todoClasses = `todo ${todo.completed ? "completed" : ""} ${dueSoon ? "due-soon" : ""} ${
    isDraggedOver ? "drag-over" : ""
  } ${isDragging ? "dragging" : ""}`

  // Handle timer
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)
  }, [isTimerRunning])

  // Format time for display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  // Format due date for display
  const formatDueDate = (dateString) => {
    if (formatDateTime) {
      return formatDateTime(dateString);
    }
    
    if (!dateString) return "No due date"

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Invalid date"

      return date.toLocaleString()
    } catch (e) {
      console.error("Error formatting date:", e)
      return "Invalid date"
    }
  }

  // Get style for priority
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return { backgroundColor: "#f44336" }
      case "Medium":
        return { backgroundColor: "#ffc107" }
      case "Low":
        return { backgroundColor: "#4caf50" }
      default:
        return { backgroundColor: "#808080" }
    }
  }

  // Handle checkbox change
  const handleSelect = (e) => {
    onSelectTodo(todo.id, e.target.checked)
  }

  // Handle edit button click
  const handleEdit = () => {
    setIsEditing(true)
  }

  // Handle delete button click
  const handleDelete = () => {
    removeTodo(todo.id)
  }

  // Handle toggle complete button click
  const handleToggleComplete = () => {
    // Stop timer if running
    if (isTimerRunning) {
      setIsTimerRunning(false)
    }

    // Update todo
    changeTodo(todo.id, todo.title, todo.category, todo.priority, todo.dueDate, !todo.completed, elapsedTime)
  }

  // Handle archive button click
  const handleArchive = () => {
    archiveTodo(todo.id)
  }

  // Toggle timer
  const toggleTimer = () => {
    if (todo.completed) return

    setIsTimerRunning(!isTimerRunning)

    // If stopping timer, update the todo with the elapsed time
    if (isTimerRunning) {
      changeTodo(todo.id, todo.title, todo.category, todo.priority, todo.dueDate, todo.completed, elapsedTime)
    }
  }

  // Handle drag start
  const handleDragStart = (e) => {
    if (onDragStart) {
      onDragStart(e)
    }
  }

  // Convert dueDate to datetime-local format for the input
  const formatDateForInput = (dateString) => {
    if (!dateString) return ""

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ""

      // Format as YYYY-MM-DDTHH:MM
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      const hours = String(date.getHours()).padStart(2, "0")
      const minutes = String(date.getMinutes()).padStart(2, "0")

      return `${year}-${month}-${day}T${hours}:${minutes}`
    } catch (e) {
      console.error("Error formatting date for input:", e)
      return ""
    }
  }

  // Handle edit form submission
  const handleEditSubmit = (e) => {
    e.preventDefault()
    changeTodo(todo.id, title, category, priority, dueDate, todo.completed, elapsedTime)
    setIsEditing(false)
  }

  // Render edit form
  if (isEditing) {
    return (
      <li className="todo">
        <form onSubmit={handleEditSubmit} className="todo-edit">
          <div className="edit-title-row">
            <input
              type="text"
              className="edit-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="edit-fields-row">
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Study">Study</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <input
              type="datetime-local"
              value={formatDateForInput(dueDate)}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <button type="submit" className="submit-btn">
              {t("save")}
            </button>
            <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
              {t("cancel")}
            </button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li
      ref={todoRef}
      className={todoClasses}
      draggable={isDraggable}
      onDragStart={isDraggable ? handleDragStart : null}
      onDragEnd={isDraggable ? onDragEnd : null}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="todo-left-controls">
        <div className="todo-select-checkbox">
          {!todo.completed ? (
            <input type="checkbox" checked={isSelected} onChange={handleSelect} aria-label={`Select ${todo.title}`} />
          ) : (
            <div className="checkbox-placeholder" style={{ width: "16px", height: "16px" }}></div>
          )}
        </div>

        <div
          className="drag-handle"
          title={isDraggable ? "Drag to reorder" : ""}
          style={{ visibility: isDraggable ? "visible" : "hidden" }}
        >
          ⋮⋮⋮
        </div>
      </div>

      <div className="task-details">
        <p className={todo.completed ? "completed" : ""}>{todo.title}</p>

        <div className="todo-details-row">
          <p className="priority-box" style={getPriorityStyle(todo.priority)}>
            {todo.priority}
          </p>
          <p className="category">{todo.category}</p>
          <p className={`due-date ${dueSoon ? "due-soon" : ""}`}>{formatDueDate(todo.dueDate)}</p>
        </div>

        <div className="actions-row">
          <button
            className="timer-btn"
            onClick={toggleTimer}
            disabled={todo.completed}
            style={{
              backgroundColor: isTimerRunning ? "#ff9800" : "#4caf50",
              opacity: todo.completed ? 0.5 : 1,
            }}
            title={isTimerRunning ? "Pause timer" : "Start timer"}
          >
            {isTimerRunning ? (
              <img
                src={PauseIcon || "/placeholder.svg"}
                alt="Pause"
                title="Pause"
                style={{ opacity: todo.completed ? 0.5 : 1 }}
              />
            ) : (
              <img
                src={PlayIcon || "/placeholder.svg"}
                alt="Play"
                title="Play"
                style={{ opacity: todo.completed ? 0.5 : 1 }}
              />
            )}
          </button>
          <span className="timer-display">{formatTime(elapsedTime)}</span>
          <button className="edit-btn" onClick={handleEdit} disabled={todo.completed}>
            <img
              src={EditIcon || "/placeholder.svg"}
              alt="Edit todo"
              title="Edit"
              style={{ opacity: todo.completed ? 0.5 : 1 }}
            />
          </button>
          <button className="delete-btn" onClick={handleDelete} disabled={todo.completed}>
            <img
              src={DeleteIcon || "/placeholder.svg"}
              alt="Delete todo"
              title="Delete"
              style={{ opacity: todo.completed ? 0.5 : 1 }}
            />
          </button>
          <button className="done-btn" onClick={handleToggleComplete} disabled={todo.completed}>
            <img
              src={DoneIcon || "/placeholder.svg"}
              alt="Done todo"
              title="Done"
              style={{ opacity: todo.completed ? 0.5 : 1 }}
            />
          </button>
          {todo.completed && (
            <button className="archive-btn" onClick={handleArchive}>
              <img src={ArchiveIcon || "/placeholder.svg"} alt="Archive todo" title="Archive" />
            </button>
          )}
        </div>
      </div>
    </li>
  )
}

export default TodoShow