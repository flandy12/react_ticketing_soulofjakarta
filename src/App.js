import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/home';
import AboutPage from './pages/about';
import DetailPage from './pages/detail/page';
import PageCheckout from './pages/checkout/page';
import ShopingChart from './pages/shopping_cart';

function App() {
  return (
      <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/detail/:id" element={<DetailPage />} />
            <Route path="/checkout" element={<PageCheckout />} />
            <Route path="/keranjang" element={<ShopingChart />} />
          </Routes>
      </div>
  );
}

export default App;
