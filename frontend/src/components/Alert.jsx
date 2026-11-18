import { CircleCheck, CircleX } from "lucide-react";

export default function Alert({ type = "error", children }) {
  const isSuccess = type === "success";
  const Icon = isSuccess ? CircleCheck : CircleX;

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm ${
        isSuccess
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
