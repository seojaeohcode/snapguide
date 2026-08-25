const state = {
  category: "전체",
  query: "",
  cart: []
};

const toast = document.querySelector("#toast");
const productCards = [...document.querySelectorAll(".product-card")];
const categoryButtons = [...document.querySelectorAll(".category-pill")];
const searchInput = document.querySelector("#store-search-input");
const emptyProducts = document.querySelector("#empty-products");
const cartButton = document.querySelector("#cart-button");
const cartDrawer = document.querySelector("#cart-drawer");
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function setCategory(category) {
  state.category = category;
  categoryButtons.forEach((button) => button.classList.toggle("active", button.dataset.category === category));
  document.querySelectorAll(".nav-link").forEach((link) => {
    const linkCategory = link.dataset.categoryLink || (link.getAttribute("href") === "#products" && link.textContent.trim() === "스마트 조명" ? "스마트 조명" : null);
    link.classList.toggle("active", linkCategory === category);
  });
  applyProductFilters();
}

function applyProductFilters() {
  const query = state.query.trim().toLowerCase();
  let visible = 0;
  productCards.forEach((card) => {
    const searchable = card.dataset.search.toLowerCase();
    const matchesCategory = state.category === "전체" || card.dataset.category === state.category;
    const matchesSearch = !query || searchable.includes(query);
    const shouldShow = matchesCategory && matchesSearch;
    card.classList.toggle("is-hidden", !shouldShow);
    if (shouldShow) visible += 1;
  });
  emptyProducts.hidden = visible > 0;
}

categoryButtons.forEach((button) => button.addEventListener("click", () => {
  setCategory(button.dataset.category);
  document.querySelector("#products").scrollIntoView({ behavior: "smooth", block: "start" });
}));

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  applyProductFilters();
  if (state.query.trim()) document.querySelector("#products").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("#show-all-products").addEventListener("click", () => {
  searchInput.value = "";
  state.query = "";
  setCategory("전체");
  document.querySelector("#products").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelectorAll("[data-category-link]").forEach((link) => link.addEventListener("click", (event) => {
  event.preventDefault();
  const category = link.dataset.categoryLink;
  if (category === "패키지") {
    document.querySelector("#packages").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  setCategory(category);
  document.querySelector("#products").scrollIntoView({ behavior: "smooth", block: "start" });
}));

function formatPrice(price) {
  return `${Number(price).toLocaleString("ko-KR")}원`;
}

function renderCart() {
  const quantity = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = quantity;
  cartTotal.textContent = formatPrice(total);
  cartItems.innerHTML = state.cart.length ? state.cart.map((item) => `
    <div class="cart-item">
      <div class="cart-item-info"><strong>${item.name}</strong><span>${formatPrice(item.price)} · ${item.quantity}개</span></div>
      <button class="cart-item-remove" type="button" data-remove-cart="${item.name}" aria-label="${item.name} 삭제">×</button>
    </div>`).join("") : `<p class="cart-empty">아직 담긴 상품이 없습니다.</p>`;
}

function addToCart(name, price) {
  const existing = state.cart.find((item) => item.name === name);
  if (existing) existing.quantity += 1;
  else state.cart.push({ name, price: Number(price), quantity: 1 });
  renderCart();
  showToast(`${name}을(를) 장바구니에 담았습니다.`);
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const removeButton = event.target.closest("[data-remove-cart]");
  const toastButton = event.target.closest("[data-toast]");
  if (addButton) addToCart(addButton.dataset.add, addButton.dataset.price);
  if (removeButton) {
    state.cart = state.cart.filter((item) => item.name !== removeButton.dataset.removeCart);
    renderCart();
  }
  if (toastButton) showToast(toastButton.dataset.toast);
});

cartButton.addEventListener("click", (event) => {
  event.stopPropagation();
  const nextOpen = cartDrawer.hidden;
  cartDrawer.hidden = !nextOpen;
  cartButton.setAttribute("aria-expanded", String(nextOpen));
});

document.querySelector("#cart-close").addEventListener("click", () => {
  cartDrawer.hidden = true;
  cartButton.setAttribute("aria-expanded", "false");
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".cart-drawer") && !event.target.closest("#cart-button")) {
    cartDrawer.hidden = true;
    cartButton.setAttribute("aria-expanded", "false");
  }
});

renderCart();
applyProductFilters();
