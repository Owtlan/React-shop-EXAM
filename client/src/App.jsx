import './index.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from './components/home/Home.jsx'
import Register from './components/register/Register.jsx'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
