import React, { useState, useRef } from "react";
import {
  Camera,
  Upload,
  RefreshCw,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowLeft,
} from "lucide-react";

export default function App() {
  // Navigation: 'landing' | 'loading' | 'results'
  const [page, setPage] = useState("landing");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [apiResult, setApiResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fileInputRef = useRef(null);

  // Handle single picture selection/capture
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrorMsg(null);
      // Trigger upload and analysis immediately
      uploadAndAnalyze(file);
    }
  };

  const uploadAndAnalyze = async (file) => {
    setPage("loading");
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      // Replace with your active backend endpoint
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned error status ${response.status}`);
      }

      const data = await response.json();
      // Expected structure: { ripeness: string, num_days_to_death: number, comment: string }
      setApiResult(data);
      setPage("results");
    } catch (err) {
      console.error(err);
      setErrorMsg("Neural link failed. Ensure the inference server is running.");
      setPage("landing");
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setApiResult(null);
    setErrorMsg(null);
    setPage("landing");
  };

  return (
    <div style={styles.container}>
      {/* Background HUD Grid Overlay */}
      <div style={styles.gridOverlay} />

      {/* Header Bar */}
      <header style={styles.header}>
        <div style={styles.logoBadge}>
          <Cpu size={18} color="#00ffcc" />
          <span style={styles.subLogoText}>BIO-DECAY TELEMETRY v2.6</span>
        </div>
      </header>

      {/* Main Container */}
      <main style={styles.main}>
        {/* ================= LANDING PAGE ================= */}
        {page === "landing" && (
          <div style={styles.card}>
            <div style={styles.radarRing}>
              <div style={styles.scanTargetMarker} />
            </div>

            <h1 style={styles.title}>BANANA DEATH PREDICTOR</h1>
            <p style={styles.subtitle}>
              SPECTRAL COMPUTER VISION • CELLULAR SENESCENCE ENGINE
            </p>

            {errorMsg && (
              <div style={styles.errorBox}>
                <AlertTriangle size={18} color="#ff3b30" />
                <span style={styles.errorText}>{errorMsg}</span>
              </div>
            )}

            {/* Hidden Input supporting both file selection and camera capture */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment" // Opens camera on mobile by default
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <button
              style={styles.scanBtn}
              onClick={() => fileInputRef.current?.click()}
            >
              <div style={styles.btnAura} />
              <Camera size={22} style={{ marginRight: 10 }} />
              <span>INITIALIZE SCAN</span>
            </button>

            <span style={styles.hintText}>
              Select an image from disk or initiate mobile camera capture
            </span>
          </div>
        )}

        {/* ================= LOADING SCREEN ================= */}
        {page === "loading" && (
          <div style={styles.card}>
            <div style={styles.loadingSpinnerContainer}>
              <RefreshCw size={54} color="#00ffcc" style={styles.spinIcon} />
            </div>

            <h2 style={styles.loadingTitle}>PROCESSING BIOMETRIC ARRAYS</h2>
            <div style={styles.terminalConsole}>
              <p>&gt; Ingesting HSV surface vectors...</p>
              <p>&gt; Running necrotic tissue segmentation...</p>
              <p>&gt; Calculating days to decay threshold...</p>
            </div>
          </div>
        )}

        {/* ================= RESULTS PAGE ================= */}
        {page === "results" && apiResult && (
          <div style={{ ...styles.card, maxWidth: 640 }}>
            <div style={styles.resultsHeader}>
              <div style={styles.tag}>
                <CheckCircle2 size={16} color="#00ffcc" />
                <span>INFERENCE COMPLETE</span>
              </div>
            </div>

            {/* Scanned Image Display */}
            {imagePreview && (
              <div style={styles.imageFrame}>
                <img
                  src={imagePreview}
                  alt="Scanned Banana"
                  style={styles.image}
                />
                <div style={styles.scanOverlayLine} />
              </div>
            )}

            {/* Metrics Breakdown */}
            <div style={styles.telemetryBox}>
              {/* a. {Ripeness} banana */}
              <div style={styles.metricRow}>
                <span style={styles.metricLabel}>STATE OF MATURATION</span>
                <span style={styles.metricValue}>
                  {apiResult.ripeness} banana
                </span>
              </div>

              {/* b. The banana will approx. rot in {num_days_to_death} days */}
              <div style={styles.metricRow}>
                <span style={styles.metricLabel}>EXPIRATION HORIZON</span>
                <span style={{ ...styles.metricValue, color: "#ffb300" }}>
                  The banana will approx. rot in{" "}
                  <strong>{Number(apiResult.num_days_to_death).toFixed(1)}</strong> days
                </span>
              </div>

              {/* c. {comment} */}
              <div style={styles.commentBox}>
                <span style={styles.commentLabel}>ANALYSIS LOG:</span>
                <p style={styles.commentText}>"{apiResult.comment}"</p>
              </div>
            </div>

            {/* 3. Go Back Button */}
            <button style={styles.backBtn} onClick={handleReset}>
              <ArrowLeft size={18} style={{ marginRight: 8 }} />
              <span>GO BACK</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// -------------------------------------------------------------
// Technological Cyber-Terminal Inline Styles
// -------------------------------------------------------------
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#080c10",
    color: "#e6edf3",
    fontFamily:
      'ui-monospace, SFMono-Regular, "Roboto Mono", Menlo, Consolas, monospace',
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflowX: "hidden",
  },
  gridOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(to right, rgba(0, 255, 204, 0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0, 255, 204, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  header: {
    padding: "20px 32px",
    borderBottom: "1px solid rgba(0, 255, 204, 0.15)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  logoBadge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(0, 255, 204, 0.08)",
    padding: "6px 14px",
    borderRadius: 6,
    border: "1px solid rgba(0, 255, 204, 0.2)",
  },
  subLogoText: {
    fontSize: 12,
    letterSpacing: 2,
    color: "#00ffcc",
    fontWeight: 700,
  },
  main: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    zIndex: 10,
  },
  card: {
    width: "100%",
    maxWidth: 520,
    background: "rgba(13, 19, 27, 0.85)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(0, 255, 204, 0.25)",
    borderRadius: 16,
    padding: 36,
    boxShadow: "0 0 40px rgba(0, 255, 204, 0.05)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
  },
  title: {
    fontSize: 26,
    fontWeight: 900,
    letterSpacing: 3,
    color: "#ffffff",
    textAlign: "center",
    margin: "16px 0 6px 0",
    textShadow: "0 0 16px rgba(0, 255, 204, 0.4)",
  },
  subtitle: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: "#8b949e",
    textAlign: "center",
    marginBottom: 32,
  },
  scanBtn: {
    width: "100%",
    padding: "16px 24px",
    backgroundColor: "#00ffcc",
    border: "none",
    borderRadius: 8,
    color: "#051015",
    fontSize: 15,
    fontWeight: 800,
    letterSpacing: 2,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
    boxShadow: "0 0 20px rgba(0, 255, 204, 0.35)",
  },
  hintText: {
    fontSize: 12,
    color: "#484f58",
    marginTop: 16,
    textAlign: "center",
  },
  loadingSpinnerContainer: {
    padding: 30,
  },
  spinIcon: {
    animation: "spin 2s linear infinite",
  },
  loadingTitle: {
    fontSize: 16,
    letterSpacing: 2,
    color: "#00ffcc",
    marginBottom: 20,
  },
  terminalConsole: {
    width: "100%",
    backgroundColor: "#05080c",
    padding: 16,
    borderRadius: 8,
    border: "1px solid rgba(255, 255, 255, 0.07)",
    fontSize: 12,
    color: "#7ee787",
    lineHeight: 1.8,
  },
  resultsHeader: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: 16,
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    borderRadius: 4,
    backgroundColor: "rgba(0, 255, 204, 0.1)",
    border: "1px solid rgba(0, 255, 204, 0.3)",
    fontSize: 11,
    letterSpacing: 1,
    color: "#00ffcc",
  },
  imageFrame: {
    width: "100%",
    height: 280,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    border: "1px solid rgba(0, 255, 204, 0.3)",
    backgroundColor: "#05080c",
    marginBottom: 24,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  scanOverlayLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#00ffcc",
    boxShadow: "0 0 10px #00ffcc",
  },
  telemetryBox: {
    width: "100%",
    backgroundColor: "#06090e",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 10,
    padding: 20,
    marginBottom: 24,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  metricRow: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    paddingBottom: 10,
  },
  metricLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: "#8b949e",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 600,
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  commentBox: {
    marginTop: 4,
    backgroundColor: "rgba(0, 255, 204, 0.03)",
    padding: 12,
    borderRadius: 6,
    borderLeft: "3px solid #00ffcc",
  },
  commentLabel: {
    fontSize: 10,
    color: "#00ffcc",
    letterSpacing: 1,
    fontWeight: 700,
    display: "block",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 13,
    color: "#c9d1d9",
    margin: 0,
    fontStyle: "italic",
    lineHeight: 1.5,
  },
  backBtn: {
    width: "100%",
    padding: "14px 20px",
    backgroundColor: "transparent",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    color: "#e6edf3",
    fontSize: 13,
    letterSpacing: 1.5,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    border: "1px solid rgba(255, 59, 48, 0.3)",
    padding: "10px 16px",
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
  },
  radarRing: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    border: "2px dashed rgba(0, 255, 204, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  scanTargetMarker: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    backgroundColor: "#00ffcc",
    boxShadow: "0 0 12px #00ffcc",
  },
};