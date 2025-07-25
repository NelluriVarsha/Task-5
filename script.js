let currentUser = null;
let isSignUp = false;

// Toggle between Sign In and Sign Up modes
function toggleAuthMode() {
  isSignUp = !isSignUp;
  document.getElementById("authConfirm").style.display = isSignUp ? "block" : "none";
  document.querySelector("#authForm button").innerText = isSignUp ? "Sign Up" : "Sign In";
  document.getElementById("toggleAuth").innerText = isSignUp
    ? "Have an account? Sign In"
    : "No account? Sign Up";
}

// Handle Sign In or Sign Up
function handleAuth() {
  const email = document.getElementById("authEmail").value.trim();
  const pass = document.getElementById("authPassword").value.trim();
  const confirm = document.getElementById("authConfirm").value.trim();

  if (!email || !pass || (isSignUp && (!confirm || pass !== confirm))) {
    alert("Please fill all fields correctly.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "{}");

  if (isSignUp) {
    if (users[email]) return alert("Account already exists!");
    if (pass.length < 6) return alert("Password must be at least 6 characters.");
    users[email] = { password: pass };
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created! You can now sign in.");
    toggleAuthMode();
  } else {
    if (!users[email] || users[email].password !== pass) return alert("Invalid credentials!");
    currentUser = email;
    document.getElementById("authSection").style.display = "none";
    document.getElementById("mainNav").style.display = "flex";
    document.getElementById("filterBar").style.display = "flex";
    showSection("home");
    renderProducts();
    updateCartCount();
    updateWishlistCount();
  }
}

// Logout function
function logout() {
  currentUser = null;
  document.getElementById("authSection").style.display = "block";
  document.getElementById("mainNav").style.display = "none";
  document.getElementById("filterBar").style.display = "none";
}

// Sample products
const allProducts = [
  {
    name: "Cotton T-Shirt",
    category: "Clothing",
    price: 799,
    image: "https://th.bing.com/th/id/OPAC.EaefKroC8fU8mQ474C474?w=592&h=550&o=5&dpr=1.3&pid=21.1"
  },
  {
    name: "Slim Fit Jeans",
    category: "Clothing",
    price: 2499,
    image: "https://th.bing.com/th/id/OPAC.tgVKCpQsTiYMJw474C474?w=592&h=550&o=5&dpr=1.3&pid=21.1"
  },
  {
    name: "Hooded Sweatshirt",
    category: "Clothing",
    price: 1899,
    image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_750,h_750/global/629648/30/mod01/fnd/IND/fmt/png/WARDROBE-Essentials-Men's-Relaxed-Fit-Hoodie"
  },
  {
    name: "Linen Blend Blazer",
    category: "Clothing",
    price: 3999,
    image: "https://tse2.mm.bing.net/th/id/OIP.bv0qOFBbAj2YhoRkmtUvRQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    name: "Canvas Tote Bag",
    category: "Accessories",
    price: 799,
    image: "https://th.bing.com/th/id/OPAC.OEPal3KuGYMSIQ474C474?w=592&h=550&o=5&dpr=1.3&pid=21.1"
  },
  {
    name: "Lace-Up Sneakers",
    category: "Footwear",
    price: 2299,
    image: "https://cdn.fcglcdn.com/brainbees/images/products/583x720/20393059a.webp"
  },
  {
    name: "SmartWatch",
    category: "Electronic",
    price: 2399,
    image: "https://th.bing.com/th/id/OIP.S6LVpcus-t_YW3LJ6lBzmgAAAA?w=156&h=196&c=7&r=0&o=5&dpr=1.3&pid=1.7"
  }
];



// Render product listing
function renderProducts() {
  const section = document.getElementById("home");
  section.innerHTML = "<h2>Products</h2>";
  let filtered = [...allProducts];
  const search = document.getElementById("searchInput").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const sort = document.getElementById("sortOption").value;

  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
  if (category !== "All") filtered = filtered.filter(p => p.category === category);
  if (sort === "price") filtered.sort((a,b) => a.price - b.price);
  if (sort === "name") filtered.sort((a,b) => a.name.localeCompare(b.name));

  filtered.forEach(p => {
    section.innerHTML += `
      <div class="product">
        <img src="${p.image}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p>₹${p.price.toLocaleString()}</p>
        <button onclick="showDetails('${p.name}', '${p.category}', ${p.price}, '${p.image}')">Details</button>
        <button onclick="addToCart('${p.name}', ${p.price}, '${p.image}')">Add to Cart</button>
        <button onclick="addToWishlist('${p.name}', ${p.price}, '${p.image}')">Wishlist</button>
      </div>
    `;
  });
}

// Show product detail modal
function showDetails(name, category, price, image) {
  document.getElementById("modalName").innerText = name;
  document.getElementById("modalCategory").innerText = `Category: ${category}`;
  document.getElementById("modalPrice").innerText = `Price: ₹${price.toLocaleString()}`;
  document.getElementById("modalImage").src = image;
  document.getElementById("productModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("productModal").style.display = "none";
}

// Add product to cart
function addToCart(name, price, image) {
  let cart = JSON.parse(localStorage.getItem(`${currentUser}_cart`) || "[]");
  if (cart.some(p => p.name === name)) {
    alert("Item already in cart.");
    return;
  }
  cart.push({ name, price, image });
  localStorage.setItem(`${currentUser}_cart`, JSON.stringify(cart));
  updateCartCount();
  alert(`${name} added to cart!`);
}

// Add product to wishlist
function addToWishlist(name, price, image) {
  let wishlist = JSON.parse(localStorage.getItem(`${currentUser}_wishlist`) || "[]");
  if (wishlist.some(p => p.name === name)) {
    alert("Item already in wishlist.");
    return;
  }
  wishlist.push({ name, price, image });
  localStorage.setItem(`${currentUser}_wishlist`, JSON.stringify(wishlist));
  updateWishlistCount();
  alert(`${name} added to wishlist!`);
}

// Update cart count badge
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem(`${currentUser}_cart`) || "[]");
  document.getElementById("cartCount").innerText = cart.length;
}

// Update wishlist count badge
function updateWishlistCount() {
  const wishlist = JSON.parse(localStorage.getItem(`${currentUser}_wishlist`) || "[]");
  document.getElementById("wishlistCount").innerText = wishlist.length;
}

// Show selected section
function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.style.display = "none");
  document.getElementById(id).style.display = "block";
  if (id === "cart") renderCart();
  if (id === "wishlist") renderWishlist();
}

// Render cart items
function renderCart() {
  const cart = JSON.parse(localStorage.getItem(`${currentUser}_cart`) || "[]");
  const section = document.getElementById("cart");
  section.innerHTML = "<h2>Your Cart</h2>";
  if (!cart.length) {
    section.innerHTML += "<p>Cart is empty.</p>";
    return;
  }
  let total = 0;
  cart.forEach((p, i) => {
    total += p.price;
    section.innerHTML += `
      <div class="product">
        <img src="${p.image}" />
        <h3>${p.name}</h3>
        <p>₹${p.price.toLocaleString()}</p>
        <button onclick="removeCartItem(${i})">Remove</button>
      </div>
    `;
  });
  section.innerHTML += `<h3>Total: ₹${total.toLocaleString()}</h3>`;
}

// Remove from cart
function removeCartItem(i) {
  const cart = JSON.parse(localStorage.getItem(`${currentUser}_cart`) || "[]");
  cart.splice(i, 1);
  localStorage.setItem(`${currentUser}_cart`, JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

// Render wishlist
function renderWishlist() {
  const wishlist = JSON.parse(localStorage.getItem(`${currentUser}_wishlist`) || "[]");
  const section = document.getElementById("wishlist");
  section.innerHTML = "<h2>Your Wishlist</h2>";
  if (!wishlist.length) {
    section.innerHTML += "<p>Wishlist is empty.</p>";
    return;
  }
  wishlist.forEach((p, i) => {
    section.innerHTML += `
      <div class="product">
        <img src="${p.image}" />
        <h3>${p.name}</h3>
        <p>₹${p.price.toLocaleString()}</p>
        <button onclick="removeWishlistItem(${i})">Remove</button>
        <button onclick="addToCart('${p.name}', ${p.price}, '${p.image}')">Add to Cart</button>
      </div>
    `;
  });
}

// Remove from wishlist
function removeWishlistItem(i) {
  const wishlist = JSON.parse(localStorage.getItem(`${currentUser}_wishlist`) || "[]");
  wishlist.splice(i, 1);
  localStorage.setItem(`${currentUser}_wishlist`, JSON.stringify(wishlist));
  renderWishlist();
  updateWishlistCount();
}

// Background color changer
setInterval(() => {
  document.body.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 90%)`;
}, 3000);

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}
