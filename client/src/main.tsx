import { createRoot } from "react-dom/client";
import App from "./App";
import "./utils/safe-dom";
import "./index.css";

// PWA Service Worker registration
import { registerServiceWorker, setupInstallPrompt } from "./utils/registerSW";
registerServiceWorker();
setupInstallPrompt();

// Prevent browser from restoring scroll position on refresh/navigation
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

// #region agent log
fetch('http://127.0.0.1:7942/ingest/7c8dafe3-0cec-422c-8dfe-2fcdc37d2896',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ac3226'},body:JSON.stringify({sessionId:'ac3226',runId:'baseline',hypothesisId:'B',location:'client/src/main.tsx:startup',message:'client_startup',data:{href:location.href,swController:!!navigator.serviceWorker?.controller},timestamp:Date.now()})}).catch(()=>{});
try { navigator.sendBeacon?.('/api/errors/log', JSON.stringify({ kind:'startup', href:location.href, swController:!!navigator.serviceWorker?.controller, ts:Date.now() })); } catch {}
// Force at least one server-side log entry per run (helps capture evidence even when SW caches most assets)
fetch('/api/health', { credentials: 'include' }).catch(() => {});
window.addEventListener('error',(e)=>{fetch('http://127.0.0.1:7942/ingest/7c8dafe3-0cec-422c-8dfe-2fcdc37d2896',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ac3226'},body:JSON.stringify({sessionId:'ac3226',runId:'baseline',hypothesisId:'E',location:'client/src/main.tsx:window.onerror',message:'window_error',data:{msg:String(e.message||''),src:String((e as any).filename||''),line:(e as any).lineno||null,col:(e as any).colno||null},timestamp:Date.now()})}).catch(()=>{});});
window.addEventListener('error',(e)=>{try{navigator.sendBeacon?.('/api/errors/log', JSON.stringify({ kind:'window_error', msg:String((e as any).message||''), src:String((e as any).filename||''), line:(e as any).lineno||null, col:(e as any).colno||null, ts:Date.now() }));}catch{}}); 
window.addEventListener('unhandledrejection',(e)=>{fetch('http://127.0.0.1:7942/ingest/7c8dafe3-0cec-422c-8dfe-2fcdc37d2896',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ac3226'},body:JSON.stringify({sessionId:'ac3226',runId:'baseline',hypothesisId:'E',location:'client/src/main.tsx:unhandledrejection',message:'unhandled_rejection',data:{reason:String((e as any).reason||'')},timestamp:Date.now()})}).catch(()=>{});});
window.addEventListener('unhandledrejection',(e)=>{try{navigator.sendBeacon?.('/api/errors/log', JSON.stringify({ kind:'unhandled_rejection', reason:String((e as any).reason||''), ts:Date.now() }));}catch{}}); 
// #endregion

try {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error("Root element not found");
  }
  
  createRoot(root).render(<App />);
  console.log("App rendered successfully");

  // #region agent log
  fetch('http://127.0.0.1:7942/ingest/7c8dafe3-0cec-422c-8dfe-2fcdc37d2896',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ac3226'},body:JSON.stringify({sessionId:'ac3226',runId:'baseline',hypothesisId:'E',location:'client/src/main.tsx:render',message:'app_rendered',data:{domContentLoadedMs:performance.timing?performance.timing.domContentLoadedEventEnd-performance.timing.navigationStart:null},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
} catch (error) {
  console.error("Failed to render app:", error);
  document.body.innerHTML = `
    <div style="padding: 20px; background: white;">
      <h1 style="color: red;">App Loading Error</h1>
      <p>Error: ${error}</p>
    </div>
  `;

  // #region agent log
  fetch('http://127.0.0.1:7942/ingest/7c8dafe3-0cec-422c-8dfe-2fcdc37d2896',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ac3226'},body:JSON.stringify({sessionId:'ac3226',runId:'baseline',hypothesisId:'E',location:'client/src/main.tsx:catch',message:'render_failed',data:{error:String(error||'')},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
}
