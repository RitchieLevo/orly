import React, { useEffect, useRef } from "react";

/**
 * AvatarCircuit
 * Un avatar SVG animado que simula un circuito electrónico.
 * El brillo y color de los nodos/lineas cambia cuando isSpeaking es true.
 * La boca se anima cuando isSpeaking es true.
 */
const NODES = 8;
const RADIUS = 48;
const CENTER = 60;

const getNodePos = (i) => {
  const angle = (2 * Math.PI * i) / NODES;
  return {
    x: CENTER + Math.cos(angle) * RADIUS,
    y: CENTER + Math.sin(angle) * RADIUS,
  };
};

const AvatarCircuit = ({ isSpeaking }) => {
  const linesRef = useRef([]);
  const nodesRef = useRef([]);
  const mouthRef = useRef();

  // Animación de líneas (simula corriente)
  useEffect(() => {
    let frame;
    let t = 0;
    function animate() {
      t += 0.04;
      linesRef.current.forEach((line, i) => {
        if (line) {
          const dashOffset = (Math.sin(t + i) * 10) % 30;
          line.setAttribute("stroke-dashoffset", dashOffset);
        }
      });
      nodesRef.current.forEach((node, i) => {
        if (node) {
          const scale = 1 + (Math.sin(t * 1.2 + i) * 0.08);
          node.setAttribute("transform", `scale(${scale})`);
        }
      });
      frame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  // Animación de la boca (hablando)
  useEffect(() => {
    let t = 0;
    let animFrame;
    const baseY = CENTER + 7;
    const smileY = CENTER + 16;
    
    function animateMouth() {
      if (mouthRef.current) {
        let qY;
        if (isSpeaking) {
          // Boca se mueve arriba y abajo como hablando
          qY = smileY + Math.sin(t * 0.25) * 2 + Math.abs(Math.sin(t * 0.13)) * 4;
        } else {
          // Boca normal (sonrisa)
          qY = smileY;
        }
        const d = `
          M${CENTER - 7},${baseY}
          Q${CENTER},${qY}
          ${CENTER + 7},${baseY}
        `;
        mouthRef.current.setAttribute("d", d);
        t += 1;
      }
      animFrame = requestAnimationFrame(animateMouth);
    }
    animateMouth();
    return () => cancelAnimationFrame(animFrame);
  }, [isSpeaking]);

  // Colores según estado
  const lineColor = isSpeaking ? "#00ffff" : "#00d4ff";
  const nodeColor = isSpeaking ? "#00ffff" : "#00d4ff";
  const nodeGlow = isSpeaking ? "0 0 18px #00ffff" : "0 0 10px #00d4ff";

  // Nodos y líneas
  const nodes = Array.from({ length: NODES }, (_, i) => getNodePos(i));
  const lines = nodes.map((pos, i) => {
    const next = nodes[(i + 1) % NODES];
    return { x1: pos.x, y1: pos.y, x2: next.x, y2: next.y };
  });

  return (
    <svg 
    className="circle-svg"
      width={220}
      height={220}
      viewBox="0 0 120 120"
      style={{
        
        display: "block",
        margin: "0 auto",
        filter: isSpeaking ? "drop-shadow(0 0 18px #00ffff)" : "drop-shadow(0 0 8px #00d4ff)",
        transition: "filter 0.3s",
        // background: "rgba(0,0,0,0.08)",
        borderRadius: "50%",
        padding: "50px"
      }}
    >
      {/* Líneas del circuito */}
      {lines.map((line, i) => (
        <line
          key={i}
          ref={el => (linesRef.current[i] = el)}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={lineColor}
          strokeWidth="3"
          strokeDasharray="18 10"
          strokeLinecap="round"
          style={{
            filter: isSpeaking
              ? "drop-shadow(0 0 8px #00ffff)"
              : "drop-shadow(0 0 4px #00d4ff)",
            transition: "stroke 0.3s, filter 0.3s",
          }}
        />
      ))}
      {/* Nodos */}
      {nodes.map((pos, i) => (
        <g key={i}>
          <circle
            ref={el => (nodesRef.current[i] = el)}
            cx={pos.x}
            cy={pos.y}
            r="8"
            fill={nodeColor}
            style={{
              filter: nodeGlow,
              transition: "fill 0.3s, filter 0.3s",
            }}
          />
          {/* Nodo interior para efecto de pulso */}
          <circle
            cx={pos.x}
            cy={pos.y}
            r="4"
            fill="#fff"
            opacity={isSpeaking ? 0.7 : 0.4}
          />
        </g>
      ))}
      {/* Centro (cara minimalista) */}
      <circle
        cx={CENTER}
        cy={CENTER}
        r="22"
        fill="#101c24"
        stroke={lineColor}
        strokeWidth="3"
        style={{
          filter: isSpeaking
            ? "drop-shadow(0 0 12px #00ffff)"
            : "drop-shadow(0 0 6px #00d4ff)",
          transition: "stroke 0.3s, filter 0.3s",
        }}
      />
      {/* Ojos */}
      <ellipse cx={CENTER - 7} cy={CENTER - 2} rx="2.5" ry="4" fill="#fff" opacity="0.8" />
      <ellipse cx={CENTER + 7} cy={CENTER - 2} rx="2.5" ry="4" fill="#fff" opacity="0.8" />
      {/* Boca (animada) */}
      <path
        ref={mouthRef}
        d={`
          M${CENTER - 7},${CENTER + 7}
          Q${CENTER},${CENTER + 16}
          ${CENTER + 7},${CENTER + 7}
        `}
        stroke="#fff"
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
};

export default AvatarCircuit;
