import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';  // creează această componentă
import Register from './Components/Register';  // creează această componentă
import PrivateRoute from './Components/PrivateRoute'; // vezi codul anterior
import Settings from './Components/Settings';
import DashboardLayout from './Components/DashboardLayout';
import EventPage from './Components/EventPage'; // deja definită
import AddEvent from './Components/AddEvent'; // creează această componentă
import MyEvents from './Components/MyEvents'; // creează această componentă
import Search from './Components/Search'; // creează această componentă


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* zona protejată */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-events"
          element={
            <PrivateRoute>
              <MyEvents />
            </PrivateRoute>
          }
        />
        <Route
          path="/add"
          element={
            <PrivateRoute>
              <AddEvent />
            </PrivateRoute>
          }
        />

        <Route
          path="/search"
          element={
            <PrivateRoute>
              <Search />
            </PrivateRoute>
          }
        />

        <Route
          path="/event/:id"
          element={
            <PrivateRoute>
              <EventPage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
