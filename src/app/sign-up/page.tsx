'use client'

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { signUp } from '@/services/auth-service';

export default function SigUpPage() {
  
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [showParticles, setShowParticles] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [step, setStep] = useState<number>(1); // Para formulario multipasos
  const [formDataSignUp, setFormDataSignUp] = useState({
    name: '',
    email: '',
    password: '',
    age: 0
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

  useEffect(() => {
    // Calcular fortaleza de contraseña
    if (formDataSignUp.password.length === 0) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (formDataSignUp.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(formDataSignUp.password)) strength += 1;
    if (/[0-9]/.test(formDataSignUp.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formDataSignUp.password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [formDataSignUp.password]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formDataSignUp.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formDataSignUp.name.trim().length < 6) {
      newErrors.name = 'El nombre debe tener al menos 6 caracteres';
    }
    
    if (!formDataSignUp.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formDataSignUp.email)) {
      newErrors.email = 'Ingresa un email válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formDataSignUp.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formDataSignUp.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (passwordStrength < 3) {
      newErrors.password = 'La contraseña es demasiado débil, (pa$wor@1)';
    }
    
    if (formDataSignUp.password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (!formDataSignUp.age) {
      newErrors.age = 'La edad es requerida';
    } else if (Number(formDataSignUp.age) < 13) {
      newErrors.age = 'Debes tener al menos 13 años';
    } else if (Number(formDataSignUp.age) > 120) {
      newErrors.age = 'Ingresa una edad válida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleOnSubmitSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setIsLoading(true);

    try {
      if (
        !formDataSignUp.name 
        || !formDataSignUp.email 
        || !formDataSignUp.age
        || !formDataSignUp.password
      ) {
        console.warn("Todos los datos son requeridos, debes llenar el formulario");
      }
      
      await signUp(formDataSignUp);
      router.push("/sign-in");
    } catch (error: any) {
      console.error(error.message || "Error al registrarse.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-500';
    if (passwordStrength === 2) return 'bg-red-500';
    if (passwordStrength === 4) return 'bg-yellow-500';
    if (passwordStrength === 6) return 'bg-green-500';
    return 'bg-teal-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 2) return 'Muy débil';
    if (passwordStrength === 4) return 'Débil';
    if (passwordStrength === 6) return 'Buena';
    return 'Excelente';
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
            <button 
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb] text-[#0e1a26] font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-[#5ab9ea]/40"
              onClick={() => router.push('/sign-in')}
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 relative z-10" ref={heroRef}>
          <div className="max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="block">Únete a </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb]">
                  Taskly hoy mismo
                </span>
              </h2>
              <p className="text-lg text-[#a9c7d8]">
                Organiza tu vida y aumenta tu productividad con la mejor herramienta
              </p>
            </motion.div>
            
            {/* Formulario de registro */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#1a2a3a]/80 backdrop-blur-lg rounded-3xl p-8 border border-[#2a3a4a]/50 shadow-2xl relative"
            >
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#5ab9ea] rounded-full filter blur-3xl opacity-20 z-0 animate-pulse"></div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-[#84ceeb] rounded-full filter blur-3xl opacity-15 z-0"></div>
              
              {/* Indicador de pasos */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center">
                  {[1, 2].map((s, index) => (
                    <div key={s} className="flex items-center">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          step === s 
                            ? 'border-[#5ab9ea] bg-[#5ab9ea] text-[#0e1a26]' 
                            : step > s 
                              ? 'border-[#5ab9ea] bg-[#5ab9ea]/20 text-[#5ab9ea]' 
                              : 'border-[#2a3a4a] text-[#a9c7d8]'
                        }`}
                      >
                        {s}
                      </div>
                      {index < 1 && (
                        <div className={`w-16 h-1 mx-2 ${
                          step > s + 1 
                            ? 'bg-[#5ab9ea]' 
                            : step > s 
                              ? 'bg-[#5ab9ea]/50' 
                              : 'bg-[#2a3a4a]'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <form onSubmit={handleOnSubmitSignUp} className="space-y-6">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[#a9c7d8] mb-2">
                          Nombre Completo
                        </label>
                        <div className="relative">
                          <input
                            id="name"
                            type="text"
                            value={formDataSignUp.name}
                            onChange={(e) => setFormDataSignUp({ ...formDataSignUp, name: e.target.value })}
                            className={`w-full bg-[#0e1a26] border ${
                              errors.name ? 'border-red-500' : 'border-[#2a3a4a]'
                            } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5ab9ea] transition-all duration-300 placeholder-[#5a7a8c]`}
                            placeholder="Tu nombre"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#5a7a8c]" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#a9c7d8] mb-2">
                          Correo Electrónico
                        </label>
                        <div className="relative">
                          <input
                            id="email"
                            type="email"
                            value={formDataSignUp.email}
                            onChange={(e) => setFormDataSignUp({ ...formDataSignUp, email: e.target.value })}
                            className={`w-full bg-[#0e1a26] border ${
                              errors.email ? 'border-red-500' : 'border-[#2a3a4a]'
                            } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5ab9ea] transition-all duration-300 placeholder-[#5a7a8c]`}
                            placeholder="tu@email.com"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#5a7a8c]" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                          </div>
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb] text-[#0e1a26] font-bold text-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-[#5ab9ea]/40"
                      >
                        Siguiente
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#a9c7d8] mb-2">
                          Contraseña
                        </label>
                        <div className="relative">
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={formDataSignUp.password}
                            onChange={(e) => setFormDataSignUp({ ...formDataSignUp, password: e.target.value })}
                            className={`w-full bg-[#0e1a26] border ${
                              errors.password ? 'border-red-500' : 'border-[#2a3a4a]'
                            } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5ab9ea] transition-all duration-300 placeholder-[#5a7a8c]`}
                            placeholder="••••••••"
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
                        
                        {/* Indicador de fortaleza de contraseña */}
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-[#a9c7d8]">Fortaleza de la contraseña</span>
                            <span className={`text-xs font-medium ${
                              passwordStrength === 2 ? 'text-red-500' : 
                              passwordStrength === 4 ? 'text-yellow-500' : 
                              passwordStrength >= 6? 'text-green-500' : 'text-[#a9c7d8]'
                            }`}>
                              {getPasswordStrengthText()}
                            </span>
                          </div>
                          <div className="w-full bg-[#0e1a26] h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                passwordStrength === 0 ? 'w-0' : 
                                passwordStrength === 2 ? 'w-1/4' : 
                                passwordStrength === 4 ? 'w-1/2' : 
                                passwordStrength === 6 ? 'w-3/4' : 'w-full'
                              } ${getPasswordStrengthColor()}`}
                            ></div>
                          </div>
                        </div>
                        
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#a9c7d8] mb-2">
                          Confirmar Contraseña
                        </label>
                        <div className="relative">
                          <input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full bg-[#0e1a26] border ${
                              errors.confirmPassword ? 'border-red-500' : 'border-[#2a3a4a]'
                            } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5ab9ea] transition-all duration-300 placeholder-[#5a7a8c]`}
                            placeholder="••••••••"
                          />
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="age" className="block text-sm font-medium text-[#a9c7d8] mb-2">
                          Edad
                        </label>
                        <div className="relative">
                          <input
                            id="age"
                            type="number"
                            value={formDataSignUp.age}
                            onChange={(e) => setFormDataSignUp({ ...formDataSignUp, age: Number(e.target.value) })}
                            className={`w-full bg-[#0e1a26] border ${
                              errors.age ? 'border-red-500' : 'border-[#2a3a4a]'
                            } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5ab9ea] transition-all duration-300 placeholder-[#5a7a8c]`}
                            placeholder="Tu edad"
                            min="13"
                            max="120"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5a7a8c]">
                            años
                          </div>
                        </div>
                        {errors.age && (
                          <p className="mt-1 text-sm text-red-500">{errors.age}</p>
                        )}
                      </div>

                      <div className="flex items-center">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          className="h-4 w-4 text-[#5ab9ea] focus:ring-[#5ab9ea] border-[#2a3a4a] rounded"
                          required
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-[#a9c7d8]">
                          Acepto los <a href="#" className="text-[#5ab9ea] hover:underline">términos y condiciones</a> y la <a href="#" className="text-[#5ab9ea] hover:underline">política de privacidad</a>
                        </label>
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="flex-1 px-4 py-3 rounded-xl bg-[#1a2a3a] border border-[#2a3a4a] text-white font-bold text-lg hover:bg-[#2a3a4a] transition-all duration-300"
                        >
                          Atrás
                        </button>
                        
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb] text-[#0e1a26] font-bold text-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-[#5ab9ea]/40 flex items-center justify-center"
                        >
                          {isLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#0e1a26]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Creando cuenta...
                            </>
                          ) : 'Registrarme'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-[#2a3a4a]"></div>
                <span className="mx-4 text-[#5a7a8c] text-sm">O regístrate con</span>
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
                ¿Ya tienes una cuenta?{' '}
                <a href="#" className="text-[#5ab9ea] font-medium hover:underline" onClick={() => router.push('/login')}>
                  Inicia sesión
                </a>
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
                Beneficios de unirte a Taskly
              </h2>
              <p className="text-lg text-[#a9c7d8]">
                Descubre todo lo que puedes lograr con nuestra plataforma
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <div className="bg-gradient-to-br from-[#0e1a26] to-[#1a2a3a] p-4 rounded-2xl w-16 h-16 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5ab9ea]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                  ),
                  title: "Gestión de tareas avanzada",
                  description: "Organiza tus tareas con etiquetas, prioridades y fechas límite"
                },
                {
                  icon: (
                    <div className="bg-gradient-to-br from-[#0e1a26] to-[#1a2a3a] p-4 rounded-2xl w-16 h-16 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5ab9ea]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  ),
                  title: "Calendario integrado",
                  description: "Visualiza tus tareas en un calendario interactivo"
                },
                {
                  icon: (
                    <div className="bg-gradient-to-br from-[#0e1a26] to-[#1a2a3a] p-4 rounded-2xl w-16 h-16 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5ab9ea]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  ),
                  title: "Estadísticas de productividad",
                  description: "Analiza tu rendimiento con gráficos detallados"
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