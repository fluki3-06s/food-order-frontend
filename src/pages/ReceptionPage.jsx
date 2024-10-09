import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

function ReceptionPage() {
  const [orders, setOrders] = useState([]);
  const [newOrderAlert, setNewOrderAlert] = useState('');
  const [deleteOrderAlert, setDeleteOrderAlert] = useState(''); // สำหรับการลบออเดอร์
  const [searchTerm, setSearchTerm] = useState(''); // สำหรับการค้นหา

  useEffect(() => {
    socket.on('currentOrders', (orders) => {
      setOrders(orders);
    });

    socket.on('newOrder', (newOrder) => {
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      setNewOrderAlert(`มีคำสั่งซื้อใหม่: ${newOrder.menu} (จำนวน: ${newOrder.quantity})`);

      // หยุดแสดงการแจ้งเตือนหลังจาก 3 วินาที
      setTimeout(() => {
        setNewOrderAlert('');
      }, 3000);
    });

    socket.on('orderDeleted', (orderIndex) => {
      setOrders((prevOrders) => prevOrders.filter((_, index) => index !== orderIndex));
    });

    return () => {
      socket.off('currentOrders');
      socket.off('newOrder');
      socket.off('orderDeleted');
    };
  }, []);

  const handleDeleteOrder = (index) => {
    const deletedOrder = orders[index];
    setOrders((prevOrders) => prevOrders.filter((_, i) => i !== index));
    setDeleteOrderAlert(`ลบคำสั่งซื้อ: ${deletedOrder.menu} (จำนวน: ${deletedOrder.quantity})`);
    socket.emit('deleteOrder_page', index); // ส่งคำสั่งลบไปที่เซิร์ฟเวอร์
    setTimeout(() => {
        setDeleteOrderAlert('');
    }, 3000);
};



  // ฟังก์ชันสำหรับการกรองคำสั่งซื้อ
  const filteredOrders = orders.filter((order) =>
    order.menu.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (order.tableNumber && order.tableNumber.toString().includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8 text-orange-600">รับคำสั่งซื้อ</h1>

      {newOrderAlert && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg mb-4">
          {newOrderAlert}
        </div>
      )}

      {deleteOrderAlert && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4">
          {deleteOrderAlert}
        </div>
      )}

      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="form-control flex-grow">
            <div className="input-group">
              {/* ช่องค้นหา */}
              <input
                type="text"
                placeholder="ค้นหาชื่อเมนูหรือหมายเลขโต๊ะ"
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 text-lg ">รายการทั้งหมด: {filteredOrders.length} รายการ</span>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-orange-800">รายการคำสั่งซื้อ</h2>
        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500">ไม่มีคำสั่งซื้อในขณะนี้</p>
        ) : (
          <ul className="space-y-4">
            {filteredOrders.map((order, index) => (
              <li key={index} className="bg-orange-100 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <span className="font-semibold">
                    {order.tableNumber ? (
                      <span className="text-orange-600">{`โต๊ะที่ ${order.tableNumber} : `}</span>
                    ) : (
                      ''
                    )}
                    <span className="text-orange-800">{order.menu}</span>
                    <span className="text-orange-500"> x{order.quantity}</span>
                    {order.isTakeaway && (
                      <span className="ml-2 px-2 py-1 bg-orange-200 text-orange-800 text-xs rounded-full">
                        สั่งกลับบ้าน
                      </span>
                    )}
                  </span>
                  {order.note && <p className="text-sm text-gray-600 mt-1">หมายเหตุ: {order.note}</p>}
                </div>
                <button
                  className="btn btn-sm btn-error text-white"
                  onClick={() => handleDeleteOrder(index)}>
                  ลบ
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ReceptionPage;
