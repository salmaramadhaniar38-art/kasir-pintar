const menus = [
  { id: 1, name: "Nasi Goreng Spesial", price: 25000, category: "Makanan", rating: 4.6, reviews: 120, icon: "🍳" },
  { id: 2, name: "Mie Goreng", price: 20000, category: "Makanan", rating: 4.4, reviews: 98, icon: "🍜" },
  { id: 3, name: "Chicken Katsu", price: 28000, category: "Makanan", rating: 4.7, reviews: 96, icon: "🍗" },
  { id: 4, name: "Es Kopi Susu", price: 15000, category: "Minuman", rating: 4.5, reviews: 75, icon: "☕" },
  { id: 5, name: "Jus Jeruk", price: 12000, category: "Minuman", rating: 4.3, reviews: 60, icon: "🍊" },
  { id: 6, name: "Chocolate Blend", price: 18000, category: "Minuman", rating: 4.6, reviews: 110, icon: "🥤" },
  { id: 7, name: "Kentang Goreng", price: 15000, category: "Snack", rating: 4.2, reviews: 45, icon: "🍟" },
  { id: 8, name: "Risoles", price: 10000, category: "Snack", rating: 4.1, reviews: 38, icon: "🥟" }
];

let cart = [];
let selectedCategory = "Semua";

const rupiah = value =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);

function renderMenu() {
  const keyword = document.getElementById("search").value.toLowerCase();

  const filtered = menus.filter(item => {
    const matchCategory =
      selectedCategory === "Semua" || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(keyword);
    return matchCategory && matchSearch;
  });

  document.getElementById("menuGrid").innerHTML = filtered.map(item => `
    <article class="menu-card">
      <div class="menu-image">${item.icon}</div>
      <div class="menu-info">
        <h3>${item.name}</h3>
        <div class="price">${rupiah(item.price)}</div>
        <div class="review">
          <span>★</span> ${item.rating} (${item.reviews} ulasan)
        </div>
        <button class="add-btn" onclick="addToCart(${item.id})">+ Tambah</button>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const menu = menus.find(item => item.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...menu, qty: 1 });
  }

  renderCart();
  showToast(`${menu.name} ditambahkan`);
}

function changeQty(id, amount) {
  const item = cart.find(item => item.id === id);
  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    cart = cart.filter(item => item.id !== id);
  }

  renderCart();
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function renderCart() {
  const list = document.getElementById("cartList");

  if (cart.length === 0) {
    list.innerHTML = `<div class="empty">Belum ada pesanan.</div>`;
  } else {
    list.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div>
          <div class="cart-name">${item.name}</div>
          <div class="cart-price">${rupiah(item.price)} × ${item.qty}</div>
        </div>
        <div class="cart-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <strong>${item.qty}</strong>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          <button class="remove" onclick="removeItem(${item.id})">×</button>
        </div>
      </div>
    `).join("");
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.10;
  const total = subtotal + tax;

  document.getElementById("subtotal").textContent = rupiah(subtotal);
  document.getElementById("tax").textContent = rupiah(tax);
  document.getElementById("total").textContent = rupiah(total);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 1800);
}

document.querySelectorAll(".category").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".category").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    selectedCategory = button.dataset.category;
    renderMenu();
  });
});

document.getElementById("search").addEventListener("input", renderMenu);

document.getElementById("clearBtn").addEventListener("click", () => {
  cart = [];
  renderCart();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  cart = [];
  document.getElementById("search").value = "";
  selectedCategory = "Semua";
  document.querySelectorAll(".category").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.category === "Semua");
  });
  renderMenu();
  renderCart();
});

document.getElementById("payBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Pesanan masih kosong");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0) * 1.10;
  alert(`Pembayaran berhasil!\nTotal: ${rupiah(total)}`);
  cart = [];
  renderCart();
});

document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.getElementById("themeBtn").textContent =
    document.body.classList.contains("dark") ? "🌙" : "☀️";
});

function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent =
    now.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }) + " | " +
    now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit"
    });
}

setInterval(updateClock, 1000);
updateClock();
renderMenu();
renderCart();
