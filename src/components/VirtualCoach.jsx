import React, { useState, useRef } from "react";
import "../styles/styles.css";
import AvatarCircuit from "./AvatarCircuit";


const VirtualCoach = () => {
  const [message, setMessage] = useState("¡Hola! Soy tu guía para crear videojuegos.");
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
      const respuesta = "¡Genial! Vamos a hacerlo paso a paso 🚀";
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
      <div className="input-area">
        <input
          type="text"
          placeholder="Escribe tu pregunta..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={() => handleSend()}>Enviar</button>
        <button
          onClick={handleMicClick}
          style={{
            background: isListening ? "#ffcccc" : "#f0f0f0",
            marginLeft: "8px",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            border: "none",
            cursor: "pointer"
          }}
          title={isListening ? "Escuchando..." : "Hablar"}
        >
          <span role="img" aria-label="mic">
            {isListening ? "🎤" : "🎙️"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default VirtualCoach;
