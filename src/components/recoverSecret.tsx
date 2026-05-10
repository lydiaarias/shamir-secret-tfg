"use client";
import { useState } from "react";
import "./style.css"; 

export default function RecoverForm() {
  const [shares, setShares] = useState([{ x: "", y: "" }]);
  const [recoveredSecret, setRecoveredSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const addShareField = () => setShares([...shares, { x: "", y: "" }]);

  const updateShare = (index: number, field: "x" | "y", value: string) => {
    const newShares = [...shares];
    newShares[index][field] = value;
    setShares(newShares);
    if (error) setError(null);
  };

  const handleRecover = async () => {
    setLoading(true);
    setError(null);
    setRecoveredSecret(null);
    try {
      const response = await fetch("/api/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shares: shares.filter(s => s.x !== "" && s.y !== "") }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al reconstruir");
      setRecoveredSecret(data.secret);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vault-card">
      <h2 className="vault-title">Desvelar Secreto</h2>
      <p className="vault-description">
        Introduce el <strong>Índice X</strong> y el <strong>Fragmento</strong> para reconstruir el secreto original.
      </p>
      
      <div className="shares-input-container">
        {shares.map((share, index) => (
          <div key={index} className="input-row">
            <div className="input-unit unit-small">
              <label>X (Índice)</label>
              <input
                type="number"
                placeholder="Ej: 1"
                value={share.x}
                onChange={(e) => updateShare(index, "x", e.target.value)}
              />
            </div>
            <div className="input-unit unit-grow">
              <label>Fragmento (Contenido Y)</label>
              <input
                type="text"
                placeholder="Introduce el fragmento largo..."
                value={share.y}
                onChange={(e) => updateShare(index, "y", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      {error && <div className="error-box"><strong>⚠️ Error:</strong> {error}</div>}

      <div className="action-group">
        <button type="button" onClick={addShareField} className="primary-button btn-secondary">
          + Añadir participante
        </button>
        <button onClick={handleRecover} disabled={loading || shares.length < 1} className="primary-button">
          {loading ? "CALCULANDO..." : "DESVELAR SECRETO"}
        </button>
      </div>

      {recoveredSecret && (
        <div className="secret-reveal-box">
          <span>El secreto recuperado es:</span>
          <strong>{recoveredSecret}</strong>
        </div>
      )}
    </div>
  );
}