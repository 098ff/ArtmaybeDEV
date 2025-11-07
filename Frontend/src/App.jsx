import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Companies from './pages/Companies';
import Favorites from './pages/Favorites';
import LoginPage from './pages/Login';

const PrivateRoutes = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;
  return token ? <Outlet /> : <div className='go-login-text'>Please login to start</div>;
};

function App() {
  return (
    <>
        <Router>
          <div>
            <Header />
            <Routes>
              <Route path='/login' element={<LoginPage />} />

              <Route element={<PrivateRoutes />}>
                <Route path='/companies' element={<Companies />} />
                <Route path='/favorites' element={<Favorites />} />
              </Route>

              <Route path='/' element={<Navigate to='/login' />} />
            </Routes>
          </div>
        </Router>
      <ToastContainer />
    </>
  );
}

export default App;

