import './style.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from './components/home/Home.jsx'
import Register from './components/register/Register.jsx'
import Navbar from './components/navigation/Navigation.jsx'
import Login from './components/login/Login.jsx'
import Logout from './components/logout/Logout.jsx'
import CreateProduct from './components/create/CreateProduct.jsx'
import Catalog from './components/catalog/Catalog.jsx'
import Details from './components/details/Details.jsx'

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
        </Routes>
      </Router>
    </>
  )
}

export default App
