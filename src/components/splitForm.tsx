"use client";
import { useState } from "react";
import "./style.css"; 

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
        body: JSON.stringify({ text: secretText, n: totalShares, k: threshold }),
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
    <div className="vault-card">
      <h2 className="vault-title">Crear Nuevo Secreto</h2>
      <p className="vault-description">Define el contenido y los parámetros de seguridad.</p>
      
      {error && <div className="error-box">{error}</div>}

      <div className="input-unit">
        <label>Contenido del Secreto</label>
        <input
          type="text"
          placeholder="Ej: MiContraseñaSegura123"
          value={secretText}
          onChange={(e) => setSecretText(e.target.value)}
        />
      </div>

      <div className="input-row">
        <div className="input-unit unit-grow">
          <label>Total Partes (n)</label>
          <input
            type="number"
            value={isNaN(totalShares) ? "" : totalShares}
            onChange={(e) => setTotalShares(parseInt(e.target.value))}
          />
        </div>
        <div className="input-unit unit-grow">
          <label>Mínimo (k)</label>
          <input
            type="number"
            value={isNaN(threshold) ? "" : threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
          />
        </div>
      </div>

      <button
        onClick={handleSplit}
        disabled={loading || !secretText || totalShares < 2}
        className="primary-button btn-full"
      >
        {loading ? "PROCESANDO..." : "GENERAR FRAGMENTOS"}
      </button>
    </div>
  );
}