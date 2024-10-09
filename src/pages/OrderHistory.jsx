import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [error, setError] = useState('');
    const [deleteMessage, setDeleteMessage] = useState(''); // สำหรับข้อความแจ้งเตือนการลบ

    // ฟังก์ชันสำหรับดึงคำสั่งซื้อจาก API
    const fetchOrders = async (date) => {
        if (date) {
            try {
                const response = await axios.get(`http://localhost:5000/api/orders?date=${date}`);
                setOrders(response.data);
                setError('');
            } catch (err) {
                setError('ไม่สามารถดึงข้อมูลคำสั่งได้');
                setOrders([]);
            }
        }
    };

    // ฟังก์ชันสำหรับลบคำสั่งซื้อ
    const handleDeleteOrder = async (index) => {
        const orderToDelete = orders[index];
        try {
            await axios.delete(`http://localhost:5000/api/orders/${orderToDelete._id}`); // ใช้ _id ในการลบคำสั่ง
            const updatedOrders = orders.filter((_, i) => i !== index); // อัปเดตสถานะคำสั่งซื้อ
            setOrders(updatedOrders);
            setDeleteMessage('ลบคำสั่งซื้อเรียบร้อยแล้ว'); // ตั้งข้อความแจ้งเตือน
            setTimeout(() => setDeleteMessage(''), 3000); // ลบข้อความหลังจาก 3 วินาที
        } catch (err) {
            setError('ไม่สามารถลบคำสั่งซื้อได้');
        }
    };

    // ใช้ useEffect เพื่อกำหนดวันปัจจุบันเป็นค่าเริ่มต้น
    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; // แปลงวันเป็น YYYY-MM-DD
        setSelectedDate(formattedDate);
        fetchOrders(formattedDate); // ค้นหาคำสั่งซื้อตามวันปัจจุบันเมื่อคอมโพเนนต์โหลด
    }, []);

    // ฟังก์ชันที่เรียกใช้เมื่อวันที่ถูกเปลี่ยน
    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        fetchOrders(date); // ค้นหาคำสั่งซื้อตามวันที่ที่เลือก
    };

    return (
        <div className="min-h-screen bg-orange-50 flex flex-col items-center p-8">
            <h1 className="text-4xl font-bold mb-8 text-orange-600">ประวัติคำสั่งซื้อ</h1>

            <div className="mb-6">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange} // เรียกใช้ฟังก์ชันเมื่อวันที่ถูกเปลี่ยน
                    className="input input-bordered"
                />
            </div>

            {error && <div className="text-red-500">{error}</div>}
            {deleteMessage && <div className="text-green-500">{deleteMessage}</div>} {/* แสดงข้อความแจ้งเตือน */}

            <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
                <h2 className="text-2xl font-semibold mb-6 text-orange-800">ประวัติคำสั่งซื้อ</h2>
                <p className="text-gray-600 mb-4">รายการทั้งหมด: {orders.length} รายการ</p> {/* แสดงจำนวนคำสั่งซื้อ */}
                {orders.length === 0 ? (
                    <p className="text-center text-gray-500">ไม่มีคำสั่งซื้อในวันที่เลือก</p>
                ) : (
                    <ul className="space-y-4">
                        {orders.map((order, index) => (
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

export default OrderHistory;
