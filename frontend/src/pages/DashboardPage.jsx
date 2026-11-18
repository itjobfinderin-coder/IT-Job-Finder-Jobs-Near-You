import { useNavigate } from "react-router-dom";
import { Briefcase, LogOut, Mail, UserRound } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../utils/roles";

const ROLE_LABELS = {
  [ROLES.CANDIDATE]: "Candidate",
  [ROLES.RECRUITER]: "Recruiter",
};

export default function DashboardPage({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Briefcase size={18} />
            </span>
            <span className="font-semibold text-slate-900">IT Job Finder</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-1.5 text-sm text-slate-500">Welcome back, {user.email}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <UserRound size={16} />
              Account type
            </div>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {ROLE_LABELS[user.role] || user.role}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <Mail size={16} />
              Email
            </div>
            <p className="mt-2 break-all text-lg font-semibold text-slate-900">{user.email}</p>
          </div>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          Your account is ready. Job listings and profile features will appear here.
        </p>
      </main>
    </div>
  );
}
