import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Contextapi from './contextapi/contextapi.jsx'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Contextapi>
    <App />
    <ToastContainer/>
    </Contextapi>
  </StrictMode>,
)
