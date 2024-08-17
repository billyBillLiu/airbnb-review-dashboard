import { React, useState } from "react";
import "../../styles/TutorialOverlay.css";
import tutorial_step_1 from "../../assets/tutorial_step_1.png";
import tutorial_step_2 from "../../assets/tutorial_step_2.png";
import tutorial_step_3 from "../../assets/tutorial_step_3.png";
import tutorial_step_4 from "../../assets/tutorial_step_4.png";
import tutorial_step_5 from "../../assets/tutorial_step_5.png";
import x_icon from "../../assets/x_icon.png";
import right_chevron from "../../assets/right_chevron.png";
import left_chevron from "../../assets/left_chevron.png";

const tutorialSteps = [
  tutorial_step_1,
  tutorial_step_2,
  tutorial_step_3,
  tutorial_step_4,
  tutorial_step_5,
];

function TutorialOverlay({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNextStep = () => {
    setCurrentStep((prevStep) => (prevStep + 1) % tutorialSteps.length);
  };

  const goToPreviousStep = () => {
    setCurrentStep(
      (prevStep) => (prevStep - 1 + tutorialSteps.length) % tutorialSteps.length
    );
  };

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-dialog">
        <div className="tutorial-close-button">
          <img className="tutorial-close-icon" src={x_icon} onClick={onClose} />
        </div>
        {currentStep !== 0 && (
          <div className="nav left" onClick={goToPreviousStep}>
            <img src={left_chevron} />
          </div>
        )}
        <img
          className="tutorial-image"
          src={tutorialSteps[currentStep]}
          alt="Tutorial step 1"
        />
        {currentStep !== 4 && (
          <div className="nav right" onClick={goToNextStep}>
            <img src={right_chevron} />
          </div>
        )}
      </div>
    </div>
  );
}

export default TutorialOverlay;
