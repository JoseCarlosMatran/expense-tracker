'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Target, Zap, Star, Crown } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

interface WelcomeAnimationProps {
  onComplete: () => void;
  userName?: string;
}

const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ onComplete, userName = 'Usuario' }) => {
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      icon: <Sparkles size={60} />,
      title: '¡Bienvenido a FinanceTracker!',
      subtitle: 'Tu compañero inteligente para el control financiero',
      color: '#10b981'
    },
    {
      icon: <Target size={60} />,
      title: 'Establece Metas',
      subtitle: 'Define presupuestos y objetivos de ahorro personalizados',
      color: '#3b82f6'
    },
    {
      icon: <TrendingUp size={60} />,
      title: 'Visualiza tu Progreso',
      subtitle: 'Gráficos hermosos e insights inteligentes',
      color: '#8b5cf6'
    },
    {
      icon: <Crown size={60} />,
      title: '¡Listo para Comenzar!',
      subtitle: `${userName}, es hora de tomar el control de tus finanzas`,
      color: '#f59e0b'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500);
          }, 2000);
          clearInterval(timer);
          return prev;
        }
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [onComplete, steps.length]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="welcome-overlay">
      <div className="welcome-container">
        {/* Floating particles */}
        <div className="particles">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}>
              {i % 4 === 0 ? '💰' : i % 4 === 1 ? '✨' : i % 4 === 2 ? '📊' : '🎯'}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="content-wrapper">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step-content ${currentStep === index ? 'active' : currentStep > index ? 'completed' : ''}`}
              style={{ '--step-color': step.color } as React.CSSProperties}
            >
              <div className="icon-wrapper">
                <div className="icon-glow"></div>
                <div className="icon">
                  {step.icon}
                </div>
                {currentStep === index && (
                  <div className="pulse-rings">
                    <div className="pulse-ring"></div>
                    <div className="pulse-ring delay-1"></div>
                    <div className="pulse-ring delay-2"></div>
                  </div>
                )}
              </div>
              
              <h2 className="step-title">{step.title}</h2>
              <p className="step-subtitle">{step.subtitle}</p>
              
              {currentStep === index && (
                <div className="feature-highlights">
                  <div className="highlight-item">
                    <Star size={16} />
                    <span>Seguimiento en tiempo real</span>
                  </div>
                  <div className="highlight-item">
                    <Zap size={16} />
                    <span>IA predictiva</span>
                  </div>
                  <div className="highlight-item">
                    <Target size={16} />
                    <span>Objetivos personalizados</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="progress-indicator">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`progress-dot ${currentStep >= index ? 'active' : ''}`}
            >
              {currentStep > index && <div className="checkmark">✓</div>}
            </div>
          ))}
          <div 
            className="progress-line"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Skip button */}
        <button className="skip-button" onClick={onComplete}>
          Omitir introducción →
        </button>
      </div>

      <style jsx>{`
        .welcome-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.5s ease-out;
        }

        .welcome-container {
          position: relative;
          max-width: 600px;
          width: 90%;
          text-align: center;
          color: white;
        }

        .particles {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          font-size: 24px;
          animation: floatParticle 6s ease-in-out infinite;
          opacity: 0.6;
        }

        .particle-1 { top: 10%; left: 10%; animation-delay: 0s; }
        .particle-2 { top: 15%; right: 15%; animation-delay: 0.5s; }
        .particle-3 { top: 30%; left: 5%; animation-delay: 1s; }
        .particle-4 { top: 45%; right: 8%; animation-delay: 1.5s; }
        .particle-5 { top: 60%; left: 12%; animation-delay: 2s; }
        .particle-6 { bottom: 20%; left: 20%; animation-delay: 2.5s; }
        .particle-7 { bottom: 15%; right: 25%; animation-delay: 3s; }
        .particle-8 { top: 25%; right: 30%; animation-delay: 3.5s; }
        .particle-9 { top: 70%; left: 70%; animation-delay: 4s; }
        .particle-10 { bottom: 30%; right: 10%; animation-delay: 4.5s; }
        .particle-11 { top: 5%; left: 60%; animation-delay: 5s; }
        .particle-12 { bottom: 10%; left: 40%; animation-delay: 5.5s; }

        .content-wrapper {
          position: relative;
          z-index: 1;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-content {
          opacity: 0;
          transform: scale(0.8) translateY(50px);
          position: absolute;
          width: 100%;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .step-content.active {
          opacity: 1;
          transform: scale(1) translateY(0);
          position: relative;
        }

        .step-content.completed {
          opacity: 0;
          transform: scale(1.1) translateY(-50px);
        }

        .icon-wrapper {
          position: relative;
          margin-bottom: 32px;
          display: inline-block;
        }

        .icon-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: var(--step-color);
          opacity: 0.3;
          filter: blur(20px);
          animation: breathe 2s ease-in-out infinite;
        }

        .icon {
          position: relative;
          z-index: 1;
          color: var(--step-color);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(255, 255, 255, 0.2);
          animation: iconFloat 3s ease-in-out infinite;
        }

        .pulse-rings {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          border: 2px solid var(--step-color);
          border-radius: 50%;
          opacity: 1;
          animation: pulseRing 2s ease-out infinite;
        }

        .pulse-ring.delay-1 {
          animation-delay: 0.5s;
        }

        .pulse-ring.delay-2 {
          animation-delay: 1s;
        }

        .step-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 16px;
          background: linear-gradient(135deg, white, #f0f9ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          animation: titleSlide 0.8s ease-out 0.2s both;
        }

        .step-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 32px;
          animation: subtitleSlide 0.8s ease-out 0.4s both;
        }

        .feature-highlights {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
          animation: highlightsSlide 0.8s ease-out 0.6s both;
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 12px 16px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 14px;
          font-weight: 500;
        }

        .progress-indicator {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 48px;
          z-index: 1;
        }

        .progress-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          position: relative;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .progress-dot.active {
          background: white;
          transform: scale(1.2);
        }

        .checkmark {
          font-size: 10px;
          color: #10b981;
          font-weight: bold;
        }

        .progress-line {
          position: absolute;
          top: 50%;
          left: 0;
          height: 2px;
          background: white;
          transform: translateY(-50%);
          transition: width 0.5s ease;
          z-index: -1;
        }

        .skip-button {
          position: absolute;
          bottom: 32px;
          right: 32px;
          background: none;
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 12px 24px;
          border-radius: 24px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .skip-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 0.3; }
        }

        @keyframes breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes iconFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulseRing {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }

        @keyframes titleSlide {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes subtitleSlide {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes highlightsSlide {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .welcome-container {
            width: 95%;
            padding: 20px;
          }

          .step-title {
            font-size: 2rem;
          }

          .step-subtitle {
            font-size: 1rem;
          }

          .feature-highlights {
            gap: 12px;
          }

          .highlight-item {
            padding: 8px 12px;
            font-size: 12px;
          }

          .skip-button {
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            font-size: 14px;
          }

          .particle {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default WelcomeAnimation;