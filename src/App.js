<<<<<<< HEAD
import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import TodoList from "./components/TodoList";
import TodoCreate from "./components/TodoCreate";
import "./App.css";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isFirstRender = useRef(true);

  // ✅ Load todos and user authentication from localStorage
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    const storedUser = localStorage.getItem("user");

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

    if (storedUser) {
      setIsAuthenticated(true);
    }
  }, []);

  // ✅ Save todos to localStorage (prevent empty saves on initial load)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
      console.log("Saved todos:", todos);
    }
  }, [todos]);

  // ✅ Handle login/logout
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify({ authenticated: true }));
  };

  const handleLogout = () => {
    sessionStorage.setItem("isAuthenticated", "false"); 
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


  // ✅ Notifications & Reminders
  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("Browser does not support notifications.");
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        const checkReminders = () => {
          todos.forEach((todo) => {
            const dueTime = new Date(todo.dueDate).getTime();
            const currentTime = new Date().getTime();

            if (dueTime - currentTime <= 0 && !todo.completed) {
              new Notification(`Reminder: ${todo.title}`, {
                body: `Due: ${todo.dueDate}`,
                icon: "/path/to/icon.png",
              });
            }
          });
        };

        const interval = setInterval(checkReminders, 60000); // Every minute
        return () => clearInterval(interval);
      }
    });
  }, [todos]);

  return (
    <Router>
        {isAuthenticated ? (
          <>
            <header className="header">
              <div className="headerBlock">
                <h1>My Todo List</h1>
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
        ) : (
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
    </Router>
  );
};

export default App;
=======
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login"; // Ensure correct import
import Signup from "./components/Signup"; // Import Signup component
import TodoList from "./components/TodoList";
import TodoCreate from "./components/TodoCreate";
import "./App.css";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated on app load
    // This effect runs once when the component mounts
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const createTodo = (title, category, priority, dueDate) => {
    const newTodo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      category,
      priority,
      dueDate,
    };
    setTodos([...todos, newTodo]);
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const changeTodo = (id, title, completed, category, priority, dueDate) => {
    const updatedTodo = { id, title, completed, category, priority, dueDate };
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <main className="main">
                <h1>My Todo Lists</h1>
                <TodoList todos={todos} removeTodo={removeTodo} changeTodo={changeTodo} />
                <TodoCreate createTodo={createTodo} />
              </main>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
>>>>>>> 035e71d4fcdfde2ccbe041222a157dc6cf69c450
