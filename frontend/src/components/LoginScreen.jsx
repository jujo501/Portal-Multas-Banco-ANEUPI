import { useState } from "react";
import { FaUniversity, FaLock, FaEnvelope, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import { toast } from "sonner";
import { authService } from "../services"; 

export function LoginScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      
      const data = await authService.login({ email, password });

      const usuario = data.user || data;

      if (usuario && usuario.id) {
          toast.success(`Bienvenido, ${usuario.nombre}`);
          onLogin(usuario); 
      } else {
          toast.error("Error: No se recibieron datos del usuario.");
      }

    } catch (error) {
      console.error("Error de login:", error);
      
      toast.error(error.message || "Error de conexión");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) return toast.error("Por favor ingrese su correo");
    if (!password) return toast.error("Por favor ingrese su contraseña");

    
    if (!isLogin) {
        if (password !== confirmPassword) {
            return toast.error("Las contraseñas no coinciden");
        }
        
        toast.error("El registro público está desactivado. Contacte al Administrador.");
        return; 
    }

    setIsLoading(true);
    await handleLogin();
    setIsLoading(false);
  };
  
  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Por favor ingrese su correo electrónico");
    
    setIsLoading(true);
    setTimeout(() => {
      toast.success("Se ha enviado un enlace de recuperación a tu correo");
      setIsLoading(false);
      setIsForgotPassword(false);
      setEmail("");
    }, 1500);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const showForgotPassword = () => {
    setIsForgotPassword(true);
    setIsLogin(true);
    setEmail("");
    setPassword("");
  };

  const backToLogin = () => {
    setIsForgotPassword(false);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-aneupi-bg-tertiary via-white to-aneupi-bg-tertiary flex items-center justify-center p-4">
      <div className="w-full max-w-7xl grid lg:grid-cols-5 gap-0 items-stretch">
        
        {/* Panel izquierdo - Branding */}
        <div className="hidden lg:flex lg:col-span-2 bg-gradient-to-br from-aneupi-primary via-aneupi-primary-dark to-aneupi-primary flex-col justify-between p-12 rounded-l-3xl shadow-2xl relative overflow-hidden">
          {/* ... (Decoración de fondo) ... */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-12">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                <FaUniversity className="text-5xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Banco ANEUPI</h1>
                <p className="text-white/80 text-sm">Portal de Accionistas</p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                  Sistema de Gestión<br />de Multas
                </h2>
                <p className="text-white/90 text-lg leading-relaxed">
                  Plataforma integral para el control y seguimiento de multas aplicadas a los accionistas.
                </p>
              </div>

              <div className="space-y-4 pt-8">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-white text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Gestión Centralizada</h3>
                    <p className="text-white/80 text-sm">Control total de multas y pagos.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-white text-xl mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="text-white font-semibold mb-1">Seguridad Garantizada</h3>
                        <p className="text-white/80 text-sm">Protección de datos con estándares bancarios.</p>
                    </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-white/60 text-sm">
            © 2026 Banco ANEUPI. Todos los derechos reservados.
          </div>
        </div>

        {/* Panel derecho - Formulario */}
        <div className="lg:col-span-3 bg-white p-8 md:p-12 lg:p-16 rounded-3xl lg:rounded-l-none shadow-2xl flex items-center">
          <div className="w-full max-w-md mx-auto">
            
            {/* Logo móvil */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="p-3 bg-aneupi-primary rounded-xl">
                  <FaUniversity className="text-2xl text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-aneupi-text-primary">Banco ANEUPI</h1>
                  <p className="text-sm text-aneupi-text-muted">Portal de Accionistas</p>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-3xl font-bold text-aneupi-text-primary mb-3">
                {isForgotPassword ? "Recuperar Contraseña" : (isLogin ? "Iniciar Sesión" : "Crear Cuenta")}
              </h2>
              <p className="text-aneupi-text-secondary">
                {isForgotPassword 
                  ? "Ingresa tu correo para recibir instrucciones."
                  : (isLogin 
                    ? "Accede al portal de gestión de multas." 
                    : "Regístrate para acceder al sistema.")}
              </p>
            </div>

            {/* --- FORMULARIO --- */}
            {isForgotPassword ? (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-aneupi-text-secondary mb-2">Correo Electrónico</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-aneupi-text-muted"><FaEnvelope /></div>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" className="w-full h-14 pl-12 pr-4 text-aneupi-text-primary bg-aneupi-bg-tertiary border-2 border-aneupi-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-aneupi-primary transition-all" required disabled={isLoading} />
                  </div>
                </div>
                <button type="submit" className="w-full h-14 bg-aneupi-primary text-white font-semibold rounded-xl hover:bg-aneupi-primary-dark transition-all shadow-lg" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar Enlace"}
                </button>
                <button type="button" className="w-full text-aneupi-primary hover:text-aneupi-primary-dark font-medium transition-colors text-center mt-4" onClick={backToLogin}>
                  ← Volver al inicio de sesión
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-aneupi-text-secondary mb-2">Correo Electrónico</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-aneupi-text-muted"><FaEnvelope /></div>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@aneupi.com" className="w-full h-14 pl-12 pr-4 text-aneupi-text-primary bg-aneupi-bg-tertiary border-2 border-aneupi-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-aneupi-primary transition-all" required disabled={isLoading} />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-aneupi-text-secondary mb-2">Contraseña</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-aneupi-text-muted"><FaLock /></div>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-14 pl-12 pr-4 text-aneupi-text-primary bg-aneupi-bg-tertiary border-2 border-aneupi-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-aneupi-primary transition-all" required disabled={isLoading} />
                  </div>
                </div>

                {/* Confirm Password (SOLO SI ES REGISTRO) */}
                {!isLogin && (
                    <div>
                        <label className="block text-sm font-medium text-aneupi-text-secondary mb-2">Confirmar Contraseña</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-aneupi-text-muted"><FaLock /></div>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full h-14 pl-12 pr-4 text-aneupi-text-primary bg-aneupi-bg-tertiary border-2 border-aneupi-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-aneupi-primary transition-all" required disabled={isLoading} />
                        </div>
                    </div>
                )}

                {isLogin && (
                  <div className="flex justify-end">
                    <button type="button" className="text-aneupi-primary hover:text-aneupi-primary-dark font-medium text-sm transition-colors" onClick={showForgotPassword}>
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}

                <button type="submit" className="w-full h-14 bg-aneupi-primary text-white font-semibold rounded-xl hover:bg-aneupi-primary-dark transition-all shadow-lg disabled:opacity-50" disabled={isLoading}>
                  {isLoading ? "Validando..." : (isLogin ? "Iniciar Sesión" : "Crear Cuenta")}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-aneupi-border-light"></div></div>
                  <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-aneupi-text-muted">{isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}</span></div>
                </div>

                <button type="button" className="w-full h-14 bg-white text-aneupi-primary font-semibold rounded-xl border-2 border-aneupi-primary hover:bg-aneupi-bg-tertiary transition-all" onClick={toggleMode}>
                  {isLogin ? "Crear Nueva Cuenta" : "Iniciar Sesión"}
                </button>
              </form>
            )}

            <div className="mt-10 pt-8 border-t border-aneupi-border-light">
              <div className="flex items-center justify-center gap-2 text-aneupi-text-muted text-sm">
                <FaShieldAlt className="text-aneupi-primary" />
                <span>Conexión segura y encriptada</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}