"use client"

import { useState, useEffect } from "react"

const AppNotification = ({ message, type = "error", duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Only set a timeout if duration is greater than 0
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false)
        if (onClose) onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  return visible ? (
    <div className={`app-notification ${type}`}>
      <div className="notification-content">
        <span>{message}</span>
        <button
          className="close-btn"
          onClick={() => {
            setVisible(false)
            if (onClose) onClose()
          }}
        >
          ×
        </button>
      </div>
    </div>
  ) : null
}

export default AppNotification