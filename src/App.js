import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/user_gues/home';
import DetailPage from './pages/user_gues/detail/page';
import PageCheckout from './pages/user_gues/checkout/page';
import PaymentMethod from './pages/user_gues/payment/page';
import LayoutPayment from './pages/user_gues/payment/layout';
import SuccessPage from './pages/user_gues/payment/finish';
// import Payment from './pages/payment/payment';
// import ShopingChart from './pages/shopping_cart';

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
            {/* <Route path="/keranjang" element={<ShopingChart />} /> */}
          </Routes>
      </div>
  );
}

export default App;
