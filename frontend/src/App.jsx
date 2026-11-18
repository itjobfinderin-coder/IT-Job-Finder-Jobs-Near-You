import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { GuestRoute, ProtectedRoute } from "./components/RouteGuards";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import { ROLES } from "./utils/roles";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[ROLES.CANDIDATE]} />}>
            <Route
              path="/candidate/dashboard"
              element={<DashboardPage title="Candidate Dashboard" />}
            />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[ROLES.RECRUITER]} />}>
            <Route
              path="/recruiter/dashboard"
              element={<DashboardPage title="Recruiter Dashboard" />}
            />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
