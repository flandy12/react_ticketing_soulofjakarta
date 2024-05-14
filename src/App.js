import logo from './logo.svg';
import './App.css';

import { Route, Routes,Navigate } from 'react-router-dom';
import HomePage from './pages/user_gues/home';

import PageCheckout from './pages/user_gues/checkout/page';
import PaymentMethod from './pages/user_gues/payment/page';
import LayoutPayment from './pages/user_gues/payment/layout';
import SuccessPage from './pages/user_gues/payment/finish';
import ErrorPage from './pages/compoments/error/error_page';
import NotFound from './pages/compoments/error/not_found';
import Login from './pages/login/login';
import Signup from './pages/login/signup';
import EventEditPage from './pages/dashboard/event/edit';
import EventPage from './pages/dashboard/event';
import { DetailPage } from './pages/user_gues/detail/page';
import ProfilePage from './pages/dashboard/user/page';
import EditProfile from './pages/dashboard/user/edit';
import RevenuePage from './pages/dashboard/revenue';
import TransActionPage from './pages/dashboard/transaction';
import CreateEvent from './pages/dashboard/event/create';
import ReferralCodePage from './pages/dashboard/refferal';
import EditReferal from './pages/dashboard/refferal/edit';
import EditReferral from './pages/dashboard/refferal/edit';
import CreateReferral from './pages/dashboard/refferal/create';


function App() {
  return (
      <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/detail/:id" element={<DetailPage />} />
            <Route path="/checkout" element={<PageCheckout />} />
            <Route path="/payment-method" element={<PaymentMethod />} />
            <Route path="/payment" element={<LayoutPayment />} />
            <Route path="/payment/finish" element={<SuccessPage />} />
            <Route path="/error" element={<ErrorPage />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />

            <Route path="/dashboard"  element={
              <ProtectedRoute>
                <EventPage />
              </ProtectedRoute>
             } > 
            </Route>

            <Route path="/dashboard/event/create"  element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
             } >  
            </Route>

            <Route path="/dashboard/event/edit/:id"  element={
              <ProtectedRoute>
                <EventEditPage />
              </ProtectedRoute>
             } >  
            </Route>

            <Route path="/dashboard/referral-code"  element={
              <ProtectedRoute>
                <ReferralCodePage />
              </ProtectedRoute>
             } >  
            </Route>

            <Route path="/dashboard/referral-code/create"  element={
              <ProtectedRoute>
                <CreateReferral />
              </ProtectedRoute>
             } >  
            </Route>

            <Route path="/dashboard/referral-code/edit/:id"  element={
              <ProtectedRoute>
                <EditReferral />
              </ProtectedRoute>
             } >  
            </Route>

            <Route path="/dashboard/profile"  element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
             } >  
            </Route>

            <Route path="/dashboard/profile/edit"  element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
             } >  
            </Route>

            <Route path="/dashboard/revenue/report"  element={
              <ProtectedRoute>
                <RevenuePage />
              </ProtectedRoute>
             } >  
            </Route>

            <Route path="/dashboard/transaction"  element={
              <ProtectedRoute>
                <TransActionPage />
              </ProtectedRoute>
             } >  
            </Route>

            

            <Route path="*" element={<NotFound />} />
          </Routes>
      </div>
  );
}

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user_data');
  if (!user) {
  return <Navigate to="/login" />;
  }
  return (children);
};

export default App;
