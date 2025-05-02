import React, { useState, useRef } from "react";
// Necesitamos jsPDF para exportar la conversación a PDF
import jsPDF from "jspdf";

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { from: "ia", text: "¡Hola! Soy tu maestro virtual. ¿En qué puedo ayudarte hoy?" }
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Simula una respuesta de IA (puedes reemplazar esto por una llamada real a una API)
  const getAIResponse = async (userMessage) => {
    // Aquí puedes conectar con tu backend o API de IA real
    // Por ahora, solo responde con un mensaje genérico
    return `Recibí tu mensaje: "${userMessage}". ¿Quieres saber algo más?`;
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    // Simula espera de IA
    const aiText = await getAIResponse(input);
    setMessages((msgs) => [...msgs, { from: "ia", text: aiText }]);
  };

  // --- VOICE RECOGNITION ---
  const handleMicClick = () => {
    if (listening) return; // No iniciar si ya está escuchando

    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Tu navegador no soporta reconocimiento de voz.");
      return;
    }
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "es-ES";
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setListening(false);
        // Opcional: enviar automáticamente
        // setTimeout(() => handleSend(), 300);
      };
      recognitionRef.current.onerror = () => setListening(false);
      recognitionRef.current.onend = () => setListening(false);
    }
    setListening(true);
    recognitionRef.current.start();
  };

  // --- PDF EXPORT ---
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(14);
    let y = 20;
    doc.text("Conversación del Chat", 10, y);
    y += 10;
    messages.forEach((msg) => {
      let prefix = msg.from === "user" ? "Tú: " : "Coach: ";
      let lines = doc.splitTextToSize(prefix + msg.text, 180);
      if (y + lines.length * 8 > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(lines, 10, y);
      y += lines.length * 8;
    });
    doc.save("conversacion_chat.pdf");
  };

  return (
    <div className="chat-window enhanced-chat-window">

      <div className="messages-container" style={{ flex: 1, overflowY: "auto", marginBottom: 16 }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message-wrapper ${msg.from === "user" ? "user-message" : "ai-message"}`}
            style={{
              display: "flex",
              justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
              marginBottom: 8,
            }}
          >
            <div
              className="message-bubble"
              style={{
                background: msg.from === "user" ? "#00d4ff" : "#f9fbfc",
                color: msg.from === "user" ? "#fff" : "#333",
                borderRadius: 16,
                padding: "10px 18px",
                maxWidth: "70%",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                fontWeight: 500,
                fontSize: "1rem",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form
        className="input-area"
        onSubmit={handleSend}
        style={{
          marginTop: 0,
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
        autoComplete="off"
      >
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          style={{
            width: "100%",
            paddingRight: 132, // espacio para los 3 íconos
            borderRadius: 8,
            border: "1px solid #e0e0e0",
            fontSize: "1rem",
            padding: "10px 16px",
            boxSizing: "border-box",
          }}
        />
        {/* Contenedor de íconos */}
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
          
          {/* Enviar */}
          <button
            type="submit"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: input.trim() ? "pointer" : "not-allowed",
              outline: "none",
              display: "flex",
              alignItems: "center",
              opacity: input.trim() ? 1 : 0.5,
            }}
            disabled={!input.trim()}
            aria-label="Enviar mensaje"
            title="Enviar mensaje"
          >
            {/* Ícono enviar */}
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
          {/* PDF */}
          {/* Micrófono */}
          <button
            type="button"
            onClick={handleMicClick}
            disabled={listening}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: listening ? "not-allowed" : "pointer",
              outline: "none",
              display: "flex",
              alignItems: "center",
              opacity: listening ? 0.5 : 1,
            }}
            title={listening ? "Escuchando..." : "Hablar por micrófono"}
            aria-label="Hablar por micrófono"
          >
            {/* SVG micrófono mejorado */}
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="9" y="2" width="6" height="12" rx="3" fill={listening ? "#00a6c9" : "#00d4ff"} />
              <path
                d="M5 10V12C5 15.3137 7.68629 18 11 18H13C16.3137 18 19 15.3137 19 12V10"
                stroke={listening ? "#00a6c9" : "#00d4ff"}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="12"
                y1="18"
                x2="12"
                y2="22"
                stroke={listening ? "#00a6c9" : "#00d4ff"}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="8"
                y1="22"
                x2="16"
                y2="22"
                stroke={listening ? "#00a6c9" : "#00d4ff"}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleDownloadPDF}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              outline: "none",
              display: "flex",
              alignItems: "center",
            }}
            aria-label="Descargar conversación en PDF"
            title="Descargar conversación en PDF"
          >
            {/* Ícono PDF (documento) */}
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="#00d4ff"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5V9h5.5L13 3.5zM8 13h8v2H8v-2zm0 4h5v2H8v-2z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
