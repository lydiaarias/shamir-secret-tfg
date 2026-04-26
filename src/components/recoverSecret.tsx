"use client";

import { useState } from "react";

export default function RecoverForm() {
  // Ahora cada share tiene un índice X y el contenido Y
  const [shares, setShares] = useState([{ x: "", y: "" }]);
  const [recoveredSecret, setRecoveredSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const addShareField = () => setShares([...shares, { x: "", y: "" }]);

  const updateShare = (index: number, field: "x" | "y", value: string) => {
    const newShares = [...shares];
    newShares[index][field] = value;
    setShares(newShares);
    if (error) setError(null); // Limpiar error al escribir
  };

  const handleRecover = async () => {
    setLoading(true);
    setError(null);
    setRecoveredSecret(null);
    try {
      const response = await fetch("/api/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Enviamos los pares (x, y) filtrando los vacíos
        body: JSON.stringify({ 
          shares: shares.filter(s => s.x !== "" && s.y !== "") 
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || "Error en el servidor");
      setRecoveredSecret(data.secret);
    } catch (err: any) {
      setError(err.message); // El error se guarda en el estado, no en alert
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recover-section">
      <h2 className="section-title">Desvelar Secreto</h2>
      <p className="description">Introduce el Índice X y el Fragmento de cada participante.</p>
      
      <div className="shares-input-container">
        {shares.map((share, index) => (
          <div key={index} className="form-group-row">
            <div className="input-unit">
              <label>X (Índice)</label>
              <input
                type="number"
                placeholder="Ej: 1"
                value={share.x}
                onChange={(e) => updateShare(index, "x", e.target.value)}
                className="input-azure small"
              />
            </div>
            <div className="input-unit flex-grow">
              <label>Fragmento (Contenido)</label>
              <input
                type="text"
                placeholder="Introduce el fragmento largo..."
                value={share.y}
                onChange={(e) => updateShare(index, "y", e.target.value)}
                className="input-azure"
              />
            </div>
          </div>
        ))}
      </div>

      {/* MENSAJE DE ERROR EN PANTALLA */}
      {error && (
        <div className="error-box">
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      <div className="button-group">
        <button type="button" onClick={addShareField} className="secondary-button">
          + Añadir participante
        </button>
        <button onClick={handleRecover} disabled={loading} className="primary-button">
          {loading ? "Calculando..." : "Desvelar Secreto"}
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