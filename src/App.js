import React from "react";
import VirtualCoach from "./components/VirtualCoach";
import ChatWindow from "./components/ChatWindow";
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
    </div>
  );
}


export default App;
