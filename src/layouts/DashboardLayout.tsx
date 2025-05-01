import  { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Package, Users, Clipboard, LogOut, Menu, X } from 'lucide-react';

export default function DashboardLayout() {
  const { user, empresa, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-primary">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Package className="h-8 w-8 text-white" />
              <span className="ml-2 text-white font-semibold text-lg">Controle de Entregas</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              <Link
                to="/app"
                className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-blue-700"
                onClick={() => setSidebarOpen(false)}
              >
                <Clipboard className="mr-3 h-6 w-6 text-white" />
                Painel
              </Link>
              <Link
                to="/app/entregadores"
                className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-blue-700"
                onClick={() => setSidebarOpen(false)}
              >
                <Users className="mr-3 h-6 w-6 text-white" />
                Entregadores
              </Link>
              <Link
                to="/app/entregas"
                className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-blue-700"
                onClick={() => setSidebarOpen(false)}
              >
                <Package className="mr-3 h-6 w-6 text-white" />
                Entregas
              </Link>
              <Link
                to="/app/entregas/historico"
                className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-blue-700"
                onClick={() => setSidebarOpen(false)}
              >
                <Clipboard className="mr-3 h-6 w-6 text-white" />
                Histórico
              </Link>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-blue-800 p-4">
            <div className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div>
                  <div className="bg-blue-200 rounded-full p-1">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{empresa?.nome}</p>
                  <p className="text-xs font-medium text-blue-200">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-primary">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Package className="h-8 w-8 text-white" />
              <span className="ml-2 text-white font-semibold text-lg">Controle de Entregas</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              <Link
                to="/app"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-blue-700"
              >
                <Clipboard className="mr-3 h-6 w-6 text-white" />
                Painel
              </Link>
              <Link
                to="/app/entregadores"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-blue-700"
              >
                <Users className="mr-3 h-6 w-6 text-white" />
                Entregadores
              </Link>
              <Link
                to="/app/entregas"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-blue-700"
              >
                <Package className="mr-3 h-6 w-6 text-white" />
                Entregas
              </Link>
              <Link
                to="/app/entregas/historico"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-blue-700"
              >
                <Clipboard className="mr-3 h-6 w-6 text-white" />
                Histórico
              </Link>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-blue-800 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <div className="bg-blue-200 rounded-full p-1">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{empresa?.nome}</p>
                  <p className="text-xs font-medium text-blue-200">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Sistema de Controle de Entregas</h1>
                <button 
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </button>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="py-4">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
 