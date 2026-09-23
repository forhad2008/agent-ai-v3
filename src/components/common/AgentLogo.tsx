import React, { useState } from 'react';

export const AgentLogo: React.FC<{ className?: string }> = ({
  className = 'h-6 w-6',
}) => {
  const [hasError, setHasError] = useState(false);

  const baseUrl = import.meta.env.BASE_URL || './';
  const logoPath = baseUrl.endsWith('/') ? `${baseUrl}logomax.png` : `${baseUrl}/logomax.png`;

  if (!hasError) {
    return (
      <img
        src={logoPath}
        alt="Agent-sigma08 Logo"
        className={`${className} object-contain drop-shadow-[0_0_12px_rgba(229,9,20,0.6)]`}
        referrerPolicy="no-referrer"
        onError={(e) => {
          // Retry with logo.png
          if (!(e.currentTarget as HTMLImageElement).dataset.retried) {
            (e.currentTarget as HTMLImageElement).dataset.retried = 'true';
            (e.currentTarget as HTMLImageElement).src = `${baseUrl}logo.png`;
          } else {
            setHasError(true);
          }
        }}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient
          id="sigmaRedGradient"
          x1="12"
          y1="15"
          x2="88"
          y2="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FF4D4D" />
          <stop offset="0.3" stopColor="#FF204E" />
          <stop offset="0.7" stopColor="#E50914" />
          <stop offset="1" stopColor="#800000" />
        </linearGradient>

        <filter
          id="sigmaGlow"
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
        >
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              0.9 0 0 0 0
              0 0.1 0 0 0
              0 0 0.1 0 0
              0 0 0 1 0
            "
          />
          <feBlend in="SourceGraphic" mode="screen" />
        </filter>
      </defs>

      <path
        d="
          M18 84
          L45 18
          C47 13 53 10 57 18
          L83 84
          L65 84
          L52 48
          C51 45 49 45 48 48
          L36 84
          Z
        "
        fill="url(#sigmaRedGradient)"
        filter="url(#sigmaGlow)"
      />
    </svg>
  );
};

