import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import About from './pages/About';
import CreateAccount from './pages/CreateAccount';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Search from './pages/Search'
import DriverHomePage from './pages/DriverHomePage'
import SponsorHomePage from './pages/SponsorHomePage';
import AdminHomePage from './pages/AdminHomePage';
import DriverRemovalPage from './pages/DriverRemoval';
import SponsorRemovalPage from './pages/SponsorRemoval';
import AdminCreateUser from './pages/AdminCreateUser';
import Apply from './pages/Apply';
import Account from "./pages/Account.jsx";
import Product from './pages/Product.jsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/create_account" element={<CreateAccount />} />
        <Route path="/home" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/search" element={<Search />} />
        <Route path="/driver-page" element = {<DriverHomePage />} />
        <Route path="/sponsor-page" element = {<SponsorHomePage />} />
        <Route path="/admin-page" element = {<AdminHomePage />} />
        <Route path="/driver-removal" element = {<DriverRemovalPage />} />
        <Route path="/sponsor-removal" element = {<SponsorRemovalPage />} />
        <Route path="/admin/users/create" element={<AdminCreateUser />} />
        <Route path="/apply" element = {<Apply />} />
        <Route path="/account" element={<Account />} />
        <Route path="/product" element={<Product />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
