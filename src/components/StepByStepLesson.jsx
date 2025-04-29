import React, { useState } from "react";


const lessons = {
  Scratch: [
    "1. Abre el editor de Scratch.",
    "2. Crea un nuevo escenario.",
    "3. Agrega un personaje (sprite).",
    "4. Programa un movimiento con bloques.",
    "5. Guarda tu juego."
  ],
  Godot: [
    "1. Crea un nuevo proyecto en Godot.",
    "2. Añade una escena 2D.",
    "3. Diseña tu personaje.",
    "4. Agrega scripts para mover al personaje.",
    "5. Ejecuta la escena para probar tu juego."
  ]
};

const StepByStepLesson = ({ platform }) => {
  const [step, setStep] = useState(0);
  const steps = lessons[platform] || [];

  return (
    <div className="lesson-container page-content">
      <h2 className="lesson-title">Guía paso a paso: {platform}</h2>
      <div className="step-box">{steps[step]}</div>
      <div className="navigation">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
        >
          Anterior
        </button>
        <button
          onClick={() => setStep(step + 1)}
          disabled={step === steps.length - 1}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default StepByStepLesson;
