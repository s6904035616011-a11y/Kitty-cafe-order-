'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function GenerateQR() {
  const [tableNumber, setTableNumber] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleOpenTable = async (e) => {
    e.preventDefault();
    if (!tableNumber) return;

    const { data: existing } = await supabase
      .from('tables')
      .select('*')
      .eq('table_number', tableNumber)
      .single();

    if (existing) {
      setMessage(`โต๊ะที่ ${tableNumber} ถูกเปิดใช้งานอยู่แล้ว!`);
    } else {
      const { error } = await supabase.from('tables').insert([{ table_number: tableNumber, status: 'active' }]);
      if (error) {
        setMessage('เกิดข้อผิดพลาดในการเปิดโต๊ะ');
        return;
      }
      setMessage(`เปิดโต๊ะ ${tableNumber} สำเร็จ!`);
    }

    const currentDomain = window.location.origin;
    const targetUrl = `${currentDomain}/order/${tableNumber}`;
    setQrUrl(targetUrl);
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ color: '#d81b60' }}>📋 ระบบพนักงาน: เปิดโต๊ะ & สร้าง QR</h1>
      <form onSubmit={handleOpenTable} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <input
          type="number"
          placeholder="ระบุเลขโต๊ะ (เช่น 1, 2, 3)"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          style={{ padding: '12px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc' }}
          required
        />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#d81b60', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
          เปิดโต๊ะและสร้างลิงก์สั่งอาหาร
        </button>
      </form>

      {message && <p style={{ marginTop: '20px', fontWeight: 'bold', color: '#333' }}>{message}</p>}

      {qrUrl && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fff0f5', borderRadius: '10px' }}>
          <h3>ลิงก์สั่งอาหารสำหรับโต๊ะ {tableNumber}</h3>
          <a href={qrUrl} target="_blank" rel="noreferrer" style={{ color: '#0070f3', wordBreak: 'break-all', display: 'block', margin: '10px 0' }}>
            {qrUrl}
          </a>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrUrl)}`} alt="QR Code" style={{ marginTop: '10px' }} />
        </div>
      )}
    </div>
  );
}
