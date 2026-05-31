import React, { useState } from "react";
import axios from "axios";

const API = "https://YOUR-RAILWAY-LINK"; // replace this

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  };

  const predict = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API}/predict`, formData);

      console.log("Backend response:", res.data); // debug
      setResult(res.data);

    } catch (err) {
      console.log("Error:", err.response?.data || err.message);
      setError("Backend error. Check API or CORS.");
    }

    setLoading(false);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>DROWSINESS DETECTION SYSTEM</h1>

      {!preview && (
        <div style={styles.uploadBox}>
          <p>Upload Driver Image</p>
          <input type="file" onChange={handleFile} />
        </div>
      )}

      {preview && (
        <img src={preview} alt="preview" style={styles.image} />
      )}

      {preview && !loading && !result && (
        <button style={styles.button} onClick={predict}>
          START ANALYSIS
        </button>
      )}

      {loading && <h2 style={styles.loading}>Processing AI Model...</h2>}

      {error && <p style={styles.error}>{error}</p>}

      {result && (
        <div style={styles.resultBox}>
          <h2>{result.prediction}</h2>
          <p>Confidence: {result.confidence}%</p>

          <button style={styles.button} onClick={reset}>
            Try Another Image
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    background: "black",
    color: "white",
    minHeight: "100vh",
    textAlign: "center",
    padding: "40px",
    fontFamily: "Arial"
  },
  title: {
    fontSize: "26px",
    marginBottom: "30px",
    borderBottom: "2px solid white",
    display: "inline-block",
    paddingBottom: "10px"
  },
  uploadBox: {
    border: "2px dashed white",
    padding: "25px",
    display: "inline-block",
    borderRadius: "10px"
  },
  image: {
    width: "260px",
    marginTop: "20px",
    borderRadius: "10px",
    border: "2px solid white"
  },
  button: {
    marginTop: "20px",
    padding: "12px 20px",
    background: "white",
    color: "black",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    borderRadius: "6px"
  },
  loading: {
    marginTop: "20px",
    color: "#aaa"
  },
  resultBox: {
    marginTop: "20px",
    border: "2px solid white",
    padding: "20px",
    display: "inline-block",
    borderRadius: "10px"
  },
  error: {
    color: "red",
    marginTop: "20px"
  }
};
