'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { Project, ProjectData, Todo } from '@/lib/typings';
import { createProject, getAllProject } from '@/services/project-service';

export default function WorkSpaceDashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeProject, setActiveProject] = useState('all');
  const [showParticles, setShowParticles] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [userData, setUserData] = useState({ name: 'Alex Rodríguez', email: 'alex@ejemplo.com' });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCreateProyect, setShowCreateProyect] = useState<boolean>(false);
  const [dataProject, setDataProject] = useState<ProjectData>({
    name: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    setShowParticles(true);

    // Datos de ejemplo
    setTodos([
      { id: 1, text: 'Revisar documentación del proyecto', completed: true, priority: 'high', dueDate: '2023-10-15', tags: ['Trabajo', 'Urgente'] },
      { id: 2, text: 'Preparar presentación para equipo', completed: false, priority: 'high', dueDate: '2023-10-18', tags: ['Trabajo'] },
      { id: 3, text: 'Reunión con equipo de desarrollo', completed: false, priority: 'medium', dueDate: '2023-10-20', tags: ['Reunión'] },
      { id: 4, text: 'Actualizar base de datos', completed: false, priority: 'medium', dueDate: '2023-10-22', tags: ['Tarea técnica'] },
      { id: 5, text: 'Enviar reporte mensual', completed: true, priority: 'low', dueDate: '2023-10-10', tags: ['Administración'] }
    ]);

    getProjects();

    // Actualizar la hora cada minuto
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      const newTask = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        priority: 'medium' as const,
        tags: []
      };

      setTodos([newTask, ...todos]);
      setNewTodo('');
      showNotificationMessage('Tarea agregada correctamente');
    }
  };

  const toggleTodo = (id: number) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);

    const task = todos.find(t => t.id === id);
    if (task) {
      showNotificationMessage(`Tarea ${!task.completed ? 'completada' : 'marcada como pendiente'}`);
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
    showNotificationMessage('Tarea eliminada');
  };

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const highPriorityCount = todos.filter(todo => todo.priority === 'high' && !todo.completed).length;

  const filteredTodos = todos.filter(todo => {
    const statusMatch = activeTab === 'all' ||
      (activeTab === 'completed' && todo.completed) ||
      (activeTab === 'active' && !todo.completed);

    const projectMatch = activeProject === 'all' ||
      (activeProject === 'high' && todo.priority === 'high') ||
      (todo.tags && todo.tags.includes(activeProject));

    return statusMatch && projectMatch;
  });

  const handleCreateProject = async () => {
    setIsLoading(true);
    setError('');

    if (!dataProject) return;
    try {
      await createProject(dataProject)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Error creando el proyecto');
    } finally {
      setIsLoading(false);
    }
  };

  const getProjects = async () => {
    setIsLoading(true);
    setError('');
  
    try {
      const response = await getAllProject();
      const projects = response.products || response; 
      
      // Add default values for missing properties
      const projectsWithDefaults = projects.map(project => ({
        ...project,
        color: project.color || '#5ab9ea',
        taskCount: project.taskCount || 0
      }));
      
      setProjects(projectsWithDefaults);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Error mostrando los proyectos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1a26] to-[#0f1a27] text-white flex">
      <Head>
        <title>Dashboard | Taskly</title>
        <meta name="description" content="Espacio de trabajo de Taskly" />
      </Head>

      {/* Efecto de partículas */}
      <div className="fixed inset-0 overflow-hidden z-0">
        {showParticles && (
          <>
            {[...Array(30)].map((_, i) => (
              <div
                key={`particle-${i}`}  // Fixed key with unique prefix
                className="absolute rounded-full bg-white animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
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

      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative w-64 bg-[#0e1a26]/95 lg:bg-[#0e1a26]/80 backdrop-blur-md border-r border-[#2a3a4a] p-6 flex flex-col z-50 lg:z-10
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Botón de cerrar sidebar en móvil */}
        <button
          className="lg:hidden absolute top-4 right-4 text-[#a9c7d8] hover:text-white"
          onClick={() => setIsSidebarOpen(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-[#1a2a3a] flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5ab9ea]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb]">
            Taskly
          </h1>
        </div>

        <div className="mb-8">
          <div className="text-xs font-semibold text-[#5a7a8c] mb-3 uppercase tracking-wider">Espacios de trabajo</div>
          <div className="space-y-2">
            <button className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 ${activeProject === 'all' ? 'bg-[#5ab9ea] text-[#0e1a26]' : 'hover:bg-[#1a2a3a]'}`}
              onClick={() => setActiveProject('all')}>
              Todos los proyectos
            </button>
            <button className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 ${activeProject === 'high' ? 'bg-[#5ab9ea] text-[#0e1a26]' : 'hover:bg-[#1a2a3a]'}`}
              onClick={() => setActiveProject('high')}>
              Prioridad alta
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="text-xs font-semibold text-[#5a7a8c] mb-3 uppercase tracking-wider">Mis proyectos</div>
          <div className="space-y-2">
            {projects.map(project => (
              <button
                key={project.id || `project-${project.name}`}  // Fixed key with fallback
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#1a2a3a] transition-all duration-300 flex items-center justify-between"
                onClick={() => setActiveProject(project.name)}
              >
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: project.color }}></div>
                  <span className="truncate">{project.name}</span>
                </div>
                <span className="text-xs bg-[#1a2a3a] px-2 py-1 rounded-full min-w-[2rem] flex justify-center">{project.taskCount}</span>
              </button>
            ))}
            <button
              onClick={() => setShowCreateProyect(true)}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#1a2a3a] transition-all duration-300 text-[#5ab9ea] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nuevo proyecto
            </button>
          </div>
        </div>

        <div className="mt-auto">
          <div className="p-4 bg-[#1a2a3a] rounded-lg mb-4">
            <div className="text-sm font-medium mb-2">Uso de almacenamiento</div>
            <div className="w-full bg-[#0e1a26] rounded-full h-2 mb-2">
              <div className="bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb] h-2 rounded-full" style={{ width: '35%' }}></div>
            </div>
            <div className="text-xs text-[#a9c7d8]">2.1 GB de 5 GB utilizados</div>
          </div>

          <div className="flex items-center p-3 bg-[#1a2a3a] rounded-lg">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb] flex items-center justify-center text-[#0e1a26] font-bold mr-3">
              {userData.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{userData.name}</div>
              <div className="text-xs text-[#a9c7d8] truncate">{userData.email}</div>
            </div>
            <button className="text-[#a9c7d8] hover:text-white flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-[#0e1a26]/80 backdrop-blur-md border-b border-[#2a3a4a] p-4 lg:p-6 sticky top-0 z-30">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-3 text-[#a9c7d8] hover:text-white"
                onClick={() => setIsSidebarOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold">Mi Espacio de Trabajo</h2>
                <p className="text-sm lg:text-base text-[#a9c7d8]">Bienvenido de vuelta, {userData.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="text-right hidden sm:block">
                <div className="text-lg lg:text-2xl font-bold">{currentTime}</div>
                <div className="text-xs lg:text-sm text-[#a9c7d8]">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb] flex items-center justify-center text-[#0e1a26] font-bold">
                {userData.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Estadísticas */}
        <div className="p-4 lg:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-[#1a2a3a]/50 backdrop-blur-sm border border-[#2a3a4a]/30 rounded-xl lg:rounded-2xl p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h3 className="font-semibold text-sm lg:text-base">Tareas Totales</h3>
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-[#0e1a26] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 lg:h-5 lg:w-5 text-[#5ab9ea]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-bold">{todos.length}</div>
            <div className="text-xs lg:text-sm text-[#a9c7d8] mt-1">Tareas en total</div>
          </div>

          <div className="bg-[#1a2a3a]/50 backdrop-blur-sm border border-[#2a3a4a]/30 rounded-xl lg:rounded-2xl p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h3 className="font-semibold text-sm lg:text-base">Completadas</h3>
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-[#0e1a26] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 lg:h-5 lg:w-5 text-[#7af9a9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 01118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-bold">{completedCount}</div>
            <div className="text-xs lg:text-sm text-[#a9c7d8] mt-1">Tareas finalizadas</div>
          </div>

          <div className="bg-[#1a2a3a]/50 backdrop-blur-sm border border-[#2a3a4a]/30 rounded-xl lg:rounded-2xl p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h3 className="font-semibold text-sm lg:text-base">Prioridad Alta</h3>
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-[#0e1a26] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 lg:h-5 lg:w-5 text-[#ff7eb3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-bold">{highPriorityCount}</div>
            <div className="text-xs lg:text-sm text-[#a9c7d8] mt-1">Tareas urgentes</div>
          </div>
        </div>

        {/* Panel de tareas */}
        <div className="p-4 lg:p-6">
          <div className="bg-[#1a2a3a]/80 backdrop-blur-lg rounded-2xl lg:rounded-3xl p-4 lg:p-6 border border-[#2a3a4a]/50 shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 lg:mb-6 gap-3">
              <h3 className="text-lg lg:text-xl font-bold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#5ab9ea]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Mis Tareas
              </h3>
              <div className="text-xs lg:text-sm bg-[#0e1a26] px-3 py-1 rounded-full flex items-center">
                <span className="text-[#5ab9ea]">{completedCount}</span>
                <span className="mx-1">/</span>
                <span>{todos.length}</span>
                <span className="ml-1 hidden sm:inline">completadas</span>
                <span className="ml-1 sm:hidden">comp.</span>
              </div>
            </div>

            {/* Input para nueva tarea */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Añade una nueva tarea..."
                  className="w-full bg-[#0e1a26] border border-[#2a3a4a] rounded-lg lg:rounded-xl px-4 py-2 lg:py-3 focus:outline-none focus:ring-2 focus:ring-[#5ab9ea] transition-all duration-300 placeholder-[#5a7a8c] text-sm lg:text-base"
                  onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                />
                <button
                  onClick={addTodo}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb] w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-[#0e1a26] hover:opacity-90 transition-all duration-300 shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 lg:h-5 lg:w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 lg:px-4 lg:py-2 rounded-lg text-xs lg:text-sm transition-all duration-300 ${activeTab === 'all' ? 'bg-[#5ab9ea] text-[#0e1a26]' : 'bg-[#0e1a26] hover:bg-[#1a2a3a]'}`}
              >
                Todas
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`px-3 py-1 lg:px-4 lg:py-2 rounded-lg text-xs lg:text-sm transition-all duration-300 ${activeTab === 'active' ? 'bg-[#5ab9ea] text-[#0e1a26]' : 'bg-[#0e1a26] hover:bg-[#1a2a3a]'}`}
              >
                Activas
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-3 py-1 lg:px-4 lg:py-2 rounded-lg text-xs lg:text-sm transition-all duration-300 ${activeTab === 'completed' ? 'bg-[#5ab9ea] text-[#0e1a26]' : 'bg-[#0e1a26] hover:bg-[#1a2a3a]'}`}
              >
                Completadas
              </button>
            </div>

            {/* Lista de tareas */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {filteredTodos.map(todo => (
                <div
                  key={todo.id}
                  className={`flex items-center p-3 rounded-xl transition-all duration-300 group ${todo.completed ? 'bg-[#0e1a26]/50' : 'bg-[#0e1a26] hover:bg-[#1a2a3a]'
                    }`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-all duration-300 flex-shrink-0 ${todo.completed
                      ? 'border-[#5ab9ea] bg-[#5ab9ea]'
                      : 'border-[#2a3a4a] hover:border-[#5ab9ea]'
                      }`}
                  >
                    {todo.completed && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 lg:h-4 lg:w-4 text-[#0e1a26]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm lg:text-base ${todo.completed ? 'line-through text-[#a9c7d8]' : ''} break-words`}>
                      {todo.text}
                    </span>
                    <div className="flex flex-wrap items-center mt-1 gap-2">
                      {todo.priority === 'high' && (
                        <span className="text-xs bg-[#ff7eb3]/20 text-[#ff7eb3] px-2 py-1 rounded-full">Alta prioridad</span>
                      )}
                      {todo.dueDate && (
                        <span className="text-xs bg-[#5ab9ea]/20 text-[#5ab9ea] px-2 py-1 rounded-full">
                          {new Date(todo.dueDate).toLocaleDateString('es-ES')}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-[#a9c7d8] hover:text-white transition-colors duration-300 opacity-0 group-hover:opacity-100 ml-2 flex-shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 lg:h-5 lg:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              {filteredTodos.length === 0 && (
                <div className="text-center py-8 text-[#a9c7d8]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-sm lg:text-base">No hay tareas {activeTab === 'completed' ? 'completadas' : activeTab === 'active' ? 'activas' : ''}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notificación */}
        {showNotification && (
          <div className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 bg-[#1a2a3a] border border-[#2a3a4a] text-white px-4 py-3 rounded-xl shadow-lg z-50 animate-fadeIn max-w-xs lg:max-w-sm">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#5ab9ea] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">{notificationMessage}</span>
            </div>
          </div>
        )}

        {/* Modal para crear proyecto */}
        {showCreateProyect && (
          <div className="fixed inset-0 bg-[rgba(14,26,38,0.85)] backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-[#0e1a26] to-[#132231] border-2 border-[#2a3a4a] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all duration-300 scale-95 animate-scaleIn">
              {/* Encabezado con gradiente */}
              <div className="bg-gradient-to-r from-[#2a3a4a] to-[#1a2a3a] p-5 border-b border-[#5ab9ea]/30">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-[#5ab9ea]/10 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5ab9ea]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Crear Nuevo Proyecto</h3>
                  </div>
                  <button
                    onClick={() => setShowCreateProyect(false)}
                    className="text-[#a9c7d8] hover:text-white transition-colors p-1 rounded-full hover:bg-[#2a3a4a]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-[#a9c7d8] text-sm mt-2 ml-11">Completa la información para crear un nuevo proyecto</p>
              </div>

              <div className="p-6">
                <form onSubmit={handleCreateProject}>
                  <div className="mb-5 relative">
                    <label htmlFor="projectName" className="block text-sm font-medium text-[#a9c7d8] mb-2">
                      Nombre del Proyecto
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#5ab9ea]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="projectName"
                        value={dataProject.name}
                        onChange={(e) => setDataProject({ ...dataProject, name: e.target.value })}
                        className="w-full bg-[#1a2a3a] border border-[#2a3a4a] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#5ab9ea] transition-all"
                        placeholder="Ingresa el nombre del proyecto"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6 relative">
                    <label htmlFor="projectDescription" className="block text-sm font-medium text-[#a9c7d8] mb-2">
                      Descripción
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#5ab9ea]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      </div>
                      <textarea
                        id="projectDescription"
                        value={dataProject.description}
                        onChange={(e) => setDataProject({ ...dataProject, description: e.target.value })}
                        rows={4}
                        className="w-full bg-[#1a2a3a] border border-[#2a3a4a] rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#5ab9ea] transition-all"
                        placeholder="Describe el propósito del proyecto..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateProyect(false)}
                      className="px-5 py-2.5 bg-[#1a2a3a] text-[#a9c7d8] border border-[#2a3a4a] rounded-lg hover:bg-[#2a3a4a] transition-all duration-300 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-[#5ab9ea] to-[#4ca5d5] text-[#0e1a26] font-medium rounded-lg hover:from-[#4ca5d5] hover:to-[#3e91c1] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 01118 0z" />
                      </svg>
                      Crear Proyecto
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          overflow-x: hidden;
          background-color: #0e1a26;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
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
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        /* Mejoras para móviles muy pequeños */
        @media (max-width: 340px) {
          .text-xs {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}