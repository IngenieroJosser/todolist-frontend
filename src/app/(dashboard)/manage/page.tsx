'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { SystemStats, User } from '@/lib/typings';

export default function DashboardManageTasly() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    storageUsed: 0,
    storageTotal: 100,
    projects: 0,
    teams: 0
  });
  const [showParticles, setShowParticles] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setShowParticles(true);
    
    // Datos de ejemplo para usuarios
    setUsers([
      { id: 1, name: 'María López', email: 'maria@ejemplo.com', status: 'active', lastLogin: '2023-10-15T14:30:00', tasks: 12, projects: 3, role: 'user' },
      { id: 2, name: 'Carlos Martínez', email: 'carlos@ejemplo.com', status: 'active', lastLogin: '2023-10-16T09:15:00', tasks: 8, projects: 2, role: 'user' },
      { id: 3, name: 'Ana Rodríguez', email: 'ana@ejemplo.com', status: 'inactive', lastLogin: '2023-10-10T16:45:00', tasks: 5, projects: 1, role: 'user' },
      { id: 4, name: 'Pedro García', email: 'pedro@ejemplo.com', status: 'active', lastLogin: '2023-10-16T11:20:00', tasks: 15, projects: 4, role: 'moderator' },
      { id: 5, name: 'Laura Sánchez', email: 'laura@ejemplo.com', status: 'suspended', lastLogin: '2023-10-05T08:30:00', tasks: 3, projects: 1, role: 'user' },
      { id: 6, name: 'Javier Ruiz', email: 'javier@ejemplo.com', status: 'active', lastLogin: '2023-10-16T13:40:00', tasks: 20, projects: 5, role: 'user' }
    ]);

    // Estadísticas del sistema
    setStats({
      totalUsers: 1248,
      activeUsers: 892,
      totalTasks: 15673,
      completedTasks: 11245,
      storageUsed: 42.7,
      storageTotal: 100,
      projects: 567,
      teams: 123
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-400';
      case 'inactive': return 'text-yellow-400';
      case 'suspended': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-purple-500/20 text-purple-400';
      case 'moderator': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1a26] to-[#0f1a27] text-white flex">
      <Head>
        <title>Panel de Administración | Taskly</title>
        <meta name="description" content="Panel de administración de Taskly" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Efecto de partículas */}
      <div className="fixed inset-0 overflow-hidden z-0">
        {showParticles && (
          <>
            {[...Array(30)].map((_, i) => (
              <div 
                key={i}
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

      {/* Overlay para móvil cuando el sidebar está abierto */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:relative inset-y-0 left-0 w-64 bg-[#0e1a26]/90 lg:bg-[#0e1a26]/80 backdrop-blur-md border-r border-[#2a3a4a] p-6 flex flex-col z-30 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#1a2a3a] flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5ab9ea]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb]">
              Taskly Admin
            </h1>
          </div>
          <button 
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 flex items-center ${
              activeTab === 'overview' 
                ? 'bg-[#5ab9ea] text-[#0e1a26]' 
                : 'hover:bg-[#1a2a3a]'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Resumen
          </button>

          <button 
            onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 flex items-center ${
              activeTab === 'users' 
                ? 'bg-[#5ab9ea] text-[#0e1a26]' 
                : 'hover:bg-[#1a2a3a]'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Gestión de Usuarios
          </button>

          <button 
            onClick={() => { setActiveTab('analytics'); setIsSidebarOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 flex items-center ${
              activeTab === 'analytics' 
                ? 'bg-[#5ab9ea] text-[#0e1a26]' 
                : 'hover:bg-[#1a2a3a]'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </button>

          <button 
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 flex items-center ${
              activeTab === 'settings' 
                ? 'bg-[#5ab9ea] text-[#0e1a26]' 
                : 'hover:bg-[#1a2a3a]'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configuración
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-[#2a3a4a]">
          <div className="flex items-center p-3 bg-[#1a2a3a] rounded-lg">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb] flex items-center justify-center text-[#0e1a26] font-bold mr-3">
              A
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Admin User</div>
              <div className="text-xs text-[#a9c7d8]">Administrador del sistema</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto min-h-screen">
        {/* Header */}
        <header className="bg-[#0e1a26]/80 backdrop-blur-md border-b border-[#2a3a4a] p-4 md:p-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button 
                className="lg:hidden mr-3 text-gray-400 hover:text-white"
                onClick={() => setIsSidebarOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-xl md:text-2xl font-bold">Panel de Administración</h2>
                <p className="text-[#a9c7d8] text-sm md:text-base">Gestión completa del sistema Taskly</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="relative">
                <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#1a2a3a] flex items-center justify-center hover:bg-[#2a3a4a] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">3</span>
                </button>
              </div>
              <button 
                onClick={() => router.push('/')}
                className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-[#1a2a3a] hover:bg-[#2a3a4a] transition-colors flex items-center text-sm md:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden sm:inline">Volver al sitio</span>
              </button>
            </div>
          </div>
        </header>

        {/* Contenido del dashboard */}
        <div className="p-4 md:p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Estadísticas generales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-[#1a2a3a]/50 backdrop-blur-sm border border-[#2a3a4a]/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h3 className="font-semibold text-sm md:text-base">Usuarios Totales</h3>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#0e1a26] flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-[#5ab9ea]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold">{stats.totalUsers}</div>
                  <div className="text-xs md:text-sm text-[#a9c7d8] mt-1">
                    <span className="text-green-400">{stats.activeUsers} activos</span>
                  </div>
                </div>

                <div className="bg-[#1a2a3a]/50 backdrop-blur-sm border border-[#2a3a4a]/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h3 className="font-semibold text-sm md:text-base">Tareas Totales</h3>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#0e1a26] flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-[#7af9a9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold">{stats.totalTasks.toLocaleString()}</div>
                  <div className="text-xs md:text-sm text-[#a9c7d8] mt-1">
                    <span className="text-green-400">{stats.completedTasks.toLocaleString()} completadas</span>
                  </div>
                </div>

                <div className="bg-[#1a2a3a]/50 backdrop-blur-sm border border-[#2a3a4a]/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h3 className="font-semibold text-sm md:text-base">Proyectos</h3>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#0e1a26] flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-[#ff7eb3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold">{stats.projects}</div>
                  <div className="text-xs md:text-sm text-[#a9c7d8] mt-1">{stats.teams} equipos activos</div>
                </div>

                <div className="bg-[#1a2a3a]/50 backdrop-blur-sm border border-[#2a3a4a]/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h3 className="font-semibold text-sm md:text-base">Almacenamiento</h3>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#0e1a26] flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-[#ffb366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold">{stats.storageUsed}GB</div>
                  <div className="text-xs md:text-sm text-[#a9c7d8] mt-1">
                    <span className="text-blue-400">{((stats.storageUsed / stats.storageTotal) * 100).toFixed(1)}% utilizado</span>
                  </div>
                </div>
              </div>

              {/* Gráficos y actividad reciente */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-[#1a2a3a]/50 backdrop-blur-sm border border-[#2a3a4a]/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Actividad Reciente</h3>
                  <div className="space-y-3 md:space-y-4">
                    {[
                      { action: 'Nuevo usuario registrado', user: 'Laura Martínez', time: 'Hace 5 min' },
                      { action: 'Tarea completada', user: 'Carlos Ruiz', time: 'Hace 12 min' },
                      { action: 'Proyecto creado', user: 'Ana García', time: 'Hace 23 min' },
                      { action: 'Usuario eliminado', user: 'Pedro López', time: 'Hace 42 min' },
                      { action: 'Equipo actualizado', user: 'Sistema', time: 'Hace 1 h' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-[#5ab9ea] mt-2 mr-3"></div>
                        <div className="flex-1">
                          <div className="font-medium text-sm md:text-base">{activity.action}</div>
                          <div className="text-xs md:text-sm text-[#a9c7d8]">Por {activity.user} · {activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1a2a3a]/50 backdrop-blur-sm border border-[#2a3a4a]/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Distribución de Usuarios</h3>
                  <div className="h-48 md:h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#5ab9ea] flex items-center justify-center mx-auto mb-3 md:mb-4">
                        <div className="text-xl md:text-2xl font-bold">72%</div>
                      </div>
                      <p className="text-xs md:text-sm text-[#a9c7d8]">Usuarios activos este mes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usuarios recientes */}
              <div className="bg-[#1a2a3a]/50 backdrop-blur-sm border border-[#2a3a4a]/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h3 className="font-semibold text-sm md:text-base">Usuarios Recientes</h3>
                  <button className="text-xs md:text-sm text-[#5ab9ea] hover:underline">Ver todos</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-[#2a3a4a]">
                        <th className="pb-2 md:pb-3 text-left text-xs md:text-sm">Usuario</th>
                        <th className="pb-2 md:pb-3 text-left text-xs md:text-sm">Estado</th>
                        <th className="pb-2 md:pb-3 text-left text-xs md:text-sm">Último acceso</th>
                        <th className="pb-2 md:pb-3 text-left text-xs md:text-sm">Tareas</th>
                        <th className="pb-2 md:pb-3 text-left text-xs md:text-sm">Rol</th>
                        <th className="pb-2 md:pb-3 text-left text-xs md:text-sm">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.slice(0, 5).map(user => (
                        <tr key={user.id} className="border-b border-[#2a3a4a]/30">
                          <td className="py-2 md:py-3">
                            <div className="flex items-center">
                              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb] flex items-center justify-center text-[#0e1a26] font-bold text-xs md:text-sm mr-2 md:mr-3">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-xs md:text-sm">{user.name}</div>
                                <div className="text-xs text-[#a9c7d8] hidden md:block">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2 md:py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 md:py-1 rounded-full text-xs ${getStatusColor(user.status)} bg-opacity-20`}>
                              <span className="w-1.5 h-1.5 rounded-full mr-1 bg-current"></span>
                              {user.status === 'active' ? 'Activo' : user.status === 'inactive' ? 'Inactivo' : 'Suspendido'}
                            </span>
                          </td>
                          <td className="py-2 md:py-3 text-xs md:text-sm text-[#a9c7d8]">{formatDate(user.lastLogin)}</td>
                          <td className="py-2 md:py-3">
                            <div className="text-xs md:text-sm">{user.tasks} tareas</div>
                            <div className="text-xs text-[#a9c7d8] hidden md:block">{user.projects} proyectos</div>
                          </td>
                          <td className="py-2 md:py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 md:py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                              {user.role === 'admin' ? 'Admin' : user.role === 'moderator' ? 'Mod' : 'User'}
                            </span>
                          </td>
                          <td className="py-2 md:py-3">
                            <div className="flex space-x-1 md:space-x-2">
                              <button className="text-[#a9c7d8] hover:text-white" title="Editar">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button className="text-[#a9c7d8] hover:text-white" title="Eliminar">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-[#1a2a3a]/50 backdrop-blur-sm border border-[#2a3a4a]/30 rounded-xl md:rounded-2xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 gap-3">
                <h3 className="font-semibold text-sm md:text-base">Gestión de Usuarios</h3>
                <button className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb] text-[#0e1a26] font-medium hover:opacity-90 transition-all text-xs md:text-sm w-full md:w-auto">
                  + Nuevo Usuario
                </button>
              </div>
              
              <div className="mb-4 md:mb-6 flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="Buscar usuarios..." 
                    className="w-full bg-[#0e1a26] border border-[#2a3a4a] rounded-xl px-4 py-2 pl-9 md:pl-10 focus:outline-none focus:ring-2 focus:ring-[#5ab9ea] transition-all text-sm md:text-base"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 absolute left-3 top-2.5 md:top-2.5 text-[#5a7a8c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <select className="bg-[#0e1a26] border border-[#2a3a4a] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5ab9ea] text-sm md:text-base">
                  <option>Todos los estados</option>
                  <option>Activo</option>
                  <option>Inactivo</option>
                  <option>Suspendido</option>
                </select>
                
                <select className="bg-[#0e1a26] border border-[#2a3a4a] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5ab9ea] text-sm md:text-base">
                  <option>Todos los roles</option>
                  <option>Administrador</option>
                  <option>Moderador</option>
                  <option>Usuario</option>
                </select>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-[#2a3a4a]">
                      <th className="pb-2 md:pb-3 text-left text-xs md:text-sm">
                        <input type="checkbox" className="rounded bg-[#0e1a26] border-[#2a3a4a] scale-75 md:scale-100" />
                      </th>
                      <th className="pb-2 md:pb-3 text-left text-xs md:text-sm">Usuario</th>
                      <th className="pb-2 md:pb-3 text-left text-xs md:text-sm">Estado</th>
                      <th className="pb-2 md:pb-3 text-left text-xs md:text-sm">Último acceso</th>
                      <th className="pb-2 md:pb-3 text-left text-xs md:text-sm">Tareas</th>
                      <th className="pb-2 md:pb-3 text-left text-xs md:text-sm">Rol</th>
                      <th className="pb-2 md:pb-3 text-left text-xs md:text-sm">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b border-[#2a3a4a]/30 hover:bg-[#1a2a3a]/50">
                        <td className="py-2 md:py-3">
                          <input type="checkbox" className="rounded bg-[#0e1a26] border-[#2a3a4a] scale-75 md:scale-100" />
                        </td>
                        <td className="py-2 md:py-3">
                          <div className="flex items-center">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb] flex items-center justify-center text-[#0e1a26] font-bold text-xs md:text-sm mr-2 md:mr-3">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-xs md:text-sm">{user.name}</div>
                              <div className="text-xs text-[#a9c7d8] hidden md:block">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 md:py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 md:py-1 rounded-full text-xs ${getStatusColor(user.status)} bg-opacity-20`}>
                            <span className="w-1.5 h-1.5 rounded-full mr-1 bg-current"></span>
                            {user.status === 'active' ? 'Activo' : user.status === 'inactive' ? 'Inactivo' : 'Suspendido'}
                          </span>
                        </td>
                        <td className="py-2 md:py-3 text-xs md:text-sm text-[#a9c7d8]">{formatDate(user.lastLogin)}</td>
                        <td className="py-2 md:py-3">
                          <div className="text-xs md:text-sm">{user.tasks} tareas</div>
                          <div className="text-xs text-[#a9c7d8] hidden md:block">{user.projects} proyectos</div>
                        </td>
                        <td className="py-2 md:py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 md:py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                            {user.role === 'admin' ? 'Admin' : user.role === 'moderator' ? 'Mod' : 'User'}
                          </span>
                        </td>
                        <td className="py-2 md:py-3">
                          <div className="flex space-x-1 md:space-x-2">
                            <button className="text-[#a9c7d8] hover:text-white" title="Editar">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button className="text-[#a9c7d8] hover:text-white" title="Eliminar">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            <button className="text-[#a9c7d8] hover:text-white hidden md:block" title="Ver detalles">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-center mt-4 md:mt-6 space-y-3 md:space-y-0">
                <div className="text-xs md:text-sm text-[#a9c7d8]">
                  Mostrando 6 de {users.length} usuarios
                </div>
                <div className="flex space-x-2">
                  <button className="px-2 py-1 md:px-3 md:py-1 rounded-lg bg-[#0e1a26] border border-[#2a3a4a] text-xs md:text-sm disabled:opacity-50" disabled>
                    Anterior
                  </button>
                  <button className="px-2 py-1 md:px-3 md:py-1 rounded-lg bg-[#5ab9ea] text-[#0e1a26] text-xs md:text-sm">
                    1
                  </button>
                  <button className="px-2 py-1 md:px-3 md:py-1 rounded-lg bg-[#0e1a26] border border-[#2a3a4a] text-xs md:text-sm">
                    2
                  </button>
                  <button className="px-2 py-1 md:px-3 md:py-1 rounded-lg bg-[#0e1a26] border border-[#2a3a4a] text-xs md:text-sm">
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-[#1a2a3a]/50 backdrop-blur-sm border border-[#2a3a4a]/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Uso de la Plataforma</h3>
                  <div className="h-48 md:h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold mb-2">4.2h</div>
                      <div className="text-xs md:text-sm text-[#a9c7d8]">Tiempo promedio por usuario</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#1a2a3a]/50 backdrop-blur-sm border border-[#2a3a4a]/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Tareas por Estado</h3>
                  <div className="h-48 md:h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="flex flex-col md:flex-row md:items-center justify-center md:space-x-4 mb-3 md:mb-4 space-y-2 md:space-y-0">
                        <div className="flex items-center">
                          <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded mr-2"></div>
                          <span className="text-xs md:text-sm">Completadas: 72%</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 md:w-4 md:h-4 bg-yellow-500 rounded mr-2"></div>
                          <span className="text-xs md:text-sm">En progreso: 18%</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded mr-2"></div>
                          <span className="text-xs md:text-sm">Pendientes: 10%</span>
                        </div>
                      </div>
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-8 border-green-500 border-t-yellow-500 border-r-red-500 border-b-red-500 border-l-yellow-500 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1a2a3a]/50 backdrop-blur-sm border border-[#2a3a4a]/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Actividad Diaria</h3>
                <div className="h-48 md:h-64 flex items-center justify-center">
                  <div className="text-center text-[#a9c7d8]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-3 md:mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-xs md:text-sm">Gráfico de actividad diaria</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4 md:space-y-6">
              <div className="bg-[#1a2a3a]/50 backdrop-blur-sm border border-[#2a3a4a]/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Configuración General</h3>
                
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium text-sm md:text-base">Modo mantenimiento</div>
                      <div className="text-xs md:text-sm text-[#a9c7d8]">Desactiva el acceso público al sitio</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 md:w-11 md:h-6 bg-[#0e1a26] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-[#5ab9ea]"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium text-sm md:text-base">Registro de usuarios</div>
                      <div className="text-xs md:text-sm text-[#a9c7d8]">Permitir que nuevos usuarios se registren</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked />
                      <div className="w-9 h-5 md:w-11 md:h-6 bg-[#0e1a26] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-[#5ab9ea]"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium text-sm md:text-base">Notificaciones por email</div>
                      <div className="text-xs md:text-sm text-[#a9c7d8]">Enviar notificaciones a los usuarios</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked />
                      <div className="w-9 h-5 md:w-11 md:h-6 bg-[#0e1a26] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-[#5ab9ea]"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1a2a3a]/50 backdrop-blur-sm border border-[#2a3a4a]/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Límites del Sistema</h3>
                
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-2">Límite de almacenamiento por usuario (GB)</label>
                    <input type="number" className="w-full bg-[#0e1a26] border border-[#2a3a4a] rounded-xl px-3 py-2 md:px-4 md:py-2 focus:outline-none focus:ring-2 focus:ring-[#5ab9ea] transition-all text-sm md:text-base" defaultValue="5" />
                  </div>
                  
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-2">Máximo de proyectos por usuario</label>
                    <input type="number" className="w-full bg-[#0e1a26] border border-[#2a3a4a] rounded-xl px-3 py-2 md:px-4 md:py-2 focus:outline-none focus:ring-2 focus:ring-[#5ab9ea] transition-all text-sm md:text-base" defaultValue="10" />
                  </div>
                  
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-2">Máximo de tareas por proyecto</label>
                    <input type="number" className="w-full bg-[#0e1a26] border border-[#2a3a4a] rounded-xl px-3 py-2 md:px-4 md:py-2 focus:outline-none focus:ring-2 focus:ring-[#5ab9ea] transition-all text-sm md:text-base" defaultValue="200" />
                  </div>
                </div>
                
                <button className="mt-4 md:mt-6 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-gradient-to-r from-[#5ab9ea] to-[#84ceeb] text-[#0e1a26] font-medium hover:opacity-90 transition-all text-xs md:text-sm">
                  Guardar Configuración
                </button>
              </div>
              
              <div className="bg-[#1a2a3a]/50 backdrop-blur-sm border border-[#2a3a4a]/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Zona Peligrosa</h3>
                <p className="text-xs md:text-sm text-[#a9c7d8] mb-3 md:mb-4">Estas acciones son irreversibles. Procede con precaución.</p>
                
                <div className="space-y-2 md:space-y-4">
                  <button className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors text-xs md:text-sm w-full text-left">
                    Eliminar todos los datos de prueba
                  </button>
                  
                  <button className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors text-xs md:text-sm w-full text-left">
                    Restablecer configuración por defecto
                  </button>
                  
                  <button className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors text-xs md:text-sm w-full text-left">
                    Borrar toda la base de datos
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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
      `}</style>
    </div>
  );
}