import TodoEdit from "./TodoEdit";
import { useState } from "react";
import EditIcon from "../edit.svg";
import DeleteIcon from "../delete.svg";

const TodoShow = ({ todo, removeTodo, changeTodo }) => {
  const [showEdit, setShowEdit] = useState(false);

  const formatDueDate = (dateTimeString) => {
    if (!dateTimeString) return "No due date";
    
    const date = new Date(dateTimeString);
    const formattedDate = date.toISOString().split('T')[0];
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${formattedDate} ${hours}:${minutes} ${ampm}`;
  };

  const handleDelete = () => {
    if (!todo.completed) {
      removeTodo(todo.id);
    }
  };

  const handleEdit = () => {
    if (!todo.completed) {
      setShowEdit(true);
    }
  };

  const handleToggleComplete = () => {
    changeTodo(
      todo.id,
      todo.title,
      todo.category,
      todo.priority,
      todo.dueDate,
      !todo.completed
    );
  };

  const handleSubmit = (id, title, category, priority, dueDate) => {
    changeTodo(id, title, category, priority, dueDate, todo.completed);
    setShowEdit(false);
  };

  const getPriorityStyle = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return { backgroundColor: "#ff4d4d", color: "#fff" };
      case "medium":
        return { backgroundColor: "#ffcc00", color: "#000" };
      case "low":
        return { backgroundColor: "#4caf50", color: "#fff" };
      default:
        return { backgroundColor: "#ccc", color: "#000" };
    }
  };

  if (showEdit) {
    return (
      <li className="todo">
        <TodoEdit todo={todo} onSubmit={handleSubmit} />
      </li>
    );
  }

  return (
    <li className="todo">
      <div className="checkbox-column">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          disabled={todo.completed}
          style={{ marginRight: "10px" }}
        />
      </div>

      <div className="task-details">
        <p className={todo.completed ? "completed" : ""}>{todo.title}</p>

        <div className="todo-details-row">
          <p className="priority-box" style={getPriorityStyle(todo.priority)}>
            {todo.priority}
          </p>
          <p className="category">{todo.category}</p>
        </div>

        <p className="due-date">{formatDueDate(todo.dueDate)}</p>
      </div>

      <div className="actions">
        <button
          className="delete-btn"
          onClick={handleDelete}
          disabled={todo.completed}
        >
          <img
            src={DeleteIcon}
            alt="Delete todo"
            title="Delete"
            style={{ opacity: todo.completed ? 0.5 : 1 }}
          />
        </button>

        <button
          className="edit-btn"
          onClick={handleEdit}
          disabled={todo.completed}
        >
          <img
            src={EditIcon}
            alt="Edit todo"
            title="Edit"
            style={{ opacity: todo.completed ? 0.5 : 1 }}
          />
        </button>
      </div>
    </li>
  );
};

export default TodoShow;