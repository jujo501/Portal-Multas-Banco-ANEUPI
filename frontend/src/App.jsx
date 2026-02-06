import { useState } from "react"; 
import { Toaster } from "sonner";
import { LoginScreen } from "./components/LoginScreen";

// 👉 Importa tu componente del portal
import AccionistasAneupiPortal from "./components/AccionistasAneupiPortal";

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const handleLogin = (role, email) => {
    setUserRole(role);
    setUserEmail(email);
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserEmail("");
  };

  return (
    <div className="min-h-screen">
      <Toaster richColors />

      {!userRole ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <AccionistasAneupiPortal onLogout={handleLogout} />
      )}
    </div>
  );
}
