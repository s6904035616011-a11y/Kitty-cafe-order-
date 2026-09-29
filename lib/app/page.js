'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    const { data } = await supabase.from('cats').select('*');
    if (data) setCats(data);
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#fff0f5', minHeight: '100vh' }}>
      <h1 style={{ color: '#d81b60', textAlign: 'center' }}>🐾 Kitty Café & Cat Lounge 🐾</h1>
      <p style={{ textAlign: 'center', color: '#555' }}>ยินดีต้อนรับสู่คาเฟ่แมวสุดน่ารัก! สั่งอาหารและทาสแมวฟินๆ ได้ที่นี่</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', margin: '30px 0', flexWrap: 'wrap' }}>
        <a href="/generate-qr" style={{ padding: '12px 24px', backgroundColor: '#d81b60', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>พนักงาน: เปิดโต๊ะ / QR Code</a>
        <a href="/kitchen" style={{ padding: '12px 24px', backgroundColor: '#ffb74d', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>จอห้องครัว (Kitchen)</a>
        <a href="/cats" style={{ padding: '12px 24px', backgroundColor: '#ab47bc', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>สถานะน้องแมว</a>
      </div>

      <h2 style={{ color: '#880e4f', textAlign: 'center', marginTop: '40px' }}>ทำเนียบแมวเหมียวประจำร้าน</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', maxWidth: '800px', margin: '20px auto' }}>
        {cats.map((cat) => (
          <div key={cat.id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <h3>{cat.name}</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>พันธุ์: {cat.breed || 'แมวไทยทั่วไป'}</p>
            <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', backgroundColor: cat.status === 'sleeping' ? '#ffe0b2' : '#c8e6c9', color: cat.status === 'sleeping' ? '#e65100' : '#2e7d32' }}>
              {cat.status === 'sleeping' ? '💤 กำลังนอนหลับ' : '🐾 พร้อมเล่น'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
