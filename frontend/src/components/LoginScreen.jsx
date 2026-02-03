import { useState } from "react";
import { FaDollarSign, FaLock, FaEnvelope, FaUser, FaChartLine, FaShieldAlt } from "react-icons/fa";
import { toast } from "sonner";

export function LoginScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Por favor ingrese su correo o número de celular");
      return;
    }
    
    if (!password) {
      toast.error("Por favor ingrese su contraseña");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (isLogin) {
        if (password === "admin") {
          toast.success("Bienvenido Administrador");
          onLogin("admin", email);
        } else {
          toast.success("Bienvenido Usuario");
          onLogin("user", email);
        }
      } else {
        toast.success("Registro exitoso. Iniciando sesión...");
        setTimeout(() => {
          onLogin("user", email);
        }, 500);
      }
      setIsLoading(false);
    }, 500);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Por favor ingrese su correo electrónico");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      toast.success("Se ha enviado un enlace de recuperación a tu correo electrónico");
      setIsLoading(false);
      setIsForgotPassword(false);
      setEmail("");
    }, 1000);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Columna izquierda - Imagen y descripción */}
        <div className="hidden md:flex flex-col items-center justify-center">
          <div className="mb-8">
            <div className="p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-blue-600 to-blue-800 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
              <FaDollarSign className="text-6xl text-white" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 tracking-tight">
              Sistema de Gestión Financiera
            </h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-md leading-relaxed">
              Controla tus multas bancarias, ingresos y egresos desde una plataforma segura y profesional
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaChartLine className="text-blue-600 text-xl" />
              </div>
              <span className="text-gray-700">Análisis en tiempo real</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaShieldAlt className="text-green-600 text-xl" />
              </div>
              <span className="text-gray-700">Protección de datos</span>
            </div>
          </div>
        </div>

        {/* Columna derecha - Formulario */}
        <div className="w-full max-w-md mx-auto">
          {/* Header para móvil */}
          <div className="text-center mb-8 md:hidden">
            <div className="flex justify-center mb-4">
              <div className="p-5 rounded-2xl shadow-xl bg-gradient-to-br from-blue-600 to-blue-800">
                <FaDollarSign className="text-3xl text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Sistema Financiero</h1>
          </div>

          {/* Tarjeta del formulario */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {isForgotPassword ? "Recuperar contraseña" : (isLogin ? "Bienvenido de nuevo" : "Crear cuenta nueva")}
              </h2>
              <p className="text-gray-600">
                {isForgotPassword 
                  ? "Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña"
                  : (isLogin 
                    ? "Accede a tu cuenta para gestionar multas y transacciones" 
                    : "Regístrate para comenzar a gestionar tus finanzas")}
              </p>
            </div>

            {/* Formulario de olvidar contraseña */}
            {isForgotPassword ? (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FaEnvelope className="text-lg" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Correo electrónico"
                      className="w-full h-12 pl-12 pr-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
                </button>

                <div className="text-center pt-4">
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition-colors"
                    onClick={backToLogin}
                  >
                    ← Volver al inicio de sesión
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      {isLogin ? <FaEnvelope className="text-lg" /> : <FaUser className="text-lg" />}
                    </div>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Correo electrónico o número de celular"
                      className="w-full h-12 pl-12 pr-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FaLock className="text-lg" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Contraseña"
                      className="w-full h-12 pl-12 pr-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {!isLogin && (
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaLock className="text-lg" />
                      </div>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmar contraseña"
                        className="w-full h-12 pl-12 pr-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  )}
                </div>

                {isLogin && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition-colors"
                      onClick={showForgotPassword}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading 
                    ? (isLogin ? "Iniciando sesión..." : "Registrando...") 
                    : (isLogin ? "Iniciar sesión" : "Registrarse")}
                </button>

                <div className="text-center pt-4">
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition-colors"
                    onClick={toggleMode}
                  >
                    {isLogin 
                      ? "¿No tienes cuenta? Regístrate aquí" 
                      : "¿Ya tienes cuenta? Inicia sesión"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex items-center justify-center gap-3 text-gray-500 text-sm">
              <div className="w-4 h-0.5 bg-gray-300"></div>
              <span>Plataforma de Gestión de Multas y Transacciones</span>
              <div className="w-4 h-0.5 bg-gray-300"></div>
            </div>
            
            <div className="flex items-center justify-center gap-2 md:hidden">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800">
                <FaDollarSign className="text-lg text-white" />
              </div>
              <span className="text-gray-700 font-medium">Sistema Financiero</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}