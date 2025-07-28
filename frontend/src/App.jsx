import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateIssuePage from "./pages/ReportIssue";
import IssueDetails from "./pages/IssueDetails";
import "leaflet/dist/leaflet.css";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import IssuesDisplay from "./pages/IssuesDisplay";
import ProtectedRoute from "./components/ProtectedRoute";

// import Dashboard from './pages/Dashboard';
// import Home from './pages/Home';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/createIssue" element={<CreateIssuePage />}></Route> */}

          {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute allowedRoles={"user"} />}>
            <Route path="/createIssue" element={<CreateIssuePage />}></Route>
            <Route path="/dashboard" element={<IssuesDisplay />}></Route>
            <Route path="/issues/:id" element={<IssueDetails />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
