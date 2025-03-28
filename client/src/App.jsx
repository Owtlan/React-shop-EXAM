import './style.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from './components/core/home/Home.jsx'
import Register from './components/user-actions/register/Register.jsx'
import Navbar from './components/core/navigation/Navigation.jsx'
import Login from './components/user-actions/login/Login.jsx'
import Logout from './components/user-actions/logout/Logout.jsx'
import CreateProduct from './components/create/CreateProduct.jsx'
import Catalog from './components/catalog/Catalog.jsx'
import Details from './components/details/Details.jsx'
import EditProduct from './components/edit-product/EditProduct.jsx'
import Chat from './components/chat/Chat.jsx'
import UsersPage from './components/usersPage/UsersPage.jsx'
import Checkout from './components/checkout/Checkout.jsx'
import AuthGuard from './components/GUards/AuthGuard.jsx'
import GuestGuard from './components/guards/GuestGuard.jsx'
import Footer from './components/core/footer/Footer.jsx'

function App() {

  return (
    <>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<GuestGuard><Register /></GuestGuard>} />
            <Route path='/login' element={<GuestGuard><Login /></GuestGuard>} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/create' element={<AuthGuard><CreateProduct /></AuthGuard>} />
            <Route path='catalog' element={<Catalog />} />
            <Route path='/details/:id' element={<Details />} />
            <Route path='/edit/:id' element={<AuthGuard><EditProduct /></AuthGuard>} />
            <Route path="/users" element={<AuthGuard><UsersPage /></AuthGuard>} />
            <Route path="/checkout" element={<AuthGuard><Checkout /></AuthGuard>} />
            <Route path='/chat/:userId' element={<AuthGuard><Chat /></AuthGuard>} />
          </Routes>

          <Footer />
        </div>
      </Router>

    </>
  )
}

export default App
