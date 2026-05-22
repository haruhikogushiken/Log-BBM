// api/transactions.js
// Data disimpan dalam memori global (akan hilang jika server restart)
let transactions = [];

export default async function handler(req, res) {
  // Setup CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const url = new URL(req.url, `http://${req.headers.host}`);
  const action = url.searchParams.get('action');
  
  // GET: Ambil semua transaksi
  if (req.method === 'GET') {
    // Urutkan berdasarkan timestamp (terlama ke terbaru)
    const sortedTransactions = [...transactions].sort((a, b) => a.timestamp - b.timestamp);
    return res.status(200).json({ 
      success: true, 
      data: sortedTransactions 
    });
  }
  
  // POST: Tambah transaksi baru
  if (req.method === 'POST') {
    let body = '';
    
    // Parse body request
    try {
      body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid JSON body' 
      });
    }
    
    const { action: postAction, tanggal, liter, jarak } = body;
    
    // Handle REFUEL
    if (postAction === 'refuel') {
      if (!tanggal || !liter || liter <= 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Data tidak valid: tanggal dan liter required' 
        });
      }
      
      const newTransaction = {
        id: Date.now(),
        tanggal: tanggal,
        jenis: 'refuel',
        nilai: parseFloat(liter),
        timestamp: Date.now()
      };
      
      transactions.push(newTransaction);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Refuel berhasil ditambahkan',
        data: newTransaction 
      });
    }
    
    // Handle ODOMETER
    if (postAction === 'odometer') {
      if (!jarak || jarak <= 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Data tidak valid: jarak required' 
        });
      }
      
      const newTransaction = {
        id: Date.now(),
        tanggal: new Date().toISOString().slice(0, 10),
        jenis: 'odometer',
        nilai: parseFloat(jarak),
        timestamp: Date.now()
      };
      
      transactions.push(newTransaction);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Pemakaian berhasil ditambahkan',
        data: newTransaction 
      });
    }
    
    return res.status(400).json({ 
      success: false, 
      message: 'Action tidak dikenal' 
    });
  }
  
  // DELETE: Reset semua data
  if (req.method === 'DELETE') {
    transactions = [];
    return res.status(200).json({ 
      success: true, 
      message: 'Semua data telah dihapus' 
    });
  }
  
  return res.status(405).json({ 
    success: false, 
    message: 'Method tidak diizinkan' 
  });
}