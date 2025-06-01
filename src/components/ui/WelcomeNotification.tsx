import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface WelcomeNotificationProps {
  title?: string;
  message?: string;
  onClose?: () => void;
  duration?: number;
}

const WelcomeNotification: React.FC<WelcomeNotificationProps> = ({ 
  title,
  message = "",
  onClose,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Definir valores padrão se não forem fornecidos nas props
  if (!title) title = "Bem-vindo ao Lead Pilot";
  if (!message) message = "";
  if (!duration) duration = 5000;

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-white text-gray-800 border-b border-gray-200 px-3 py-2 z-50 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <span className="text-green-500">🚀</span>
          <span className="text-xs font-medium">{message}</span>
        </div>
        <button 
          onClick={handleClose} 
          className="text-gray-400 hover:text-gray-600"
          aria-label="Fechar notificação"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default WelcomeNotification; 