import React, { useState, useEffect } from "react";

const TodoList = () => {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [usuario, setUsuario] = useState("alesanchezr");

  useEffect(() => {
    fetchTodos();
  }, [usuario]);

  const fetchTodos = () => {
    fetch(`https://playground.4geeks.com/todo/user/${usuario}`)
      .then(resp => resp.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTareas(data);
        } else {
          setTareas([]);
        }
      })
      .catch(error => console.error("Error fetching todos:", error));
  };

  const updateTodos = (todos) => {
    fetch(`https://playground.4geeks.com/todo/user/${usuario}`, {
      method: "PUT",
      body: JSON.stringify(todos),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(resp => {
        if (!resp.ok) {
          throw new Error('Error updating todos');
        }
        return resp.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setTareas(data);
        } else {
          setTareas(todos);
        }
      })
      .catch(error => {
        console.error("Error updating todos:", error);
        setTareas(todos);
      });
  };

  const agregarTarea = () => {
    if (nuevaTarea.trim() !== "") {
      const nuevasTareas = [...tareas, { label: nuevaTarea, done: false }];
      setTareas(nuevasTareas);
      setNuevaTarea("");
      updateTodos(nuevasTareas);
    }
  };

  const eliminarTarea = (indice) => {
    const nuevasTareas = tareas.filter((_, i) => i !== indice);
    setTareas(nuevasTareas);
    updateTodos(nuevasTareas);
  };

  const manejarKeyDown = (e) => {
    if (e.key === "Enter") {
      agregarTarea();
    }
  };

  const clearTodos = () => {
    fetch(`https://playground.4geeks.com/todo/user/${usuario}`, {
      method: "DELETE",
    })
      .then(resp => {
        if (!resp.ok) {
          throw new Error('Error deleting user');
        }
        setTareas([]);
      })
      .catch(error => console.error("Error deleting user:", error));
  };

  const crearUsuario = () => {
    fetch('https://playground.4geeks.com/todo/user/', {
      method: "POST",
      body: JSON.stringify([]),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(resp => resp.json())
      .then(data => {
        if (data && data.username) {
          setUsuario(data.username);
          setTareas([]);
        }
      })
      .catch(error => console.error("Error creating user:", error));
  };

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-9">
          <h1 className="text-center">todos</h1>
        </div>
        <div className="col-3 d-flex justify-content-end align-items-center">
          <button 
            className="btn btn-success" 
            onClick={crearUsuario}
            style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}
          >
            Crear nuevo usuario
          </button>
        </div>
      </div>
      <p className="text-center">Usuario actual: {usuario}</p>
      <div className="list-group">
        <input
          type="text"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          onKeyDown={manejarKeyDown}
          placeholder="Agregar nueva tarea"
          className="list-group-item"
        />
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {tareas.map((tarea, indice) => (
            <li
              className="d-flex justify-content-between align-items-center"
              key={indice}
              onMouseEnter={() => setHoveredIndex(indice)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ 
                padding: "10px", 
                margin: "5px 0", 
                borderBottom: "1px solid #ccc",
                backgroundColor: hoveredIndex === indice ? '#f8f9fa' : 'transparent',
                transition: 'background-color 0.3s ease'
              }}
            >
              <span>{tarea.label}</span>
              {hoveredIndex === indice && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminarTarea(indice)}
                  style={{
                    opacity: 1,
                    transition: 'opacity 0.3s ease'
                  }}
                >
                  <i className="fas fa-trash"></i>
                </button>
              )}
            </li>
          ))}
        </ul>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <strong>Total de tareas: {tareas.length}</strong>
          <button className="btn btn-outline-danger" onClick={clearTodos}>
            Limpiar todas las tareas
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoList;