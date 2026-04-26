"use client";

import { useState } from "react";

interface SplitFormProps {
  onResult: (data: any) => void;
}

export default function SplitForm({ onResult }: SplitFormProps) {
  const [secretText, setSecretText] = useState("");
  const [threshold, setThreshold] = useState(3);
  const [totalShares, setTotalShares] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSplit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/split", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: secretText,
          n: totalShares,
          k: threshold,
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      onResult(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="share-card"> {/* Usamos la clase de tu CSS para el contenedor */}
      <h2 style={{ marginBottom: '20px', fontSize: '20px' }}>Crear Nuevo Secreto</h2>
      
      {error && <div className="error-box">{error}</div>}

      <div className="form-group" style={{ marginBottom: '20px' }}>
        <div className="input-unit">
          <label>Contenido del Secreto</label>
          <input
            type="text"
            placeholder="Ej: 1234882"
            value={secretText}
            onChange={(e) => setSecretText(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group-row">
        <div className="input-unit">
          <label>Total Partes (n)</label>
          <input
            type="number"
            value={isNaN(totalShares) ? "" : totalShares}
            onChange={(e) => setTotalShares(parseInt(e.target.value))}
          />
        </div>
        <div className="input-unit">
          <label>Mínimo (k)</label>
          <input
            type="number"
            value={isNaN(threshold) ? "" : threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
          />
        </div>
      </div>

      <div style={{ marginTop: '25px' }}>
        <button
          onClick={handleSplit}
          disabled={loading || !secretText || totalShares < 2}
          className="primary-button"
          style={{ width: '100%' }}
        >
          {loading ? "PROCESANDO..." : "GENERAR FRAGMENTOS"}
        </button>
      </div>
    </div>
  );
}