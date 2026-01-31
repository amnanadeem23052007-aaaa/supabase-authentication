import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiTrash2, FiCheck, FiSun } from "react-icons/fi";

const Dashboard = () => {
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true); // default dark

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [dragId, setDragId] = useState(null);

  // 🔐 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // 📥 Fetch Todos
  const getTodos = async (currentUser) => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });

    if (!error) setTodos(data || []);
  };

  // ➕ Add Todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim() || !user) return;

    const { data, error } = await supabase
      .from("todos")
      .insert([{ title, user_id: user.id, is_completed: false }])
      .select();

    if (error) {
      console.error(error.message);
      return;
    }

    setTodos([data[0], ...todos]);
    setTitle("");
  };

  // ✅ Toggle complete
  const toggleTodo = async (id, status) => {
    await supabase
      .from("todos")
      .update({ is_completed: !status })
      .eq("id", id);

    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, is_completed: !status } : t
      )
    );
  };

  // ✏️ Edit
  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditTitle(todo.title);
  };

  const saveEdit = async () => {
    if (!editTitle.trim()) return;

    await supabase
      .from("todos")
      .update({ title: editTitle })
      .eq("id", editId);

    setTodos(
      todos.map((t) =>
        t.id === editId ? { ...t, title: editTitle } : t
      )
    );

    setEditId(null);
    setEditTitle("");
  };

  // 🗑 Delete
  const deleteTodo = async (id) => {
    await supabase.from("todos").delete().eq("id", id);
    setTodos(todos.filter((t) => t.id !== id));
  };

  // 🧠 Status badge
  const getStatus = (todo) => (todo.is_completed ? "Completed" : "Pending");

  // 🔃 Drag & Drop
  const handleDrop = (id) => {
    const items = [...todos];
    const from = items.findIndex((t) => t.id === dragId);
    const to = items.findIndex((t) => t.id === id);

    const moved = items[from];
    items.splice(from, 1);
    items.splice(to, 0, moved);

    setTodos(items);
  };

  // 🔐 Auth
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return navigate("/login");

      setUser(data.user);
      getTodos(data.user);
    };
    init();
  }, []);

  return (
   <div
  className={`${
    darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"
  } min-h-screen px-4 sm:px-6 lg:px-8 py-6 font-poppins transition-colors duration-500`}
>
  <div className="max-w-2xl mx-auto">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center sm:text-left">
        My Tasks
      </h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow transition flex items-center justify-center gap-1 font-medium"
        >
          <FiSun />
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition font-medium"
        >
          Logout
        </button>
      </div>
    </div>

    {/* Add Todo */}
    <form
      onSubmit={addTodo}
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } flex flex-col sm:flex-row gap-3 mb-6 p-4 rounded-xl shadow-md transition-colors duration-500`}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className={`flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium ${
          darkMode
            ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
            : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
        }`}
      />
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow transition font-medium w-full sm:w-auto"
      >
        Add
      </button>
    </form>

    {/* Todo List */}
    <AnimatePresence>
      {todos.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 py-6 font-medium"
        >
          No tasks yet 👀
        </motion.p>
      )}

      {todos.map((todo) => {
        const status = getStatus(todo);

        return (
          <motion.div
            key={todo.id}
            draggable
            onDragStart={() => setDragId(todo.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(todo.id)}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className={`${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
            } flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-xl shadow transition border-l-4 mb-3 ${
              status === "Completed"
                ? "border-green-500"
                : "border-yellow-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={todo.is_completed}
                onChange={() => toggleTodo(todo.id, todo.is_completed)}
                className="h-5 w-5 accent-indigo-600"
              />

              {editId === todo.id ? (
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={`border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              ) : (
                <span
                  className={`text-base sm:text-lg ${
                    todo.is_completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {todo.title}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {editId === todo.id ? (
                <button
                  onClick={saveEdit}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center gap-1"
                >
                  <FiCheck /> Save
                </button>
              ) : (
                <>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {status}
                  </span>

                  <button
                    onClick={() => startEdit(todo)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md flex items-center gap-1"
                  >
                    <FiEdit /> Edit
                  </button>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md flex items-center gap-1"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </>
              )}
            </div>
          </motion.div>
        );
      })}
    </AnimatePresence>
  </div>
</div>
  );
};

export default Dashboard;
