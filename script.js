document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const btnSubmit = document.getElementById('btnSubmit');
  
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

function showIosNotification(text) {
  const notif = document.getElementById('iosNotif');
  
  notif.innerText = text;
  
  // Reset status class
  notif.classList.remove('hide');
  // Trigger animasi masuk smooth
  notif.classList.add('show');
  
  // Clear timeout lama biar ga bertabrakan kalau di-spam klik
  if (window.notifTimer) clearTimeout(window.notifTimer);
  
  // Cooldown 4 detik (4000ms) untuk dibaca, lalu animasi keluar smooth
  window.notifTimer = setTimeout(() => {
    notif.classList.remove('show');
    notif.classList.add('hide');
  }, 4000);
}
