const mongoose = require('mongoose');

// Definisi Schema Key (Sama dengan format yang dibuat Bot Telegram nanti)
const KeySchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

const KeyModel = mongoose.models.Key || mongoose.model('Key', KeySchema);

// Fungsi koneksi database hemat resource (Serverless style)
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGO_URI);
}

module.exports = async (req, res) => {
  // Hanya menerima method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectDB();
    const { username, password } = req.body;

    // 1. Cari data berdasarkan Username
    const userKey = await KeyModel.findOne({ username: username.trim() });
    if (!userKey) {
      return res.status(400).json({ message: 'Gagal! Ada Kesalahan Di Username' });
    }

    // 2. Cek apakah Password salah
    if (userKey.password !== password.trim()) {
      return res.status(400).json({ message: 'Gagal! Ada Kesalahan Di Password' });
    }

    // 3. Cek apakah Masa Expired Key sudah habis
    const sekarang = new Date();
    if (userKey.expiresAt < sekarang) {
      return res.status(400).json({ message: 'Gagal! Masa Aktif Key Anda Sudah Habis' });
    }

    // 4. Jika semua benar -> Login Sukses
    return res.status(200).json({ message: `Welcome, ${userKey.username} You Are The King` });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server database.' });
  }
};
