import './App.css';
import Login from './Login';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from './SignUp';
import ChatPage from './chatPage';
import { AuthContext } from './context';
import { useContext } from 'react';
import VideoCall from './videoCall';
import { ProtectedRoutes } from './ProtectedRoutes';
import { Navigate } from 'react-router-dom';

function App() {

  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={currentUser ? <Navigate to="/chatpage" /> : <Navigate to="/login" />} />
            <Route path='/chatpage' element={<ProtectedRoutes><ChatPage /></ProtectedRoutes>} />
            <Route path="/call" element={<ProtectedRoutes><VideoCall /></ProtectedRoutes>} />
          </Routes>
        </Router>
      </header>

    </div>
  );
}

export default App;
