import React from "react";

const CoinLoader = ({
  size = 48,
  className = "",
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <div className={`coin-loader ${className}`}>
      <div
        className="coin-loader-inner"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          fontSize: `${size * 0.67}px`,
          lineHeight: `${size * 0.83}px`,
        }}
      />
      <style jsx>{`
        .coin-loader {
          transform: translateZ(1px);
          display: inline-block;
        }

        .coin-loader-inner {
          content: "";
          position: relative;
          border-radius: 50%;
          text-align: center;
          font-weight: bold;
          background: linear-gradient(
            45deg,
            var(--push-pink-500),
            var(--push-pink-600),
            var(--push-purple-500)
          );
          color: white;
          border: 4px double rgba(255, 255, 255, 0.3);
          box-sizing: border-box;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          animation: coin-flip 3s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        }

        .coin-loader-inner::after {
          content: "❤️";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: ${size * 0.5}px;
        }

        @keyframes coin-flip {
          0%,
          100% {
            animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
          }

          0% {
            transform: rotateY(0deg);
          }

          50% {
            transform: rotateY(1800deg);
            animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
          }

          100% {
            transform: rotateY(3600deg);
          }
        }
      `}</style>
    </div>
  );
};

export default CoinLoader;
