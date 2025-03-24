<<<<<<< HEAD
import { useState } from "react";

const TodoCreate = ({ createTodo }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Personal");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    createTodo(title, category, priority, dueDate);

    // Reset form fields
    setTitle("");
    setCategory("Personal");
    setPriority("Medium");
    setDueDate("");
  };

  const isDisabled = !title.trim() || !dueDate;

  return (
    <form onSubmit={handleSubmit} className="todo-create">
      <input
        type="text"
        name="title"
        id="title"
        placeholder="Enter a todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* ✅ Display Category, Priority, Due Date, and Button in a single row */}
      <div className="todo-row">
        <div className="todo-field">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Chores">Chores</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
          </select>
        </div>

        <div className="todo-field">
          <label>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="todo-field">
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <div className="todo-field">
          <button type="submit" disabled={isDisabled}>
            Add Todo
          </button>
        </div>
      </div>
    </form>
  );
};

export default TodoCreate;
=======
import { useState } from "react";

const TodoCreate = ({ createTodo }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Personal");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleChangeCategory = (e) => {
    setCategory(e.target.value);
  };

  const handleChangePriority = (e) => {
    setPriority(e.target.value);
  };

  const handleChangeDueDate = (e) => {
    setDueDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createTodo(title, category, priority, dueDate);
    setTitle("");
    setCategory("Personal");
    setPriority("Medium");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="todo-create">
      <input
        type="text"
        name="title"
        id="title"
        placeholder="Enter a todo"
        value={title}
        onChange={handleChangeTitle}
      />
      <select value={category} onChange={handleChangeCategory}>
        <option value="Chores">Chores</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
      </select>
      <select value={priority} onChange={handleChangePriority}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <input type="date" value={dueDate} onChange={handleChangeDueDate} />
      <button type="submit">Add Todo</button>
    </form>
  );
};

export default TodoCreate;
>>>>>>> 035e71d4fcdfde2ccbe041222a157dc6cf69c450
