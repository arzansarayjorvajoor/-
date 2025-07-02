let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let total = parseInt(localStorage.getItem("total")) || 0;

// افزودن کالا به سبد خرید
function addToCart(productName, price) {
  cartItems.push({ name: productName, price: price });
  total += price;
  saveCart();
  updateCart();
}

// حذف کالا از سبد خرید
function removeFromCart(index) {
  total -= cartItems[index].price;
  cartItems.splice(index, 1);
  saveCart();
  updateCart();
}

// نمایش تعداد اقلام در آیکون سبد خرید
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  const count = cartItems.length;

  if (count > 0) {
    cartCount.style.display = "inline-block";
    cartCount.textContent = count;
  } else {
    cartCount.style.display = "none";
  }
}

// به‌روزرسانی لیست سبد خرید کشویی
function updateCart() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = "";

  cartItems.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${index + 1}. ${item.name} - ${item.price.toLocaleString()} تومان</span>
      <button onclick="removeFromCart(${index})">حذف</button>
    `;
    cartList.appendChild(li);
  });

  // حذف جمع کل قبلی
  const existingTotal = document.querySelector(".cart-drawer p.total");
  if (existingTotal) existingTotal.remove();

  // نمایش جمع کل جدید
  const totalElement = document.createElement("p");
  totalElement.className = "total";
  totalElement.textContent = `جمع کل: ${total.toLocaleString()} تومان`;
  document.querySelector(".cart-drawer").appendChild(totalElement);

  updateCartCount();
}

// ذخیره سبد خرید در localStorage
function saveCart() {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  localStorage.setItem("total", total.toString());
}

// باز و بسته کردن کشویی سبد خرید
const cartIcon = document.getElementById("cart-icon");
const cartDrawer = document.querySelector(".cart-drawer");

cartIcon.addEventListener("click", () => {
  cartDrawer.classList.toggle("open");
});

// ارسال سفارش به واتساپ
function submitOrder(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!name || !phone || !address) {
    alert("لطفاً همه فیلدها را پر کنید.");
    return;
  }

  if (cartItems.length === 0) {
    alert("سبد خرید شما خالی است!");
    return;
  }

  let message = `🛒 سفارش جدید\n`;
  message += `👤 نام: ${name}\n📞 شماره: ${phone}\n🏠 آدرس: ${address}\n\n📦 محصولات:\n`;

  cartItems.forEach((item, i) => {
    message += `${i + 1}. ${item.name} - ${item.price.toLocaleString()} تومان\n`;
  });

  message += `\n💰 جمع کل: ${total.toLocaleString()} تومان`;

  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = "989901363145"; // بدون صفر اول، عددی
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  window.location.href = whatsappLink;

  // پاک کردن سبد پس از ارسال
  cartItems = [];
  total = 0;
  saveCart();
  updateCart();

  // پاک کردن فرم
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("address").value = "";
}

// جستجو در محصولات
function searchProducts() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const products = document.querySelectorAll(".product");

  products.forEach(product => {
    const title = product.querySelector("h2").textContent.toLowerCase();
    const description = product.querySelector("p").textContent.toLowerCase();
    if (title.includes(input) || description.includes(input)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

// دکمه بازگشت به بالا
const backToTopBtn = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// حالت تاریک / روشن (مود)
window.onload = () => {
  updateCart();

  // بارگذاری حالت تاریک از localStorage
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  }

  // دکمه تغییر حالت مود
  const modeToggleBtn = document.getElementById("modeToggle");
  modeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const darkModeActive = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", darkModeActive.toString());

    if (darkModeActive) {
      modeToggleBtn.textContent = "☀️";
      modeToggleBtn.title = "حالت روشن";
    } else {
      modeToggleBtn.textContent = "🌓";
      modeToggleBtn.title = "حالت تاریک";
    }
  });

  // تنظیم اولیه آیکون دکمه مود
  if (isDarkMode) {
    modeToggleBtn.textContent = "☀️";
    modeToggleBtn.title = "حالت روشن";
  } else {
    modeToggleBtn.textContent = "🌓";
    modeToggleBtn.title = "حالت تاریک";
  }
};