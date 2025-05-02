import React from "react";
import VirtualCoach from "./components/VirtualCoach";
import ChatWindow from "./components/ChatWindow";
import Perfil from "./components/Perfil";

import "./styles/styles.css";

function App() {
  return (
    <div className="main-flex-container">
      <div className="chat-section">
        <ChatWindow />
      </div>
      
      <div className="avatar-section">
        <VirtualCoach />
      </div>


      <div
        style={{
          position: "fixed",
          bottom: 150,
          right: 180,
          zIndex: 1000, 
        }}
      >
        <Perfil
          foto="https://randomuser.me/api/portraits/lego/6.jpg"
          nombre="Juan Pérez"
          edad={14}
          descripcion="Ciudad de México · Amante de la tecnología."
        />
      </div>
    </div>
  );
}


export default App;
