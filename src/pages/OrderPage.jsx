import React, { useState } from 'react';
import io from 'socket.io-client';
import logo from './assets/logo.png';

const socket = io.connect('http://localhost:5000');

function OrderPage() {
  const [menu, setMenu] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [isTakeaway, setIsTakeaway] = useState(false);

  const handleOrderSubmit = () => {
    if (!menu || menu.trim() === '') {
      alert('กรุณากรอกชื่อเมนู');
      return;
    }
    if (quantity <= 0) {
      alert('กรุณากรอกจำนวนที่ถูกต้อง');
      return;
    }

    const orderDetails = {
      menu,
      quantity,
      note,
      tableNumber,
      isTakeaway,
    };

    socket.emit('placeOrder', orderDetails);
    setMenu('');
    setQuantity(1);
    setNote('');
    setTableNumber('');
    setIsTakeaway(false);
  };

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    // ตรวจสอบว่าให้ตั้งค่าจำนวนเป็น 1 ถ้าป้อน 0 หรือค่าต่ำกว่า 1
    if (value < 1) {
      setQuantity(1);
    } else {
      setQuantity(value);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center p-8">
      <img src={logo} alt="Logo" className="w-44 mb-8" />

      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold mb-8 text-center text-orange-600">สั่งอาหาร</h1>
        <input
          type="text"
          value={menu}
          onChange={(e) => setMenu(e.target.value)}
          className="input input-bordered w-full mb-4 bg-orange-100 border-orange-300 focus:border-orange-500"
          placeholder="กรอกเมนูที่ต้องการสั่ง"
        />
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange} // เปลี่ยนฟังก์ชัน
          className="input input-bordered w-full mb-4 bg-orange-100 border-orange-300 focus:border-orange-500"
          min="1" // จำกัดให้จำนวนอย่างน้อยเป็น 1
          placeholder="จำนวน"
        />
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="textarea textarea-bordered w-full mb-4 bg-orange-100 border-orange-300 focus:border-orange-500"
          placeholder="หมายเหตุพิเศษ (ถ้ามี)"
          rows="3"
        />
        <input
          type="text"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className="input input-bordered w-full mb-4 bg-orange-100 border-orange-300 focus:border-orange-500"
          placeholder="หมายเลขโต๊ะ (ถ้ามี)"
        />
        <label className="flex items-center mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={isTakeaway}
            onChange={(e) => setIsTakeaway(e.target.checked)}
            className="checkbox checkbox-warning mr-2"
          />
          <span className="text-orange-800">สั่งกลับบ้าน</span>
        </label>
        <button 
          className={`btn btn-warning w-full text-white hover:bg-orange-600 transition-colors duration-300 ${!menu || quantity <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleOrderSubmit}
          disabled={!menu || quantity <= 0} // ปิดปุ่มถ้าข้อมูลไม่ครบ
        >
          ส่งคำสั่งซื้อ
        </button>
      </div>
    </div>
  );
}

export default OrderPage;
