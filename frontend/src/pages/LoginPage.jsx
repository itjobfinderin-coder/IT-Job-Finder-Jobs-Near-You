import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import Alert from "../components/Alert";
import { PasswordField, TextField } from "../components/FormFields";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage, login as loginRequest } from "../services/authService";
import { dashboardPathFor } from "../utils/roles";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};
  const email = values.email.trim();
  if (!email) errors.email = "Email is required";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Enter a valid email address";
  if (!values.password) errors.password = "Password is required";
  return errors;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Signup passes the new account's email and a success message via router state.
  const [values, setValues] = useState({
    email: location.state?.email || "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || "");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    setServerError("");
    try {
      const data = await loginRequest({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      login(data.token, data.user);
      navigate(dashboardPathFor(data.user.role), { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err, "Login failed. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to find jobs and manage your applications."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {successMessage && <Alert type="success">{successMessage}</Alert>}
        {serverError && <Alert type="error">{serverError}</Alert>}

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
          autoComplete="current-password"
          placeholder="Enter your password"
          value={values.password}
          onChange={handleChange}
          error={fieldErrors.password}
          disabled={submitting}
        />

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting && <LoaderCircle size={16} className="animate-spin" />}
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthLayout>
  );
}
