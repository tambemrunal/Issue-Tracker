import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateIssuePage from './pages/ReportIssue';
import IssuesDisplay from './pages/IssuesDisplay'
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute allowedRoles={'user'} />}>
            <Route path='/createIssue' element={<CreateIssuePage />}></Route>
            <Route path='/IssuesDisplay' element={<IssuesDisplay />}></Route>

          </Route>
          
          <Route path="*" element={<NotFound />} />
        
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
