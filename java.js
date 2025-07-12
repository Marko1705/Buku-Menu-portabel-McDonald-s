const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");
const cartContent = document.querySelector(".cart-content");
const buyNowButton = document.querySelector(".btn-buy");
let cartItemCount = 0;

// Tampilkan cart saat icon diklik
cartIcon.addEventListener("click", (e) => {
  e.stopPropagation();
  cart.classList.add("active");
});

// Sembunyikan cart saat tombol close diklik
cartClose.addEventListener("click", () => {
  cart.classList.remove("active");
});

// Sembunyikan cart saat klik di luar cart
document.addEventListener("click", (e) => {
  if (!cart.contains(e.target) && !cartIcon.contains(e.target)) {
    cart.classList.remove("active");
  }
});

// Tombol tambah ke keranjang
const addCartButtons = document.querySelectorAll(".add-cart");
addCartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const productBox = event.target.closest(".product-box");
    addToCart(productBox);
  });
});

// Fungsi tambah ke cart
const addToCart = (productBox) => {
  const productImgSrc = productBox.querySelector("img").src;
  const productTitle = productBox.querySelector(".product-title").textContent;
  const productPrice = productBox.querySelector(".price").textContent;

  // Cek apakah produk sudah ada di cart
  const cartItems = cartContent.querySelectorAll(".cart-product-title");
  for (let item of cartItems) {
    if (item.textContent === productTitle) {
      alert("Produk ini sudah ada di keranjang.");
      return;
    }
  }

  const cartBox = document.createElement("div");
  cartBox.classList.add("cart-box");
  cartBox.innerHTML = `
    <img src="${productImgSrc}" class="cart-img">
    <div class="cart-detail">
      <h2 class="cart-product-title">${productTitle}</h2>
      <span class="cart-price">${productPrice}</span>
      <div class="cart-quantity">
        <button class="decrement">-</button>
        <span class="number">1</span>
        <button class="increment">+</button>
      </div>
    </div>
    <i class="ri-delete-bin-6-line cart-remove"></i>
  `;

  cartContent.appendChild(cartBox);

  // Event hapus produk
  cartBox.querySelector(".cart-remove").addEventListener("click", (e) => {
    e.stopPropagation();
    cartBox.remove();
    updateCartCount(-1);
    updateTotalPrice();
  });

  // Event tambah/kurang jumlah
  const decrementBtn = cartBox.querySelector(".decrement");
  const incrementBtn = cartBox.querySelector(".increment");
  const numberElement = cartBox.querySelector(".number");

  decrementBtn.addEventListener("click", () => {
    let quantity = parseInt(numberElement.textContent);
    if (quantity > 1) {
      quantity--;
      numberElement.textContent = quantity;
      if (quantity === 1) {
        decrementBtn.style.color = "#999";
      }
    }
    updateTotalPrice();
  });

  incrementBtn.addEventListener("click", () => {
    let quantity = parseInt(numberElement.textContent);
    quantity++;
    numberElement.textContent = quantity;
    decrementBtn.style.color = "#333";
    updateTotalPrice();
  });

  updateCartCount(1);
  updateTotalPrice();
};

// Update total harga
const updateTotalPrice = () => {
  const totalPriceElement = document.querySelector(".total-price");
  const cartBoxes = cartContent.querySelectorAll(".cart-box");
  let total = 0;

  cartBoxes.forEach(cartBox => {
    const priceElement = cartBox.querySelector(".cart-price");
    const quantityElement = cartBox.querySelector(".number");
    const price = parseInt(priceElement.textContent.replace("Rp", "").replace(/\./g, "")) || 0;
    const quantity = parseInt(quantityElement.textContent) || 0;
    total += price * quantity;
  });

  totalPriceElement.textContent = `Rp${total}`;
};

// Update badge jumlah cart
const updateCartCount = (change) => {
  const cartItemCountBadge = document.querySelector(".cart-item-count");
  cartItemCount += change;
  if (cartItemCount > 0) {
    cartItemCountBadge.style.visibility = "visible";
    cartItemCountBadge.textContent = cartItemCount;
  } else {
    cartItemCountBadge.style.visibility = "hidden";
    cartItemCountBadge.textContent = "";
  }
};

// Tombol beli sekarang
buyNowButton.addEventListener("click", () => {
  const cartBoxes = cartContent.querySelectorAll(".cart-box");
  if (cartBoxes.length === 0) {
    alert("Keranjang masih kosong. Silakan tambahkan produk.");
    return;
  }

  cartBoxes.forEach(cartBox => cartBox.remove());
  cartItemCount = 0;
  updateCartCount(0);
  updateTotalPrice();
  alert("Terima kasih telah berbelanja!");
});
