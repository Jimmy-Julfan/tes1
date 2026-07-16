// ============================================================
//  JIM'S SPORT — E-Commerce JavaScript (Vanilla)
//  Full SPA + Admin + Payment + Sorting
// ============================================================

// ---------- DATA PRODUK (ditambah rating & 2 produk baru) ----------
const productsData = [
    {
        id: 1,
        name: "Kemeja Olahraga Pria",
        category: "pria",
        price: 299000,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop&crop=center&auto=format",
        slug: "kemeja-olahraga-pria",
        rating: 4.5
    },
    {
        id: 2,
        name: "Kaos Sport Wanita",
        category: "wanita",
        price: 189000,
        image: "https://images.unsplash.com/photo-1560243563-062bfc001d68?w=400&h=400&fit=crop&crop=center&auto=format",
        slug: "kaos-sport-wanita",
        rating: 4.3
    },
    {
        id: 3,
        name: "Jaket Running Pria",
        category: "pria",
        price: 459000,
        image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop&crop=center&auto=format",
        slug: "jaket-running-pria",
        rating: 4.7
    },
    {
        id: 4,
        name: "Legging Yoga Wanita",
        category: "wanita",
        price: 249000,
        image: "https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=400&h=400&fit=crop&crop=center&auto=format",
        slug: "legging-yoga-wanita",
        rating: 4.6
    },
    {
        id: 5,
        name: "Hoodie Sport Unisex",
        category: "pria",
        price: 389000,
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&h=400&fit=crop&crop=center&auto=format",
        slug: "hoodie-sport-unisex",
        rating: 4.4
    },
    {
        id: 6,
        name: "Tank Top Wanita",
        category: "wanita",
        price: 159000,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop&crop=center&auto=format",
        slug: "tank-top-wanita",
        rating: 4.2
    },
    // ===== PRODUK BARU =====
    {
        id: 7,
        name: "Sepatu Lari Pria",
        category: "pria",
        price: 599000,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center&auto=format",
        slug: "sepatu-lari-pria",
        rating: 4.8
    },
    {
        id: 8,
        name: "Topi Olahraga Wanita",
        category: "wanita",
        price: 129000,
        image: "https://images.unsplash.com/photo-1566577134770-3c85bb2d9fa4?w=400&h=400&fit=crop&crop=center&auto=format",
        slug: "topi-olahraga-wanita",
        rating: 4.6
    }
];

// ---------- STATE ----------
let cart = [];
let currentFilter = "all";
let currentSort = "default";

// ---------- DOM REFS ----------
const productGrid = document.getElementById("productGrid");
const filterContainer = document.getElementById("filterContainer");
const sortSelect = document.getElementById("sortSelect");
const cartBadge = document.getElementById("cartBadge");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartBody = document.getElementById("cartBody");
const cartTotal = document.getElementById("cartTotal");
const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutOverlay");
const checkoutClose = document.getElementById("checkoutClose");
const checkoutForm = document.getElementById("checkoutForm");
const hamburgerToggle = document.getElementById("hamburgerToggle");
const mobileMenu = document.getElementById("mobileMenu");
const navLinks = document.querySelectorAll(".navbar__links a, .navbar__mobile a");
const pages = document.querySelectorAll(".page");

// Admin elements
const adminLoginMessage = document.getElementById("adminLoginMessage");
const adminDashboard = document.getElementById("adminDashboard");
const openLoginBtn = document.getElementById("openLoginBtn");
const loginOverlay = document.getElementById("loginOverlay");
const loginClose = document.getElementById("loginClose");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");
const totalProductsSpan = document.getElementById("totalProducts");
const adminProductTableBody = document.getElementById("adminProductTableBody");

// ---------- UTILITY ----------
const formatRupiah = (number) => "Rp" + number.toLocaleString("id-ID");

// ---------- ROUTING / NAVIGASI ----------
const navigateTo = (pageId) => {
    // Sembunyikan semua halaman
    pages.forEach(p => p.classList.remove("active"));
    // Tampilkan halaman tujuan
    const target = document.getElementById("page-" + pageId);
    if (target) target.classList.add("active");

    // Update nav link active
    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.dataset.page === pageId) link.classList.add("active");
    });

    // Tutup mobile menu
    mobileMenu.classList.remove("open");

    // Jika halaman admin, cek login
    if (pageId === "admin") {
        checkAdminAccess();
    }
};

// Event listener untuk semua link navigasi
document.querySelectorAll("[data-page]").forEach(el => {
    el.addEventListener("click", (e) => {
        e.preventDefault();
        const page = el.dataset.page;
        if (page) navigateTo(page);
    });
});

// ---------- CHECK ADMIN ACCESS ----------
const checkAdminAccess = () => {
    const isLoggedIn = sessionStorage.getItem("adminLoggedIn") === "true";
    if (isLoggedIn) {
        adminLoginMessage.style.display = "none";
        adminDashboard.style.display = "block";
        renderAdminDashboard();
    } else {
        adminLoginMessage.style.display = "block";
        adminDashboard.style.display = "none";
    }
};

// ---------- LOGIN ADMIN ----------
openLoginBtn.addEventListener("click", () => {
    loginOverlay.classList.add("open");
    loginError.style.display = "none";
});

loginClose.addEventListener("click", () => loginOverlay.classList.remove("open"));
loginOverlay.addEventListener("click", (e) => {
    if (e.target === loginOverlay) loginOverlay.classList.remove("open");
});

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (username === "admin" && password === "admin123") {
        sessionStorage.setItem("adminLoggedIn", "true");
        loginOverlay.classList.remove("open");
        navigateTo("admin");
    } else {
        loginError.style.display = "block";
    }
});

logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("adminLoggedIn");
    navigateTo("admin");
});

// ---------- RENDER ADMIN DASHBOARD ----------
const renderAdminDashboard = () => {
    totalProductsSpan.textContent = productsData.length;

    adminProductTableBody.innerHTML = productsData.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.category === "pria" ? "Pria" : "Wanita"}</td>
            <td>${formatRupiah(p.price)}</td>
            <td>⭐ ${p.rating.toFixed(1)}</td>
            <td>
                <button class="btn-edit" onclick="alert('Edit produk ${p.id}')">Edit</button>
                <button class="btn-delete" onclick="alert('Hapus produk ${p.id}')">Hapus</button>
            </td>
        </tr>
    `).join("");
};

// ---------- RENDER PRODUK (dengan filter & sort) ----------
const renderProducts = () => {
    let filtered = currentFilter === "all"
        ? [...productsData]
        : productsData.filter(p => p.category === currentFilter);

    // Sorting
    switch (currentSort) {
        case "price-low":
            filtered.sort((a, b) => a.price - b.price);
            break;
        case "price-high":
            filtered.sort((a, b) => b.price - a.price);
            break;
        case "rating":
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        default:
            break;
    }

    if (filtered.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--color-gray);">
                <i class="fa-solid fa-box-open" style="font-size:2rem; opacity:0.5;"></i>
                <p style="margin-top:8px;">Tidak ada produk untuk kategori ini.</p>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = filtered.map(product => {
        const cartItem = cart.find(item => item.id === product.id);
        const inCart = !!cartItem;
        return `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" loading="lazy" />
                <div class="product-card__info">
                    <h3>${product.name}</h3>
                    <span class="category">${product.category === "pria" ? "👔 Pria" : "👗 Wanita"}</span>
                    <div class="rating">⭐ ${product.rating.toFixed(1)}</div>
                    <div class="price">${formatRupiah(product.price)}</div>
                    <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">
                        ${inCart ? "✅ Di Keranjang" : "Tambah ke Keranjang"}
                    </button>
                </div>
            </div>
        `;
    }).join("");

    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            const name = btn.dataset.name;
            const price = Number(btn.dataset.price);
            const image = btn.dataset.image;
            addToCart(id, name, price, image);
        });
    });
};

// ---------- FILTER ----------
filterContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    filterContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderProducts();
});

// ---------- SORTING ----------
sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;
    renderProducts();
});

// ---------- CART ----------
const addToCart = (id, name, price, image) => {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    updateCartUI();
    renderProducts();
};

const removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
    renderProducts();
};

const updateCartQuantity = (id, delta) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
        removeFromCart(id);
        return;
    }
    item.quantity = newQty;
    updateCartUI();
    renderProducts();
};

const updateCartUI = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? "flex" : "none";

    renderCartSidebar();

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = formatRupiah(totalPrice);
    checkoutBtn.dataset.total = totalPrice;
};

const renderCartSidebar = () => {
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="empty-cart">
                <i class="fa-regular fa-face-frown"></i>
                <p>Keranjangmu kosong.<br />Yuk, belanja sekarang!</p>
            </div>
        `;
        return;
    }

    cartBody.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" />
            <div class="cart-item__info">
                <h4>${item.name}</h4>
                <div class="price">${formatRupiah(item.price)}</div>
                <div class="cart-item__qty">
                    <button class="qty-decr" data-id="${item.id}">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-incr" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="cart-item__remove" data-id="${item.id}">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        </div>
    `).join("");

    document.querySelectorAll(".qty-incr").forEach(btn => {
        btn.addEventListener("click", () => updateCartQuantity(Number(btn.dataset.id), 1));
    });
    document.querySelectorAll(".qty-decr").forEach(btn => {
        btn.addEventListener("click", () => updateCartQuantity(Number(btn.dataset.id), -1));
    });
    document.querySelectorAll(".cart-item__remove").forEach(btn => {
        btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.id)));
    });
};

// ---------- SIDEBAR CART ----------
const openCart = () => {
    cartSidebar.classList.add("open");
    cartOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
};

const closeCart = () => {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("open");
    document.body.style.overflow = "";
};

cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// ---------- CHECKOUT ----------
const openCheckout = () => {
    if (cart.length === 0) {
        alert("Keranjang masih kosong. Tambahkan produk dulu!");
        return;
    }
    closeCart();
    checkoutModal.classList.add("open");
    document.body.style.overflow = "hidden";
};

const closeCheckout = () => {
    checkoutModal.classList.remove("open");
    document.body.style.overflow = "";
    document.querySelectorAll(".form-error").forEach(el => el.classList.remove("visible"));
};

checkoutBtn.addEventListener("click", openCheckout);
checkoutClose.addEventListener("click", closeCheckout);
checkoutModal.addEventListener("click", (e) => {
    if (e.target === checkoutModal) closeCheckout();
});

checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName");
    const address = document.getElementById("address");
    const paymentMethod = document.getElementById("paymentMethod");

    const nameError = document.getElementById("nameError");
    const addressError = document.getElementById("addressError");
    const paymentError = document.getElementById("paymentError");

    [nameError, addressError, paymentError].forEach(el => el.classList.remove("visible"));

    let isValid = true;
    if (!fullName.value.trim()) { nameError.classList.add("visible"); isValid = false; }
    if (!address.value.trim()) { addressError.classList.add("visible"); isValid = false; }
    if (!paymentMethod.value) { paymentError.classList.add("visible"); isValid = false; }

    if (!isValid) return;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const paymentLabels = {
        qris: "QRIS",
        ovo: "OVO",
        gopay: "GoPay",
        dana: "DANA",
        linkaja: "LinkAja",
        transfer: "Transfer Bank"
    };
    const paymentLabel = paymentLabels[paymentMethod.value] || paymentMethod.value;

    alert(
        `✅ Pesanan Berhasil!\n\n` +
        `Nama: ${fullName.value.trim()}\n` +
        `Alamat: ${address.value.trim()}\n` +
        `Metode Pembayaran: ${paymentLabel}\n` +
        `Total: ${formatRupiah(total)}\n\n` +
        `Terima kasih telah berbelanja di JIM'S SPORT!`
    );

    checkoutForm.reset();
    cart = [];
    updateCartUI();
    renderProducts();
    closeCheckout();
});

// ---------- MOBILE HAMBURGER ----------
hamburgerToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
});

mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => mobileMenu.classList.remove("open"));
});

// ---------- ESC KEY ----------
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (cartSidebar.classList.contains("open")) closeCart();
        if (checkoutModal.classList.contains("open")) closeCheckout();
        if (loginOverlay.classList.contains("open")) loginOverlay.classList.remove("open");
    }
});

// ---------- INIT ----------
renderProducts();
updateCartUI();
cartBadge.style.display = "none";
// Tampilkan home
navigateTo("home");

console.log("🚀 JIM'S SPORT siap! Selamat berbelanja.");