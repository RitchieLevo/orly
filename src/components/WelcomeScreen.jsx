import React from "react";


const WelcomeScreen = ({ onSelectPlatform }) => {
  return (
    <div className="welcome-container">
      <h1 className="title">🎮 Bienvenido a Orby</h1>
      <h2>Maestro virtual inteligente</h2>
      <p className="subtitle">Elige una plataforma para comenzar:</p>
      <div className="platform-buttons">
        <button onClick={() => onSelectPlatform("Scratch")}>Scratch</button>
        <button onClick={() => onSelectPlatform("Godot")}>Godot Engine</button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
