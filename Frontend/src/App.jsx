import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Companies from './pages/Companies';
import Favorites from './pages/Favorites';
import { CookiesProvider, useCookies } from 'react-cookie';

const PrivateRoutes = () => {
  let auth = useCookies(['token'])[0];
  console.log(auth.token);
  return (
    auth.token !== "" ? <Outlet /> : (<div className='go-login-text'> Please login via Postman</div>)
  )
}

function App() {
  return (
    <>
      {/* This is our Router DOM */}
      <CookiesProvider>
        <Router>
          <div>
            <Header />
            <Routes>
              {/* Given path to each Page */}
              <Route element={<PrivateRoutes />}>
                <Route path='/companies' element={<Companies />} />
                <Route path='/favorites' element={<Favorites />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </CookiesProvider>
      <ToastContainer />
    </>
  );
}

// Export for Index.js to use
export default App;