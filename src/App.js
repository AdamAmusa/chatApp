import './App.css';
import Login from './Login';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from './SignUp';
import ChatPage from './chatPage';
import { AuthContext } from './context';
import { useContext } from 'react';
import VideoCall from './videoCall';


function App() {

  const {currentUser} = useContext(AuthContext);
  console.log(currentUser);
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/signup" element={<SignUp />} />  
            <Route path="/login" element={<Login />} />
            <Route path ='/chatpage' element={<ChatPage/>}/>
            <Route path="/call" element={<VideoCall/>} />
          </Routes>
        </Router>
      </header>

    </div>
  );
}

export default App;
