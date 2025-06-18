import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Login from './pages/Login';
import Agents from './pages/Agents';
import NewDeal from './pages/NewDeal';
import NewContact from './pages/NewContact';
import ContactsList from './pages/ContactsList';
import ContactView from './pages/ContactView';
import DocumentsList from './pages/DocumentsList';
import Phototheque from './pages/Phototheque';
import { useAuth } from './hooks/useAuth';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );
}

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <ProtectedLayout>{children}</ProtectedLayout>;
}

function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/login" 
          element={session ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-deal"
          element={
            <ProtectedRoute>
              <NewDeal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-contact"
          element={
            <ProtectedRoute>
              <NewContact />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact/:contactId"
          element={
            <ProtectedRoute>
              <ContactView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact/:contactId/edit"
          element={
            <ProtectedRoute>
              <ContactView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <ContactsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents-list"
          element={
            <ProtectedRoute>
              <DocumentsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/phototheque"
          element={
            <ProtectedRoute>
              <Phototheque />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent-profile"
          element={
            <ProtectedRoute>
              <Agents />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App