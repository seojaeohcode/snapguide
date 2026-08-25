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
const storeView = document.querySelector("#store-view");
const referenceView = document.querySelector("#reference-view");
const viewTabs = [...document.querySelectorAll(".view-tab")];
const brandStore = document.querySelector(".brand-store");
const referenceGrid = document.querySelector("#reference-grid");
let toastTimer;

const referenceState = {
  category: "전체",
  minSimilarity: 85,
  angle: "전체",
  light: "전체",
  verifiedOnly: true,
  query: "",
  sort: "popular"
};

const referenceItems = [
  { title: "실버 맥북 · 침구 위", image: "assets/macbook.webp", category: "전자기기", label: "노트북", similarity: 94, angle: "45°", light: "자연광", zoom: "1배줌", horizon: "수평 0°", verified: true, price: "4,900원", order: 8, tags: ["금속 질감", "소프트 그림자"] },
  { title: "월넛 사이드 테이블", image: "assets/side-table.webp", category: "가구", label: "사이드 테이블", similarity: 92, angle: "45°", light: "자연광", zoom: "1배줌", horizon: "수평 0°", verified: true, price: "4,900원", order: 7, tags: ["우드 톤", "창가 빛"] },
  { title: "진회색 스포츠카", image: "assets/car.webp", category: "자동차·이동수단", label: "스포츠카", similarity: 96, angle: "0°", light: "역광", zoom: "1.5배줌", horizon: "수평 0°", verified: true, price: "5,900원", order: 6, tags: ["젖은 노면", "대칭 구도"] },
  { title: "새틴 위 투명 향수", image: "assets/perfume.webp", category: "화장품", label: "향수", similarity: 93, angle: "45°", light: "자연광", zoom: "2배줌", horizon: "수평 0°", verified: true, price: "4,900원", order: 5, tags: ["유리 반사", "베이지 톤"] },
  { title: "블랙 골드 립스틱", image: "assets/lipstick.webp", category: "화장품", label: "립스틱", similarity: 92, angle: "45°", light: "측광", zoom: "1배줌", horizon: "수평 0°", verified: true, price: "3,900원", order: 4, tags: ["하이 콘트라스트", "금속 포인트"] },
  { title: "크림 모노그램 바니티", image: "assets/vanity-bag.webp", category: "가방", label: "바니티 백", similarity: 91, angle: "45°", light: "자연광", zoom: "1배줌", horizon: "수평 0°", verified: true, price: "4,900원", order: 3, tags: ["가죽 질감", "골드 체인"] },
  { title: "빈티지 레드 바이크", image: "assets/bicycle.webp", category: "자동차·이동수단", label: "이동수단", similarity: 90, angle: "90°", light: "스튜디오", zoom: "1배줌", horizon: "수평 0°", verified: true, price: "3,900원", order: 2, tags: ["레드 포인트", "제품 전체"] },
  { title: "여름 시트러스 드링크", image: "assets/fruit-drinks.jpg", category: "음식·음료", label: "음료", similarity: 94, angle: "45°", light: "자연광", zoom: "1배줌", horizon: "수평 0°", verified: false, price: "4,900원", order: 1, tags: ["오렌지 톤", "홍보 스타일"] }
];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function setCategory(category) {
  state.category = category;
  categoryButtons.forEach((button) => button.classList.toggle("active", button.dataset.category === category));
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
  const referenceCapture = event.target.closest("[data-reference-capture]");
  if (referenceCapture) showToast(`${referenceCapture.dataset.referenceCapture}의 촬영값을 불러왔습니다.`);
  const referenceSave = event.target.closest("[data-reference-save]");
  if (referenceSave) showToast(`${referenceSave.dataset.referenceSave} 레퍼런스를 저장했습니다.`);
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

function setView(view) {
  const isReference = view === "reference";
  storeView.hidden = isReference;
  referenceView.hidden = !isReference;
  viewTabs.forEach((tab) => {
    const active = tab.dataset.view === view;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  document.body.classList.toggle("reference-mode", isReference);
  brandStore.textContent = isReference ? "REFERENCE" : "STORE";
  history.replaceState(null, "", isReference ? "#reference" : "#store");
  cartButton.hidden = isReference;
  if (isReference) {
    cartDrawer.hidden = true;
    cartButton.setAttribute("aria-expanded", "false");
    renderReferenceCards();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

viewTabs.forEach((tab) => tab.addEventListener("click", () => setView(tab.dataset.view)));

function matchesReference(item) {
  const query = referenceState.query.trim().toLowerCase();
  const searchable = [item.title, item.category, item.label, item.angle, item.light, item.zoom, ...item.tags].join(" ").toLowerCase();
  return (!query || searchable.includes(query)) &&
    (referenceState.category === "전체" || item.category === referenceState.category) &&
    item.similarity >= referenceState.minSimilarity &&
    (referenceState.angle === "전체" || item.angle === referenceState.angle) &&
    (referenceState.light === "전체" || item.light === referenceState.light) &&
    (!referenceState.verifiedOnly || item.verified);
}

function renderReferenceCards() {
  let items = referenceItems.filter(matchesReference);
  if (referenceState.sort === "latest") items = [...items].sort((a, b) => b.order - a.order);
  if (referenceState.sort === "similar") items = [...items].sort((a, b) => b.similarity - a.similarity);
  document.querySelector("#reference-result-count").textContent = `${items.length}장 표시`;
  document.querySelector("#reference-page-title").textContent = referenceState.category === "전체" ? "전체 레퍼런스" : referenceState.category;
  referenceGrid.innerHTML = items.length ? items.map((item) => `
    <article class="reference-card">
      <div class="reference-card-media"><img src="${item.image}" alt="${item.title}" loading="lazy" /><button class="reference-capture" type="button" data-reference-capture="${item.title}">이 값으로 촬영</button></div>
      <div class="reference-card-info"><div class="reference-card-type"><span>${item.label}</span><small>${item.similarity}% 유사</small></div><h3>${item.title}</h3><div class="reference-meta"><span class="primary">${item.angle}</span><span class="primary">${item.light}</span><span>${item.zoom}</span><span>${item.horizon}</span>${item.tags.map((tag) => `<span>${tag}</span>`).join("")}</div><div class="reference-card-footer"><span>${item.price}</span><button type="button" data-reference-save="${item.title}" aria-label="${item.title} 저장">♡</button></div></div>
    </article>`).join("") : `<p class="empty-products">조건에 맞는 레퍼런스가 없습니다.</p>`;
}

document.querySelectorAll(".reference-category").forEach((button) => button.addEventListener("click", () => {
  referenceState.category = button.dataset.refCategory;
  document.querySelectorAll(".reference-category").forEach((item) => item.classList.toggle("active", item === button));
  renderReferenceCards();
}));

document.querySelectorAll(".ref-chips").forEach((group) => group.addEventListener("click", (event) => {
  const chip = event.target.closest(".ref-chip");
  if (!chip) return;
  const type = group.dataset.refFilter;
  referenceState[type] = chip.dataset.value;
  group.querySelectorAll(".ref-chip").forEach((item) => item.classList.toggle("active", item === chip));
  renderReferenceCards();
}));

document.querySelector("#ref-similarity-range").addEventListener("input", (event) => {
  referenceState.minSimilarity = Number(event.target.value);
  document.querySelector("#ref-similarity-value").textContent = `${referenceState.minSimilarity}% 이상`;
  renderReferenceCards();
});

document.querySelectorAll(".reference-sort-button").forEach((button) => button.addEventListener("click", () => {
  referenceState.sort = button.dataset.refSort;
  document.querySelectorAll(".reference-sort-button").forEach((item) => item.classList.toggle("active", item === button));
  renderReferenceCards();
}));

document.querySelector("#reference-search-input").addEventListener("input", (event) => {
  referenceState.query = event.target.value;
  renderReferenceCards();
});

document.querySelector("#reference-verified-toggle").addEventListener("click", (event) => {
  referenceState.verifiedOnly = !referenceState.verifiedOnly;
  event.currentTarget.classList.toggle("active", referenceState.verifiedOnly);
  event.currentTarget.setAttribute("aria-checked", String(referenceState.verifiedOnly));
  renderReferenceCards();
});

renderReferenceCards();
if (window.location.hash === "#reference" || new URLSearchParams(window.location.search).get("view") === "reference") setView("reference");
