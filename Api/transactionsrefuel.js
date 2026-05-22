// api/transactions/refuel.js
let transactions = []; // Catatan: Untuk production, gunakan database sungguhan

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  
  const { tanggal, liter } = req.body;
  
  if (!tanggal || !liter || liter <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid data' });
  }
  
  // Import data dari index (perlu mekanisme shared state)
  // Untuk solusi sederhana, kita gunakan global variable
  
  if (!global.transactions) global.transactions = [];
  
  const newTransaction = {
    id: Date.now(),
    tanggal,
    jenis: 'refuel',
    nilai: parseFloat(liter),
    timestamp: new Date().toISOString()
  };
  
  global.transactions.push(newTransaction);
  
  return res.status(200).json({ success: true, data: newTransaction });
}