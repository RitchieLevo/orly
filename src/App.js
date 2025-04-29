import React, { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import StepByStepLesson from "./components/StepByStepLesson";
import VirtualCoach from "./components/VirtualCoach";
import "./styles/styles.css";

function App() {
  const [platform, setPlatform] = useState(null);

  return (
    <div className="main-container">
      <VirtualCoach />
      {!platform ? (
        <WelcomeScreen onSelectPlatform={setPlatform} />
      ) : (
        <StepByStepLesson platform={platform} />
      )}
    </div>
  );
}

export default App;
