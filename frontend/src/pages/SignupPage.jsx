import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import Alert from "../components/Alert";
import { PasswordField, TextField } from "../components/FormFields";
import { getErrorMessage, register as registerRequest } from "../services/authService";
import { ROLES } from "../utils/roles";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROLE_OPTIONS = [
  { value: ROLES.CANDIDATE, label: "Candidate", description: "I'm looking for jobs" },
  { value: ROLES.RECRUITER, label: "Recruiter", description: "I'm hiring talent" },
];

const INITIAL_VALUES = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: ROLES.CANDIDATE,
};

function validate(values) {
  const errors = {};
  const email = values.email.trim();

  if (!values.fullName.trim()) errors.fullName = "Full name is required";

  if (!email) errors.email = "Email is required";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Enter a valid email address";

  if (!values.password) errors.password = "Password is required";
  else if (values.password.length < 8) errors.password = "Password must be at least 8 characters";
  else if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) {
    errors.password = "Password must contain at least one letter and one number";
  }

  if (!values.confirmPassword) errors.confirmPassword = "Please confirm your password";
  else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!ROLE_OPTIONS.some((option) => option.value === values.role)) {
    errors.role = "Select a role";
  }

  return errors;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const email = values.email.trim().toLowerCase();
    setSubmitting(true);
    setServerError("");
    try {
      await registerRequest({
        fullName: values.fullName.trim(),
        email,
        password: values.password,
        role: values.role,
      });
      navigate("/login", {
        replace: true,
        state: { successMessage: "Account created successfully. Please log in.", email },
      });
    } catch (err) {
      const message = getErrorMessage(err, "Registration failed. Please try again.");
      if (err.response?.status === 409) {
        setFieldErrors((prev) => ({ ...prev, email: message }));
      } else {
        setServerError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join IT Job Finder to discover jobs or hire great talent."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {serverError && <Alert type="error">{serverError}</Alert>}

        <TextField
          label="Full name"
          id="fullName"
          name="fullName"
          autoComplete="name"
          placeholder="Sanjay Khan"
          value={values.fullName}
          onChange={handleChange}
          error={fieldErrors.fullName}
          disabled={submitting}
        />

        <TextField
          label="Email address"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange}
          error={fieldErrors.email}
          disabled={submitting}
        />

        <PasswordField
          label="Password"
          id="password"
          name="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={values.password}
          onChange={handleChange}
          error={fieldErrors.password}
          disabled={submitting}
        />

        <PasswordField
          label="Confirm password"
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={values.confirmPassword}
          onChange={handleChange}
          error={fieldErrors.confirmPassword}
          disabled={submitting}
        />

        <fieldset disabled={submitting}>
          <legend className="mb-1.5 text-sm font-medium text-slate-700">I am a</legend>
          <div className="grid grid-cols-2 gap-3">
            {ROLE_OPTIONS.map((option) => {
              const selected = values.role === option.value;
              return (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-lg border px-3 py-3 text-center transition ${
                    selected
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20"
                      : "border-slate-300 text-slate-600 hover:border-slate-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={selected}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="block text-sm font-semibold">{option.label}</span>
                  <span className="mt-0.5 block text-xs opacity-80">{option.description}</span>
                </label>
              );
            })}
          </div>
          {fieldErrors.role && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.role}</p>}
        </fieldset>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting && <LoaderCircle size={16} className="animate-spin" />}
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
