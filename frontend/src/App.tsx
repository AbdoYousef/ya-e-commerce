import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import Navbar from './components/Navbar'
import Register from "./pages/Register"


function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"  element={<Home />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/register"  element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
