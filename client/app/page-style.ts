export const pageCss = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  @keyframes float-delayed {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-15px);
    }
  }

  @keyframes float-slow {
    0%, 100% {
      transform: translateY(0px) translateX(0px);
    }
    33% {
      transform: translateY(-10px) translateX(5px);
    }
    66% {
      transform: translateY(5px) translateX(-5px);
    }
  }

  @keyframes float-medium {
    0%, 100% {
      transform: translateY(0px) translateX(0px);
    }
    50% {
      transform: translateY(-15px) translateX(10px);
    }
  }

  @keyframes float-fast {
    0%, 100% {
      transform: translateY(0px) translateX(0px);
    }
    25% {
      transform: translateY(-8px) translateX(8px);
    }
    75% {
      transform: translateY(8px) translateX(-8px);
    }
  }

  @keyframes wave-1 {
    0%, 100% {
      transform: translateX(0px) translateY(0px) rotate(0deg);
    }
    33% {
      transform: translateX(30px) translateY(-30px) rotate(120deg);
    }
    66% {
      transform: translateX(-20px) translateY(20px) rotate(240deg);
    }
  }

  @keyframes wave-2 {
    0%, 100% {
      transform: translateX(0px) translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateX(-40px) translateY(-40px) rotate(180deg);
    }
  }

  @keyframes wave-3 {
    0%, 100% {
      transform: translateX(-50%) translateY(-50%) rotate(0deg);
    }
    33% {
      transform: translateX(-50%) translateY(-50%) rotate(120deg);
    }
    66% {
      transform: translateX(-50%) translateY(-50%) rotate(240deg);
    }
  }

  @keyframes grid-move {
    0% {
      transform: translateX(0px) translateY(0px);
    }
    100% {
      transform: translateX(20px) translateY(20px);
    }
  }

  @keyframes gradient-text {
    0%, 100% {
      background-size: 200% 200%;
      background-position: left center;
    }
    50% {
      background-size: 200% 200%;
      background-position: right center;
    }
  }

  .animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out forwards;
  }

  .animate-fade-in {
    animation: fade-in 0.6s ease-out forwards;
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-float-delayed {
    animation: float-delayed 8s ease-in-out infinite;
  }

  .animate-float-slow {
    animation: float-slow 8s ease-in-out infinite;
  }

  .animate-float-medium {
    animation: float-medium 6s ease-in-out infinite;
  }

  .animate-float-fast {
    animation: float-fast 4s ease-in-out infinite;
  }

  .animate-wave-1 {
    animation: wave-1 20s ease-in-out infinite;
  }

  .animate-wave-2 {
    animation: wave-2 25s ease-in-out infinite;
  }

  .animate-wave-3 {
    animation: wave-3 30s ease-in-out infinite;
  }

  .animate-grid-move {
    animation: grid-move 20s linear infinite;
  }

  .animate-gradient-text {
    animation: gradient-text 3s ease infinite;
  }

  .delay-50 {
    animation-delay: 0.05s;
  }

  .delay-100 {
    animation-delay: 0.1s;
  }

  .delay-200 {
    animation-delay: 0.2s;
  }

  .delay-300 {
    animation-delay: 0.3s;
  }

  .delay-500 {
    animation-delay: 0.5s;
  }

  .bg-grid-pattern {
    background-image: radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }
`
