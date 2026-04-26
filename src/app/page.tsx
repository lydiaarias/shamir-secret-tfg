"use client";

import { useState } from "react";
import SplitForm from "@/components/splitForm";
import RecoverForm from "@/components/recoverSecret";
import "./page.module.css"

export default function ShamirPage() {
  // Estado para la navegación: "menu", "create", "recover"
  const [view, setView] = useState<"menu" | "create" | "recover">("menu");
  // Estado para guardar el resultado de la generación (fragmentos)
  const [result, setResult] = useState<any>(null);

  return (
    <div className="page-container">
      <div className="content-wrapper">
        
        {/* ENCABEZADO (Siempre visible, hacer clic para volver al menú) */}
        <div className="header-section">
          <h1 className="main-title" onClick={() => { setView("menu"); setResult(null); }} style={{cursor: 'pointer'}}>
            SHAMIR <span className="blue-highlight">VAULT</span>
          </h1>
          <p>Sistema de Seguridad Criptográfica de Escritorio</p>
        </div>

        {/* --- PANTALLA 1: MENÚ INICIAL --- */}
        {view === "menu" && (
          <div className="menu-container">
            <button className="menu-button" onClick={() => setView("create")}>
              <div className="text-group">
                <strong>Crear Secreto</strong>
                <p>Divide un código en fragmentos seguros</p>
              </div>
            </button>

            <button className="menu-button" onClick={() => setView("recover")}>
              <div className="text-group">
                <strong>Desvelar Secreto</strong>
                <p>Reconstruye el código usando fragmentos</p>
              </div>
            </button>
          </div>
        )}

        {/* --- PANTALLA 2: CREAR (SPLIT) Y VER RESULTADOS --- */}
        {view === "create" && (
          <div className="view-container">
            <button className="back-link" onClick={() => { setView("menu"); setResult(null); }}>← Volver al menú</button>
            
            {/* Si NO hay resultado, mostramos el formulario */}
            {!result && (
              <SplitForm onResult={(data) => setResult(data)} />
            )}
            
            {/* Si SÍ hay resultado, mostramos los fragmentos generados */}
            {result && (
              <div className="shares-list">
                {/* Cabecera Azul del Secreto (Solo lectura) */}
                <div className="result-header">
                  <div>
                    <span style={{fontSize: '10px', textTransform: 'uppercase', opacity: 0.8, fontWeight: 'bold'}}>Secreto ID</span>
                    <h2 style={{fontFamily: 'monospace', margin: 0, fontSize: '18px'}}>
                      {result.id.substring(0, 8).toUpperCase()}
                    </h2>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <span style={{fontSize: '10px', textTransform: 'uppercase', opacity: 0.8, fontWeight: 'bold'}}>Mínimo para recuperar</span>
                    <span style={{fontSize: '28px', fontWeight: 900, display: 'block'}}>
                      {result.threshold} / {result.shares.length}
                    </span>
                  </div>
                </div>

                {/* Listado de Tarjetas Blancas (Mapeo de fragmentos, solo lectura) */}
                {result.shares.map((s: any) => (
                  <div key={s.id} className="share-card">
                     <div className="badge-row">
                        <span className="id-badge">SHARE ID: {s.id.substring(0, 6).toUpperCase()}</span>
                        {/* Importante: El Índice X es fundamental para recuperar */}
                        <span className="id-badge" style={{backgroundColor: '#dbeafe', color: '#2563eb'}}>X: {s.xIndex}</span>
                      </div>
                      {/* El fragmento largo y decimal (break-all asegura que no se corte) */}
                      <p className="share-content">{s.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- PANTALLA 3: DESVELAR (RECOVER) --- */}
        {view === "recover" && (
          <div className="view-container">
            <button className="back-link" onClick={() => setView("menu")}>← Volver al menú</button>
            <RecoverForm />
          </div>
        )}

      </div>
    </div>
  );
}