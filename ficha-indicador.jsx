import { useState, useCallback } from "react";

const COLORS = {
  bg: "#F5F3EE",
  surface: "#FFFFFF",
  primary: "#C0392B",
  primaryDark: "#922B21",
  accent: "#2C3E50",
  muted: "#7F8C8D",
  border: "#DDD8D0",
  success: "#27AE60",
  warning: "#E67E22",
  inputBg: "#FAFAF8",
};

const OPTIONS = {
  codigo1: ["Política General de Gobierno","Política Nacional Sectorial","Política Nacional Multisectorial","Política Institucional","Plan Estratégico de Desarrollo Nacional","Plan Estratégico Sectorial Multianual","Plan Estratégico Institucional","Estrategia Nacional","Programa Presupuestal","Plan de Actuación","Cadena de Resultados","Proyecto Educativo Nacional"],
  codigo2: ["Objetivo","Acción Estratégica","Servicio","Intervención"],
  codigo13: ["Ascendente","Constante","Descendente","Variable"],
  codigo17: ["Resultado","Producto","Componente","Recurso"],
  codigo18: ["Cobertura","Calidad","Pertinencia"],
  codigo19: ["Oportunidad","Accesibilidad","Retención","Continuidad","Igualdad","Inclusión","Eficiencia","Fiabilidad","Desempeño","Eficacia","Percepción"],
  codigo20: ["Trimestral","Semestral","Anual","Bienal","Trienal","Cuatrienal","Quinquenal"],
  codigo21: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Setiembre","Octubre","Noviembre","Diciembre"],
  codigo24: ["Distrital","Regional","Nacional"],
  codigo25: ["Sexo","Área","Gestión"],
  codigo26: ["Número","Promedio","Ratio","Porcentaje","Tasa","Índice","Variación"],
  codigo27: ["Histórico","Línea de base","Proyectado","Alcanzado"],
};

const CAMPOS = [
  { id: "codigo1", num: 1, label: "Instrumento de gestión", tipo: "cerrado", entrada: "Texto" },
  { id: "codigo2", num: 2, label: "Elemento Estratégico", tipo: "cerrado", entrada: "Texto" },
  { id: "codigo3", num: 3, label: "Nombre del indicador", tipo: "condicionado", entrada: "Texto",
    prompt: `Actúa como un experto en sintaxis funcional. Verifica que la oración redactada sea lógica y formalmente estructurada bajo la siguiente fórmula estricta: [Parámetro (código 25)] + [Sujeto] + [Característica/Estado a transformar]. Considera que el [Sujeto] puede ser un usuario, entidad, entorno o un elemento de gestión. Emite observaciones críticas y recomendaciones de mejora, cuando corresponda.` },
  { id: "codigo4", num: 4, label: "Justificación", tipo: "condicionado", entrada: "Texto",
    prompt: `Actúa como un experto en monitoreo y evaluación. Verifica que el texto redactado tenga consistencia técnica, pertinencia estratégica y metodológica. Valida la relación lógica entre la definición operacional del indicador (nombre del indicador) y la definición conceptual de aquello que se desea lograr (elemento estratégico). Asegura la lógica formal y analítica. Emite observaciones críticas y recomendaciones de mejora.` },
  { id: "codigo5", num: 5, label: "Responsable de integración de datos", tipo: "abierto", entrada: "Texto" },
  { id: "codigo6", num: 6, label: "Responsable de logro esperado", tipo: "abierto", entrada: "Texto" },
  { id: "codigo7", num: 7, label: "Limitación del indicador", tipo: "condicionado", entrada: "Texto",
    prompt: `Actúa como un experto en monitoreo y evaluación. Verifica que en el texto redactado se identifique las limitaciones que presenta el indicador en relación con el elemento que pretende medir. Asegura la lógica formal y analítica, y su relevancia. Emite observaciones críticas y recomendaciones de mejora.` },
  { id: "codigo8", num: 8, label: "Limitaciones para la medición del indicador", tipo: "condicionado", entrada: "Texto",
    prompt: `Actúa como un experto en monitoreo y evaluación. Verifica que en el texto redactado se identifique las limitaciones que presenta el indicador en relación a su propia medición, considerando su método de cálculo y el proceso de recolección de datos. Asegura la lógica formal y analítica. Emite observaciones críticas y recomendaciones de mejora.` },
  { id: "codigo9", num: 9, label: "Supuestos", tipo: "condicionado", entrada: "Texto",
    prompt: `Actúa como un experto en monitoreo y evaluación. Verifica que el texto redactado sea positivo y tenga consistencia técnica. Valida que la condición favorable que se espera que ocurra ayude a que el indicador evolucione. Considera que la condición positiva es externa y no se encuentra bajo control del responsable. Asegura la lógica formal y analítica, la relevancia y probabilidad de ocurrencia del supuesto. Emite observaciones críticas y recomendaciones de mejora.` },
  { id: "codigo10", num: 10, label: "Fórmula de cálculo", tipo: "condicionado", entrada: "Fórmula",
    prompt: `Actúa como un experto en estadística. Verifica la correcta formalización de la fórmula matemática que exprese con lógica y consistencia la estructura de cálculo del indicador, considerando el método de cálculo. Verifica que el registro de la fórmula sea precisa y siga los estándares internacionales. Emite observaciones críticas y recomendaciones de mejora.` },
  { id: "codigo11", num: 11, label: "Método de cálculo", tipo: "condicionado", entrada: "Texto",
    prompt: `Actúa como un experto en estadística. Verifica la correcta redacción, secuencia y lógica en la definición de las variables utilizadas en la fórmula de cálculo y los criterios necesarios para la medición del indicador. Emite observaciones críticas y recomendaciones de mejora.` },
  { id: "codigo12", num: 12, label: "Proceso de recolección de datos y análisis", tipo: "condicionado", entrada: "Texto",
    prompt: `Actúa como un experto en estadística. Verifica la correcta redacción, secuencia y lógica en la identificación, recolección, validación y sistematización de datos para ser utilizados en la medición del indicador. Emite observaciones críticas y recomendaciones de mejora.` },
  { id: "codigo13", num: 13, label: "Sentido del indicador", tipo: "cerrado", entrada: "Texto" },
  { id: "codigo14", num: 14, label: "Fuente de información", tipo: "abierto", entrada: "Texto" },
  { id: "codigo15", num: 15, label: "Base de Datos", tipo: "abierto", entrada: "Texto" },
  { id: "codigo16", num: 16, label: "Enlace de base de datos", tipo: "condicionado", entrada: "Enlace",
    prompt: `Actúa como un experto en análisis de calidad de datos. Verifica que el enlace registrado en el campo sea válido y dirija al destino correcto. Emite observaciones críticas y recomendaciones de mejora.` },
  { id: "codigo17", num: 17, label: "Nivel de indicador", tipo: "cerrado", entrada: "Texto" },
  { id: "codigo18", num: 18, label: "Tipo de indicador", tipo: "cerrado", entrada: "Texto" },
  { id: "codigo19", num: 19, label: "Estándar", tipo: "cerrado", entrada: "Texto" },
  { id: "codigo20", num: 20, label: "Periodicidad", tipo: "cerrado", entrada: "Texto" },
  { id: "codigo21", num: 21, label: "Disponibilidad", tipo: "cerrado", entrada: "Texto" },
  { id: "codigo22", num: 22, label: "Características del Indicador", tipo: "condicionado", entrada: "Numérico",
    prompt: `Actúa como un experto en monitoreo y evaluación. Verifica que el indicador cumpla con las características deseables (específico, relevante, medible, realizable y temporal), considerando el proceso de recolección de datos, la base de datos, la periodicidad y la disponibilidad. Registra un porcentaje de cumplimiento con las características deseables. Emite observaciones críticas y recomendaciones de mejora.` },
  { id: "codigo23", num: 23, label: "Serie histórica", tipo: "abierto", entrada: "Numérico" },
  { id: "codigo24", num: 24, label: "Desagregación territorial", tipo: "cerrado", entrada: "Texto" },
  { id: "codigo25", num: 25, label: "Desagregación de variable", tipo: "cerrado", entrada: "Texto" },
  { id: "codigo26", num: 26, label: "Parámetro", tipo: "cerrado", entrada: "Texto" },
  { id: "codigo27", num: 27, label: "Tipo de valor", tipo: "cerrado", entrada: "Texto" },
  { id: "codigo28", num: 28, label: "Año", tipo: "abierto", entrada: "Numérico" },
  { id: "codigo29", num: 29, label: "Valor", tipo: "condicionado", entrada: "Numérico",
    prompt: `Actúa como un experto en estadística. Verifica el correcto cálculo del valor, considerando el numerador y denominador, la fórmula de cálculo, el sentido del indicador y el parámetro. Verifica que el registro de números y unidades de medida sean precisos y sigan los estándares internacionales. Emite observaciones críticas y recomendaciones de mejora.` },
  { id: "codigo30", num: 30, label: "Numerador", tipo: "abierto", entrada: "Numérico" },
  { id: "codigo31", num: 31, label: "Denominador", tipo: "abierto", entrada: "Numérico" },
  { id: "codigo32", num: 32, label: "Norma y fecha de aprobación", tipo: "abierto", entrada: "Texto" },
  { id: "codigo33", num: 33, label: "Comentario u observación", tipo: "abierto", entrada: "Texto" },
];

const SECCIONES = [
  { titulo: "I. Identificación", campos: [1,2,3,4,5,6] },
  { titulo: "II. Metodología", campos: [7,8,9,10,11,12] },
  { titulo: "III. Clasificación", campos: [13,14,15,16,17,18,19,20,21] },
  { titulo: "IV. Calidad y Desagregación", campos: [22,23,24,25,26,27] },
  { titulo: "V. Datos y Valores", campos: [28,29,30,31,32,33] },
];

function Badge({ tipo }) {
  const colors = {
    cerrado: { bg: "#EBF5FB", color: "#2980B9", label: "Cerrado" },
    condicionado: { bg: "#FEF9E7", color: "#D68910", label: "IA Valida" },
    abierto: { bg: "#EAFAF1", color: "#1E8449", label: "Abierto" },
  };
  const c = colors[tipo];
  return (
    <span style={{
      fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em",
      padding: "2px 8px", borderRadius: "20px",
      background: c.bg, color: c.color, textTransform: "uppercase",
    }}>{c.label}</span>
  );
}

function ValidationPanel({ result, loading }) {
  if (loading) return (
    <div style={{ marginTop: 10, padding: "12px 16px", background: "#F8F9FA", borderRadius: 8, borderLeft: `3px solid ${COLORS.primary}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.muted, fontSize: 13 }}>
        <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</span>
        Analizando con IA...
      </div>
    </div>
  );
  if (!result) return null;
  return (
    <div style={{ marginTop: 10, padding: "14px 16px", background: "#FFFBF0", borderRadius: 8, borderLeft: `3px solid ${COLORS.warning}`, fontSize: 13, lineHeight: 1.6 }}>
      <div style={{ fontWeight: 700, color: COLORS.accent, marginBottom: 6, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        🤖 Análisis IA
      </div>
      <div style={{ color: "#444", whiteSpace: "pre-wrap" }}>{result}</div>
    </div>
  );
}

function Campo({ campo, value, onChange, formData }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleValidar = useCallback(async () => {
    if (!value || !campo.prompt) return;
    setLoading(true);
    setResult(null);
    try {
      const contextoPrevio = CAMPOS
        .filter(c => c.num < campo.num && formData[c.id])
        .map(c => `${c.label} (código ${c.num}): ${formData[c.id]}`)
        .join("\n");

      const userMsg = `Contexto de la ficha:\n${contextoPrevio || "(sin datos previos)"}\n\n---\nCampo a validar — ${campo.label} (código ${campo.num}):\n"${value}"\n\nPor favor, valida este campo según tu rol.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: campo.prompt,
          messages: [{ role: "user", content: userMsg }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "Sin respuesta.";
      setResult(text);
    } catch (e) {
      setResult("Error al conectar con la IA. Intente nuevamente.");
    }
    setLoading(false);
  }, [value, campo, formData]);

  const isSelect = campo.tipo === "cerrado" && OPTIONS[campo.id];
  const isNumber = campo.entrada === "Numérico";

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 11, color: COLORS.muted, minWidth: 60 }}>
          Código {campo.num}
        </span>
        <span style={{ fontWeight: 600, color: COLORS.accent, fontSize: 14, flex: 1 }}>{campo.label}</span>
        <Badge tipo={campo.tipo} />
      </div>

      {isSelect ? (
        <select
          value={value || ""}
          onChange={e => onChange(campo.id, e.target.value)}
          style={{
            width: "100%", padding: "10px 14px", borderRadius: 8,
            border: `1.5px solid ${COLORS.border}`, background: COLORS.inputBg,
            fontSize: 14, color: COLORS.accent, fontFamily: "inherit",
            appearance: "none", cursor: "pointer",
          }}
        >
          <option value="">— Seleccionar —</option>
          {OPTIONS[campo.id].map(op => <option key={op} value={op}>{op}</option>)}
        </select>
      ) : (
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <textarea
            value={value || ""}
            onChange={e => onChange(campo.id, e.target.value)}
            placeholder={campo.entrada === "Enlace" ? "https://..." : isNumber ? "Ingrese valor numérico..." : "Ingrese texto..."}
            rows={isNumber ? 1 : 3}
            style={{
              flex: 1, padding: "10px 14px", borderRadius: 8,
              border: `1.5px solid ${COLORS.border}`, background: COLORS.inputBg,
              fontSize: 14, color: COLORS.accent, fontFamily: "inherit",
              resize: "vertical", lineHeight: 1.5,
              outline: "none",
            }}
          />
          {campo.tipo === "condicionado" && (
            <button
              onClick={handleValidar}
              disabled={!value || loading}
              style={{
                padding: "10px 16px", borderRadius: 8, border: "none",
                background: value ? COLORS.primary : "#DDD",
                color: value ? "white" : "#AAA",
                fontSize: 12, fontWeight: 700, cursor: value ? "pointer" : "default",
                letterSpacing: "0.05em", whiteSpace: "nowrap",
                transition: "background 0.2s",
              }}
            >
              {loading ? "..." : "Validar IA"}
            </button>
          )}
        </div>
      )}
      <ValidationPanel result={result} loading={loading} />
    </div>
  );
}

export default function App() {
  const [formData, setFormData] = useState({});
  const [seccionActiva, setSeccionActiva] = useState(0);
  const [validandoTodo, setValidandoTodo] = useState(false);
  const [resumenIA, setResumenIA] = useState(null);

  const handleChange = useCallback((id, val) => {
    setFormData(prev => ({ ...prev, [id]: val }));
  }, []);

  const camposSeccion = SECCIONES[seccionActiva].campos
    .map(n => CAMPOS.find(c => c.num === n))
    .filter(Boolean);

  const progreso = Math.round((Object.keys(formData).filter(k => formData[k]).length / CAMPOS.length) * 100);

  const handleResumenGlobal = async () => {
    setValidandoTodo(true);
    setResumenIA(null);
    try {
      const resumen = CAMPOS
        .filter(c => formData[c.id])
        .map(c => `${c.label} (${c.num}): ${formData[c.id]}`)
        .join("\n");

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Actúa como un experto en monitoreo y evaluación del sector público peruano. 
Revisa la ficha de indicador completa y emite: 
1) Una evaluación global de consistencia interna (coherencia entre campos).
2) Un porcentaje estimado de calidad de la ficha (0-100%).
3) Las 3 principales fortalezas.
4) Las 3 principales debilidades o campos a mejorar.
5) Una recomendación final concisa.
Sé directo y técnico.`,
          messages: [{ role: "user", content: `Ficha del indicador:\n\n${resumen}` }],
        }),
      });
      const data = await res.json();
      setResumenIA(data.content?.map(b => b.text || "").join("") || "Sin respuesta.");
    } catch {
      setResumenIA("Error al conectar con la IA.");
    }
    setValidandoTodo(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Palatino Linotype', Georgia, serif" }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        select:focus, textarea:focus { border-color: ${COLORS.primary} !important; outline: none; box-shadow: 0 0 0 3px rgba(192,57,43,0.1); }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{ background: COLORS.accent, color: "white", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.6, marginBottom: 4 }}>
            Ministerio de Educación · Unidad de Planificación
          </div>
          <div style={{ fontSize: 22, fontWeight: 400, letterSpacing: "0.02em" }}>
            Ficha del Indicador
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.primary }}>{progreso}%</div>
          <div style={{ fontSize: 11, opacity: 0.6 }}>completado</div>
          <div style={{ width: 120, height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 2, marginTop: 6 }}>
            <div style={{ width: `${progreso}%`, height: "100%", background: COLORS.primary, borderRadius: 2, transition: "width 0.3s" }} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", maxWidth: 1100, margin: "0 auto", padding: "24px 16px", gap: 24 }}>
        {/* Sidebar navegación */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <div style={{ background: COLORS.surface, borderRadius: 12, padding: 16, border: `1px solid ${COLORS.border}`, position: "sticky", top: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: COLORS.muted, marginBottom: 12, textTransform: "uppercase" }}>
              Secciones
            </div>
            {SECCIONES.map((s, i) => {
              const camposS = s.campos.map(n => CAMPOS.find(c => c.num === n)).filter(Boolean);
              const llenos = camposS.filter(c => formData[c.id]).length;
              const activa = i === seccionActiva;
              return (
                <button
                  key={i}
                  onClick={() => setSeccionActiva(i)}
                  style={{
                    width: "100%", textAlign: "left", padding: "10px 12px",
                    borderRadius: 8, border: "none", marginBottom: 4, cursor: "pointer",
                    background: activa ? COLORS.primary : "transparent",
                    color: activa ? "white" : COLORS.accent,
                    fontSize: 13, fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontWeight: activa ? 700 : 400 }}>{s.titulo}</div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>
                    {llenos}/{camposS.length} campos
                  </div>
                </button>
              );
            })}

            <div style={{ borderTop: `1px solid ${COLORS.border}`, marginTop: 16, paddingTop: 16 }}>
              <button
                onClick={handleResumenGlobal}
                disabled={validandoTodo || progreso < 30}
                style={{
                  width: "100%", padding: "12px", borderRadius: 8,
                  border: `2px solid ${progreso >= 30 ? COLORS.primary : COLORS.border}`,
                  background: "transparent",
                  color: progreso >= 30 ? COLORS.primary : COLORS.muted,
                  fontSize: 13, fontWeight: 700, cursor: progreso >= 30 ? "pointer" : "default",
                  fontFamily: "inherit", letterSpacing: "0.04em",
                }}
              >
                {validandoTodo ? "Analizando..." : "📊 Evaluación Global"}
              </button>
              {progreso < 30 && (
                <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 6, textAlign: "center" }}>
                  Complete al menos 30% para evaluar
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div style={{ flex: 1 }}>
          <div style={{ background: COLORS.surface, borderRadius: 12, padding: 28, border: `1px solid ${COLORS.border}`, marginBottom: 20 }}>
            <h2 style={{ margin: "0 0 6px 0", fontSize: 18, color: COLORS.accent, fontWeight: 600 }}>
              {SECCIONES[seccionActiva].titulo}
            </h2>
            <p style={{ margin: "0 0 24px 0", fontSize: 13, color: COLORS.muted }}>
              Los campos marcados como <strong>IA Valida</strong> pueden ser analizados automáticamente con inteligencia artificial.
            </p>

            {camposSeccion.map(campo => (
              <Campo
                key={campo.id}
                campo={campo}
                value={formData[campo.id] || ""}
                onChange={handleChange}
                formData={formData}
              />
            ))}

            {/* Navegación entre secciones */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, paddingTop: 20, borderTop: `1px solid ${COLORS.border}` }}>
              <button
                onClick={() => setSeccionActiva(Math.max(0, seccionActiva - 1))}
                disabled={seccionActiva === 0}
                style={{
                  padding: "10px 20px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`,
                  background: "transparent", color: seccionActiva === 0 ? COLORS.muted : COLORS.accent,
                  fontSize: 13, cursor: seccionActiva === 0 ? "default" : "pointer", fontFamily: "inherit",
                }}
              >
                ← Anterior
              </button>
              <button
                onClick={() => setSeccionActiva(Math.min(SECCIONES.length - 1, seccionActiva + 1))}
                disabled={seccionActiva === SECCIONES.length - 1}
                style={{
                  padding: "10px 20px", borderRadius: 8, border: "none",
                  background: seccionActiva === SECCIONES.length - 1 ? COLORS.border : COLORS.primary,
                  color: seccionActiva === SECCIONES.length - 1 ? COLORS.muted : "white",
                  fontSize: 13, cursor: seccionActiva === SECCIONES.length - 1 ? "default" : "pointer",
                  fontFamily: "inherit", fontWeight: 600,
                }}
              >
                Siguiente →
              </button>
            </div>
          </div>

          {/* Panel de evaluación global */}
          {resumenIA && (
            <div style={{ background: COLORS.surface, borderRadius: 12, padding: 28, border: `2px solid ${COLORS.primary}` }}>
              <div style={{ fontWeight: 700, color: COLORS.primary, fontSize: 16, marginBottom: 16 }}>
                📊 Evaluación Global de la Ficha
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.8, color: COLORS.accent, whiteSpace: "pre-wrap" }}>
                {resumenIA}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
