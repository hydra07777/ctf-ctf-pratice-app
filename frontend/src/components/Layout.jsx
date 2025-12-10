import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold text-cyan-400">
            CTC CTF
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {user && (
              <>
                <Link to="/upload" className="hover:text-cyan-300">
                  Upload CTF
                </Link>
                <Link to="/competitions/1" className="hover:text-cyan-300">
                  Competition #1
                </Link>
                {user.role === 'ADMIN_GENERAL' && (
                  <Link to="/admin" className="hover:text-cyan-300">
                    Admin
                  </Link>
                )}
              </>
            )}
            {!user ? (
              <>
                <Link to="/login" className="hover:text-cyan-300">
                  Login
                </Link>
                <Link to="/register" className="hover:text-cyan-300">
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="rounded border border-slate-700 px-3 py-1 text-xs hover:bg-slate-800"
              >
                Logout ({user.username})
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
