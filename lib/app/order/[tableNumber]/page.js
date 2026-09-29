'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function OrderPage() {
  const params = useParams();
  const tableNumber = params.tableNumber;

  const [menu, setMenu] = useState([]);
  const [category, setCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    const { data } = await supabase.from('menu_items').select('*');
    if (data) setMenu(data);
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const submitOrder = async () => {
    if (cart.length === 0) return;
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{ table_number: tableNumber, total_price: totalPrice, status: 'pending' }])
      .select()
      .single();

    if (orderError) {
      alert('เกิดข้อผิดพลาดในการส่งออเดอร์');
      return;
    }

    const orderItems = cart.map((item) => ({
      order_id: orderData.id,
      menu_item_id: item.id,
      quantity: item.quantity,
    }));

    await supabase.from('order_items').insert(orderItems);
    setCart([]);
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 5000);
  };

  const filteredMenu = category === 'all' ? menu : menu.filter((i) => i.category === category);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff0f5', minHeight: '100vh' }}>
      <h1 style={{ color: '#d81b60', textAlign: 'center' }}>🐾 Kitty Café - โต๊ะ {tableNumber} 🐾</h1>

      {orderSuccess && (
        <div style={{ padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '8px', textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>
          🎉 ส่งออเดอร์เข้าครัวเรียบร้อยแล้ว รอสักครู่นะเหมียว!
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['all', 'drink', 'food', 'dessert'].map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: category === cat ? '#d81b60' : '#fff', color: category === cat ? '#fff' : '#333', cursor: 'pointer', fontWeight: 'bold' }}>
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <h2>เมนูอาหารและเครื่องดื่ม</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
        {filteredMenu.map((item) => (
          <div key={item.id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h3>{item.name}</h3>
            <p style={{ color: '#d81b60', fontWeight: 'bold' }}>{item.price} บาท</p>
            <button onClick={() => addToCart(item)} style={{ width: '100%', padding: '8px', backgroundColor: '#ffb74d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              + เพิ่มลงตะกร้า
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <h2>🛒 ตะกร้าสินค้าของคุณ</h2>
        {cart.length === 0 ? (
          <p style={{ color: '#777' }}>ยังไม่มีสินค้าในตะกร้า</p>
        ) : (
          <div>
            {cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                <span>{item.name} (x{item.quantity})</span>
                <div>
                  <span style={{ marginRight: '15px', fontWeight: 'bold' }}>{item.price * item.quantity} บาท</span>
                  <button onClick={() => removeFromCart(item.id)} style={{ backgroundColor: '#ff5252', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>ลบ</button>
                </div>
              </div>
            ))}
            <button onClick={submitOrder} style={{ width: '100%', marginTop: '15px', padding: '12px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              ยืนยันการสั่งอาหาร (Send to Kitchen)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
