import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase.js";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Nunito+Sans:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#f0f4f8;--surface:#ffffff;--surface2:#f8fafc;--surface3:#eef2f7;
  --border:#e2e8f0;--border2:#cbd5e1;
  --red:#ef4444;--red-bg:#fef2f2;--red-border:#fecaca;
  --yellow:#f59e0b;--yellow-bg:#fffbeb;--yellow-border:#fde68a;
  --blue:#3b82f6;--blue-bg:#eff6ff;--blue-border:#bfdbfe;
  --green:#10b981;--green-bg:#ecfdf5;--green-border:#a7f3d0;
  --purple:#8b5cf6;--purple-bg:#f5f3ff;--purple-border:#ddd6fe;
  --text:#1e293b;--text2:#475569;--text3:#94a3b8;
  --font:'Nunito',sans-serif;--mono:'Nunito Sans',sans-serif;
  --shadow:0 1px 3px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.05);
  --shadow-md:0 4px 12px rgba(0,0,0,.08),0 2px 4px rgba(0,0,0,.05);
  --shadow-lg:0 20px 40px rgba(0,0,0,.12),0 8px 16px rgba(0,0,0,.06);
  --radius:10px;--radius-sm:6px;
}
body{background:var(--bg);color:var(--text);font-family:var(--font)}
.app{min-height:100vh;display:flex;flex-direction:column}
.hdr{background:var(--surface);border-bottom:1px solid var(--border);padding:0 24px;height:56px;display:flex;align-items:center;justify-content:space-between;box-shadow:var(--shadow);position:sticky;top:0;z-index:100}
.logo{font-weight:800;font-size:15px;color:var(--text);letter-spacing:-.3px}
.logo em{color:var(--blue);font-style:normal}
.hdr-right{display:flex;align-items:center;gap:10px}
.date-badge{font-size:11px;color:var(--text3);font-family:var(--mono);background:var(--surface3);padding:4px 10px;border-radius:20px;border:1px solid var(--border)}
.sync-badge{font-size:10px;font-family:var(--mono);padding:4px 10px;border-radius:20px;display:flex;align-items:center;gap:5px}
.sync-badge.ok{background:var(--green-bg);color:var(--green);border:1px solid var(--green-border)}
.sync-badge.err{background:var(--red-bg);color:var(--red);border:1px solid var(--red-border)}
.sync-badge.loading{background:var(--yellow-bg);color:var(--yellow);border:1px solid var(--yellow-border)}
.main{flex:1;display:grid;grid-template-columns:220px 1fr;gap:0}
.sidebar{background:var(--surface);border-right:1px solid var(--border);padding:16px 12px;display:flex;flex-direction:column;gap:20px;min-height:100%}
.sb-label{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);padding:0 8px;margin-bottom:6px;font-family:var(--mono)}
.nav-item{display:flex;align-items:center;justify-content:space-between;padding:7px 10px;border-radius:var(--radius-sm);cursor:pointer;font-size:13px;font-weight:500;color:var(--text2);transition:all .15s;border:1px solid transparent}
.nav-item:hover{background:var(--surface3);color:var(--text)}
.nav-item.active{background:var(--blue-bg);color:var(--blue);border-color:var(--blue-border);font-weight:600}
.nav-badge{font-size:10px;font-family:var(--mono);padding:1px 6px;border-radius:10px;background:var(--surface3);color:var(--text3)}
.nav-item.active .nav-badge{background:var(--blue);color:#fff}
.import-btn{width:100%;padding:9px 14px;border-radius:var(--radius-sm);border:1.5px dashed var(--blue-border);background:var(--blue-bg);color:var(--blue);font-size:12px;font-weight:600;cursor:pointer;font-family:var(--font);transition:all .2s;display:flex;align-items:center;gap:6px;justify-content:center}
.import-btn:hover{background:var(--blue);color:#fff;border-style:solid}
.stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.stat-card{background:var(--surface3);border-radius:var(--radius-sm);padding:8px 10px;border:1px solid var(--border)}
.stat-n{font-size:20px;font-weight:800;line-height:1;font-family:var(--mono)}
.stat-lbl{font-size:10px;color:var(--text3);margin-top:2px;font-weight:500}
.content{padding:20px;overflow-y:auto}
.toolbar{display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap}
.view-tabs{display:flex;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:3px;gap:2px}
.vtab{font-size:11px;font-weight:600;padding:5px 12px;border-radius:4px;border:none;cursor:pointer;color:var(--text3);background:transparent;transition:all .15s;font-family:var(--font)}
.vtab.on{background:var(--blue);color:#fff;box-shadow:var(--shadow)}
.search-box{flex:1;min-width:180px;max-width:260px;position:relative}
.search-box input{width:100%;padding:7px 12px 7px 32px;border-radius:var(--radius-sm);border:1px solid var(--border);font-size:12px;font-family:var(--font);background:var(--surface);color:var(--text);outline:none;transition:border .15s}
.search-box input:focus{border-color:var(--blue)}
.search-box::before{content:'🔍';position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:11px}
.sort-sel{font-size:11px;padding:6px 10px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface);color:var(--text);cursor:pointer;font-family:var(--font)}
.kanban{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;align-items:start}
.k-col{display:flex;flex-direction:column;gap:8px}
.k-hdr{padding:9px 12px;border-radius:var(--radius-sm);font-size:11px;font-weight:700;font-family:var(--mono);display:flex;align-items:center;justify-content:space-between;letter-spacing:.3px;margin-bottom:2px}
.k-hdr.hot{background:var(--red-bg);color:var(--red);border:1px solid var(--red-border)}
.k-hdr.warm{background:var(--yellow-bg);color:var(--yellow);border:1px solid var(--yellow-border)}
.k-hdr.watch{background:var(--blue-bg);color:var(--blue);border:1px solid var(--blue-border)}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px;cursor:pointer;transition:all .2s;box-shadow:var(--shadow);position:relative;overflow:hidden}
.card:hover{box-shadow:var(--shadow-md);border-color:var(--blue-border);transform:translateY(-1px)}
.card-accent{height:3px;margin:-14px -14px 12px -14px}
.card-accent.hot{background:linear-gradient(90deg,var(--red),#f97316)}
.card-accent.warm{background:linear-gradient(90deg,var(--yellow),#fbbf24)}
.card-accent.watch{background:linear-gradient(90deg,var(--blue),#6366f1)}
.card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px}
.card-name{font-weight:700;font-size:13px;line-height:1.3;color:var(--text)}
.card-meta{font-size:11px;color:var(--text3);margin-top:2px;font-family:var(--mono)}
.score-badge{font-size:12px;font-weight:800;padding:3px 8px;border-radius:6px;flex-shrink:0;font-family:var(--mono)}
.score-badge.hot{background:var(--red-bg);color:var(--red);border:1px solid var(--red-border)}
.score-badge.warm{background:var(--yellow-bg);color:var(--yellow);border:1px solid var(--yellow-border)}
.score-badge.watch{background:var(--blue-bg);color:var(--blue);border:1px solid var(--blue-border)}
.card-signal{font-size:11px;color:var(--text2);line-height:1.5;margin-bottom:8px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.card-tags{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px}
.tag{font-size:9px;font-weight:600;padding:2px 7px;border-radius:10px;font-family:var(--mono);letter-spacing:.3px;text-transform:uppercase}
.tag.levee{background:var(--green-bg);color:var(--green);border:1px solid var(--green-border)}
.tag.offre{background:var(--yellow-bg);color:var(--yellow);border:1px solid var(--yellow-border)}
.tag.nomination{background:var(--purple-bg);color:var(--purple);border:1px solid var(--purple-border)}
.tag.esn{background:var(--blue-bg);color:var(--blue);border:1px solid var(--blue-border)}
.tag.pme{background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0}
.card-contact{display:flex;align-items:center;gap:6px;padding:6px 8px;background:var(--surface3);border-radius:var(--radius-sm);font-size:11px;margin-bottom:8px;border:1px solid var(--border)}
.card-foot{display:flex;align-items:center;justify-content:space-between;padding-top:8px;border-top:1px solid var(--border);font-size:10px}
.status-pill{font-size:9px;font-weight:700;padding:2px 8px;border-radius:10px;font-family:var(--mono);text-transform:uppercase;letter-spacing:.5px}
.sp-new{background:var(--surface3);color:var(--text3);border:1px solid var(--border)}
.sp-contacted{background:var(--blue-bg);color:var(--blue);border:1px solid var(--blue-border)}
.sp-replied{background:var(--green-bg);color:var(--green);border:1px solid var(--green-border)}
.sp-meeting{background:var(--yellow-bg);color:var(--yellow);border:1px solid var(--yellow-border)}
.sp-signed{background:var(--green-bg);color:var(--green);border:1px solid var(--green)}
.sp-no_fit{background:var(--red-bg);color:var(--red);border:1px solid var(--red-border)}
.sp-archived{background:var(--surface3);color:var(--text3);border:1px solid var(--border);opacity:.6}
.card-action-btn{font-size:10px;color:var(--blue);font-weight:600;font-family:var(--mono)}
.list{display:flex;flex-direction:column;gap:6px}
.l-hdr,.l-row{display:grid;grid-template-columns:52px 1fr 100px 90px 80px 90px 80px;align-items:center;gap:12px;padding:10px 14px;border-radius:var(--radius-sm);font-size:11px}
.l-hdr{font-family:var(--mono);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);padding-bottom:6px}
.l-row{background:var(--surface);border:1px solid var(--border);cursor:pointer;transition:all .15s;box-shadow:var(--shadow)}
.l-row:hover{border-color:var(--blue-border);box-shadow:var(--shadow-md)}
.l-co{font-weight:700;font-size:12px}
.l-sub{font-size:10px;color:var(--text3)}
.overlay{position:fixed;inset:0;background:rgba(15,23,42,.5);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px}
.fiche{background:var(--surface);border-radius:14px;width:100%;max-width:700px;max-height:90vh;overflow-y:auto;box-shadow:var(--shadow-lg);display:flex;flex-direction:column}
.fiche-hdr{padding:22px 24px 16px;border-bottom:1px solid var(--border)}
.fiche-hdr-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}
.fiche-co{font-size:20px;font-weight:800;line-height:1.2}
.fiche-sub{font-size:13px;color:var(--text2);margin-top:4px}
.fiche-close{background:var(--surface3);border:1px solid var(--border);color:var(--text2);cursor:pointer;font-size:14px;padding:6px 10px;border-radius:var(--radius-sm);font-family:var(--font)}
.fiche-close:hover{background:var(--border);color:var(--text)}
.meta-pills{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.mpill{font-size:11px;color:var(--text2);background:var(--surface3);border:1px solid var(--border);padding:4px 10px;border-radius:20px;font-family:var(--mono)}
.fiche-body{padding:20px 24px;display:flex;flex-direction:column;gap:16px}
.fsec{display:flex;flex-direction:column;gap:8px}
.fsec-hdr{display:flex;align-items:center;justify-content:space-between}
.fsec-title{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);font-family:var(--mono)}
.score-row{display:flex;align-items:center;gap:12px}
.score-big{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;flex-shrink:0;font-family:var(--mono);border:2px solid}
.score-big.hot{border-color:var(--red);color:var(--red);background:var(--red-bg)}
.score-big.warm{border-color:var(--yellow);color:var(--yellow);background:var(--yellow-bg)}
.score-big.watch{border-color:var(--blue);color:var(--blue);background:var(--blue-bg)}
.reasons{display:flex;flex-direction:column;gap:4px;flex:1}
.reason{font-size:11px;color:var(--text2);display:flex;align-items:flex-start;gap:6px}
.reason::before{content:'↑';color:var(--green);font-family:var(--mono);font-size:10px;flex-shrink:0;margin-top:1px}
.ctx-box{background:var(--surface3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;font-size:12px;line-height:1.7;color:var(--text2)}
.ctx-box.accroche{background:var(--blue-bg);border-color:var(--blue-border);color:var(--text)}
.ctx-edit{width:100%;min-height:80px;background:var(--surface);border:1px solid var(--border);color:var(--text);font-size:12px;padding:10px;border-radius:var(--radius-sm);font-family:var(--font);resize:vertical;outline:none;line-height:1.7;transition:border .15s}
.ctx-edit:focus{border-color:var(--blue)}
.ctc-card{background:var(--surface3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px}
.ctc-name{font-size:14px;font-weight:700;margin-bottom:2px}
.ctc-role{font-size:11px;color:var(--blue);margin-bottom:10px;font-family:var(--mono);font-weight:600}
.cf{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.cf-lbl{font-size:10px;color:var(--text3);width:54px;flex-shrink:0;font-family:var(--mono);font-weight:600}
.cf-inp{flex:1;background:var(--surface);border:1px solid var(--border);color:var(--text);font-size:12px;padding:5px 8px;border-radius:var(--radius-sm);font-family:var(--font);outline:none;transition:border .15s}
.cf-inp:focus{border-color:var(--blue)}
.cf-inp::placeholder{color:var(--text3)}
.s-row{display:flex;gap:5px;flex-wrap:wrap}
.s-opt{font-size:10px;font-weight:600;padding:5px 10px;border-radius:20px;border:1px solid var(--border);cursor:pointer;color:var(--text3);background:var(--surface);transition:all .15s;font-family:var(--font)}
.s-opt:hover{border-color:var(--blue-border);color:var(--text)}
.s-opt.a-new{background:var(--surface3);border-color:var(--border2);color:var(--text)}
.s-opt.a-contacted{background:var(--blue-bg);border-color:var(--blue);color:var(--blue)}
.s-opt.a-replied{background:var(--green-bg);border-color:var(--green);color:var(--green)}
.s-opt.a-meeting{background:var(--yellow-bg);border-color:var(--yellow);color:var(--yellow)}
.s-opt.a-signed{background:var(--green-bg);border-color:var(--green);color:var(--green);font-weight:700}
.s-opt.a-no_fit{background:var(--red-bg);border-color:var(--red);color:var(--red)}
.s-opt.a-archived{background:var(--surface3);border-color:var(--border2);color:var(--text3)}
.notes-area{width:100%;min-height:70px;background:var(--surface);border:1px solid var(--border);color:var(--text);font-size:12px;padding:10px;border-radius:var(--radius-sm);font-family:var(--font);resize:vertical;outline:none;line-height:1.6;transition:border .15s}
.notes-area:focus{border-color:var(--blue)}
.notes-area::placeholder{color:var(--text3)}
.fiche-foot{padding:14px 24px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:12px;border-radius:0 0 14px 14px;background:var(--surface2)}
.saved-ok{font-size:10px;color:var(--green);font-family:var(--mono);font-weight:600;opacity:0;transition:opacity .3s}
.saved-ok.show{opacity:1}
.import-modal{background:var(--surface);border-radius:14px;width:100%;max-width:680px;max-height:88vh;overflow-y:auto;box-shadow:var(--shadow-lg);padding:28px;display:flex;flex-direction:column;gap:16px}
.import-title{font-size:18px;font-weight:800}
.import-sub{font-size:12px;color:var(--text2);line-height:1.6}
.import-format{background:var(--surface3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;font-size:11px;font-family:var(--mono);color:var(--text2);line-height:1.8;white-space:pre-wrap;max-height:200px;overflow-y:auto}
.import-area{width:100%;min-height:220px;background:var(--surface);border:1.5px solid var(--border);color:var(--text);font-size:12px;padding:12px;border-radius:var(--radius-sm);font-family:var(--mono);resize:vertical;outline:none;line-height:1.6;transition:border .15s}
.import-area:focus{border-color:var(--blue)}
.import-area::placeholder{color:var(--text3)}
.import-error{font-size:11px;color:var(--red);background:var(--red-bg);border:1px solid var(--red-border);border-radius:var(--radius-sm);padding:8px 12px;font-family:var(--mono)}
.btn{font-size:12px;font-weight:600;padding:8px 16px;border-radius:var(--radius-sm);border:1px solid;cursor:pointer;transition:all .2s;font-family:var(--font)}
.btn-primary{border-color:var(--blue);color:#fff;background:var(--blue)}
.btn-primary:hover{background:#2563eb}
.btn-ghost{border-color:var(--border);color:var(--text2);background:var(--surface)}
.btn-ghost:hover{border-color:var(--border2);color:var(--text);background:var(--surface3)}
.btn-sm{padding:5px 10px;font-size:11px}
.btn-danger{border-color:var(--red-border);color:var(--red);background:var(--red-bg)}
.btn-danger:hover{background:var(--red);color:#fff}
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 20px;text-align:center;gap:12px}
.empty-icon{font-size:48px}
.empty-title{font-size:16px;font-weight:700;color:var(--text)}
.empty-sub{font-size:13px;color:var(--text3);max-width:360px;line-height:1.6}
.divider{height:1px;background:var(--border)}
.prog-wrap{background:var(--border);border-radius:2px;height:3px;margin:6px 0}
.prog{height:3px;border-radius:2px;transition:width .4s}
.prog.hot{background:linear-gradient(90deg,var(--red),#f97316)}
.prog.warm{background:linear-gradient(90deg,var(--yellow),#fbbf24)}
.prog.watch{background:linear-gradient(90deg,var(--blue),#6366f1)}
.brief-badge{font-size:10px;font-family:var(--mono);font-weight:600;padding:2px 8px;border-radius:10px;background:var(--blue-bg);color:var(--blue);border:1px solid var(--blue-border)}
`;

const TIER = s => s >= 75 ? "hot" : s >= 50 ? "warm" : "watch";
const TAG_CLASS = {
  "levée de fonds": "levee", "offres IT actives": "offre",
  "nomination DRH/CTO": "nomination", "ESN niche": "esn", "PME tech en croissance": "pme"
};
const STATUS_LABELS = {
  new: "🆕 Nouveau", contacted: "📤 Contacté", replied: "💬 Répondu",
  meeting: "📅 RDV", signed: "✅ Signé", no_fit: "❌ No fit", archived: "📦 Archivé"
};

const EXAMPLE_JSON = `[
  {
    "company": "Naboo",
    "location": "Paris",
    "sector": "SaaS Événementiel B2B",
    "size": "180 sal.",
    "founded": "2022",
    "type": "startup",
    "score": 92,
    "signals": "levée de fonds",
    "signal_details": "Série B 70M$ fev 2026. Objectif 200→300 col. fin 2026.",
    "score_reasons": "Levée très récente|Objectif +100 recrutements|Recours cabinets confirmé",
    "company_context": "Plateforme SaaS événementiel B2B. A déjà fait appel à des cabinets externes.",
    "contact_role": "Head of People",
    "contact_name": "À identifier",
    "accroche": "Votre Série B + objectif 200→300 col. — c'est le type de volume où Konekt intervient."
  }
]`;

function SPill({ s }) {
  return <span className={`status-pill sp-${s}`}>{STATUS_LABELS[s] || s}</span>;
}

function Tags({ signals = "" }) {
  const arr = typeof signals === "string" ? signals.split("|").filter(Boolean) : signals;
  return (
    <div className="card-tags">
      {arr.map(s => <span key={s} className={`tag ${TAG_CLASS[s.trim()] || "offre"}`}>{s.trim()}</span>)}
    </div>
  );
}

function Fiche({ prospect: init, onClose, onSave, onDelete }) {
  const [p, setP] = useState(init);
  const [editCtx, setEditCtx] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const t = TIER(p.score);

  const upd = (k, v) => setP(prev => ({ ...prev, [k]: v }));

  const save = async () => {
    setSaving(true);
    await onSave(p);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const reasons = typeof p.score_reasons === "string"
    ? p.score_reasons.split("|").filter(Boolean)
    : (p.score_reasons || []);

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="fiche">
        <div className="fiche-hdr">
          <div className="fiche-hdr-top">
            <div>
              <div className="fiche-co">{p.company}</div>
              <div className="fiche-sub">{p.sector} · {p.location}</div>
            </div>
            <button className="fiche-close" onClick={onClose}>✕ Fermer</button>
          </div>
          <div className="meta-pills">
            <span className="mpill">🏢 {p.type}</span>
            <span className="mpill">👥 {p.size}</span>
            {p.founded && <span className="mpill">📅 {p.founded}</span>}
            <span className={`score-badge ${t}`}>{p.score}</span>
            <SPill s={p.status} />
            <span className="brief-badge">Brief {p.brief_date || "—"}</span>
          </div>
        </div>

        <div className="fiche-body">
          <div className="fsec">
            <div className="fsec-title">Pourquoi ce score</div>
            <div className="score-row">
              <div className={`score-big ${t}`}>{p.score}</div>
              <div className="reasons">
                {reasons.map((r, i) => <div key={i} className="reason">{r}</div>)}
              </div>
            </div>
            <Tags signals={p.signals} />
            <div className="ctx-box">{p.signal_details}</div>
          </div>
          <div className="divider" />

          <div className="fsec">
            <div className="fsec-hdr">
              <div className="fsec-title">Contexte société</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditCtx(!editCtx)}>
                {editCtx ? "Fermer" : "Éditer"}
              </button>
            </div>
            {editCtx
              ? <textarea className="ctx-edit" value={p.company_context || ""} onChange={e => upd("company_context", e.target.value)} />
              : <div className="ctx-box">{p.company_context || <span style={{ color: "var(--text3)" }}>Clique sur Éditer pour ajouter un contexte.</span>}</div>
            }
          </div>

          {p.accroche && (
            <>
              <div className="divider" />
              <div className="fsec">
                <div className="fsec-title">💬 Accroche recommandée</div>
                <div className="ctx-box accroche">"{p.accroche}"</div>
              </div>
            </>
          )}
          <div className="divider" />

          <div className="fsec">
            <div className="fsec-title">Contact à approcher</div>
            <div className="ctc-card">
              <div className="ctc-name">{p.contact_name || "À identifier"}</div>
              <div className="ctc-role">{p.contact_role}</div>
              <div className="cf">
                <span className="cf-lbl">LinkedIn</span>
                <input className="cf-inp" placeholder="URL profil LinkedIn" value={p.contact_linkedin || ""} onChange={e => upd("contact_linkedin", e.target.value)} />
              </div>
              <div className="cf">
                <span className="cf-lbl">Email</span>
                <input className="cf-inp" placeholder="prenom.nom@société.fr" value={p.contact_email || ""} onChange={e => upd("contact_email", e.target.value)} />
              </div>
              <div className="cf">
                <span className="cf-lbl">Canal</span>
                <select className="cf-inp" value={p.recommended_action || "LinkedIn InMail"} onChange={e => upd("recommended_action", e.target.value)}>
                  <option>LinkedIn InMail</option>
                  <option>Demande connexion LinkedIn</option>
                  <option>Email direct</option>
                  <option>Appel</option>
                </select>
              </div>
            </div>
          </div>
          <div className="divider" />

          <div className="fsec">
            <div className="fsec-title">Recruteur assigné</div>
            <select className="cf-inp" value={p.recruiter || ""} onChange={e => upd("recruiter", e.target.value)}>
              <option value="">— Non assigné</option>
              <option>Tiago</option>
              <option>Laurent</option>
              <option>Guillaume</option>
              <option>Thomas</option>
            </select>
          </div>
          <div className="divider" />

          <div className="fsec">
            <div className="fsec-title">Statut</div>
            <div className="s-row">
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <button key={k} className={`s-opt ${p.status === k ? `a-${k}` : ""}`} onClick={() => upd("status", k)}>{v}</button>
              ))}
            </div>
          </div>

          <div className="fsec">
            <div className="fsec-title">Notes</div>
            <textarea className="notes-area" placeholder="Retours d'appel, observations, contexte..." value={p.notes || ""} onChange={e => upd("notes", e.target.value)} />
          </div>
        </div>

        <div className="fiche-foot">
          <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm("Supprimer ce prospect ?")) { onDelete(p.id); onClose(); } }}>
            Supprimer
          </button>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className={`saved-ok ${saved ? "show" : ""}`}>✓ Sauvegardé</span>
            <button className="btn btn-ghost" onClick={onClose}>Fermer</button>
            <button className="btn btn-primary" onClick={save} disabled={saving}>
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImportModal({ onClose, onImport, importing }) {
  const [json, setJson] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("json");

  const tryImport = () => {
    setError("");
    try {
      const parsed = JSON.parse(json.trim());
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      const today = new Date().toLocaleDateString("fr-FR");
      const enriched = arr.map(p => ({
        status: "new",
        notes: "",
        contact_linkedin: "",
        contact_email: "",
        recommended_action: "LinkedIn InMail",
        brief_date: today,
        recruiter: "",
        ...p,
        signals: Array.isArray(p.signals) ? p.signals.join("|") : (p.signals || ""),
        score_reasons: Array.isArray(p.score_reasons) ? p.score_reasons.join("|") : (p.score_reasons || ""),
      }));
      onImport(enriched);
    } catch (e) {
      setError("JSON invalide — vérifie la syntaxe.");
    }
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="import-modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div className="import-title">📥 Importer un brief</div>
          <button className="fiche-close" onClick={onClose}>✕</button>
        </div>
        <div className="import-sub">
          Colle ici le JSON du brief Claude. Le dashboard importe les prospects dans Supabase — visible par toute l'équipe instantanément.
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className={`btn btn-sm ${mode === "json" ? "btn-primary" : "btn-ghost"}`} onClick={() => setMode("json")}>Coller mon brief</button>
          <button className={`btn btn-sm ${mode === "example" ? "btn-primary" : "btn-ghost"}`} onClick={() => setMode("example")}>Voir le format</button>
        </div>
        {mode === "example"
          ? <div className="import-format">{EXAMPLE_JSON}</div>
          : <textarea className="import-area" placeholder='Colle ici le JSON du brief Claude...' value={json} onChange={e => setJson(e.target.value)} />
        }
        {error && <div className="import-error">{error}</div>}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          {mode === "json" && (
            <button className="btn btn-primary" onClick={tryImport} disabled={importing}>
              {importing ? "Import en cours..." : "Importer les prospects"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [prospects, setProspects] = useState([]);
  const [syncStatus, setSyncStatus] = useState("loading");
  const [view, setView] = useState("kanban");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("score");
  const [selected, setSelected] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [importing, setImporting] = useState(false);

  // Chargement initial + realtime
  useEffect(() => {
    loadProspects();

    const channel = supabase
      .channel("prospects-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "prospects" }, () => {
        loadProspects();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const loadProspects = async () => {
    setSyncStatus("loading");
    const { data, error } = await supabase
      .from("prospects")
      .select("*")
      .order("score", { ascending: false });

    if (error) {
      setSyncStatus("err");
      console.error(error);
    } else {
      setProspects(data || []);
      setSyncStatus("ok");
    }
  };

  const handleImport = async (newProspects) => {
    setImporting(true);
    for (const p of newProspects) {
      const { data: existing } = await supabase
        .from("prospects")
        .select("id")
        .ilike("company", p.company)
        .single();

      if (existing) {
        await supabase.from("prospects").update({
          score: p.score,
          signals: p.signals,
          signal_details: p.signal_details,
          score_reasons: p.score_reasons,
          brief_date: p.brief_date,
          priority: p.priority,
          type: p.type,
          sector: p.sector,
          location: p.location,
          size: p.size,
          founded: p.founded,
          accroche: p.accroche,
          company_context: p.company_context,
          contact_name: p.contact_name,
          contact_role: p.contact_role,
        }).eq("id", existing.id);
      } else {
        await supabase.from("prospects").insert(p);
      }
    }
    setImporting(false);
    setShowImport(false);
    await loadProspects();
  };

  const saveFiche = async (updated) => {
    const { id, ...data } = updated;
    await supabase.from("prospects").update(data).eq("id", id);
    setProspects(prev => prev.map(p => p.id === id ? updated : p));
    setSelected(updated);
  };

  const deletePros = async (id) => {
    await supabase.from("prospects").delete().eq("id", id);
    setProspects(prev => prev.filter(p => p.id !== id));
  };

  const visible = prospects
    .filter(p => {
      if (filter === "all") return p.status !== "archived";
      if (filter === "hot") return TIER(p.score) === "hot" && p.status !== "archived";
      if (filter === "warm") return TIER(p.score) === "warm" && p.status !== "archived";
      if (filter === "watch") return TIER(p.score) === "watch" && p.status !== "archived";
      if (filter === "inprogress") return ["contacted", "replied", "meeting"].includes(p.status);
      if (filter === "signed") return p.status === "signed";
      if (filter === "archived") return p.status === "archived";
      return true;
    })
    .filter(p => !search || (p.company || "").toLowerCase().includes(search.toLowerCase()) || (p.location || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "score" ? b.score - a.score : 0);

  const hot = visible.filter(p => TIER(p.score) === "hot");
  const warm = visible.filter(p => TIER(p.score) === "warm");
  const watch = visible.filter(p => TIER(p.score) === "watch");

  const C = {
    all: prospects.filter(p => p.status !== "archived").length,
    hot: prospects.filter(p => TIER(p.score) === "hot" && p.status !== "archived").length,
    warm: prospects.filter(p => TIER(p.score) === "warm" && p.status !== "archived").length,
    watch: prospects.filter(p => TIER(p.score) === "watch" && p.status !== "archived").length,
    inprogress: prospects.filter(p => ["contacted", "replied", "meeting"].includes(p.status)).length,
    signed: prospects.filter(p => p.status === "signed").length,
    archived: prospects.filter(p => p.status === "archived").length,
  };

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  function Card({ p }) {
    const t = TIER(p.score);
    return (
      <div className="card" onClick={() => setSelected(p)}>
        <div className={`card-accent ${t}`} />
        <div className="card-top">
          <div>
            <div className="card-name">{p.company}</div>
            <div className="card-meta">📍 {p.location} · {p.size} · {p.type}</div>
          </div>
          <span className={`score-badge ${t}`}>{p.score}</span>
        </div>
        <Tags signals={p.signals} />
        <div className="card-signal">{p.signal_details}</div>
        {p.contact_name && (
          <div className="card-contact">
            <span style={{ fontWeight: 600 }}>{p.contact_name}</span>
            <span style={{ color: "var(--text3)" }}>·</span>
            <span style={{ color: "var(--text3)" }}>{p.contact_role}</span>
          </div>
        )}
        <div className="prog-wrap"><div className={`prog ${t}`} style={{ width: `${p.score}%` }} /></div>
        <div className="card-foot">
          <span className="card-action-btn">→ {p.recommended_action || "LinkedIn"}</span>
          <SPill s={p.status} />
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={handleImport} importing={importing} />}
        {selected && <Fiche prospect={selected} onClose={() => setSelected(null)} onSave={saveFiche} onDelete={deletePros} />}

        <div className="hdr">
          <div className="logo">Konekt <em>·</em> Prospect Radar</div>
          <div className="hdr-right">
            <div className={`sync-badge ${syncStatus}`}>
              {syncStatus === "ok" && "● Sync temps réel"}
              {syncStatus === "loading" && "○ Chargement..."}
              {syncStatus === "err" && "✕ Erreur connexion"}
            </div>
            <div className="date-badge">{today}</div>
          </div>
        </div>

        <div className="main">
          <div className="sidebar">
            <div>
              <button className="import-btn" onClick={() => setShowImport(true)}>📥 Importer un brief</button>
            </div>
            <div>
              <div className="sb-label">Pipeline</div>
              {[
                { k: "all", l: "Tous les prospects" },
                { k: "hot", l: "🔥 Prioritaires" },
                { k: "warm", l: "⚡ À suivre" },
                { k: "watch", l: "👁 Veille" },
              ].map(({ k, l }) => (
                <div key={k} className={`nav-item ${filter === k ? "active" : ""}`} onClick={() => setFilter(k)}>
                  <span>{l}</span><span className="nav-badge">{C[k]}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="sb-label">Suivi</div>
              {[
                { k: "inprogress", l: "⚡ En discussion" },
                { k: "signed", l: "✅ Signés" },
                { k: "archived", l: "📦 Archivés" },
              ].map(({ k, l }) => (
                <div key={k} className={`nav-item ${filter === k ? "active" : ""}`} onClick={() => setFilter(k)}>
                  <span>{l}</span><span className="nav-badge">{C[k]}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="sb-label">Chiffres clés</div>
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-n" style={{ color: "var(--red)" }}>{C.hot}</div><div className="stat-lbl">Prioritaires</div></div>
                <div className="stat-card"><div className="stat-n" style={{ color: "var(--blue)" }}>{C.inprogress}</div><div className="stat-lbl">En cours</div></div>
                <div className="stat-card"><div className="stat-n" style={{ color: "var(--green)" }}>{C.signed}</div><div className="stat-lbl">Signés</div></div>
                <div className="stat-card"><div className="stat-n" style={{ color: "var(--text2)" }}>{C.all}</div><div className="stat-lbl">Total</div></div>
              </div>
            </div>
          </div>

          <div className="content">
            <div className="toolbar">
              <div className="view-tabs">
                <button className={`vtab ${view === "kanban" ? "on" : ""}`} onClick={() => setView("kanban")}>Kanban</button>
                <button className={`vtab ${view === "list" ? "on" : ""}`} onClick={() => setView("list")}>Liste</button>
              </div>
              <div className="search-box">
                <input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="sort-sel" value={sort} onChange={e => setSort(e.target.value)}>
                <option value="score">↓ Score</option>
                <option value="date">↓ Date brief</option>
              </select>
            </div>

            {prospects.length === 0 && syncStatus !== "loading" ? (
              <div className="empty">
                <div className="empty-icon">📋</div>
                <div className="empty-title">Aucun prospect pour l'instant</div>
                <div className="empty-sub">Demande un brief à Claude chaque matin et importe le JSON ici. Toute l'équipe verra les prospects instantanément.</div>
                <button className="btn btn-primary" onClick={() => setShowImport(true)}>📥 Importer mon premier brief</button>
              </div>
            ) : syncStatus === "loading" && prospects.length === 0 ? (
              <div className="empty"><div className="empty-icon">⏳</div><div className="empty-title">Chargement...</div></div>
            ) : view === "kanban" ? (
              <div className="kanban">
                <div className="k-col">
                  <div className="k-hdr hot">🔥 Prioritaires <span>{hot.length}</span></div>
                  {hot.map(p => <Card key={p.id} p={p} />)}
                </div>
                <div className="k-col">
                  <div className="k-hdr warm">⚡ À suivre <span>{warm.length}</span></div>
                  {warm.map(p => <Card key={p.id} p={p} />)}
                </div>
                <div className="k-col">
                  <div className="k-hdr watch">👁 Veille <span>{watch.length}</span></div>
                  {watch.map(p => <Card key={p.id} p={p} />)}
                </div>
              </div>
            ) : (
              <div className="list">
                <div className="l-hdr">
                  <span>SCORE</span><span>SOCIÉTÉ</span><span>SIGNAL</span>
                  <span>TYPE</span><span>TAILLE</span><span>CONTACT</span><span>STATUT</span>
                </div>
                {visible.map(p => (
                  <div key={p.id} className="l-row" onClick={() => setSelected(p)}>
                    <span className={`score-badge ${TIER(p.score)}`}>{p.score}</span>
                    <div><div className="l-co">{p.company}</div><div className="l-sub">📍 {p.location}</div></div>
                    <Tags signals={(p.signals || "").split("|").slice(0, 1).join("")} />
                    <span style={{ fontSize: 11, color: "var(--text2)" }}>{p.type}</span>
                    <span style={{ fontSize: 11, color: "var(--text3)" }}>{p.size}</span>
                    <span style={{ fontSize: 11, color: "var(--text3)" }}>{p.contact_role}</span>
                    <SPill s={p.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
