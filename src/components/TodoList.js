import { useState } from "react";
import TodoShow from "./TodoShow";

const TodoList = ({ todos, removeTodo, changeTodo }) => {
  const [sortBy, setSortBy] = useState("priority");

  const sortTodos = (todos, sortBy) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };

    return [...todos].sort((a, b) => {
      // When sorting by "Completed" → Completed tasks go to the top
      if (sortBy === "completed") {
        if (a.completed !== b.completed) {
          return a.completed ? -1 : 1; // Completed first
        }
        return new Date(a.dueDate) - new Date(b.dueDate);
      }

      // For other sorting options → Completed tasks go to the bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1; // Completed at the bottom
      }

      // Sorting logic for other options
      if (sortBy === "priority") {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      if (sortBy === "dueDate") {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }

      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "category") {
        return a.category.localeCompare(b.category);
      }

      return 0;
    });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // ✅ Pass `todos` and `sortBy` to ensure correct sorting
  const sortedTodos = sortTodos(todos, sortBy);

  const renderedTodos = sortedTodos.map((todo) => (
    <TodoShow
      key={todo.id}
      todo={todo}
      removeTodo={removeTodo}
      changeTodo={changeTodo}
    />
  ));

  return (
    <div>
      <div className="sort-dropdown">
        <label htmlFor="sort">Sort by:</label>
        <select id="sort" value={sortBy} onChange={handleSortChange}>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
          <option value="dueDate">Due Date</option>
          <option value="category">Category</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <ul className="todo-list">{renderedTodos}</ul>
    </div>
  );
};

export default TodoList;
