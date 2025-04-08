// src/components/TaskStats.js
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const TaskStats = ({ todos }) => {
    const total = todos.length
    const completed = todos.filter((todo) => todo.completed).length
  
    // Calculate overdue tasks (tasks with due date in the past that are not completed)
    const overdue = todos.filter((todo) => {
      if (todo.completed) return false
      if (!todo.dueDate) return false
      const dueDate = new Date(todo.dueDate)
      return dueDate < new Date()
    }).length
  
    // Pending is now total minus completed minus overdue
    const pending = total - completed - overdue
  
    // Data for the pie chart
    const data = [
      { name: "Pending", value: pending, color: "#ffc107" },
      { name: "Completed", value: completed, color: "#4caf50" },
      { name: "Overdue", value: overdue, color: "#f44336" },
    ].filter((item) => item.value > 0) // Only show categories with values > 0
  
    // If there are no todos, show a message
    if (total === 0) {
      return (
        <div className="task-stats-empty">
          <p>No tasks available. Add some tasks to see statistics.</p>
        </div>
      )
    }
  
    // Custom label component for inside the pie slices
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5
      const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180)
      const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)
  
      return (
        <g>
          {/* Name on top */}
          <text
            x={x}
            y={y - 8}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="12"
            fontWeight="bold"
          >
            {name}
          </text>
          {/* Percentage below */}
          <text
            x={x}
            y={y + 8}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="12"
            fontWeight="bold"
          >
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        </g>
      )
    }
  
    return (
      <div className="task-stats">

        <h3 className="stats-title">Task Statistics</h3>
  
        <div className="pie-chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} tasks`, "Count"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="stats-summary">
          <div className="stat">
            <span className="stat-label">Pending:</span>
            <span className="stat-value">{pending}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Completed:</span>
            <span className="stat-value">{completed}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Overdue:</span>
            <span className="stat-value">{overdue}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{total}</span>
          </div>
        </div>

      </div>
    )
  }
  
  export default TaskStats
  