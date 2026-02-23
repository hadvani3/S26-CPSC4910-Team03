import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import About from './pages/About';
import CreateAccount from './pages/CreateAccount';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/create_account" element={<CreateAccount />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
