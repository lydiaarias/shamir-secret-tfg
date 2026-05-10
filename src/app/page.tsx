"use client";

import { useState } from "react";
import SplitForm from "@/components/splitForm";
import RecoverForm from "@/components/recoverSecret";
import "./page.css"; 

export default function ShamirPage() {
  const [view, setView] = useState<"menu" | "create" | "recover">("menu");
  const [result, setResult] = useState<any>(null);

  return (
    <div className="page-container">
      <div className="content-wrapper">
        
        <div className="header-section">
          <h1 
            className="main-title" 
            onClick={() => { setView("menu"); setResult(null); }} 
            style={{cursor: 'pointer'}}
          >
            SHAMIR <span className="blue-highlight">VAULT</span>
          </h1>
          <p>Sistema de Seguridad Criptográfico </p>
        </div>

        {/*Pantalla 1: Menu inicial*/}
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

        {/*Pantalla 2: Creay y ver los fragmentos*/}
        {view === "create" && (
          <div className="view-container">
            <button className="back-link" onClick={() => { setView("menu"); setResult(null); }}>
              ← Volver al menú
            </button>
            
            {/*Si no existe un resultado, se muestra la pantalla inicial*/}
            {!result && (
              <SplitForm onResult={(data) => setResult(data)} />
            )}
            
            {/*Si hay resultado, se muestran los fragmentos*/}
            {result && (
              <div className="shares-list">
                <div className="result-header">
                  <div>
                    <span style={{fontSize: '10px', textTransform: 'uppercase', opacity: 0.8, fontWeight: 'bold'}}>
                      ID VÍNCULO (10 DÍGITOS)
                    </span>
                    <h2 style={{fontFamily: 'monospace', margin: 0, fontSize: '22px'}}>
                      {result.id}
                    </h2>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <span style={{fontSize: '10px', textTransform: 'uppercase', opacity: 0.8, fontWeight: 'bold'}}>
                      MÍNIMO PARA RECUPERAR
                    </span>
                    <span style={{fontSize: '28px', fontWeight: 900, display: 'block'}}>
                      {result.threshold} / {result.shares.length}
                    </span>
                  </div>
                </div>

                {/*Listado de los fragmentos*/}
                {result.shares.map((s: any) => (
                  <div key={`${s.id}-${s.xIndex}`} className="share-card">
                     <div className="badge-row">
                        <span className="id-badge">SHARE ID: {s.id}</span>
                        //Indice X necesario para la fórmula matemática
                        <span className="id-badge" style={{backgroundColor: '#dbeafe', color: '#2563eb'}}>
                          X: {s.xIndex}
                        </span>
                      </div>
                      <p className="share-content">{s.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pantalla 3: Reconstrucción del secreto */}
        {view === "recover" && (
          <div className="view-container">
            <button className="back-link" onClick={() => setView("menu")}>
              ← Volver al menú
            </button>
            <RecoverForm />
          </div>
        )}

      </div>
    </div>
  );
}