import './App.css';
import Login from './Login';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from './SignUp';
import ChatPage from './chatPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/signup" element={<SignUp />} />  
            <Route path="/login" element={<Login />} />
            <Route path ='/chatpage' element={<ChatPage/>}/>
          </Routes>
        </Router>
      </header>

    </div>
  );
}

export default App;
