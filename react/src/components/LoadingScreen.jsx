
export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
      <style>{`
        @keyframes spin-clockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-counterclockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes logo-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        .outer-ring {
          animation: spin-clockwise 2s linear infinite;
        }
        .inner-ring {
          animation: spin-counterclockwise 1.5s linear infinite;
        }
        .logo-badge {
          animation: logo-pulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Outer wrapper: large enough so the spinning rings are never clipped */}
      <div className="relative flex items-center justify-center" style={{ width: 340, height: 340 }}>

        {/* Outer spinner ring */}
        <div
          className="outer-ring absolute rounded-full border-4 border-transparent border-t-blue-600 border-b-cyan-500"
          style={{ width: 220, height: 220, opacity: 0.85 }}
        />

        {/* Inner spinner ring */}
        <div
          className="inner-ring absolute rounded-full border-4 border-transparent border-l-blue-500 border-r-indigo-400"
          style={{ width: 180, height: 180, opacity: 0.7 }}
        />

        {/* Logo badge: /logo.webp on blue background */}
        <div
          className="logo-badge"
          style={{
            position: "relative",
            zIndex: 10,
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1a56db 0%, #0e3fa8 100%)",
            boxShadow: "0 0 0 3px rgba(26,86,219,0.35), 0 6px 24px rgba(14,63,168,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <img
            src="/logo.webp"
            alt="G-Tec Azhagiyamandapam"
            style={{
              width: 72,
              height: 72,
              objectFit: "contain",
            }}
          />
        </div>
      </div>

      <p
        className="mt-4 font-semibold tracking-wide animate-pulse"
        style={{ color: "#1a56db", fontSize: "0.95rem", letterSpacing: "0.05em" }}
      >
        Loading G-Tec Azhagiyamandapam...
      </p>
    </div>
  );
}
