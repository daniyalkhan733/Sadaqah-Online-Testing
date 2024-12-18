import React, { useState } from 'react';
import DonationCart from './DonationCart';
import GiftAidStep from './GiftAidStep';
import ContactForm from './ContactForm';
import PersonalDetailsForm from './PersonalDetailsForm';
import Success from './Success';
import Failed from './Failed';
import "../../../index.css";


const Wizard = () => {
  const steps = [
    { number: 1, title: 'Cart', component: <DonationCart /> },
    { number: 2, title: 'Gift Aid', component: <GiftAidStep /> },
    { number: 3, title: 'Communication', component: <ContactForm /> },
    { number: 4, title: 'Personal Info', component: <PersonalDetailsForm /> },
    { number: 5, title: 'Confirmation', component: <><Success /><Failed /></> },
  ];

  const [currentStep, setCurrentStep] = useState(1);

  const topScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const updateUI = (stepNumber) => {
    setCurrentStep(stepNumber);
    topScroll();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative mb-12">
        <div id="progress-bar" className="absolute transition-all duration-300"></div>

        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`step-circle w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm relative z-10 transition-colors duration-300 ${
                  step.number === currentStep
                    ? 'bg-[#02343F] text-white'
                    : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}
              >
                {step.number}
              </div>
              <div className="mt-2 text-xs font-medium text-gray-500">{step.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white md:p-6 px-2 rounded-lg shadow-sm border-gray-200 min-h-48">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`step-content ${currentStep === step.number ? '' : 'hidden'}`}
          >
            {step.component}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between px-4">
        <button
          onClick={() => updateUI(currentStep - 1)}
          disabled={currentStep === 1}
          className={`px-4 py-2 rounded ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Previous
        </button>

        <button
          onClick={() => updateUI(currentStep + 1)}
          disabled={currentStep === steps.length}
          className={`px-4 py-2 rounded ${
            currentStep === steps.length
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#02343F] text-white hover:bg-[#02343fc5]'
          }`}
        >
          {currentStep === steps.length
            ? 'Complete'
            : currentStep === steps.length - 1
            ? 'Proceed To Payment'
            : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Wizard;
