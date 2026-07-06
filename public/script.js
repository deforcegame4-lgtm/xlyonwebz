document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const btnSubmit = document.getElementById('btnSubmit');
  
  // Disable tombol pas lagi loading biar ga di-spam
  btnSubmit.disabled = true;
  
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    showIosNotification(data.message);
    
  } catch (error) {
    showIosNotification("Gagal terhubung ke server!");
  } finally {
    btnSubmit.disabled = false;
  }
});

// Fungsi pemanggil notifikasi iPhone Glassmorphism
function showIosNotification(text) {
  const notif = document.getElementById('iosNotif');
  
  notif.innerText = text;
  
  // Reset class dulu jika ada notif sebelumnya yang masih jalan
  notif.classList.remove('hide');
  // Trigger efek smooth muncul
  notif.classList.add('show');
  
  // Clear timeout lama jika user klik berkali-kali supaya cooldown tidak bentrok
  if (window.notifTimer) clearTimeout(window.notifTimer);
  
  // Cooldown selama 4 detik (4000ms) untuk dibaca
  window.notifTimer = setTimeout(() => {
    notif.classList.remove('show');
    // Trigger efek smooth keluar
    notif.classList.add('hide');
  }, 4000);
}
