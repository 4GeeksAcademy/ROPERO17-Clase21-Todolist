import React, { useState } from "react";

const TodoList = () => {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const agregarTarea = () => {
    if (nuevaTarea.trim() !== "") {
      setTareas([nuevaTarea, ...tareas]);
      setNuevaTarea("");
    }
  };

  const eliminarTarea = (indice) => {
    const nuevasTareas = tareas.filter((_, i) => i !== indice);
    setTareas(nuevasTareas);
  };

  const manejarKeyDown = (e) => {
    if (e.key === "Enter") {
      agregarTarea();
    }
  };
 
      return (
        <div className="container text-center">

<div  className="list-group">
      <h1>todos</h1>
      <input onClick={agregarTarea}
      
        type="text"
        value={nuevaTarea}
        onChange={(e) => setNuevaTarea(e.target.value)}
        onKeyDown={manejarKeyDown}
        placeholder="Agregar nueva tarea"
        class="list-group-item"
      />
       <ul   style={{ listStyleType: "none", padding: 0 }}>
      {tareas.map((tarea, indice) => (
          <li className="d-flex justify-content-start"
            key={indice}
            onMouseEnter={() => setHoveredIndex(indice)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ position: "relative", padding: "10px 0", margin: "5px 0", borderBottom: "1px solid #ccc" }}
          >
            {tarea}
            {hoveredIndex === indice && (
              <button className="btn btn-outline-danger"
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
    <div className="list-group d-flex justify-content-start" style={{ marginTop: "10px",margin: "5px 0", borderBottom: "1px solid #ccc" }}>
        <strong>Total de tareas: {tareas.length}</strong>
      </div>
    </div>
  
        </div>
	);
};

export default TodoList;
