import { useState } from "react";
import CheckIcon from "../g_check.svg";

const TodoEdit = ({ todo, onSubmit }) => {
  const [title, setTitle] = useState(todo.title);
  const [category, setCategory] = useState(todo.category || "Personal");
  const [priority, setPriority] = useState(todo.priority || "Medium");
  
  // Split date and time if both are present
  const [dueDate, setDueDate] = useState(todo.dueDate ? todo.dueDate.split('T')[0] : "");
  const [dueTime, setDueTime] = useState(todo.dueDate ? todo.dueDate.split('T')[1]?.slice(0, 5) : "");

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

  // ⭐️ Handle time changes
  const handleChangeDueTime = (e) => {
    setDueTime(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullDateTime = dueDate && dueTime ? `${dueDate}T${dueTime}:00` : dueDate;
    onSubmit(todo.id, title, category, priority, fullDateTime);
  };

  return (
    <form className="todo-edit" onSubmit={handleSubmit}>
      {/* Row 1: Title Only (Full Width) */}
      <div className="edit-title-row">
        <input 
          type="text" 
          value={title} 
          onChange={handleChangeTitle}
          className="edit-title-input"
        />
      </div>

      {/* Row 2: All Other Fields */}
      <div className="edit-fields-row">
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
        <input type="time" value={dueTime} onChange={handleChangeDueTime} />

        <button type="submit" className="edit-submit-btn">
          <img src={CheckIcon} alt="Save todo" title="Save" />
        </button>
      </div>
    </form>
  );
};

export default TodoEdit;
