
import Lottie from "lottie-react";
import loadingAnimation from "../Assets/loading.json";

// Fallback for Vite/ESM interop issues where default export is wrapped
const LottieComponent = Lottie.default || Lottie;

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
      {/* Outer wrapper: large enough so the spinning rings are never clipped */}
      <div className="relative flex items-center justify-center" style={{ width: 340, height: 340 }}>

        {/* Lottie fills the full wrapper – no overflow hidden */}
        <LottieComponent
          animationData={loadingAnimation}
          loop={true}
          style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
        />

        {/* Logo badge: uses the official G-TEC favicon so colours are exact */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "#ffffff",
            boxShadow: "0 0 0 3px rgba(26,86,219,0.3), 0 6px 24px rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <img
            src="https://www.gteceducation.com/assets/img/favicon/favicon-100x100.png"
            alt="G-Tec Azhagiyamandapam"
            style={{
              width: 88,
              height: 88,
              objectFit: "contain",
              animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
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
