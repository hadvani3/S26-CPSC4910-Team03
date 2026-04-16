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
import Cart from './pages/Cart.jsx';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminApplications from './pages/AdminApplications';
import AdminBulkUpload from './pages/AdminBulkUpload';
import Catalog from './pages/catalog.jsx';
import SponsorProduct from './pages/SponsorProduct.jsx';
import PurchaseHistory from './pages/purchaseHistory.jsx';  
import AdminCreateSponsor from './pages/AdminCreateSponsor';
import AdminAuditLog from './pages/AdminAuditLog.jsx';
import SponsorBulkUpload from './pages/SponsorBulkUpload.jsx';
import SponsorPointsReport from './pages/SponsorPointsReports.jsx';
import AdminReports from './pages/AdminReports.jsx';
import AdminSalesBySponsor from './pages/AdminSalesBySponsor.jsx';
import AdminSalesByDriver from './pages/AdminSalesByDriver.jsx';
import SponsorAuditLog from './pages/SponsorAuditLog.jsx';
import SponsorManageDrivers from './pages/SponsorManageDrivers.jsx';
import AdminInvoice from './pages/AdminInvoice.jsx'
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
        <Route path="/cart" element={<Cart />} />
        <Route path="/purchaseHistory" element={<PurchaseHistory />} />
        <Route path="/admin/users" element={<AdminUserManagement />} />
        <Route path="/admin/applications" element={<AdminApplications />} />
        <Route path="/sponsor/applications" element={<AdminApplications />} />
        <Route path="/admin/bulk-upload" element={<AdminBulkUpload />} />
        <Route path= "/sponsor/:sponsor_id/catalog" element={<Catalog />} />
        <Route path= "/sponsor_product" element={<SponsorProduct/>} />
        <Route path= "/admin/sponsors/create" element={<AdminCreateSponsor />} />
        <Route path= "/admin/audit-log" element={<AdminAuditLog />} />
        <Route path= "/sponsor/bulk-upload" element={<SponsorBulkUpload />} />
        <Route path= "/sponsor/points-report" element={<SponsorPointsReport />} />
        <Route path= "/admin/reports" element={<AdminReports />} />
        <Route path= "/admin/reports/sales-by-sponsor" element={<AdminSalesBySponsor />} />
        <Route path= "/admin/reports/sales-by-driver" element={<AdminSalesByDriver />} />
        <Route path= "/sponsor/audit-log" element={<SponsorAuditLog />} />
        <Route path="/sponsor/manage-drivers" element={<SponsorManageDrivers />} />

        <Route path= "/admin/invoice" element={<AdminInvoice />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
