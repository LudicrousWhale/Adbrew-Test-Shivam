import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = "http://localhost:8000";

  // Fetch todos from backend
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/todos/`);
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error fetching todos.");
    } finally {
      setLoading(false);
    }
  };

  // Submit new todo to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/todos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (!res.ok) throw new Error("Failed to create todo");
      setDescription("");
      fetchTodos(); // refresh list
    } catch (err) {
      console.error(err);
      setError("Error adding todo.");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="App">
      <h1>TODO List</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a new todo"
        />
        <button type="submit">Add</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : todos.length === 0 ? (
        <p>No todos yet.</p>
      ) : (
        <ul>
          {todos.map((todo, index) => (
            <li key={index}>{todo.description}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
