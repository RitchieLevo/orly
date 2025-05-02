import React from "react";

/**
 * Componente Perfil
 * Props:
 * - foto: URL de la imagen del usuario
 * - nombre: Nombre o nickname del usuario
 * - edad: Edad del usuario
 * - descripcion: Breve descripción, ciudad, ocupación, etc.
 */
const Perfil = ({ foto, nombre, edad, descripcion }) => {
  return (
    <div
      className="perfil-container"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: "#f9fbfc",
        borderRadius: 16,
        padding: 20,
        boxShadow: "0 0px 16px rgba(0, 212, 255, 0.50), 0 1.5px 8px rgba(0,0,0,0.06) ",
        marginBottom: 24,
        maxWidth: 800
      }}
    >
      <img
        src={foto}
        alt="Foto de perfil"
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #00d4ff"
        }}
      />
      <div>
        <div style={{ fontWeight: 700, fontSize: "1.3rem", color: "#00a6c9" }}>
          {nombre}
        </div>
        <div style={{ fontSize: "1rem", color: "#555" }}>Edad: {edad}</div>
        {descripcion && (
          <div style={{ fontSize: "0.95rem", color: "#888", marginTop: 6 }}>
            {descripcion}
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;