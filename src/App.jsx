import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase.js";

/* ─── DESIGN TOKENS ─────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#F7F6F2;
  --surface:#FFFFFF;
  --surface2:#F2F1ED;
  --surface3:#ECEAE4;
  --border:#E2DFD8;
  --border2:#CCCAB8;

  --yellow:#F5C842;
  --yellow-bg:#FFFBEB;
  --yellow-dim:#F5C84240;

  --red:#E53E3E;    --red-bg:#FFF5F5;    --red-dim:#FED7D7;
  --amber:#D97706;  --amber-bg:#FFFBEB;  --amber-dim:#FDE68A;
  --green:#2D6A4F;  --green-bg:#F0FDF4;  --green-dim:#BBF7D0;
  --blue:#2B6CB0;   --blue-bg:#EBF8FF;   --blue-dim:#BEE3F8;
  --cyan:#0E7490;   --cyan-bg:#ECFEFF;   --cyan-dim:#A5F3FC;
  --purple:#553C9A; --purple-bg:#FAF5FF;

  --text:#1A1A18;
  --text2:#5C5C52;
  --text3:#9C9A8E;

  --font:'Instrument Sans',sans-serif;
  --mono:'DM Mono',monospace;
  --radius:8px;
  --radius-sm:5px;
  --shadow:0 1px 4px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);
  --shadow-md:0 4px 16px rgba(0,0,0,.08);
  --shadow-lg:0 24px 48px rgba(0,0,0,.12);
}

body{background:var(--bg);color:var(--text);font-family:var(--font);font-size:13px}
button{font-family:var(--font)}

/* ── LAYOUT ── */
.app{min-height:100vh;display:flex;flex-direction:column}
.hdr{background:var(--surface);border-bottom:1px solid var(--border);padding:0 24px;height:54px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;box-shadow:var(--shadow)}
.logo{font-weight:700;font-size:15px;letter-spacing:-.4px;color:var(--text);display:flex;align-items:center;gap:8px}
.logo-tag{font-size:9px;font-weight:600;font-family:var(--mono);background:var(--yellow);color:var(--text);padding:2px 7px;border-radius:4px;letter-spacing:.5px;text-transform:uppercase}
.hdr-right{display:flex;align-items:center;gap:8px}

.layout{display:grid;grid-template-columns:210px 1fr;flex:1;min-height:0}
.sidebar{background:var(--surface);border-right:1px solid var(--border);padding:16px 12px;display:flex;flex-direction:column;gap:20px;overflow-y:auto}
.sb-section{display:flex;flex-direction:column;gap:1px}
.sb-label{font-size:9px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--text3);padding:0 8px;margin-bottom:6px;font-family:var(--mono)}
.nav-item{display:flex;align-items:center;justify-content:space-between;padding:7px 10px;border-radius:var(--radius-sm);cursor:pointer;font-size:12px;font-weight:500;color:var(--text2);transition:all .12s;border:1px solid transparent;gap:6px}
.nav-item:hover{background:var(--surface2);color:var(--text)}
.nav-item.active{background:var(--yellow-bg);color:var(--text);border-color:var(--yellow-dim);font-weight:600}
.nav-item-left{display:flex;align-items:center;gap:7px}
.nav-count{font-size:10px;font-family:var(--mono);padding:1px 6px;border-radius:20px;background:var(--surface3);color:var(--text3);min-width:18px;text-align:center}
.nav-item.active .nav-count{background:var(--yellow);color:var(--text)}
.nav-count.urgent{background:var(--red);color:#fff;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}

.content{padding:20px 24px;overflow-y:auto;display:flex;flex-direction:column;gap:16px}

/* ── STATS BAR ── */
.stats-bar{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px;display:flex;flex-direction:column;gap:4px;transition:all .15s}
.stat-card:hover{border-color:var(--border2);box-shadow:var(--shadow)}
.stat-n{font-size:24px;font-weight:700;font-family:var(--mono);line-height:1}
.stat-lbl{font-size:10px;color:var(--text3);font-weight:500;letter-spacing:.3px;text-transform:uppercase}
.stat-sub{font-size:10px;color:var(--text3);font-family:var(--mono)}

/* ── TOOLBAR ── */
.toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.search-wrap{position:relative;flex:1;min-width:160px;max-width:280px}
.search-wrap input{width:100%;padding:7px 10px 7px 30px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:12px;font-family:var(--font);outline:none;transition:border .15s}
.search-wrap input:focus{border-color:var(--border2)}
.search-wrap input::placeholder{color:var(--text3)}
.search-icon{position:absolute;left:9px;top:50%;transform:translateY(-50%);color:var(--text3);font-size:12px}
.sel{font-size:11px;padding:6px 10px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text2);cursor:pointer;font-family:var(--font);outline:none;transition:border .15s}
.sel:focus{border-color:var(--border2)}
.view-switch{display:flex;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:2px;gap:2px}
.vsw{font-size:11px;font-weight:600;padding:4px 10px;border-radius:4px;border:none;cursor:pointer;color:var(--text3);background:transparent;transition:all .12s;font-family:var(--font)}
.vsw.on{background:var(--text);color:#fff}

/* ── BTN ── */
.btn{font-size:11px;font-weight:600;padding:7px 14px;border-radius:var(--radius-sm);border:1px solid;cursor:pointer;transition:all .15s;font-family:var(--font);display:inline-flex;align-items:center;gap:5px}
.btn-primary{border-color:var(--yellow);background:var(--yellow);color:var(--text)}
.btn-primary:hover{background:#e8b930;border-color:#e8b930}
.btn-ghost{border-color:var(--border);background:transparent;color:var(--text2)}
.btn-ghost:hover{border-color:var(--border2);color:var(--text);background:var(--surface2)}
.btn-danger{border-color:var(--red-dim);background:var(--red-bg);color:var(--red)}
.btn-danger:hover{background:var(--red);color:#fff;border-color:var(--red)}
.btn-sm{padding:4px 10px;font-size:10px}
.btn-xs{padding:3px 8px;font-size:10px}

/* ── BADGE & PILLS ── */
.badge{font-size:9px;font-weight:600;padding:2px 8px;border-radius:20px;font-family:var(--mono);letter-spacing:.3px;text-transform:uppercase;border:1px solid}
.b-new{background:var(--surface3);color:var(--text3);border-color:var(--border)}
.b-contacted{background:var(--blue-bg);color:var(--blue);border-color:var(--blue-dim)}
.b-replied{background:var(--cyan-bg);color:var(--cyan);border-color:var(--cyan-dim)}
.b-meeting{background:var(--amber-bg);color:var(--amber);border-color:var(--amber-dim)}
.b-signed{background:var(--green-bg);color:var(--green);border-color:var(--green-dim)}
.b-no_fit{background:var(--red-bg);color:var(--red);border-color:var(--red-dim)}
.b-archived{background:var(--surface3);color:var(--text3);border-color:var(--border);opacity:.6}

.score-badge{font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;font-family:var(--mono);flex-shrink:0;border:1px solid}
.sb-hot{background:var(--red-bg);color:var(--red);border-color:var(--red-dim)}
.sb-warm{background:var(--yellow-bg);color:#92610a;border-color:var(--amber-dim)}
.sb-watch{background:var(--surface3);color:var(--text2);border-color:var(--border)}

.recruiter-dot{border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0}

/* ── KANBAN ── */
.kanban-board{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;align-items:start;min-width:900px}
.kanban-wrap{overflow-x:auto;padding-bottom:8px}
.k-col{display:flex;flex-direction:column;gap:6px;min-width:0}
.k-hdr{padding:8px 10px;border-radius:var(--radius-sm);font-size:9px;font-weight:700;font-family:var(--mono);display:flex;align-items:center;justify-content:space-between;letter-spacing:.8px;text-transform:uppercase;margin-bottom:4px;border:1px solid}
.k-hdr.s-new{background:var(--surface3);color:var(--text2);border-color:var(--border)}
.k-hdr.s-contacted{background:var(--blue-bg);color:var(--blue);border-color:var(--blue-dim)}
.k-hdr.s-replied{background:var(--cyan-bg);color:var(--cyan);border-color:var(--cyan-dim)}
.k-hdr.s-meeting{background:var(--yellow-bg);color:#92610a;border-color:var(--amber-dim)}
.k-hdr.s-signed{background:var(--green-bg);color:var(--green);border-color:var(--green-dim)}

/* ── CARD ── */
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:12px 12px 10px 14px;cursor:pointer;transition:all .15s;position:relative;overflow:hidden}
.card:hover{border-color:var(--border2);box-shadow:var(--shadow-md);transform:translateY(-1px)}
.card.overdue{border-left:3px solid var(--red)}
.card-stripe{position:absolute;left:0;top:0;bottom:0;width:3px}
.card-stripe.hot{background:var(--red)}
.card-stripe.warm{background:var(--yellow)}
.card-stripe.watch{background:var(--border2)}
.card-stripe.signed{background:var(--green)}
.card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:6px;margin-bottom:6px}
.card-name{font-weight:700;font-size:13px;line-height:1.3;color:var(--text)}
.card-sub{font-size:10px;color:var(--text3);margin-top:1px;font-family:var(--mono)}
.card-signal{font-size:11px;color:var(--text2);line-height:1.5;margin-bottom:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.card-foot{display:flex;align-items:center;justify-content:space-between;padding-top:6px;border-top:1px solid var(--border)}
.card-recruiter{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--text3)}
.overdue-flag{font-size:9px;color:var(--red);font-family:var(--mono);font-weight:700;display:flex;align-items:center;gap:3px}
.next-action{font-size:9px;color:var(--text3);font-family:var(--mono)}

/* ── LIST ── */
.list-view{display:flex;flex-direction:column;gap:3px}
.list-hdr{display:grid;grid-template-columns:44px 1fr 90px 80px 90px 80px 100px 90px;gap:10px;padding:6px 14px;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);font-family:var(--mono)}
.list-row{display:grid;grid-template-columns:44px 1fr 90px 80px 90px 80px 100px 90px;gap:10px;padding:10px 14px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);cursor:pointer;transition:all .12s;align-items:center}
.list-row:hover{border-color:var(--border2);background:var(--surface2)}
.list-row.overdue{border-left:3px solid var(--red)}
.lco{font-weight:700;font-size:12px}
.lsub{font-size:10px;color:var(--text3);font-family:var(--mono)}

/* ── SÉQUENCE / MESSAGES ── */
.seq-type-tabs{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:4px}
.seq-type-tab{font-size:10px;font-weight:500;padding:4px 10px;border-radius:20px;border:1px solid var(--border);background:var(--surface2);color:var(--text2);cursor:pointer;font-family:var(--font);transition:all .12s;display:flex;align-items:center;gap:5px;position:relative}
.seq-type-tab:hover{border-color:var(--border2);color:var(--text)}
.seq-type-tab.active{background:var(--text);border-color:var(--text);color:#fff}
.seq-sent-dot{width:6px;height:6px;border-radius:50%;background:var(--green);flex-shrink:0}
.seq-msg-box{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px}
.seq-msg-text{font-size:12px;line-height:1.7;color:var(--text);white-space:pre-wrap;min-height:60px}
.seq-msg-edit{width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);font-size:12px;padding:10px;border-radius:var(--radius-sm);font-family:var(--font);resize:vertical;outline:none;line-height:1.7;transition:border .15s;min-height:90px}
.seq-msg-edit:focus{border-color:var(--border2)}
.seq-char-count{font-size:9px;font-family:var(--mono);color:var(--text3);text-align:right;margin-top:3px}
.seq-char-count.over{color:var(--red);font-weight:700}
.seq-actions{display:flex;align-items:center;gap:6px;margin-top:8px;flex-wrap:wrap}
.seq-generating{display:flex;align-items:center;gap:8px;font-size:11px;color:var(--text3);padding:14px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm)}
.seq-dot{width:6px;height:6px;border-radius:50%;background:var(--yellow);animation:pulse 1s infinite}
.seq-empty{font-size:11px;color:var(--text3);font-style:italic;padding:6px 0;line-height:1.6}
.seq-canal{font-size:10px;font-family:var(--mono);color:var(--text3);background:var(--surface3);border:1px solid var(--border);padding:2px 8px;border-radius:20px}

/* ── OVERLAY / FICHE ── */
.overlay{position:fixed;inset:0;background:rgba(26,26,24,.45);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px}
.fiche{background:var(--surface);border:1px solid var(--border);border-radius:12px;width:100%;max-width:740px;max-height:92vh;overflow-y:auto;box-shadow:var(--shadow-lg);display:flex;flex-direction:column}
.fiche-hdr{padding:20px 24px 14px;border-bottom:1px solid var(--border);position:sticky;top:0;background:var(--surface);z-index:10}
.fiche-hdr-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:12px}
.fiche-co{font-size:20px;font-weight:700;line-height:1.2;color:var(--text)}
.fiche-sub{font-size:12px;color:var(--text2);margin-top:3px;font-family:var(--mono)}
.fiche-pills{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.fpill{font-size:10px;color:var(--text2);background:var(--surface2);border:1px solid var(--border);padding:3px 10px;border-radius:20px;font-family:var(--mono)}

.fiche-body{padding:20px 24px;display:flex;flex-direction:column;gap:16px}
.fsec{display:flex;flex-direction:column;gap:8px}
.fsec-hdr{display:flex;align-items:center;justify-content:space-between}
.fsec-title{font-size:9px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--text3);font-family:var(--mono)}
.divider{height:1px;background:var(--border)}

.ctx-box{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 12px;font-size:12px;line-height:1.7;color:var(--text2)}
.ctx-box.accent{background:var(--yellow-bg);border-color:var(--yellow-dim);color:var(--text)}
.ctx-edit{width:100%;min-height:70px;background:var(--bg);border:1px solid var(--border);color:var(--text);font-size:12px;padding:10px;border-radius:var(--radius-sm);font-family:var(--font);resize:vertical;outline:none;line-height:1.7;transition:border .15s}
.ctx-edit:focus{border-color:var(--border2)}

/* Status selector */
.status-row{display:flex;gap:5px;flex-wrap:wrap}
.s-opt{font-size:10px;font-weight:600;padding:5px 11px;border-radius:20px;border:1px solid var(--border);cursor:pointer;color:var(--text3);background:var(--surface2);transition:all .12s;font-family:var(--font)}
.s-opt:hover{border-color:var(--border2);color:var(--text)}
.s-opt.a-new{background:var(--surface3);border-color:var(--border2);color:var(--text2)}
.s-opt.a-contacted{background:var(--blue-bg);border-color:var(--blue);color:var(--blue)}
.s-opt.a-replied{background:var(--cyan-bg);border-color:var(--cyan);color:var(--cyan)}
.s-opt.a-meeting{background:var(--yellow-bg);border-color:var(--yellow);color:#92610a}
.s-opt.a-signed{background:var(--green-bg);border-color:var(--green);color:var(--green);font-weight:700}
.s-opt.a-no_fit{background:var(--red-bg);border-color:var(--red);color:var(--red)}
.s-opt.a-archived{background:var(--surface3);border-color:var(--border2);color:var(--text3)}

/* Contact fields */
.cf{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.cf-lbl{font-size:10px;color:var(--text3);width:60px;flex-shrink:0;font-family:var(--mono);font-weight:500}
.cf-inp{flex:1;background:var(--bg);border:1px solid var(--border);color:var(--text);font-size:12px;padding:5px 9px;border-radius:var(--radius-sm);font-family:var(--font);outline:none;transition:border .15s}
.cf-inp:focus{border-color:var(--border2)}
.cf-inp::placeholder{color:var(--text3)}

/* Action log */
.log-list{display:flex;flex-direction:column;gap:4px;max-height:200px;overflow-y:auto}
.log-entry{display:flex;gap:8px;align-items:flex-start;padding:7px 10px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm)}
.log-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:4px}
.log-dot.action-note{background:var(--border2)}
.log-dot.action-contacted{background:var(--blue)}
.log-dot.action-replied{background:var(--cyan)}
.log-dot.action-meeting{background:var(--yellow)}
.log-dot.action-signed{background:var(--green)}
.log-dot.action-no_fit{background:var(--red)}
.log-text{flex:1;font-size:11px;color:var(--text2);line-height:1.5}
.log-date{font-size:9px;color:var(--text3);font-family:var(--mono);white-space:nowrap;margin-top:1px}
.log-add{display:flex;gap:6px;align-items:flex-end}
.log-inp{flex:1;background:var(--bg);border:1px solid var(--border);color:var(--text);font-size:12px;padding:6px 10px;border-radius:var(--radius-sm);font-family:var(--font);outline:none;transition:border .15s}
.log-inp:focus{border-color:var(--border2)}
.log-inp::placeholder{color:var(--text3)}

/* Relance */
.relance-row{display:flex;align-items:center;gap:8px}
.relance-inp{background:var(--bg);border:1px solid var(--border);color:var(--text);font-size:12px;padding:5px 9px;border-radius:var(--radius-sm);font-family:var(--font);outline:none;transition:border .15s}
.relance-inp:focus{border-color:var(--border2)}
.overdue-tag{font-size:10px;color:var(--red);font-family:var(--mono);font-weight:700;padding:3px 8px;background:var(--red-bg);border-radius:20px;border:1px solid var(--red-dim)}

/* Fiche footer */
.fiche-foot{padding:12px 24px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--surface2);border-radius:0 0 12px 12px;position:sticky;bottom:0}
.saved-ok{font-size:10px;color:var(--green);font-family:var(--mono);font-weight:600;opacity:0;transition:opacity .3s}
.saved-ok.show{opacity:1}

/* Import modal */
.import-modal{background:var(--surface);border:1px solid var(--border);border-radius:12px;width:100%;max-width:680px;max-height:88vh;overflow-y:auto;box-shadow:var(--shadow-lg);padding:24px;display:flex;flex-direction:column;gap:14px}
.import-title{font-size:16px;font-weight:700;color:var(--text)}
.import-sub{font-size:12px;color:var(--text2);line-height:1.6}
.import-format{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;font-size:10px;font-family:var(--mono);color:var(--text2);line-height:1.8;white-space:pre-wrap;max-height:180px;overflow-y:auto}
.import-area{width:100%;min-height:200px;background:var(--bg);border:1.5px solid var(--border);color:var(--text);font-size:12px;padding:10px;border-radius:var(--radius-sm);font-family:var(--mono);resize:vertical;outline:none;line-height:1.6;transition:border .15s}
.import-area:focus{border-color:var(--border2)}
.import-area::placeholder{color:var(--text3)}
.import-error{font-size:11px;color:var(--red);background:var(--red-bg);border:1px solid var(--red-dim);border-radius:var(--radius-sm);padding:7px 10px;font-family:var(--mono)}

.signal-chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}.signal-chip{font-size:10px;font-weight:500;padding:3px 10px;border-radius:20px;border:1px solid var(--border);background:var(--surface2);color:var(--text2);cursor:pointer;font-family:var(--font);transition:all .12s;line-height:1.5}
.signal-chip:hover{border-color:var(--border2);color:var(--text);background:var(--surface3)}
.signal-chip.active{background:var(--yellow);border-color:var(--yellow);color:var(--text);font-weight:600}

/* Add form */
.add-modal{background:var(--surface);border:1px solid var(--border);border-radius:12px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;box-shadow:var(--shadow-lg);display:flex;flex-direction:column}
.add-modal-hdr{padding:18px 22px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.add-modal-title{font-size:15px;font-weight:700;color:var(--text)}
.add-modal-body{padding:18px 22px;display:flex;flex-direction:column;gap:14px}
.add-modal-foot{padding:12px 22px;border-top:1px solid var(--border);background:var(--surface2);border-radius:0 0 12px 12px;display:flex;gap:8px;justify-content:flex-end}
.field{display:flex;flex-direction:column;gap:5px}
.field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.field label{font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);font-family:var(--mono)}
.field input,.field select,.field textarea{background:var(--bg);border:1px solid var(--border);color:var(--text);font-size:12px;padding:7px 10px;border-radius:var(--radius-sm);font-family:var(--font);outline:none;transition:border .15s;width:100%}
.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--border2)}
.field input::placeholder,.field textarea::placeholder{color:var(--text3)}
.field textarea{resize:vertical;min-height:60px;line-height:1.6}
.score-slider-wrap{display:flex;align-items:center;gap:10px}
.score-slider{flex:1;accent-color:var(--yellow)}
.score-preview{font-size:13px;font-weight:700;font-family:var(--mono);width:36px;text-align:center}

/* Sync badge */
.sync-badge{font-size:10px;font-family:var(--mono);padding:3px 9px;border-radius:20px;display:flex;align-items:center;gap:4px;border:1px solid}
.sync-badge.ok{background:var(--green-bg);color:var(--green);border-color:var(--green-dim)}
.sync-badge.err{background:var(--red-bg);color:var(--red);border-color:var(--red-dim)}
.sync-badge.loading{background:var(--surface2);color:var(--text3);border-color:var(--border)}
.date-badge{font-size:10px;color:var(--text3);font-family:var(--mono);background:var(--surface2);padding:3px 9px;border-radius:20px;border:1px solid var(--border)}

/* Empty */
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;text-align:center;gap:10px}
.empty-icon{font-size:36px}
.empty-title{font-size:14px;font-weight:700;color:var(--text)}
.empty-sub{font-size:12px;color:var(--text3);max-width:320px;line-height:1.6}

/* Score bar */
.score-bar{height:2px;border-radius:1px;margin-top:5px;background:var(--border)}
.score-bar.hot{background:var(--red)}
.score-bar.warm{background:var(--yellow)}
.score-bar.watch{background:var(--border2)}

/* Recruiter colors */
.rc-tiago{background:#1A1A18;color:#fff}
.rc-laurent{background:#F5C842;color:#1A1A18}
.rc-guillaume{background:#2D6A4F;color:#fff}
.rc-thomas{background:#2B6CB0;color:#fff}
.rc-default{background:var(--surface3);color:var(--text3)}
`;

/* ─── CONSTANTS ─────────────────────────────────────────────────────────── */
const TIER = s => s >= 75 ? "hot" : s >= 50 ? "warm" : "watch";

const STATUS_LABELS = {
  new: "À traiter",
  contacted: "Contacté",
  replied: "Répondu",
  meeting: "RDV",
  signed: "Signé",
  no_fit: "No fit",
  archived: "Archivé",
};

const KANBAN_COLS = ["new", "contacted", "replied", "meeting", "signed"];

const RECRUITERS = ["Tiago", "Laurent", "Guillaume", "Thomas"];

const RECRUITER_CLASS = {
  Tiago: "rc-tiago", Laurent: "rc-laurent", Guillaume: "rc-guillaume", Thomas: "rc-thomas"
};

const EXAMPLE_JSON = `[
  {
    "company": "Naboo",
    "location": "Paris",
    "sector": "SaaS Événementiel B2B",
    "size": "180 sal.",
    "type": "startup",
    "score": 92,
    "signals": "levée de fonds",
    "signal_details": "Série B 70M$ fev 2026. Objectif 200→300 col. fin 2026.",
    "score_reasons": "Levée très récente|Objectif +100 recrutements|Recours cabinets confirmé",
    "company_context": "Plateforme SaaS événementiel B2B. A déjà fait appel à des cabinets.",
    "contact_role": "Head of People",
    "contact_name": "À identifier",
    "accroche": "Votre Série B + objectif 200→300 col. — c'est le type de volume où Konekt intervient."
  }
]`;

/* ─── HELPERS ───────────────────────────────────────────────────────────── */
function isOverdue(p) {
  if (!p.next_action_date) return false;
  return new Date(p.next_action_date) < new Date();
}

function fmtDate(d) {
  if (!d) return null;
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function recruiterInitials(name) {
  if (!name) return "?";
  return name.slice(0, 2).toUpperCase();
}

function parseLog(raw) {
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

/* ─── SUB-COMPONENTS ────────────────────────────────────────────────────── */
function StatusBadge({ s }) {
  return <span className={`badge b-${s}`}>{STATUS_LABELS[s] || s}</span>;
}

function RecruiterDot({ name, size = 20 }) {
  const cls = RECRUITER_CLASS[name] || "rc-default";
  return (
    <div className={`recruiter-dot ${cls}`} style={{ width: size, height: size, fontSize: size * .4 }} title={name}>
      {recruiterInitials(name)}
    </div>
  );
}

function ScoreBadge({ score }) {
  const t = TIER(score);
  return <span className={`score-badge sb-${t}`}>{score}</span>;
}

/* ─── KANBAN CARD ───────────────────────────────────────────────────────── */
function KanbanCard({ p, onClick }) {
  const t = TIER(p.score);
  const overdue = isOverdue(p);
  return (
    <div className={`card ${overdue ? "overdue" : ""}`} onClick={() => onClick(p)}>
      <div className={`card-stripe ${p.status === "signed" ? "signed" : t}`} />
      <div className="card-top">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="card-name">{p.company}</div>
          <div className="card-sub">{p.location}{p.sector ? ` · ${p.sector}` : ""}</div>
        </div>
        <ScoreBadge score={p.score} />
      </div>
      {p.signal_details && <div className="card-signal">{p.signal_details}</div>}
      <div className={`score-bar ${t}`} style={{ width: `${p.score}%` }} />
      <div className="card-foot">
        <div className="card-recruiter">
          {p.assigned_to
            ? <><RecruiterDot name={p.assigned_to} /><span>{p.assigned_to}</span></>
            : <span style={{ color: "var(--text3)", fontStyle: "italic" }}>Non assigné</span>
          }
        </div>
        {overdue
          ? <span className="overdue-flag">⚠ Relance due</span>
          : p.next_action_date
            ? <span className="next-action">📅 {fmtDate(p.next_action_date)}</span>
            : null
        }
      </div>
    </div>
  );
}

/* ─── SEQUENCE D'APPROCHE ───────────────────────────────────────────────── */
const MSG_TYPES = [
  { key: "connexion",  label: "Connexion LinkedIn", canal: "LinkedIn • 300 car. max", maxChars: 300,
    prompt: `Tu es recruteur tech (cabinet Konekt/Skalr), tu prospectes des entreprises pour leur proposer tes services.
Écris une note de connexion LinkedIn. RÈGLES ABSOLUES :
- 300 caractères MAX (compte-les précisément, c'est une limite technique LinkedIn)
- 1ère phrase = fait vérifiable sur l'entreprise, pas un compliment
- Ton pair-à-pair, naturel, pas corporate
- Zéro "Je serais ravi", "opportunité", "synergie", "impressionné"
- Pas de bullet points ni de gras
- 1 seule question en fin de message
- Ne pas citer le nom du cabinet` },

  { key: "message_li", label: "Message LinkedIn", canal: "LinkedIn • déjà connectés", maxChars: 600,
    prompt: `Tu es recruteur tech (cabinet Konekt/Skalr), tu envoies un message LinkedIn à quelqu'un déjà dans ton réseau.
RÈGLES :
- 400-600 caractères
- Accroche sur un fait précis de l'entreprise
- Présente brièvement ce que fait Konekt/Skalr (recrutement tech pour startups/scaleups)
- Propose un échange concret (call 20 min, question directe)
- Ton direct, humain, pas de formule froide` },

  { key: "inmail",    label: "InMail LinkedIn", canal: "LinkedIn InMail", maxChars: 600,
    prompt: `Tu es recruteur tech (cabinet Konekt/Skalr), tu envoies un InMail LinkedIn.
RÈGLES :
- 400-600 caractères
- Accroche sur un fait précis et récent de l'entreprise
- Mentionne Konekt/Skalr et ce que vous apportez concrètement
- Une question ou proposition d'échange en fin
- Pas de "Je me permets de vous contacter"` },

  { key: "email",     label: "Email", canal: "Email direct", maxChars: 800,
    prompt: `Tu es recruteur tech (cabinet Konekt/Skalr), tu envoies un email de prospection.
RÈGLES :
- Objet court et factuel (pas de clickbait)
- Corps : 5-7 lignes max
- Accroche sur un signal concret de l'entreprise
- Présente Konekt/Skalr en 1 phrase
- Propose un call de 20 min ou une question directe
- Signature : Prénom, Konekt
- Pas de "J'espère que ce mail vous trouve bien"` },

  { key: "relance",   label: "Relance", canal: "Même canal • 1 phrase", maxChars: 200,
    prompt: `Tu es recruteur, tu relances quelqu'un qui n'a pas répondu.
RÈGLES :
- 1-2 phrases MAX, 200 caractères max
- Pas de répétition du pitch
- Donne une sortie facile ("dis-le moi, c'est utile aussi")
- Ton décontracté
- Pas de "J'espère que ce message vous trouve bien"` },

  { key: "breakup",   label: "Breakup", canal: "Dernier message", maxChars: 200,
    prompt: `Tu es recruteur, c'est ton dernier message de prospection.
RÈGLES :
- 150 caractères max
- Court, respectueux, sans culpabilisation
- Laisse une porte ouverte
- Pas d'insistance` },

  { key: "custom",    label: "Message libre", canal: "Au choix", maxChars: 9999,
    prompt: `Tu es recruteur tech (cabinet Konekt/Skalr). Génère un message de prospection adapté au contexte de cette entreprise. Ton naturel, factuel, direct.` },
];

function Sequence({ prospect, onSave }) {
  const stored = (() => { try { return JSON.parse(prospect.sequence_data || "{}"); } catch { return {}; } })();
  const [data, setData]         = useState(stored);
  const [typeKey, setTypeKey]   = useState("connexion");
  const [generating, setGenerating] = useState(false);
  const [editing, setEditing]   = useState(false);
  const [copied, setCopied]     = useState(false);
  const [error, setError]       = useState("");

  const msgType = MSG_TYPES.find(t => t.key === typeKey);
  const currentMsg = data[typeKey]?.msg || "";
  const sentAt     = data[typeKey]?.sentAt;

  const persistData = async (newData) => {
    setData(newData);
    await onSave({ ...prospect, sequence_data: JSON.stringify(newData) });
  };

  const generate = async () => {
    setGenerating(true);
    setEditing(false);
    setError("");

    const context = `Entreprise : ${prospect.company}
Secteur : ${prospect.sector || "—"}
Taille : ${prospect.size || "—"}
Ville : ${prospect.location || "France"}
Signal : ${prospect.signals || "—"}
Détail signal : ${prospect.signal_details || "—"}
Contact : ${prospect.contact_name ? `${prospect.contact_name}${prospect.contact_role ? `, ${prospect.contact_role}` : ""}` : "non identifié"}
Contexte : ${prospect.company_context || prospect.notes || "—"}`;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: msgType.prompt,
          context: `Entreprise : ${prospect.company}
Secteur : ${prospect.sector || "—"}
Taille : ${prospect.size || "—"}
Ville : ${prospect.location || "France"}
Signal : ${prospect.signals || "—"}
Détail signal : ${prospect.signal_details || "—"}
Contact : ${prospect.contact_name ? `${prospect.contact_name}${prospect.contact_role ? `, ${prospect.contact_role}` : ""}` : "non identifié"}
Contexte : ${prospect.company_context || prospect.notes || "—"}`,
        }),
      });
      const json = await res.json();
      if (json.error) { setError(json.error); setGenerating(false); return; }
      const msg = json.msg || "";
      const newData = { ...data, [typeKey]: { ...data[typeKey], msg } };
      setData(newData);
      setEditing(true);
    } catch (e) {
      setError("Erreur réseau");
    }
    setGenerating(false);
  };

  const saveEdit = (val) => {
    const newData = { ...data, [typeKey]: { ...data[typeKey], msg: val } };
    setData(newData);
    persistData(newData);
  };

  const copy = () => {
    navigator.clipboard.writeText(currentMsg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const markSent = async () => {
    const newData = { ...data, [typeKey]: { ...data[typeKey], sentAt: new Date().toISOString() } };
    await persistData(newData);
  };

  const charCount  = currentMsg.length;
  const maxChars   = msgType?.maxChars || 9999;
  const overLimit  = maxChars < 9999 && charCount > maxChars;

  return (
    <div className="fsec">
      <div className="fsec-title">Messages d'approche</div>

      {/* Type selector */}
      <div className="seq-type-tabs">
        {MSG_TYPES.map(t => (
          <button key={t.key}
            className={`seq-type-tab ${typeKey === t.key ? "active" : ""}`}
            onClick={() => { setTypeKey(t.key); setEditing(false); }}>
            {t.label}
            {data[t.key]?.sentAt && <span className="seq-sent-dot" title="Envoyé" />}
          </button>
        ))}
      </div>

      {/* Canal + date envoi */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "8px 0" }}>
        <span className="seq-canal">📤 {msgType.canal}</span>
        {sentAt && <span style={{ fontSize: 9, color: "var(--green)", fontFamily: "var(--mono)" }}>✓ Envoyé le {fmtDate(sentAt)}</span>}
      </div>

      {/* Message area */}
      {generating ? (
        <div className="seq-generating"><div className="seq-dot" />Génération en cours...</div>
      ) : !currentMsg ? (
        <div className="seq-empty">Clique sur "Générer" pour créer un message basé sur le contexte de cette fiche, ou écris directement.</div>
      ) : editing ? (
        <>
          <textarea className="seq-msg-edit" value={currentMsg} onChange={e => saveEdit(e.target.value)} />
          {maxChars < 9999 && (
            <div className={`seq-char-count ${overLimit ? "over" : ""}`}>
              {charCount} / {maxChars} car.{overLimit ? " ⚠ trop long" : ""}
            </div>
          )}
        </>
      ) : (
        <div className="seq-msg-box"><div className="seq-msg-text">{currentMsg}</div></div>
      )}

      {error && <div style={{ fontSize: 11, color: "var(--red)", fontFamily: "var(--mono)", padding: "6px 0" }}>⚠ {error}</div>}

      {/* Actions */}
      <div className="seq-actions">
        <button className="btn btn-primary btn-sm" onClick={generate} disabled={generating}>
          {generating ? "..." : currentMsg ? "↺ Regénérer" : "✦ Générer"}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => { if (!currentMsg) saveEdit(" "); setEditing(!editing); }}>
          {editing ? "Aperçu" : "Écrire / modifier"}
        </button>
        {currentMsg && !generating && (
          <>
            <button className="btn btn-ghost btn-sm" onClick={copy}>
              {copied ? "✓ Copié !" : "Copier"}
            </button>
            {!sentAt && (
              <button className="btn btn-ghost btn-sm" onClick={markSent}
                style={{ marginLeft: "auto", color: "var(--green)", borderColor: "var(--green-dim)" }}>
                ✓ Marquer envoyé
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ─── FICHE ─────────────────────────────────────────────────────────────── */
function Fiche({ prospect: init, onClose, onSave, onDelete }) {
  const [p, setP] = useState(init);
  const [editCtx, setEditCtx] = useState(false);
  const [logInput, setLogInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const upd = (k, v) => setP(prev => ({ ...prev, [k]: v }));
  const log = parseLog(p.action_log);

  const save = async () => {
    setSaving(true);
    await onSave(p);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addLog = () => {
    if (!logInput.trim()) return;
    const entry = {
      date: new Date().toISOString(),
      text: logInput.trim(),
      type: "note",
      author: p.assigned_to || "—",
    };
    const newLog = JSON.stringify([entry, ...log]);
    upd("action_log", newLog);
    setLogInput("");
  };

  const changeStatus = (newStatus) => {
    const entry = {
      date: new Date().toISOString(),
      text: `Statut → ${STATUS_LABELS[newStatus]}`,
      type: newStatus,
      author: p.assigned_to || "—",
    };
    const newLog = JSON.stringify([entry, ...log]);
    setP(prev => ({ ...prev, status: newStatus, action_log: newLog }));
  };

  const overdue = isOverdue(p);
  const reasons = typeof p.score_reasons === "string"
    ? p.score_reasons.split("|").filter(Boolean)
    : (p.score_reasons || []);

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="fiche">
        {/* Header */}
        <div className="fiche-hdr">
          <div className="fiche-hdr-top">
            <div>
              <div className="fiche-co">{p.company}</div>
              <div className="fiche-sub">{p.sector}{p.location ? ` · ${p.location}` : ""}{p.size ? ` · ${p.size}` : ""}</div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
              <ScoreBadge score={p.score} />
              <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
            </div>
          </div>
          <div className="fiche-pills">
            <StatusBadge s={p.status} />
            {p.assigned_to && <span className="fpill">👤 {p.assigned_to}</span>}
            {p.brief_date && <span className="fpill">📋 Brief {p.brief_date}</span>}
            {overdue && <span className="overdue-tag">⚠ Relance dépassée</span>}
          </div>
        </div>

        <div className="fiche-body">
          {/* Statut */}
          <div className="fsec">
            <div className="fsec-title">Statut pipeline</div>
            <div className="status-row">
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <button key={k} className={`s-opt ${p.status === k ? `a-${k}` : ""}`}
                  onClick={() => changeStatus(k)}>{v}</button>
              ))}
            </div>
          </div>

          <div className="divider" />

          {/* Assignation + Relance */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="fsec">
              <div className="fsec-title">Recruteur assigné</div>
              <select className="cf-inp" value={p.assigned_to || ""} onChange={e => upd("assigned_to", e.target.value)}>
                <option value="">— Non assigné</option>
                {RECRUITERS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="fsec">
              <div className="fsec-title">Prochaine relance</div>
              <div className="relance-row">
                <input type="date" className="relance-inp" value={p.next_action_date || ""}
                  onChange={e => upd("next_action_date", e.target.value)} />
                {overdue && <span className="overdue-tag">Dépassée</span>}
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Séquence d'approche */}
          <Sequence prospect={p} onSave={async (updated) => { await onSave(updated); setP(updated); }} />

          <div className="divider" />

          {/* Historique */}
          <div className="fsec">
            <div className="fsec-title">Historique des actions ({log.length})</div>
            <div className="log-add">
              <input className="log-inp" placeholder="Ajouter une note, retour d'appel..."
                value={logInput} onChange={e => setLogInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addLog()} />
              <button className="btn btn-primary btn-sm" onClick={addLog}>+ Ajouter</button>
            </div>
            {log.length > 0 && (
              <div className="log-list">
                {log.map((entry, i) => (
                  <div key={i} className="log-entry">
                    <div className={`log-dot action-${entry.type}`} />
                    <div className="log-text">
                      {entry.text}
                      {entry.author && entry.author !== "—" && <span style={{ color: "var(--text3)" }}> — {entry.author}</span>}
                    </div>
                    <div className="log-date">{fmtDate(entry.date)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="divider" />

          {/* Score */}
          <div className="fsec">
            <div className="fsec-title">Pourquoi ce score</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <ScoreBadge score={p.score} />
              <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
                {reasons.map((r, i) => (
                  <div key={i} style={{ fontSize: 11, color: "var(--text2)", display: "flex", gap: 6 }}>
                    <span style={{ color: "var(--green)", fontFamily: "var(--mono)", fontSize: 10 }}>↑</span>
                    {r}
                  </div>
                ))}
              </div>
            </div>
            {p.signal_details && <div className="ctx-box">{p.signal_details}</div>}
          </div>

          <div className="divider" />

          {/* Contexte */}
          <div className="fsec">
            <div className="fsec-hdr">
              <div className="fsec-title">Contexte société</div>
              <button className="btn btn-ghost btn-xs" onClick={() => setEditCtx(!editCtx)}>
                {editCtx ? "Fermer" : "Éditer"}
              </button>
            </div>
            {editCtx
              ? <textarea className="ctx-edit" value={p.company_context || ""}
                  onChange={e => upd("company_context", e.target.value)} />
              : <div className="ctx-box">{p.company_context || <span style={{ color: "var(--text3)" }}>Clique sur Éditer pour ajouter un contexte.</span>}</div>
            }
          </div>

          {p.accroche && (
            <>
              <div className="divider" />
              <div className="fsec">
                <div className="fsec-title">💬 Accroche recommandée</div>
                <div className="ctx-box accent">"{p.accroche}"</div>
              </div>
            </>
          )}

          <div className="divider" />

          {/* Contact */}
          <div className="fsec">
            <div className="fsec-title">Contact à approcher</div>
            <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: 12 }}>
              <div className="cf">
                <span className="cf-lbl">Nom</span>
                <input className="cf-inp" placeholder="Prénom Nom" value={p.contact_name || ""}
                  onChange={e => upd("contact_name", e.target.value)} />
              </div>
              <div className="cf">
                <span className="cf-lbl">Rôle</span>
                <input className="cf-inp" placeholder="Head of People, DRH..." value={p.contact_role || ""}
                  onChange={e => upd("contact_role", e.target.value)} />
              </div>
              <div className="cf">
                <span className="cf-lbl">LinkedIn</span>
                <input className="cf-inp" placeholder="URL profil LinkedIn" value={p.contact_linkedin || ""}
                  onChange={e => upd("contact_linkedin", e.target.value)} />
              </div>
              <div className="cf" style={{ marginBottom: 0 }}>
                <span className="cf-lbl">Email</span>
                <input className="cf-inp" placeholder="prenom.nom@société.fr" value={p.contact_email || ""}
                  onChange={e => upd("contact_email", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Notes */}
          <div className="fsec">
            <div className="fsec-title">Notes libres</div>
            <textarea className="ctx-edit" style={{ minHeight: 60 }}
              placeholder="Retours d'appel, observations, contexte..."
              value={p.notes || ""} onChange={e => upd("notes", e.target.value)} />
          </div>
        </div>

        {/* Footer */}
        <div className="fiche-foot">
          <button className="btn btn-danger btn-sm"
            onClick={() => { if (window.confirm("Supprimer ce prospect ?")) { onDelete(p.id); onClose(); } }}>
            Supprimer
          </button>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className={`saved-ok ${saved ? "show" : ""}`}>✓ Sauvegardé</span>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>Fermer</button>
            <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
              {saving ? "..." : "Sauvegarder"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ADD MODAL ─────────────────────────────────────────────────────────── */
function AddModal({ onClose, onAdd }) {
  const today = new Date().toLocaleDateString("fr-FR");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    company: "", location: "Paris", sector: "", size: "",
    type: "startup", score: 70, signals: "offres IT actives",
    signal_details: "", contact_name: "", contact_role: "",
    contact_linkedin: "", contact_email: "",
    assigned_to: "", notes: "",
    status: "new", action_log: "[]", next_action_date: "",
    brief_date: today,
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const t = TIER(form.score);

  const submit = async () => {
    if (!form.company.trim()) return;
    setSaving(true);
    await onAdd(form);
    setSaving(false);
    onClose();
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="add-modal">
        <div className="add-modal-hdr">
          <div className="add-modal-title">+ Ajouter un prospect</div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="add-modal-body">
          {/* Société */}
          <div className="field">
            <label>Nom de la société *</label>
            <input placeholder="ex: Naboo" value={form.company} onChange={e => set("company", e.target.value)} autoFocus />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Ville</label>
              <input placeholder="Paris" value={form.location} onChange={e => set("location", e.target.value)} />
            </div>
            <div className="field">
              <label>Type</label>
              <select value={form.type} onChange={e => set("type", e.target.value)}>
                <option value="startup">Startup</option>
                <option value="scaleup">Scaleup</option>
                <option value="PME tech">PME tech</option>
                <option value="licorne">Licorne</option>
                <option value="grand groupe">Grand groupe</option>
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Secteur</label>
              <input placeholder="ex: SaaS B2B, Fintech..." value={form.sector} onChange={e => set("sector", e.target.value)} />
            </div>
            <div className="field">
              <label>Taille</label>
              <input placeholder="ex: ~50 sal." value={form.size} onChange={e => set("size", e.target.value)} />
            </div>
          </div>

          {/* Score */}
          <div className="field">
            <label>Score de priorité</label>
            <div className="score-slider-wrap">
              <input type="range" className="score-slider" min={10} max={99} value={form.score}
                onChange={e => set("score", Number(e.target.value))} />
              <span className={`score-preview sb-${t}`}>{form.score}</span>
            </div>
          </div>

          {/* Signal */}
          <div className="field">
            <label>Signal principal</label>
            <input
              placeholder="Tape ou choisis ci-dessous..."
              value={form.signals}
              onChange={e => set("signals", e.target.value)}
            />
            <div className="signal-chips">
              {[
                "Levée de fonds","Offres IT actives","Nomination DRH/CTO",
                "Croissance équipe","Post LinkedIn recrutement","Nouveau client stratégique",
                "Expansion internationale","Restructuration","IPO / pré-IPO",
                "Rachat / acquisition","Nouveau CTO / CPO","Passage à l'échelle",
                "PME tech en croissance","ESN niche","Recommandation réseau",
              ].map(s => (
                <button
                  key={s}
                  type="button"
                  className={`signal-chip ${form.signals === s ? "active" : ""}`}
                  onClick={() => set("signals", form.signals === s ? "" : s)}
                >{s}</button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Détail du signal</label>
            <textarea placeholder="Ex: Série B 15M€ annoncée en mars 2026. Objectif +30 recrutements."
              value={form.signal_details} onChange={e => set("signal_details", e.target.value)} />
          </div>

          {/* Contact */}
          <div style={{ height: 1, background: "var(--border)" }} />
          <div className="field-row">
            <div className="field">
              <label>Nom du contact</label>
              <input placeholder="Prénom Nom" value={form.contact_name} onChange={e => set("contact_name", e.target.value)} />
            </div>
            <div className="field">
              <label>Rôle</label>
              <input placeholder="Head of People, DRH..." value={form.contact_role} onChange={e => set("contact_role", e.target.value)} />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Assigner à</label>
              <select value={form.assigned_to} onChange={e => set("assigned_to", e.target.value)}>
                <option value="">— Non assigné</option>
                {RECRUITERS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Statut initial</label>
              <select value={form.status} onChange={e => set("status", e.target.value)}>
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>

          <div className="field">
            <label>Notes</label>
            <textarea placeholder="Contexte, source, observations..."
              value={form.notes} onChange={e => set("notes", e.target.value)} />
          </div>
        </div>

        <div className="add-modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={submit} disabled={saving || !form.company.trim()}>
            {saving ? "Ajout..." : "Ajouter le prospect"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── IMPORT MODAL ──────────────────────────────────────────────────────── */
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
        status: "new", notes: "", contact_linkedin: "", contact_email: "",
        brief_date: today, assigned_to: "", action_log: "[]", next_action_date: "",
        ...p,
        signals: Array.isArray(p.signals) ? p.signals.join("|") : (p.signals || ""),
        score_reasons: Array.isArray(p.score_reasons) ? p.score_reasons.join("|") : (p.score_reasons || ""),
      }));
      onImport(enriched);
    } catch {
      setError("JSON invalide — vérifie la syntaxe.");
    }
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="import-modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div className="import-title">📥 Importer un brief</div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="import-sub">
          Colle ici le JSON du brief Claude. Les prospects sont importés dans Supabase et visibles par toute l'équipe instantanément.
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className={`btn btn-sm ${mode === "json" ? "btn-primary" : "btn-ghost"}`} onClick={() => setMode("json")}>Coller mon brief</button>
          <button className={`btn btn-sm ${mode === "example" ? "btn-primary" : "btn-ghost"}`} onClick={() => setMode("example")}>Voir le format</button>
        </div>
        {mode === "example"
          ? <div className="import-format">{EXAMPLE_JSON}</div>
          : <textarea className="import-area" placeholder="Colle ici le JSON du brief Claude..."
              value={json} onChange={e => setJson(e.target.value)} />
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

/* ─── MAIN APP ──────────────────────────────────────────────────────────── */
export default function App() {
  const [prospects, setProspects] = useState([]);
  const [syncStatus, setSyncStatus] = useState("loading");
  const [view, setView] = useState("kanban");
  const [filter, setFilter] = useState("active");
  const [recruiterFilter, setRecruiterFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    loadProspects();
    const channel = supabase.channel("prospects-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "prospects" }, loadProspects)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const loadProspects = async () => {
    setSyncStatus("loading");
    const { data, error } = await supabase.from("prospects").select("*").order("score", { ascending: false });
    if (error) { setSyncStatus("err"); }
    else { setProspects(data || []); setSyncStatus("ok"); }
  };

  const handleAdd = async (prospect) => {
    await supabase.from("prospects").insert(prospect);
    await loadProspects();
  };

  const handleImport = async (newProspects) => {
    setImporting(true);
    for (const p of newProspects) {
      const { data: existing } = await supabase.from("prospects").select("id").ilike("company", p.company).single();
      if (existing) {
        await supabase.from("prospects").update({
          score: p.score, signals: p.signals, signal_details: p.signal_details,
          score_reasons: p.score_reasons, brief_date: p.brief_date, type: p.type,
          sector: p.sector, location: p.location, size: p.size,
          accroche: p.accroche, company_context: p.company_context,
          contact_name: p.contact_name, contact_role: p.contact_role,
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

  /* ── FILTERING ── */
  const base = prospects
    .filter(p => {
      if (filter === "active") return !["archived", "no_fit"].includes(p.status);
      if (filter === "overdue") return isOverdue(p) && !["archived", "no_fit"].includes(p.status);
      if (filter === "unassigned") return !p.assigned_to && p.status === "new";
      if (filter === "signed") return p.status === "signed";
      if (filter === "archived") return ["archived", "no_fit"].includes(p.status);
      return true;
    })
    .filter(p => recruiterFilter === "all" || p.assigned_to === recruiterFilter)
    .filter(p => !search || (p.company || "").toLowerCase().includes(search.toLowerCase())
      || (p.location || "").toLowerCase().includes(search.toLowerCase())
      || (p.sector || "").toLowerCase().includes(search.toLowerCase()));

  /* ── STATS ── */
  const active = prospects.filter(p => !["archived", "no_fit"].includes(p.status));
  const overdueCount = active.filter(isOverdue).length;
  const signedCount = prospects.filter(p => p.status === "signed").length;
  const contactedCount = prospects.filter(p => ["contacted", "replied", "meeting"].includes(p.status)).length;
  const convRate = active.length ? Math.round((signedCount / active.length) * 100) : 0;
  const unassigned = prospects.filter(p => !p.assigned_to && p.status === "new").length;

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  /* ── SIDEBAR ITEMS ── */
  const sidebarItems = [
    { k: "active", icon: "📋", label: "Tous actifs", count: active.length },
    { k: "unassigned", icon: "🆕", label: "À assigner", count: unassigned, urgent: unassigned > 0 },
    { k: "overdue", icon: "⚠", label: "Relances dues", count: overdueCount, urgent: overdueCount > 0 },
    { k: "signed", icon: "✅", label: "Signés", count: signedCount },
    { k: "archived", icon: "📦", label: "Archivés / No fit", count: prospects.filter(p => ["archived", "no_fit"].includes(p.status)).length },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={handleImport} importing={importing} />}
        {showAdd && <AddModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
        {selected && <Fiche prospect={selected} onClose={() => setSelected(null)} onSave={saveFiche} onDelete={deletePros} />}

        {/* Header */}
        <div className="hdr">
          <div className="logo">
            Konekt
            <span className="logo-tag">Radar</span>
          </div>
          <div className="hdr-right">
            <div className={`sync-badge ${syncStatus}`}>
              {syncStatus === "ok" && "● Live"}
              {syncStatus === "loading" && "○ Sync..."}
              {syncStatus === "err" && "✕ Erreur"}
            </div>
            <div className="date-badge">{today}</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowImport(true)}>📥 Importer JSON</button>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Ajouter</button>
          </div>
        </div>

        <div className="layout">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="sb-section">
              <div className="sb-label">Pipeline</div>
              {sidebarItems.map(({ k, icon, label, count, urgent }) => (
                <div key={k} className={`nav-item ${filter === k ? "active" : ""}`} onClick={() => setFilter(k)}>
                  <div className="nav-item-left">
                    <span>{icon}</span>
                    <span>{label}</span>
                  </div>
                  <span className={`nav-count ${urgent ? "urgent" : ""}`}>{count}</span>
                </div>
              ))}
            </div>

            <div className="sb-section">
              <div className="sb-label">Par recruteur</div>
              <div className={`nav-item ${recruiterFilter === "all" ? "active" : ""}`} onClick={() => setRecruiterFilter("all")}>
                <div className="nav-item-left"><span>👥</span><span>Toute l'équipe</span></div>
                <span className="nav-count">{active.length}</span>
              </div>
              {RECRUITERS.map(r => {
                const cnt = active.filter(p => p.assigned_to === r).length;
                return (
                  <div key={r} className={`nav-item ${recruiterFilter === r ? "active" : ""}`} onClick={() => setRecruiterFilter(r)}>
                    <div className="nav-item-left">
                      <RecruiterDot name={r} size={16} />
                      <span>{r}</span>
                    </div>
                    <span className="nav-count">{cnt}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="content">
            {/* Stats bar */}
            <div className="stats-bar">
              <div className="stat-card">
                <div className="stat-n" style={{ color: "var(--blue)" }}>{active.length}</div>
                <div className="stat-lbl">Prospects actifs</div>
              </div>
              <div className="stat-card">
                <div className="stat-n" style={{ color: "var(--amber)" }}>{contactedCount}</div>
                <div className="stat-lbl">En discussion</div>
              </div>
              <div className="stat-card">
                <div className="stat-n" style={{ color: overdueCount > 0 ? "var(--red)" : "var(--text3)" }}>{overdueCount}</div>
                <div className="stat-lbl">Relances dues</div>
              </div>
              <div className="stat-card">
                <div className="stat-n" style={{ color: "var(--green)" }}>{signedCount}</div>
                <div className="stat-lbl">Signés</div>
              </div>
              <div className="stat-card">
                <div className="stat-n" style={{ color: "var(--purple)" }}>{convRate}%</div>
                <div className="stat-lbl">Taux conversion</div>
                <div className="stat-sub">{signedCount}/{active.length}</div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="toolbar">
              <div className="view-switch">
                <button className={`vsw ${view === "kanban" ? "on" : ""}`} onClick={() => setView("kanban")}>Kanban</button>
                <button className={`vsw ${view === "list" ? "on" : ""}`} onClick={() => setView("list")}>Liste</button>
              </div>
              <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="sel" value={recruiterFilter} onChange={e => setRecruiterFilter(e.target.value)}>
                <option value="all">Toute l'équipe</option>
                {RECRUITERS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            {/* Board */}
            {base.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">🎯</div>
                <div className="empty-title">Aucun prospect ici</div>
                <div className="empty-sub">
                  {filter === "unassigned" ? "Tous les prospects sont assignés 👏" : "Importe un brief ou change les filtres."}
                </div>
                {filter === "active" && <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Ajouter un prospect</button>}
              </div>
            ) : view === "kanban" ? (
              <div className="kanban-wrap">
                <div className="kanban-board">
                  {KANBAN_COLS.map(status => {
                    const cards = base.filter(p => p.status === status);
                    return (
                      <div key={status} className="k-col">
                        <div className={`k-hdr s-${status}`}>
                          <span>{STATUS_LABELS[status]}</span>
                          <span>{cards.length}</span>
                        </div>
                        {cards.length === 0
                          ? <div style={{ padding: "20px 10px", textAlign: "center", color: "var(--text3)", fontSize: 11, fontStyle: "italic" }}>Vide</div>
                          : cards.map(p => <KanbanCard key={p.id} p={p} onClick={setSelected} />)
                        }
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="list-view">
                <div className="list-hdr">
                  <span>SCORE</span><span>SOCIÉTÉ</span><span>STATUT</span>
                  <span>RECRUTEUR</span><span>SECTEUR</span><span>TAILLE</span>
                  <span>RELANCE</span><span>ACTIONS</span>
                </div>
                {base.map(p => (
                  <div key={p.id} className={`list-row ${isOverdue(p) ? "overdue" : ""}`} onClick={() => setSelected(p)}>
                    <ScoreBadge score={p.score} />
                    <div><div className="lco">{p.company}</div><div className="lsub">📍 {p.location}</div></div>
                    <StatusBadge s={p.status} />
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      {p.assigned_to ? <><RecruiterDot name={p.assigned_to} size={18} /><span style={{ fontSize: 11, color: "var(--text2)" }}>{p.assigned_to}</span></> : <span style={{ color: "var(--text3)", fontSize: 11, fontStyle: "italic" }}>—</span>}
                    </div>
                    <span style={{ fontSize: 11, color: "var(--text2)" }}>{p.sector || "—"}</span>
                    <span style={{ fontSize: 11, color: "var(--text3)" }}>{p.size || "—"}</span>
                    <span style={{ fontSize: 11, color: isOverdue(p) ? "var(--red)" : "var(--text3)", fontFamily: "var(--mono)" }}>
                      {p.next_action_date ? fmtDate(p.next_action_date) : "—"}
                    </span>
                    <span style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)" }}>
                      {parseLog(p.action_log).length} actions
                    </span>
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
