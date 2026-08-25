const references = [
  {
    title: "실버 맥북 · 침구 위",
    image: "assets/macbook.webp",
    category: "가전제품",
    similarity: 94,
    angle: "45°",
    light: "자연광",
    zoom: "1배줌",
    horizon: "수평 0°",
    verified: true,
    price: "4,900원",
    order: 8,
    tags: ["금속 질감", "소프트 그림자", "제품 정면"]
  },
  {
    title: "월넛 사이드 테이블",
    image: "assets/side-table.webp",
    category: "가구",
    similarity: 92,
    angle: "45°",
    light: "자연광",
    zoom: "1배줌",
    horizon: "수평 0°",
    verified: true,
    price: "4,900원",
    order: 7,
    tags: ["우드 톤", "창가 빛", "수직 구도"]
  },
  {
    title: "진회색 스포츠카",
    image: "assets/car.webp",
    category: "자동차",
    similarity: 96,
    angle: "0°",
    light: "역광",
    zoom: "1.5배줌",
    horizon: "수평 0°",
    verified: true,
    price: "5,900원",
    order: 6,
    tags: ["젖은 노면", "대칭 구도", "안개 배경"]
  },
  {
    title: "새틴 위 투명 향수",
    image: "assets/perfume.webp",
    category: "화장품",
    similarity: 93,
    angle: "45°",
    light: "자연광",
    zoom: "2배줌",
    horizon: "수평 0°",
    verified: true,
    price: "4,900원",
    order: 5,
    tags: ["유리 반사", "베이지 톤", "새틴 질감"]
  },
  {
    title: "블랙 골드 립스틱",
    image: "assets/lipstick.webp",
    category: "화장품",
    similarity: 92,
    angle: "45°",
    light: "측광",
    zoom: "1배줌",
    horizon: "수평 0°",
    verified: true,
    price: "3,900원",
    order: 4,
    tags: ["하이 콘트라스트", "화이트 배경", "금속 포인트"]
  },
  {
    title: "크림 모노그램 바니티",
    image: "assets/vanity-bag.webp",
    category: "화장품",
    similarity: 91,
    angle: "45°",
    light: "자연광",
    zoom: "1배줌",
    horizon: "수평 0°",
    verified: true,
    price: "4,900원",
    order: 3,
    tags: ["가죽 질감", "골드 체인", "중앙 배치"]
  },
  {
    title: "빈티지 레드 바이크",
    image: "assets/bicycle.webp",
    category: "자동차",
    categoryLabel: "이동수단",
    similarity: 90,
    angle: "90°",
    light: "스튜디오",
    zoom: "1배줌",
    horizon: "수평 0°",
    verified: true,
    price: "3,900원",
    order: 2,
    tags: ["레드 포인트", "제품 전체", "그레이 배경"]
  },
  {
    title: "여름 시트러스 드링크",
    image: "assets/fruit-drinks.jpg",
    category: "음식",
    similarity: 94,
    angle: "45°",
    light: "자연광",
    zoom: "1배줌",
    horizon: "수평 0°",
    verified: false,
    price: "4,900원",
    order: 1,
    tags: ["오렌지 톤", "과일 소품", "홍보 스타일"]
  }
];

const libraryCounts = { 전체: "1,284", 가전제품: "312", 가구: "198", 자동차: "241", 음식: "176", 화장품: "157" };
const state = { sort: "popular", query: "", category: "전체", minSimilarity: 85, angle: null, light: null, verifiedOnly: true };
const grid = document.querySelector("#reference-grid");
const resultCount = document.querySelector("#result-count");
const pageTitle = document.querySelector("#page-title");
const pageSubtitle = document.querySelector("#page-subtitle");
const toast = document.querySelector("#toast");
let toastTimer;

function iconDownload() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v11"></path><path d="m7.5 10.5 4.5 4.5 4.5-4.5"></path><path d="M4 20h16"></path></svg>`;
}

function matchesFilters(item) {
  const query = state.query.trim().toLowerCase();
  const searchable = [item.title, item.category, item.categoryLabel, item.angle, item.light, item.zoom, item.horizon, ...item.tags].filter(Boolean).join(" ").toLowerCase();
  return (!query || searchable.includes(query)) &&
    (state.category === "전체" || item.category === state.category) &&
    item.similarity >= state.minSimilarity &&
    (!state.angle || item.angle === state.angle) &&
    (!state.light || item.light === state.light) &&
    (!state.verifiedOnly || item.verified);
}

function getVisibleItems() {
  const items = references.filter(matchesFilters);
  if (state.sort === "similar") return [...items].sort((a, b) => b.similarity - a.similarity);
  if (state.sort === "latest") return [...items].sort((a, b) => b.order - a.order);
  return items;
}

function renderCards() {
  const items = getVisibleItems();
  pageTitle.textContent = state.category === "전체" ? "전체 레퍼런스" : state.category;
  pageSubtitle.innerHTML = `현재 ${items.length}장 표시 <span>·</span> 카테고리·촬영값 태그 완료`;
  resultCount.textContent = `${items.length}장 표시 · 전체 ${libraryCounts[state.category]}장`;
  grid.innerHTML = items.length ? items.map((item, index) => `
    <article class="reference-card ${index === 0 && state.sort === "popular" ? "is-hovered" : ""}" data-title="${item.title}">
      <div class="card-media"><img src="${item.image}" alt="${item.title}" loading="lazy" /><span class="similarity-badge">유사도 ${item.similarity}%</span><button class="capture-action" type="button" data-capture="${item.title}">이 값으로 촬영</button></div>
      <div class="card-body"><div class="category-line"><span class="category-tag">${item.categoryLabel || item.category}</span><span class="verified-label">${item.verified ? "실촬영 인증" : "참고 이미지"}</span></div><div class="tag-row">${[item.angle, item.light, item.zoom, item.horizon, ...item.tags].map((tag, tagIndex) => `<span class="capture-tag ${tagIndex < 2 ? "primary" : ""}">${tag}</span>`).join("")}</div><div class="card-footer"><span class="card-title">${item.title}</span><span class="card-price">${item.price}</span><button class="download-button" type="button" aria-label="${item.title} 다운로드" data-download="${item.title}">${iconDownload()}</button></div></div>
    </article>`).join("") : `<div class="empty-state"><strong>조건에 맞는 레퍼런스가 없습니다.</strong><span>카테고리나 촬영 필터를 한 단계 완화해 보세요.</span></div>`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function setActiveButton(selector, activeButton) {
  document.querySelectorAll(selector).forEach((button) => button.classList.toggle("active", button === activeButton));
}

document.querySelector("#search-input").addEventListener("input", (event) => { state.query = event.target.value; renderCards(); });
document.addEventListener("keydown", (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); document.querySelector("#search-input").focus(); } });

document.querySelectorAll(".sort-tab").forEach((tab) => tab.addEventListener("click", () => { setActiveButton(".sort-tab", tab); state.sort = tab.dataset.sort; renderCards(); }));
document.querySelectorAll(".category-row").forEach((row) => row.addEventListener("click", () => { setActiveButton(".category-row", row); state.category = row.dataset.category; renderCards(); showToast(`${state.category} 카테고리로 필터링했습니다.`); }));
document.querySelectorAll(".chip-row").forEach((group) => group.addEventListener("click", (event) => {
  const chip = event.target.closest(".filter-chip");
  if (!chip) return;
  setActiveButton(`[data-chip-group="${group.dataset.chipGroup}"] .filter-chip`, chip);
  const value = chip.dataset.chip === "전체" ? null : chip.dataset.chip;
  if (group.dataset.chipGroup === "angle") state.angle = value;
  if (group.dataset.chipGroup === "light") state.light = value;
  renderCards();
  showToast(`${chip.dataset.chip === "전체" ? "전체" : chip.dataset.chip} 필터를 적용했습니다.`);
}));

const range = document.querySelector("#similarity-range");
function updateRange() { const value = Number(range.value); const percent = ((value - Number(range.min)) / (Number(range.max) - Number(range.min))) * 100; state.minSimilarity = value; range.style.setProperty("--range-progress", `${percent}%`); document.querySelector("#similarity-value").textContent = `${value}% 이상`; renderCards(); }
range.addEventListener("input", updateRange);
state.minSimilarity = Number(range.value);
range.style.setProperty("--range-progress", `${((state.minSimilarity - 50) / 50) * 100}%`);

const toggle = document.querySelector(".toggle");
toggle.addEventListener("click", () => { state.verifiedOnly = !state.verifiedOnly; toggle.classList.toggle("active", state.verifiedOnly); toggle.setAttribute("aria-checked", String(state.verifiedOnly)); renderCards(); showToast(state.verifiedOnly ? "실촬영 인증 레퍼런스만 표시합니다." : "참고 이미지까지 모두 표시합니다."); });
document.querySelector("#upload-button").addEventListener("click", () => document.querySelector("#upload-input").click());
document.querySelector("#upload-input").addEventListener("change", (event) => { const file = event.target.files?.[0]; if (file) showToast(`${file.name} 업로드를 시작했습니다.`); });

const profileButton = document.querySelector("#profile-button");
const profilePopover = document.querySelector("#profile-popover");
profileButton.addEventListener("click", (event) => { event.stopPropagation(); const isOpen = profilePopover.hidden; profilePopover.hidden = !isOpen; profileButton.setAttribute("aria-expanded", String(isOpen)); });
document.addEventListener("click", (event) => { if (!event.target.closest(".profile-wrap")) { profilePopover.hidden = true; profileButton.setAttribute("aria-expanded", "false"); } });

document.addEventListener("click", (event) => {
  const capture = event.target.closest("[data-capture]");
  const download = event.target.closest("[data-download]");
  const toastTrigger = event.target.closest("[data-toast]");
  if (capture) showToast(`${capture.dataset.capture}의 촬영값을 카메라에 적용합니다.`);
  else if (download) showToast(`${download.dataset.download} 레퍼런스를 저장했습니다.`);
  else if (toastTrigger) showToast(toastTrigger.dataset.toast);
});

renderCards();
