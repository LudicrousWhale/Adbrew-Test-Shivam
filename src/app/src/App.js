import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = "http://localhost:8000";

  // fetch todos from backend
  const fetchTodos = async () => {
    try {
      setLoading(true);

      // GET api call to fetch todos
      const todoListResult = await fetch(`${API_BASE}/todos/`);
      if (!todoListResult.ok)
        throw new Error("Failed to fetch todos");

      const todoList = await todoListResult.json();

      // update the state
      setTodos(todoList);
      setError("");

    } catch (error) {
      console.error(error);
      setError("Error fetching todos.");

    } finally {
      setLoading(false);
    }
  };

  // submit new todo to backend
  const handleSubmit = async (event) => {
    event.preventDefault();

    // if todo is an empty string, return
    if (!description.trim()) {
      setError("Todo cannot be empty.");
      return;
    }

    try {
      // POST call to create a new todo
      const updateTodoListResult = await fetch(`${API_BASE}/todos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (!updateTodoListResult.ok) 
        throw new Error("Failed to create todo");
      
      setDescription("");
      fetchTodos(); // refresh list

    } catch (error) {
      console.error(error);
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

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Loading...</p>
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
