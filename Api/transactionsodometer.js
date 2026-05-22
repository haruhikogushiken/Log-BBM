// api/transactions/odometer.js
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
  
  const { jarak } = req.body;
  
  if (!jarak || jarak <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid distance' });
  }
  
  if (!global.transactions) global.transactions = [];
  
  const newTransaction = {
    id: Date.now(),
    tanggal: new Date().toISOString().slice(0, 10),
    jenis: 'odometer',
    nilai: parseFloat(jarak),
    timestamp: new Date().toISOString()
  };
  
  global.transactions.push(newTransaction);
  
  return res.status(200).json({ success: true, data: newTransaction });
}