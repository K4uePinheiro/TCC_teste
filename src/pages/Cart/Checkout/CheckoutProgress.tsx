
import React from 'react';

interface CheckoutProgressProps {
  currentStep: 'carrinho' | 'entrega' | 'pagamento' | 'concluido';
}

const CheckoutProgress: React.FC<CheckoutProgressProps> = ({ currentStep }) => {
  const steps = [
    { id: 'carrinho', label: 'Carrinho', icon: <img src="/shopping-cart.svg" alt="Carrinho" className="w-5 h-5" /> },
    { id: 'entrega', label: 'Entrega', icon: <img src="/location.svg" alt="Carrinho" className="w-5 h-5" /> },
    { id: 'pagamento', label: 'Pagamento', icon: <img src="/card.svg" alt="Carrinho" className="w-5 h-5" /> },
    { id: 'concluido', label: 'Concluído', icon: <img src="/check.svg" alt="Carrinho" className="w-5 h-5" /> }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="checkout-progress">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;
        const isCompleted = index < currentStepIndex;
        
        return (
          <React.Fragment key={step.id}>
            <div className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
              <div className="step-icon">
                {step.icon}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`progress-line ${isCompleted ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CheckoutProgress;