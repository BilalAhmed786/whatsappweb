import Home from './pages/Home'
import Register from './pages/register'
import Login from './pages/login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Protecteduser from './protected/protected'
import Authprotected from './protected/authprotected'
import Pagenotfound from './pages/pagenotfound'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Protecteduser Component={Register} />} />
        <Route path='/login' element={<Protecteduser Component={Login} />} />
        
        {/* Password Reset Routes */}
        <Route path='/forgotpassword' element={<Protecteduser Component={ForgotPassword} />} />
        <Route path='/resetpassword/:id/:token' element={<Protecteduser Component={ResetPassword} />} />
        
        <Route path='/chat' element={<Authprotected Component={Home} />} />
        <Route path='*' element={<Pagenotfound />} />
      </Routes>
    </Router>
  )
}

export default App