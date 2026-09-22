import { Routes, Route, Navigate, Link } from "react-router-dom";
import DocumentsPage from "./pages/DocumentsPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Simple nav so you can switch between the two pages ── */}
      <nav className="bg-white shadow-sm px-6 py-3 flex gap-6">
        <Link
          to="/documents"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Intern — Documents
        </Link>
        <Link
          to="/admin"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Staff — Admin
        </Link>
      </nav>

      <main className="p-6">
        <Routes>
          {/* Default redirect to /documents */}
          <Route path="/" element={<Navigate to="/documents" replace />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
}
