'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function KitchenPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
  };

  const updateStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetchOrders();
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ color: '#d81b60', textAlign: 'center' }}>👨‍🍳 หน้าจอห้องครัว (Kitchen Realtime) 👨‍🍳</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {orders.map((order) => (
          <div key={order.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h3>โต๊ะหมายเลข: {order.table_number}</h3>
            <p>ราคารวม: <strong>{order.total_price} บาท</strong></p>
            <p>สถานะ: <span style={{ padding: '4px 8px', borderRadius: '4px', background: order.status === 'pending' ? '#ffe0b2' : '#c8e6c9' }}>{order.status}</span></p>

            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button onClick={() => updateStatus(order.id, 'cooking')} style={{ flex: 1, padding: '8px', backgroundColor: '#ffa726', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>กำลังทำ</button>
              <button onClick={() => updateStatus(order.id, 'served')} style={{ flex: 1, padding: '8px', backgroundColor: '#66bb6a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>เสร็จสิ้น</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
