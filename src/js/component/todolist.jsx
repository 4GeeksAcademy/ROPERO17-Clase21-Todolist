import React, { useState, useEffect } from "react";

const TodoList = () => {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);

 
  useEffect(() => {
    fetch('https://playground.4geeks.com/todo/user/alesanchezr')
      .then(resp => resp.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTareas(data);
        } else {
          setTareas([]);
        }
      })
      .catch(error => console.error("Error fetching todos:", error));
  }, []);

  
  const updateTodos = (todos) => {
    fetch('https://playground.4geeks.com/todo/user/alesanchezr', {
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
    const emptyTodos = [];
    setTareas(emptyTodos);
    updateTodos(emptyTodos);
  };

  return (
    <div className="container text-center">
      <div className="list-group">
        <h1>todos</h1>
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
              className="d-flex justify-content-start"
              key={indice}
              onMouseEnter={() => setHoveredIndex(indice)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ position: "relative", padding: "10px 0", margin: "5px 0", borderBottom: "1px solid #ccc" }}
            >
              {tarea.label}
              {hoveredIndex === indice && (
                <button
                  className="btn btn-outline-danger"
                  onClick={() => eliminarTarea(indice)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer"
                  }}
                >
                  X
                </button>
              )}
            </li>
          ))}
        </ul>
        <div className="list-group d-flex justify-content-start" style={{ marginTop: "10px", margin: "5px 0", borderBottom: "1px solid #ccc" }}>
          <strong>Total de tareas: {tareas.length}</strong>
        </div>
        <button className="btn btn-outline-danger mt-3" onClick={clearTodos}>
          Limpiar todas las tareas
        </button>
      </div>
    </div>
  );
};

export default TodoList;