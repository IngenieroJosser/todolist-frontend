'use client'

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { signIn } from '@/services/auth-service';
import Link from 'next/link';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [showParticles, setShowParticles] = useState<boolean>(false);
  const [formDataSignIn, setFormDataSignIn] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();
  
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowParticles(true);
    setIsVisible(true);
    
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOnSubmitSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const { email, password } = formDataSignIn;
    console.log("Objetos del login: ", formDataSignIn);

    try {
      const res = await signIn({ email, password });
      console.log("Respuesta del backend: ", res);
      localStorage.setItem("token", res.token);
      localStorage.setItem("userRole", res.email);
      localStorage.setItem("userName", res.name);
      // toast.success(`Hola, ${response.user.name || "Usuario"}!`);
      localStorage.setItem("user", JSON.stringify(res));

      router.push("/workspace")
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setError('');
    
    // Simular autenticación social
    setTimeout(() => {
      router.push('/dashboard');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#0e1a26] to-[#0f1a27] text-white transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Efecto de partículas */}
      <div className="fixed inset-0 overflow-hidden z-0">
        {showParticles && (
          <>
            {[...Array(50)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-white animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 8 + 2}px`,
                  height: `${Math.random() * 8 + 2}px`,
                  animationDuration: `${Math.random() * 10 + 5}s`,
                  opacity: Math.random() * 0.1 + 0.05,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0e1a26]/30 via-[#0f1a27]/10 to-[#0e1a26]"></div>
          </>
        )}
      </div>

      {/* Header flotante */}
      <header className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-500 ${isScrolled ? 'bg-[#0e1a26]/90 backdrop-blur-md border-b border-[#1a2a3a]' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#1a2a3a] flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5ab9ea]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb] tracking-tight">
              Taskly
            </h1>
          </div>
          
          <div className="flex space-x-4">
            <button 
              className="px-4 py-2 rounded-lg bg-[#1a2a3a] hover:bg-[#2a3a4a] transition-all duration-300 shadow-lg hover:shadow-[#5ab9ea]/20"
              onClick={() => router.push('/')}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 relative z-10" ref={heroRef}>
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb]">
                Bienvenido de vuelta
              </h2>
              <p className="text-lg text-[#a9c7d8]">
                Accede a tu cuenta para gestionar tus tareas y proyectos
              </p>
            </motion.div>
            
            {/* Formulario de inicio de sesión */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#1a2a3a]/80 backdrop-blur-lg rounded-3xl p-8 border border-[#2a3a4a]/50 shadow-2xl relative"
            >
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#5ab9ea] rounded-full filter blur-3xl opacity-20 z-0 animate-pulse"></div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-[#84ceeb] rounded-full filter blur-3xl opacity-15 z-0"></div>
              
              <form onSubmit={handleOnSubmitSignIn} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#a9c7d8] mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={formDataSignIn.email}
                      onChange={(e) => setFormDataSignIn({ ...formDataSignIn, email: e.target.value })}
                      className="w-full bg-[#0e1a26] border border-[#2a3a4a] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5ab9ea] transition-all duration-300 placeholder-[#5a7a8c]"
                      placeholder="tu@email.com"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#5a7a8c]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#a9c7d8] mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formDataSignIn.password}
                      onChange={(e) => setFormDataSignIn({ ...formDataSignIn, password: e.target.value })}
                      className="w-full bg-[#0e1a26] border border-[#2a3a4a] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5ab9ea] transition-all duration-300 placeholder-[#5a7a8c]"
                      placeholder="••••••••"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5a7a8c] hover:text-[#5ab9ea] transition-colors"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-[#5ab9ea] focus:ring-[#5ab9ea] border-[#2a3a4a] rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-[#a9c7d8]">
                      Recordarme
                    </label>
                  </div>
                  <a href="#" className="text-sm text-[#5ab9ea] hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-[#2a1a1a] border border-[#3a2a2a] text-[#ff8a8a] p-3 rounded-lg text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb] text-[#0e1a26] font-bold text-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-[#5ab9ea]/40 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#0e1a26]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Iniciando sesión...
                    </>
                  ) : 'Iniciar sesión'}
                </button>
              </form>

              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-[#2a3a4a]"></div>
                <span className="mx-4 text-[#5a7a8c] text-sm">O continúa con</span>
                <div className="flex-grow border-t border-[#2a3a4a]"></div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { provider: 'Google', color: '#DB4437', icon: 'M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z' },
                  { provider: 'GitHub', color: '#333', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
                  { provider: 'Twitter', color: '#1DA1F2', icon: 'M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.277-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z' }
                ].map((social, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSocialLogin(social.provider)}
                    className="py-3 rounded-xl bg-[#0e1a26] border border-[#2a3a4a] hover:bg-[#1a2a3a] transition-colors duration-300 flex items-center justify-center"
                    style={{ color: social.color }}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d={social.icon} />
                    </svg>
                  </motion.button>
                ))}
              </div>

              <div className="text-center text-[#a9c7d8] text-sm mt-8">
                ¿No tienes una cuenta?{' '}
                <Link href="/sign-up" className="text-[#5ab9ea] font-medium hover:underline">
                  Regístrate ahora
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 relative">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#0e1a26] to-transparent z-0"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4">
                ¿Por qué elegir Taskly?
              </h2>
              <p className="text-lg text-[#a9c7d8]">
                Descubre cómo Taskly puede transformar tu productividad
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <div className="bg-gradient-to-br from-[#0e1a26] to-[#1a2a3a] p-4 rounded-2xl w-16 h-16 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5ab9ea]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  ),
                  title: "Sincronización en tiempo real",
                  description: "Tus tareas se actualizan al instante en todos tus dispositivos"
                },
                {
                  icon: (
                    <div className="bg-gradient-to-br from-[#0e1a26] to-[#1a2a3a] p-4 rounded-2xl w-16 h-16 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5ab9ea]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  ),
                  title: "Seguridad garantizada",
                  description: "Protección de datos con encriptación de extremo a extremo"
                },
                {
                  icon: (
                    <div className="bg-gradient-to-br from-[#0e1a26] to-[#1a2a3a] p-4 rounded-2xl w-16 h-16 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5ab9ea]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  ),
                  title: "Colaboración en equipo",
                  description: "Comparte tareas y proyectos con tu equipo sin esfuerzo"
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#1a2a3a]/50 backdrop-blur-sm border border-[#2a3a4a]/30 rounded-3xl p-8 hover:border-[#5ab9ea]/50 transition-all duration-500 transform hover:-translate-y-2 group"
                >
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[#5ab9ea] transition-colors duration-300">{feature.title}</h3>
                  <p className="text-[#a9c7d8]">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Efectos de fondo */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#5ab9ea] rounded-full filter blur-[100px] opacity-10 z-0"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#84ceeb] rounded-full filter blur-[120px] opacity-10 z-0"></div>
        </section>
      </main>

      <footer className="border-t border-[#2a3a4a] py-12 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#0e1a26] z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#1a2a3a] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#5ab9ea]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb]">
                  Taskly
                </h3>
              </div>
              <p className="text-[#a9c7d8] mb-4">
                La herramienta definitiva para organizar tu vida y aumentar tu productividad.
              </p>
              <div className="flex space-x-4">
                {['Twitter', 'Facebook', 'Instagram', 'LinkedIn'].map((social, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className="text-[#a9c7d8] hover:text-[#5ab9ea] transition-colors duration-300"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
            
            {['Producto', 'Recursos', 'Compañía', 'Legal'].map((category, index) => (
              <div key={index}>
                <h4 className="text-lg font-semibold mb-4">{category}</h4>
                <ul className="space-y-2">
                  {['Características', 'Precios', 'Integraciones', 'Actualizaciones'].map((item, i) => (
                    <li key={i}>
                      <a href="#" className="text-[#a9c7d8] hover:text-white transition-colors duration-300">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-[#2a3a4a] mt-12 pt-6 text-center text-[#a9c7d8]">
            <p>© {new Date().getFullYear()} Taskly. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        body {
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          overflow-x: hidden;
          background-color: #0e1a26;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0e1a26;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2a3a4a;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #5ab9ea;
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}