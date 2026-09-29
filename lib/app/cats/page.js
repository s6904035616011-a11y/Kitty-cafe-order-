'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function CatsStatusPage() {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    const { data } = await supabase.from('cats').select('*');
    if (data) setCats(data);
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'sleeping' ? 'awake' : 'sleeping';
    await supabase.from('cats').update({ status: newStatus }).eq('id', id);
    fetchCats();
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff0f5', minHeight: '100vh' }}>
      <h1 style={{ color: '#d81b60', textAlign: 'center' }}>🐱 สถานะและทำเนียบแมวเหมียว 🐱</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {cats.map((cat) => (
          <div key={cat.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <h2>{cat.name}</h2>
            <p style={{ color: '#666' }}>พันธุ์: {cat.breed || 'แมวไทย'}</p>
            <p>สถานะ: <strong>{cat.status === 'sleeping' ? '💤 นอนหลับ' : '🐾 ตื่นอยู่ พร้อมเล่น'}</strong></p>
            <button onClick={() => toggleStatus(cat.id, cat.status)} style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#ab47bc', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              เปลี่ยนสถานะแมว
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
