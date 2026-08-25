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
  subcategory: "전체",
  angle: "전체",
  light: "전체",
  verifiedOnly: true,
  query: "",
  sort: "popular"
};

const referenceSubcategories = {
  전체: ["전체", "노트북", "카메라", "스마트폰", "헤드폰", "키보드", "테이블", "의자", "스포츠카", "SUV", "자전거", "음료", "디저트", "커피", "선글라스", "스니커즈", "바니티 백", "백팩", "향수", "립스틱", "메이크업", "스킨케어", "시계", "주얼리", "화병", "플랜트"],
  전자기기: ["전체", "노트북", "카메라", "스마트폰", "헤드폰", "키보드", "태블릿"],
  가구: ["전체", "사이드 테이블", "소파", "의자", "수납장"],
  "자동차·이동수단": ["전체", "스포츠카", "SUV", "자전거"],
  "음식·음료": ["전체", "음료", "디저트", "커피", "샐러드"],
  패션소품: ["전체", "선글라스", "스니커즈", "패션"],
  가방: ["전체", "바니티 백", "핸드백", "백팩"],
  화장품: ["전체", "향수", "립스틱", "메이크업", "스킨케어"],
  "주얼리·시계": ["전체", "시계", "주얼리"],
  "홈·인테리어": ["전체", "사이드 테이블", "램프", "화병", "플랜트"]
};

const referenceItems = [
  { title: "실버 맥북 · 침구 위", image: "assets/macbook.webp", category: "전자기기", subcategory: "노트북", label: "노트북", similarity: 94, angle: "45°", light: "자연광", zoom: "1배줌", horizon: "수평 0°", verified: true, price: "4,900원", order: 20, tags: ["금속 질감", "소프트 그림자", "침구 배경"] },
  { title: "월넛 사이드 테이블", image: "assets/side-table.webp", category: "가구", subcategory: "사이드 테이블", label: "사이드 테이블", similarity: 92, angle: "45°", light: "자연광", zoom: "1배줌", horizon: "수평 0°", verified: true, price: "4,900원", order: 19, tags: ["우드 톤", "창가 빛", "오브제 배치"] },
  { title: "진회색 스포츠카", image: "assets/car.webp", category: "자동차·이동수단", subcategory: "스포츠카", label: "스포츠카", similarity: 96, angle: "0°", light: "역광", zoom: "1.5배줌", horizon: "수평 0°", verified: true, price: "5,900원", order: 18, tags: ["젖은 노면", "대칭 구도", "안개 톤"] },
  { title: "새틴 위 투명 향수", image: "assets/perfume.webp", category: "화장품", subcategory: "향수", label: "향수", similarity: 93, angle: "45°", light: "자연광", zoom: "2배줌", horizon: "수평 0°", verified: true, price: "4,900원", order: 17, tags: ["유리 반사", "베이지 톤", "새틴 텍스처"] },
  { title: "블랙 골드 립스틱", image: "assets/lipstick.webp", category: "화장품", subcategory: "립스틱", label: "립스틱", similarity: 92, angle: "45°", light: "측광", zoom: "1배줌", horizon: "수평 0°", verified: true, price: "3,900원", order: 16, tags: ["하이 콘트라스트", "금속 포인트", "오픈 패키지"] },
  { title: "크림 모노그램 바니티", image: "assets/vanity-bag.webp", category: "가방", subcategory: "바니티 백", label: "바니티 백", similarity: 91, angle: "45°", light: "자연광", zoom: "1배줌", horizon: "수평 0°", verified: true, price: "4,900원", order: 15, tags: ["가죽 질감", "골드 체인", "웜 뉴트럴"] },
  { title: "빈티지 레드 바이크", image: "assets/bicycle.webp", category: "자동차·이동수단", subcategory: "자전거", label: "자전거", similarity: 90, angle: "90°", light: "스튜디오", zoom: "1배줌", horizon: "수평 0°", verified: true, price: "3,900원", order: 14, tags: ["레드 포인트", "제품 전체", "빈티지 무드"] },
  { title: "여름 시트러스 드링크", image: "assets/fruit-drinks.jpg", category: "음식·음료", subcategory: "음료", label: "음료", similarity: 94, angle: "45°", light: "자연광", zoom: "1배줌", horizon: "수평 0°", verified: true, price: "4,900원", order: 13, tags: ["오렌지 톤", "홍보 스타일", "과일 소품"] },
  { title: "화이트 스마트폰 플랫레이", image: "assets/smartphone.jpg", category: "전자기기", subcategory: "스마트폰", label: "스마트폰", similarity: 93, angle: "45°", light: "자연광", zoom: "2배줌", horizon: "수평 0°", verified: true, price: "4,900원", order: 12, tags: ["화이트 배경", "대각선 구도", "데스크 셋업"] },
  { title: "미니멀 블랙 키보드", image: "assets/keyboard.jpg", category: "전자기기", subcategory: "키보드", label: "키보드", similarity: 91, angle: "0°", light: "측광", zoom: "1.5배줌", horizon: "수평 0°", verified: true, price: "4,900원", order: 11, tags: ["키캡 디테일", "하드 그림자", "제품 정렬"] },
  { title: "실버 태블릿 · 책상 위", image: "assets/tablet.jpg", category: "전자기기", subcategory: "태블릿", label: "태블릿", similarity: 90, angle: "45°", light: "자연광", zoom: "1.5배줌", horizon: "수평 0°", verified: true, price: "4,900원", order: 10, tags: ["실버 바디", "탑뷰", "소프트 톤"] },
  { title: "블랙 미니멀 백팩", image: "assets/backpack.jpg", category: "가방", subcategory: "백팩", label: "백팩", similarity: 92, angle: "45°", light: "자연광", zoom: "1.5배줌", horizon: "수평 0°", verified: true, price: "4,900원", order: 9, tags: ["패브릭 질감", "건축 그림자", "정면 제품샷"] },
  { title: "골드 주얼리 클로즈업", image: "assets/jewelry.jpg", category: "주얼리·시계", subcategory: "주얼리", label: "주얼리", similarity: 94, angle: "45°", light: "스튜디오", zoom: "2배줌", horizon: "수평 0°", verified: true, price: "5,900원", order: 8, tags: ["골드 반사", "매크로 디테일", "블랙 배경"] },
  { title: "크림 라떼 · 카페 테이블", image: "assets/coffee.jpg", category: "음식·음료", subcategory: "커피", label: "커피", similarity: 90, angle: "45°", light: "자연광", zoom: "1배줌", horizon: "수평 0°", verified: true, price: "3,900원", order: 7, tags: ["브라운 톤", "카페 무드", "스팀 디테일"] },
  { title: "컬러 샐러드 플랫레이", image: "assets/salad.jpg", category: "음식·음료", subcategory: "샐러드", label: "샐러드", similarity: 89, angle: "90°", light: "자연광", zoom: "1배줌", horizon: "수평 0°", verified: true, price: "3,900원", order: 6, tags: ["탑뷰", "컬러 대비", "플레이팅"] },
  { title: "세라믹 화병 · 선반 위", image: "assets/vase.jpg", category: "홈·인테리어", subcategory: "화병", label: "화병", similarity: 92, angle: "0°", light: "자연광", zoom: "1배줌", horizon: "수평 0°", verified: true, price: "3,900원", order: 5, tags: ["세라믹 질감", "선반 스타일링", "뉴트럴 배경"] },
  { title: "그린 플랜트 인테리어", image: "assets/plant.jpg", category: "홈·인테리어", subcategory: "플랜트", label: "플랜트", similarity: 90, angle: "45°", light: "자연광", zoom: "1배줌", horizon: "수평 0°", verified: true, price: "3,900원", order: 4, tags: ["그린 포인트", "창가 빛", "생활 공간"] },
  { title: "웜톤 아이섀도 팔레트", image: "assets/makeup-palette.jpg", category: "화장품", subcategory: "메이크업", label: "메이크업", similarity: 91, angle: "45°", light: "스튜디오", zoom: "2배줌", horizon: "수평 0°", verified: true, price: "4,900원", order: 3, tags: ["컬러 스와치", "웜톤", "탑뷰"] },
  { title: "민트 타일 스킨케어", image: "assets/skincare.jpg", category: "화장품", subcategory: "스킨케어", label: "스킨케어", similarity: 90, angle: "0°", light: "스튜디오", zoom: "2배줌", horizon: "수평 0°", verified: true, price: "4,900원", order: 2, tags: ["물방울 질감", "민트 톤", "욕실 배경"] },
  { title: "실버 SUV · 안개 숲", image: "assets/suv.jpg", category: "자동차·이동수단", subcategory: "SUV", label: "SUV", similarity: 93, angle: "0°", light: "역광", zoom: "1.5배줌", horizon: "수평 0°", verified: true, price: "5,900원", order: 1, tags: ["차량 정면", "안개 톤", "로케이션 촬영"] }
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
  const searchable = [item.title, item.category, item.subcategory, item.label, item.angle, item.light, item.zoom, item.horizon, ...item.tags].join(" ").toLowerCase();
  return (!query || searchable.includes(query)) &&
    (referenceState.category === "전체" || item.category === referenceState.category) &&
    (referenceState.subcategory === "전체" || item.subcategory === referenceState.subcategory) &&
    (referenceState.angle === "전체" || item.angle === referenceState.angle) &&
    (referenceState.light === "전체" || item.light === referenceState.light) &&
    (!referenceState.verifiedOnly || item.verified);
}

function renderSubcategories() {
  const container = document.querySelector("#reference-subcategories");
  if (!container) return;
  const options = referenceSubcategories[referenceState.category] || referenceSubcategories.전체;
  if (!options.includes(referenceState.subcategory)) referenceState.subcategory = "전체";
  container.innerHTML = options.map((subcategory) => `<button class="reference-subcategory${subcategory === referenceState.subcategory ? " active" : ""}" type="button" data-ref-subcategory="${subcategory}">${subcategory}</button>`).join("");
  container.querySelectorAll(".reference-subcategory").forEach((button) => button.addEventListener("click", () => {
    referenceState.subcategory = button.dataset.refSubcategory;
    container.querySelectorAll(".reference-subcategory").forEach((item) => item.classList.toggle("active", item === button));
    renderReferenceCards();
  }));
}

function renderReferenceCards() {
  let items = referenceItems.filter(matchesReference);
  if (referenceState.sort === "latest") items = [...items].sort((a, b) => b.order - a.order);
  document.querySelector("#reference-result-count").textContent = `${items.length}장 표시`;
  document.querySelector("#reference-page-title").textContent = referenceState.subcategory !== "전체" ? referenceState.subcategory : referenceState.category === "전체" ? "전체 레퍼런스" : referenceState.category;
  referenceGrid.innerHTML = items.length ? items.map((item) => `
    <article class="reference-card">
      <div class="reference-card-media"><img src="${item.image}" alt="${item.title}" loading="lazy" /><button class="reference-capture" type="button" data-reference-capture="${item.title}">이 값으로 촬영</button></div>
      <div class="reference-card-info"><div class="reference-card-type"><span>${item.label}</span><small>${item.similarity}% 유사</small></div><h3>${item.title}</h3><div class="reference-meta"><span class="primary">${item.angle}</span><span class="primary">${item.light}</span><span>${item.zoom}</span><span>${item.horizon}</span>${item.tags.map((tag) => `<span>${tag}</span>`).join("")}</div><div class="reference-card-footer"><span>${item.price}</span><button type="button" data-reference-save="${item.title}" aria-label="${item.title} 저장">♡</button></div></div>
    </article>`).join("") : `<p class="empty-products">조건에 맞는 레퍼런스가 없습니다.</p>`;
}

document.querySelectorAll(".reference-category").forEach((button) => button.addEventListener("click", () => {
  referenceState.category = button.dataset.refCategory;
  referenceState.subcategory = "전체";
  document.querySelectorAll(".reference-category").forEach((item) => item.classList.toggle("active", item === button));
  renderSubcategories();
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

renderSubcategories();
renderReferenceCards();
if (window.location.hash === "#reference" || new URLSearchParams(window.location.search).get("view") === "reference") setView("reference");
