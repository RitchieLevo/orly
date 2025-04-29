import React, { useState, useRef } from "react";
// Necesitamos jsPDF para exportar la conversación a PDF
import jsPDF from "jspdf";

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { from: "ia", text: "¡Hola! Soy tu coach virtual. ¿En qué puedo ayudarte hoy?" }
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
      
      <form className="input-area" onSubmit={handleSend} style={{ marginTop: 0 }}>
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
        <button type="submit">Enviar</button>
      </form>
      <div style={{ display: "flex",  gap: 8, marginBottom: 8 , marginTop: 20 }}>
        <button
          type="button"
          onClick={handleMicClick}
          disabled={listening}
          style={{
            background: listening ? "#00a6c9" : "#00d4ff",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 14px",
            cursor: listening ? "not-allowed" : "pointer",
            fontWeight: 600,
            transition: "background 0.2s"
          }}
          title="Hablar por micrófono"
        >
          {listening ? "🎤 Escuchando..." : "🎤 Hablar"}
        </button>
        <button
          type="button"
          onClick={handleDownloadPDF}
          style={{
            background: "#00d4ff",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 14px",
            cursor: "pointer",
            fontWeight: 600
          }}
          title="Descargar conversación en PDF"
        >
          📄 Descargar PDF
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
