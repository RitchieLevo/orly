import React, { useState, useRef } from "react";
import "../styles/styles.css";
import AvatarCircuit from "./AvatarCircuit";


const VirtualCoach = () => {
  const [message, setMessage] = useState("¡Hola! Soy Orby tu maestro virtual.");
  const [userInput, setUserInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const synthRef = useRef(window.speechSynthesis);
  const recognitionRef = useRef(null);

  // Función para hablar y vibrar
  const speakCoach = (text) => {
    // Limpia cualquier voz en cola
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }

    if ("speechSynthesis" in window) {
      const utterance = new window.SpeechSynthesisUtterance(text);
      // Selecciona voz en español si está disponible
      const voices = synthRef.current.getVoices();
      const spanishVoice = voices.find(v => v.lang.startsWith("es"));
      if (spanishVoice) {
        utterance.voice = spanishVoice;
        utterance.lang = spanishVoice.lang;
      } else {
        utterance.lang = "es-ES"; // Configurar idioma español
      }
      setIsSpeaking(true);
      
      // Vibrar si la API está disponible
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    } else {
      setIsSpeaking(true);
      // Simular duración del habla si la API no está disponible
      setTimeout(() => setIsSpeaking(false), 1500);
    }
  };

  // Maneja el envío del usuario
  const handleSend = (inputText) => {
    const text = typeof inputText === "string" ? inputText : userInput;
    if (text.trim() !== "") {
      const respuesta = "¡Genial! Vamos a hacerlo";
      setMessage(respuesta);
      speakCoach(respuesta); // Solo habla y vibra tras interacción
      setUserInput("");
    }
  };

  // Maneja el reconocimiento de voz
  const handleMicClick = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Tu navegador no soporta reconocimiento de voz.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      recognitionRef.current = null;
      alert("Error en el reconocimiento de voz: " + event.error);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript); // Mostrar lo que se dijo
      handleSend(transcript); // Responde automáticamente
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="avatar-floating">
      <AvatarCircuit isSpeaking={isSpeaking} />
      <div className="coach-bubble">
        {message}
      </div>
      <div className="input-area" style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Escribe tu pregunta..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          style={{
            width: "100%",
            paddingRight: 90, // espacio para los íconos
            borderRadius: 8,
            border: "1px solid #e0e0e0",
            fontSize: "1rem",
            padding: "10px 16px",
            boxSizing: "border-box",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            gap: 8,
            alignItems: "center",
            zIndex: 2,
          }}
        >
          {/* Botón enviar (paper plane) */}
          <button
            type="button"
            onClick={() => handleSend()}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: userInput.trim() ? "pointer" : "not-allowed",
              outline: "none",
              display: "flex",
              alignItems: "center",
              opacity: userInput.trim() ? 1 : 0.5,
            }}
            disabled={!userInput.trim()}
            aria-label="Enviar mensaje"
            title="Enviar mensaje"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="#00d4ff"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
          {/* Botón micrófono */}
          <button
  type="button"
  onClick={handleMicClick}
  style={{
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    outline: "none",
    display: "flex",
    alignItems: "center",
    opacity: isListening ? 0.5 : 1,
  }}
  aria-label={isListening ? "Escuchando..." : "Hablar"}
  title={isListening ? "Escuchando..." : "Hablar"}
>
  {/* SVG micrófono mejorado */}
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="9" y="2" width="6" height="12" rx="3" fill={isListening ? "#00a6c9" : "#00d4ff"} />
    <path
      d="M5 10V12C5 15.3137 7.68629 18 11 18H13C16.3137 18 19 15.3137 19 12V10"
      stroke={isListening ? "#00a6c9" : "#00d4ff"}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="12"
      y1="18"
      x2="12"
      y2="22"
      stroke={isListening ? "#00a6c9" : "#00d4ff"}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="8"
      y1="22"
      x2="16"
      y2="22"
      stroke={isListening ? "#00a6c9" : "#00d4ff"}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
</button>
        </div>
      </div>
    </div>
  );
};

export default VirtualCoach;
