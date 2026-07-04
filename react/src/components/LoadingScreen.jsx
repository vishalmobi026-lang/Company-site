
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

        {/* Logo badge: sits on top of the animation, centred, with a blue
            background so the G-Tec mark is clearly legible */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1a56db 0%, #0e3fa8 100%)",
            boxShadow: "0 0 0 4px rgba(26,86,219,0.25), 0 4px 20px rgba(14,63,168,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/logo.webp"
            alt="G-Tec Azhagiyamandapam"
            style={{
              width: 64,
              height: 64,
              objectFit: "contain",
              filter: "brightness(0) invert(1)",  /* make the logo white on the blue bg */
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
