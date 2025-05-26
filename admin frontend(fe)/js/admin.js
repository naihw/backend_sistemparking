const form = document.getElementById('auth-form');
const toggleAuth = document.getElementById('toggle-auth');
const formTitle = document.getElementById('form-title');
const nameInput = document.getElementById('name');

let isLogin = true;

// Toggle antara Login dan Register
toggleAuth.addEventListener('click', () => {
  isLogin = !isLogin;
  formTitle.textContent = isLogin ? 'Login Admin' : 'Register Admin';
  toggleAuth.textContent = isLogin ? 'Belum punya akun? Register' : 'Sudah punya akun? Login';
  nameInput.style.display = isLogin ? 'none' : 'block';
  form.querySelector('button').textContent = isLogin ? 'Login' : 'Register';
});

// Submit form login/register
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password || (!isLogin && !name)) {
    alert('Silakan isi semua field.');
    return;
  }

  const endpoint = isLogin 
    ? 'http://localhost:3000/api/admin/login' 
    : 'http://localhost:3000/api/admin/register';

  const body = isLogin ? { email, password } : { name, email, password };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Terjadi kesalahan.');
      return;
    }

    if (isLogin) {
      localStorage.setItem('token', data.token);
      showDashboard();
    } else {
      alert('Registrasi berhasil, silakan login.');
      toggleAuth.click();
    }
  } catch (err) {
    alert('Terjadi kesalahan saat mengirim permintaan.');
  }
});

// Tampilkan dashboard jika login berhasil
async function showDashboard() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('http://localhost:3000/api/admin/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (!res.ok) throw new Error();

    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
    document.getElementById('admin-name').textContent = data.name;

    loadSlotDashboard(token);

  } catch {
    localStorage.removeItem('token');
    alert('Session expired, silakan login ulang.');
  }
}

function loadSlotDashboard(token) {
  if (!document.getElementById('slot-dashboard')) {
    const slotDashboard = document.createElement('div');
    slotDashboard.id = 'slot-dashboard';
    slotDashboard.innerHTML = `
      <h2>Kelola Slot Parkir</h2>
      <div>
        <input type="text" id="slotNumberInput" placeholder="Nomor Slot" />
        <button id="addSlotBtn">Tambah Slot</button>
      </div>
      <div>
        <input type="number" id="availableSlotsInput" min="0" placeholder="Jumlah Slot Tersedia" />
        <button id="updateAvailableSlotsBtn">Update Jumlah Slot Tersedia</button>
      </div>
      <table border="1" style="width: 100%; margin-top: 15px;">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nomor Slot</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody id="slotsTableBody"></tbody>
      </table>
    `;
    document.getElementById('dashboard-section').appendChild(slotDashboard);

    document.getElementById('addSlotBtn').addEventListener('click', () => addSlot(token));
    document.getElementById('updateAvailableSlotsBtn').addEventListener('click', () => updateAvailableSlots(token));
  }

  fetchSlots(token);
}

async function fetchSlots(token) {
  try {
    const response = await fetch('http://localhost:3000/api/slot', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Gagal memuat data slot.');

    const slots = await response.json();
    const tbody = document.getElementById('slotsTableBody');
    tbody.innerHTML = '';

    slots.forEach(slot => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${slot.id}</td>
        <td>${slot.slot_number}</td>
        <td>${slot.status}</td>
        <td>
          <button onclick="updateSlotStatus(${slot.id}, '${slot.status === 'available' ? 'occupied' : 'available'}', '${token}')">
            Ubah ke ${slot.status === 'available' ? 'occupied' : 'available'}
          </button>
          <button onclick="deleteSlot(${slot.id}, '${token}')" style="color: red;">
            Hapus
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    alert(err.message);
  }
}

async function addSlot(token) {
  const slotNumber = document.getElementById('slotNumberInput').value.trim();
  if (!slotNumber) {
    alert('Nomor slot harus diisi.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/slot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ slot_number: slotNumber }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal menambah slot.');
    alert(data.message);
    document.getElementById('slotNumberInput').value = '';
    fetchSlots(token);
  } catch (err) {
    alert(err.message);
  }
}

async function updateSlotStatus(id, newStatus, token) {
  try {
    const response = await fetch(`http://localhost:3000/api/slot/update${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal memperbarui status.');
    alert(data.message);
    fetchSlots(token);
  } catch (err) {
    alert(err.message);
  }
}

async function deleteSlot(id, token) {
  if (!confirm('Yakin ingin menghapus slot ini?')) return;

  try {
    const response = await fetch(`http://localhost:3000/api/slot/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal menghapus slot.');
    alert(data.message);
    fetchSlots(token);
  } catch (err) {
    alert(err.message);
  }
}

async function updateAvailableSlots(token) {
  const availableSlots = parseInt(document.getElementById('availableSlotsInput').value, 10);
  if (isNaN(availableSlots) || availableSlots < 0) {
    alert('Masukkan jumlah slot tersedia yang valid.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/slot/available', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ availableSlots }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal update.');
    alert(data.message);
    document.getElementById('availableSlotsInput').value = '';
  } catch (err) {
    alert(err.message);
  }
}

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token');
  location.reload();
});

// Auto login saat refresh
window.onload = showDashboard;
