'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [completedCount, setCompletedCount] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showParticles, setShowParticles] = useState(false); // Nuevo estado para partículas
  const heroRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Solo renderizar partículas en el cliente
    setShowParticles(true);
    
    // Animación de entrada
    setIsVisible(true);
    
    // Datos de ejemplo
    setTodos([
      { id: 1, text: 'Crear presentación de Taskly', completed: true },
      { id: 2, text: 'Diseñar la interfaz de usuario', completed: true },
      { id: 3, text: 'Implementar efectos visuales', completed: false },
      { id: 4, text: 'Preparar demo para inversores', completed: false }
    ]);
    setCompletedCount(2);

    // Efecto de scroll
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([{
        id: Date.now(),
        text: newTodo,
        completed: false
      }, ...todos]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        const updated = {...todo, completed: !todo.completed};
        setCompletedCount(prev => updated.completed ? prev + 1 : prev - 1);
        return updated;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const deleteTodo = (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (todo?.completed) setCompletedCount(prev => prev - 1);
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = activeTab === 'completed' 
    ? todos.filter(todo => todo.completed)
    : activeTab === 'active'
      ? todos.filter(todo => !todo.completed)
      : todos;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#0e1a26] to-[#0f1a27] text-white transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Head>
        <title>Taskly | Organiza tu vida</title>
        <meta name="description" content="La aplicación de gestión de tareas más elegante del mercado" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Efecto de partículas (solo en cliente) */}
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
              onClick={() => router.push('/sign-in')}
              className="px-4 py-2 rounded-lg bg-[#1a2a3a] hover:bg-[#2a3a4a] transition-all duration-300 shadow-lg hover:shadow-[#5ab9ea]/20">
              Iniciar sesión
            </button>
            <button 
              onClick={() => router.push('/sign-up')}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb] text-[#0e1a26] font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-[#5ab9ea]/40 transform hover:-translate-y-0.5">
              Registrarse
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 relative z-10" ref={heroRef}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                <span className="block">Organiza tu vida,</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb]">
                  aumenta tu productividad
                </span>
              </h2>
              <p className="text-lg text-[#a9c7d8] max-w-xl">
                Taskly es la aplicación definitiva para gestionar tus tareas diarias. Con una interfaz elegante y funcionalidades avanzadas, transforma tu forma de trabajar.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb] text-[#0e1a26] font-bold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#5ab9ea]/30 group relative overflow-hidden">
                  <span className="relative z-10">Comenzar Gratis</span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button className="px-8 py-3 rounded-xl bg-[#1a2a3a] border border-[#2a3a4a] text-white font-bold text-lg hover:bg-[#2a3a4a] transition-all duration-300 group relative overflow-hidden">
                  <span className="relative z-10">Ver Demo</span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
              
              {/* Estadísticas */}
              <div className="flex flex-wrap gap-6 mt-12">
                <div className="flex items-center">
                  <div className="text-3xl font-bold text-[#5ab9ea]">10K+</div>
                  <div className="ml-3 text-[#a9c7d8]">Usuarios activos</div>
                </div>
                <div className="flex items-center">
                  <div className="text-3xl font-bold text-[#5ab9ea]">99%</div>
                  <div className="ml-3 text-[#a9c7d8]">Satisfacción</div>
                </div>
                <div className="flex items-center">
                  <div className="text-3xl font-bold text-[#5ab9ea]">5x</div>
                  <div className="ml-3 text-[#a9c7d8]">Más productividad</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-[#1a2a3a]/80 backdrop-blur-lg rounded-3xl p-6 border border-[#2a3a4a]/50 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#5ab9ea]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Tus Tareas
                  </h3>
                  <div className="text-sm bg-[#0e1a26] px-3 py-1 rounded-full flex items-center">
                    <span className="text-[#5ab9ea]">{completedCount}</span>
                    <span className="mx-1">/</span>
                    <span>{todos.length}</span>
                    <span className="ml-1">completadas</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      placeholder="Añade una nueva tarea..."
                      className="w-full bg-[#0e1a26] border border-[#2a3a4a] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5ab9ea] transition-all duration-300 placeholder-[#5a7a8c]"
                      onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                    />
                    <button 
                      onClick={addTodo} 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb] w-8 h-8 rounded-full flex items-center justify-center text-[#0e1a26] hover:opacity-90 transition-all duration-300 shadow-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="flex space-x-2 mb-4">
                  <button 
                    onClick={() => setActiveTab('all')} 
                    className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${activeTab === 'all' ? 'bg-[#5ab9ea] text-[#0e1a26]' : 'bg-[#0e1a26] hover:bg-[#1a2a3a]'}`}
                  >
                    Todas
                  </button>
                  <button 
                    onClick={() => setActiveTab('active')} 
                    className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${activeTab === 'active' ? 'bg-[#5ab9ea] text-[#0e1a26]' : 'bg-[#0e1a26] hover:bg-[#1a2a3a]'}`}
                  >
                    Activas
                  </button>
                  <button 
                    onClick={() => setActiveTab('completed')} 
                    className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${activeTab === 'completed' ? 'bg-[#5ab9ea] text-[#0e1a26]' : 'bg-[#0e1a26] hover:bg-[#1a2a3a]'}`}
                  >
                    Completadas
                  </button>
                </div>
                
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {filteredTodos.map(todo => (
                    <div 
                      key={todo.id} 
                      className={`flex items-center p-3 rounded-xl transition-all duration-300 group ${
                        todo.completed ? 'bg-[#0e1a26]/50' : 'bg-[#0e1a26] hover:bg-[#1a2a3a]'
                      }`}
                    >
                      <button 
                        onClick={() => toggleTodo(todo.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-all duration-300 ${
                          todo.completed 
                            ? 'border-[#5ab9ea] bg-[#5ab9ea]' 
                            : 'border-[#2a3a4a] hover:border-[#5ab9ea]'
                        }`}
                      >
                        {todo.completed && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#0e1a26]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <span className={`flex-1 ${todo.completed ? 'line-through text-[#a9c7d8]' : ''}`}>
                        {todo.text}
                      </span>
                      <button 
                        onClick={() => deleteTodo(todo.id)} 
                        className="text-[#a9c7d8] hover:text-white transition-colors duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  
                  {filteredTodos.length === 0 && (
                    <div className="text-center py-8 text-[#a9c7d8]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p>No hay tareas {activeTab === 'completed' ? 'completadas' : activeTab === 'active' ? 'activas' : ''}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Efectos de brillo */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#5ab9ea] rounded-full filter blur-3xl opacity-20 z-0 animate-pulse"></div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-[#84ceeb] rounded-full filter blur-3xl opacity-15 z-0"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 relative">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#0e1a26] to-transparent z-0"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb]">
                Características Premium
              </h2>
              <p className="text-lg text-[#a9c7d8]">
                Descubre cómo Taskly puede transformar tu productividad con herramientas diseñadas para el éxito
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
                  title: "Sincronización en Tiempo Real",
                  description: "Tus tareas se sincronizan instantáneamente en todos tus dispositivos, manteniéndote actualizado en todo momento."
                },
                {
                  icon: (
                    <div className="bg-gradient-to-br from-[#0e1a26] to-[#1a2a3a] p-4 rounded-2xl w-16 h-16 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5ab9ea]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  ),
                  title: "Seguridad Avanzada",
                  description: "Protección de grado empresarial para tus datos con encriptación de extremo a extremo."
                },
                {
                  icon: (
                    <div className="bg-gradient-to-br from-[#0e1a26] to-[#1a2a3a] p-4 rounded-2xl w-16 h-16 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5ab9ea]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  ),
                  title: "Colaboración en Equipo",
                  description: "Comparte listas, asigna tareas y coordina proyectos con tu equipo sin esfuerzo."
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-[#1a2a3a]/50 backdrop-blur-sm border border-[#2a3a4a]/30 rounded-3xl p-8 hover:border-[#5ab9ea]/50 transition-all duration-500 transform hover:-translate-y-2 group"
                >
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[#5ab9ea] transition-colors duration-300">{feature.title}</h3>
                  <p className="text-[#a9c7d8]">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Efectos de fondo */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#5ab9ea] rounded-full filter blur-[100px] opacity-10 z-0"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#84ceeb] rounded-full filter blur-[120px] opacity-10 z-0"></div>
        </section>

        {/* Testimonials */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4">Lo que dicen nuestros usuarios</h2>
              <p className="text-lg text-[#a9c7d8]">
                Descubre por qué miles de personas confían en Taskly
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "María López",
                  role: "Diseñadora UX",
                  comment: "Taskly ha revolucionado mi forma de trabajar. Ahora puedo organizar mis proyectos de manera eficiente y nunca olvido una tarea importante.",
                  rating: 5
                },
                {
                  name: "Carlos Martínez",
                  role: "Desarrollador Full Stack",
                  comment: "La sincronización entre dispositivos es impecable. Puedo empezar una tarea en mi laptop y terminarla en mi teléfono sin problemas.",
                  rating: 5
                },
                {
                  name: "Ana Rodríguez",
                  role: "Gerente de Proyectos",
                  comment: "La función de colaboración ha mejorado enormemente la productividad de mi equipo. ¡Una herramienta imprescindible!",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <div 
                  key={index} 
                  className="bg-[#1a2a3a]/50 backdrop-blur-sm border border-[#2a3a4a]/30 rounded-3xl p-8 transition-all duration-500 hover:border-[#5ab9ea]/50"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 ${i < testimonial.rating ? 'text-[#FFD700]' : 'text-[#5a7a8c]'}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[#a9c7d8] mb-6 italic">"{testimonial.comment}"</p>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-[#5ab9ea]">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-[#0e1a26] to-[#1a2a3a] border border-[#2a3a4a] rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#5ab9ea] rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#84ceeb] rounded-full filter blur-3xl opacity-10"></div>
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para transformar tu productividad?</h2>
                <p className="text-lg text-[#a9c7d8] mb-8">
                  Únete a miles de usuarios que ya están organizando sus vidas con Taskly. Totalmente gratis para empezar.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb] text-[#0e1a26] font-bold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#5ab9ea]/30 group relative overflow-hidden">
                    <span className="relative z-10">Comenzar Gratis</span>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  <button className="px-8 py-4 rounded-xl bg-[#1a2a3a] border border-[#2a3a4a] text-white font-bold text-lg hover:bg-[#2a3a4a] transition-all duration-300 group relative overflow-hidden">
                    <span className="relative z-10">Ver Demo</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
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
