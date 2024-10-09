import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OrderPage from './pages/OrderPage';
import ReceptionPage from './pages/ReceptionPage';
import OrderHistory from './pages/OrderHistory';
import Navbar from './components/Navbar'; // นำเข้า Navbar
import './App.css';

function App() {
  const openOrderPage = () => {
    window.open('/', '_blank');
  };

  const openReceptionPage = () => {
    window.open('/Order-ListPage', '_blank');
  };

  const openHistoryPage = () => {
    window.open('/Order-History', '_blank'); // เปลี่ยนเป็น /Order-History
  };

  return (
    <Router>
      <div className="min-h-screen bg-orange-50">
        <Navbar 
          openOrderPage={openOrderPage} 
          openReceptionPage={openReceptionPage} 
          openHistoryPage={openHistoryPage} // ส่งฟังก์ชันนี้ไปยัง Navbar
        />
        <div className="container mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<OrderPage />} />
            <Route path="/Order-ListPage" element={<ReceptionPage />} />
            <Route path="/Order-History" element={<OrderHistory />} /> {/* เปลี่ยนจาก component เป็น element */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;