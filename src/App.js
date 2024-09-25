import './App.css';
import Login from './Login';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from './SignUp';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/signup" element={<SignUp />} />  {/* Use JSX here */}
            <Route path="/login" element={<Login />} />  {/* Use JSX here */}
          </Routes>
        </Router>
      </header>

    </div>
  );
}

export default App;
