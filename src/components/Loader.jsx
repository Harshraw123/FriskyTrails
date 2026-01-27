const FriskyLoader = ({ size = "lg", text = "Loading" }) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  };

  const ringSize = {
    sm: "w-20 h-20",
    md: "w-28 h-28",
    lg: "w-36 h-36",
    xl: "w-52 h-52",
  };

  return (
    <>
      {/* FULL SCREEN WRAPPER */}
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-orange-50">
        
        <div className="relative flex items-center justify-center">
          {/* 🔄 Rotating ring */}
          <div
            className={`absolute ${ringSize[size]} rounded-full`}
            style={{
              border: "4px solid transparent",
              borderTopColor: "#f97316",
              borderRightColor: "#f97316",
              animation: "spin 1.5s linear infinite",
            }}
          />

          {/* 🖼️ Logo with pulse */}
          <div
            className={`relative ${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center shadow-md`}
            style={{
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          >
            <img
              src="/logo.PNG"
              alt="Frisky Trails Loading"
              className="w-full h-full object-contain p-1 scale-125"
            />
          </div>
        </div>

        {text && (
          <p className="text-lg font-semibold tracking-wide text-[#1a3a2f]">
            {text}
          </p>
        )}
      </div>

      {/* ANIMATIONS */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.85;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
      `}</style>
    </>
  );
};

export default FriskyLoader;
