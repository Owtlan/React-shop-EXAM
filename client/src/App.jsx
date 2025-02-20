import './style.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from './components/home/Home.jsx'
import Register from './components/user-actions/register/Register.jsx'
import Navbar from './components/navigation/Navigation.jsx'
import Login from './components/user-actions/login/Login.jsx'
import Logout from './components/user-actions/logout/Logout.jsx'
import CreateProduct from './components/create/CreateProduct.jsx'
import Catalog from './components/catalog/Catalog.jsx'
import Details from './components/details/Details.jsx'
import EditProduct from './components/edit-product/EditProduct.jsx'
import Chat from './components/chat/Chat.jsx'
import UsersPage from './components/usersPage/UsersPage.jsx'
import Checkout from './components/checkout/Checkout.jsx'

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/create' element={<CreateProduct />} />
          <Route path='catalog' element={<Catalog />} />
          <Route path='/details/:id' element={<Details />} />
          <Route path='/edit/:id' element={<EditProduct />} />
          <Route path="/users" element={<UsersPage />} /> {/* Страница с потребители */}
          <Route path="/Checkout" element={<Checkout />} />
          <Route path='/chat/:userId' element={<Chat />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
