import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-sky-50 px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/login" className="mb-6 flex items-center justify-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
            <Briefcase size={20} />
          </span>
          <span className="text-left leading-tight">
            <span className="block text-lg font-semibold text-slate-900">IT Job Finder</span>
            <span className="block text-xs text-slate-500">Jobs Near You</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">{footer}</p>
      </div>
    </div>
  );
}
