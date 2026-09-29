import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import DocumentsPage from "./pages/DocumentsPage";
import AdminPage from "./pages/AdminPage";

// ── Sidebar nav icon ─────────────────────────────────────────────────────────
function NavIcon({ to, title, active, children }) {
  return (
    <Link
      to={to}
      className={`relative w-[42px] h-[42px] rounded-[11px] flex items-center justify-center transition-colors duration-150 group
        ${active
          ? "bg-blue-100 text-blue-600"
          : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
        }`}
    >
      {/* Active indicator bar */}
      {active && (
        <span className="absolute -left-5 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 rounded-r" />
      )}
      {children}
      {/* Tooltip */}
      <span className="absolute left-[52px] top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-20">
        {title}
      </span>
    </Link>
  );
}

// ── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-[84px] bg-white border-r border-slate-100 flex flex-col items-center py-5 flex-shrink-0">
      {/* Logo */}
      <div className="w-[42px] h-[42px] bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg mb-7 select-none">
        D
      </div>

      {/* Primary nav */}
      <nav className="flex flex-col gap-1.5 flex-1">
        {/* Dashboard (decorative) */}
        <NavIcon to="/documents" title="Dashboard" active={false}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        </NavIcon>

        {/* Learning (decorative) */}
        <NavIcon to="/documents" title="Learning" active={false}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/>
          </svg>
        </NavIcon>

        {/* Documents — intern page */}
        <NavIcon to="/documents" title="My Documents" active={pathname === "/documents"}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z"/>
          </svg>
        </NavIcon>

        {/* Admin — staff page */}
        <NavIcon to="/admin" title="Staff Admin" active={pathname === "/admin"}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="4" width="12" height="17" rx="2"/>
            <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/>
            <path d="M9 11h6M9 15h6"/>
          </svg>
        </NavIcon>

        {/* Progress (decorative) */}
        <NavIcon to="/documents" title="Progress" active={false}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 17 9 11 13 15 21 6"/><polyline points="15 6 21 6 21 12"/>
          </svg>
        </NavIcon>

        {/* Profile (decorative) */}
        <NavIcon to="/documents" title="Profile" active={false}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/>
          </svg>
        </NavIcon>
      </nav>

      {/* Bottom controls */}
      <div className="flex flex-col gap-1.5 pt-4 mt-2 border-t border-slate-100 w-full items-center">
        <button
          title="Toggle dark mode"
          className="w-[42px] h-[42px] rounded-[11px] flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.5A8.5 8.5 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5Z"/>
          </svg>
        </button>
        <button
          title="Log out"
          className="w-[42px] h-[42px] rounded-[11px] flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </aside>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/documents" replace />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
}
