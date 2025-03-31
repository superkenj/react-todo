import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import TodoList from "./components/TodoList";
import TodoCreate from "./components/TodoCreate";
import "./App.css";
import "./components/Auth.css";

const App = () => {
  const [todos, setTodos] = useState([]);                  // State to store todo items
  const [isAuthenticated, setIsAuthenticated] = useState(null);  // State to track authentication status
  const isFirstRender = useRef(true);                      // Ref to prevent saving todos on initial render

  // ✅ Load todos and user authentication from localStorage and sessionStorage on initial render
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");     // Retrieve todos from localStorage
    const storedUser = sessionStorage.getItem("user");      // Retrieve user authentication from sessionStorage

    if (storedTodos) {
      try {
        const parsedTodos = JSON.parse(storedTodos);
        if (Array.isArray(parsedTodos)) {
          setTodos(parsedTodos);
          console.log("Loaded todos:", parsedTodos);
        }
      } catch (error) {
        console.error("Error parsing todos:", error);
        setTodos([]);
      }
    }

    setIsAuthenticated(!!storedUser);
  }, []);

  // ✅ Save todos to localStorage (with initial render check)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // ✅ Notifications & Reminders
  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }

    if (Notification.permission !== "granted") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          console.log("Notification permission granted");
        }
      });
    }

    const checkReminders = () => {
      const now = new Date();
      todos.forEach(todo => {
        if (!todo.completed && todo.dueDate) {
          try {
            const dueDate = new Date(todo.dueDate);  // ✅ Define dueDate before using it

            if (
              dueDate.toDateString() !== now.toDateString()
            ) {
              return;  // Skip if not due today
            }

            const timeDiff = dueDate - now;
            if (timeDiff <= 300000 || timeDiff < 0) {  // 5 minutes or overdue
              new Notification(`Todo Reminder: ${todo.title}`, {
                body: `Due: ${dueDate.toLocaleString()}\nCategory: ${todo.category || 'No category'}`,
                icon: "/todo-icon.png",
                tag: `todo-reminder-${todo.id}`
              });
            }
          } catch (e) {
            console.error("Error processing todo due date:", e);
          }
        }
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000);

    return () => clearInterval(interval);
  }, [todos]);

  // ✅ Prevent rendering before checking authentication
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // ✅ Handle login/logout
  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem("user", JSON.stringify({ authenticated: true }));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  // ✅ Create a new todo
  const createTodo = (title, category, priority, dueDate) => {
    const newTodo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      category,
      priority,
      dueDate,
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  // ✅ Remove todo
  const removeTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  // ✅ Modify existing todo
  const changeTodo = (id, title, category, priority, dueDate, completed) => {
    const updatedTodo = { id, title, category, priority, dueDate, completed };
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
    );
  };

  return (
    <Router>
      <Routes>
        {isAuthenticated ? (
          <>
            <Route
              path="/"
              element={
                <>
                  <header className="header">
                    <div className="headerBlock">
                      <div className="icon-container2">
                        <img src="/TickTrack_logo.png" alt="App Icon" className="app-icon2" />
                      </div>
                      <h1>TickTrack</h1>
                      <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </div>
                  </header>

                  <div className="listBlock">
                    <TodoList todos={todos} removeTodo={removeTodo} changeTodo={changeTodo} />
                  </div>

                  <div className="createBlock">
                    <TodoCreate createTodo={createTodo} />
                  </div>
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
  );
};

export default App;
