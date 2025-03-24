import { useState } from "react";
import CheckIcon from "../check.svg";

const TodoEdit = ({ todo, onSubmit }) => {
  const [title, setTitle] = useState(todo.title);
  const [category, setCategory] = useState(todo.category || "Personal");
  const [priority, setPriority] = useState(todo.priority || "Medium");
  const [dueDate, setDueDate] = useState(todo.dueDate || "");

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
    onSubmit(todo.id, title, category, priority, dueDate);
  };

  return (
    <form className="todo-edit" onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={handleChangeTitle} />
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
      <button type="submit">
        <img src={CheckIcon} alt="Save todo" title="Save" />
      </button>
    </form>
  );
};

export default TodoEdit;