// api/transactions/index.js
let transactions = []; // Data disimpan dalam memori (akan hilang saat server restart)

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET: Ambil semua transaksi
  if (req.method === 'GET') {
    return res.status(200).json({ success: true, data: transactions });
  }
  
  // DELETE: Reset semua data
  if (req.method === 'DELETE') {
    transactions = [];
    return res.status(200).json({ success: true, message: 'All data cleared' });
  }
  
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}