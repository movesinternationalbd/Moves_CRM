import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Leads from './pages/Leads.jsx';
import Students from './pages/Students.jsx';
import Followups from './pages/Followups.jsx';
import Finance from './pages/Finance.jsx';
import PTE from './pages/PTE.jsx';
import Countries from './pages/Countries.jsx';
import Universities from './pages/Universities.jsx';
import Documents from './pages/Documents.jsx';
import Notifications from './pages/Notifications.jsx';
import Settings from './pages/Settings.jsx';

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <Protected>
              <Layout>
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="leads" element={<Leads />} />
                  <Route path="students" element={<Students />} />
                  <Route path="followups" element={<Followups />} />
                  <Route path="finance" element={<Finance />} />
                  <Route path="pte" element={<PTE />} />
                  <Route path="countries" element={<Countries />} />
                  <Route path="universities" element={<Universities />} />
                  <Route path="documents" element={<Documents />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="settings" element={<Settings />} />
                </Routes>
              </Layout>
            </Protected>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
