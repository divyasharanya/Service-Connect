import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, steps, onStepClick }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps?.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;
          const isClickable = currentStep >= stepNumber;

          return (
            <React.Fragment key={step?.id}>
              <div
                className={`flex items-center space-x-2 cursor-pointer transition-micro ${
                  isClickable ? 'hover:opacity-80' : 'cursor-not-allowed'
                }`}
                onClick={() => isClickable && onStepClick(stepNumber)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-micro ${
                    isCompleted
                      ? 'bg-success text-success-foreground'
                      : isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    stepNumber
                  )}
                </div>
                <div className="hidden sm:block">
                  <p
                    className={`text-sm font-medium ${
                      isActive || isCompleted
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {step?.description}
                  </p>
                </div>
              </div>
              {index < steps?.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-micro ${
                    currentStep > stepNumber ? 'bg-success' : 'bg-border'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* Mobile Step Info */}
      <div className="sm:hidden mt-4 text-center">
        <p className="text-sm font-medium text-foreground">
          {steps?.[currentStep - 1]?.title}
        </p>
        <p className="text-xs text-muted-foreground">
          Step {currentStep} of {steps?.length}
        </p>
      </div>
    </div>
  );
};

export default ProgressIndicator;