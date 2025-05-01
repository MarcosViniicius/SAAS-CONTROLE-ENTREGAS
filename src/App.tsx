import  { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/auth/Login';
import Registro from './pages/auth/Registro';
import Painel from './pages/Painel';
import EntregadoresList from './pages/entregadores/EntregadoresList';
import EntregadoresForm from './pages/entregadores/EntregadoresForm';
import EntregasList from './pages/entregas/EntregasList';
import EntregasForm from './pages/entregas/EntregasForm';
import EntregasHistorico from './pages/entregas/EntregasHistorico';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
      </Route>
      
      <Route path="/app" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Painel />} />
        <Route path="entregadores">
          <Route index element={<EntregadoresList />} />
          <Route path="novo" element={<EntregadoresForm />} />
          <Route path="editar/:id" element={<EntregadoresForm />} />
        </Route>
        <Route path="entregas">
          <Route index element={<EntregasList />} />
          <Route path="novo" element={<EntregasForm />} />
          <Route path="editar/:id" element={<EntregasForm />} />
          <Route path="historico" element={<EntregasHistorico />} />
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
 