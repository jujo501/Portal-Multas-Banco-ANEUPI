import { useState, useEffect } from "react";
import { Toaster } from "sonner"; 
import AccionistasAneupiPortal from "./components/AccionistasAneupiPortal";
import { LoginScreen } from "./components/LoginScreen";

function App() {
 
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); 
  };

  
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <>
      {/* Componente de Notificaciones Global */}
      <Toaster position="top-right" richColors />

      {/* Lógica del Semáforo */}
      {!user ? (
        
        <LoginScreen onLogin={handleLogin} />
      ) : (
        
        <AccionistasAneupiPortal 
          usuarioLogueado={user} 
          onLogout={handleLogout} 
        />
      )}
    </>
  );
}

export default App;