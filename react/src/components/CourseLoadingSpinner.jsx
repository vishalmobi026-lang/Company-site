import Lottie from "lottie-react";
import loadingAnimation from "../Assets/loading.json";

const LottieComponent = Lottie.default || Lottie;

/**
 * Inline loading state — shown inside course pages while DB fetch is in progress.
 * Matches the full-page LoadingScreen look but sits inside the dark section layout.
 */
export default function CourseLoadingSpinner({ label = "Loading courses..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 w-full">
      {/* Animation wrapper — large enough so outer rings are never clipped */}
      <div
        style={{ position: "relative", width: 260, height: 260 }}
        className="flex items-center justify-center"
      >
        <LottieComponent
          animationData={loadingAnimation}
          loop={true}
          style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
        />

        {/* Blue-background logo badge */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1a56db 0%, #0e3fa8 100%)",
            boxShadow:
              "0 0 0 3px rgba(26,86,219,0.35), 0 6px 24px rgba(14,63,168,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <img
            src="/logo.webp"
            alt="G-Tec"
            style={{
              width: 60,
              height: 60,
              objectFit: "contain",
              animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
            }}
          />
        </div>
      </div>

      <p
        className="mt-3 font-semibold animate-pulse"
        style={{
          color: "#93c5fd",
          fontSize: "0.9rem",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </p>
    </div>
  );
}
