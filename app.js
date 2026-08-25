const references = [
  { title: "실버 맥북 · 침구 위", image: "assets/macbook.webp", similarity: 94, tags: ["45°", "자연광", "1배줌", "수평 0°"], price: "4,900원", order: 8 },
  { title: "월넛 사이드 테이블", image: "assets/side-table.webp", similarity: 92, tags: ["45°", "자연광", "1배줌", "수평 0°"], price: "4,900원", order: 7 },
  { title: "진회색 스포츠카", image: "assets/car.webp", similarity: 96, tags: ["0°", "역광", "1.5배줌", "수평 0°"], price: "5,900원", order: 6 },
  { title: "새틴 위 투명 향수", image: "assets/perfume.webp", similarity: 93, tags: ["45°", "자연광", "2배줌", "수평 0°"], price: "4,900원", order: 5 },
  { title: "블랙 골드 립스틱", image: "assets/lipstick.webp", similarity: 92, tags: ["45°", "자연광", "1배줌", "수평 0°"], price: "3,900원", order: 4 },
  { title: "크림 모노그램 바니티", image: "assets/vanity-bag.webp", similarity: 91, tags: ["45°", "자연광", "1배줌", "수평 0°"], price: "4,900원", order: 3 },
  { title: "빈티지 레드 바이크", image: "assets/bicycle.webp", similarity: 90, tags: ["90°", "스튜디오", "1배줌", "수평 0°"], price: "3,900원", order: 2 },
  { title: "여름 시트러스 드링크", image: "assets/fruit-drinks.jpg", similarity: 94, tags: ["45°", "자연광", "1배줌", "수평 0°"], price: "4,900원", order: 1 }
];

const state = { sort: "popular", query: "", category: "가전제품" };
const grid = document.querySelector("#reference-grid");
const resultCount = document.querySelector("#result-count");
const toast = document.querySelector("#toast");
let toastTimer;

function iconDownload() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v11"></path><path d="m7.5 10.5 4.5 4.5 4.5-4.5"></path><path d="M4 20h16"></path></svg>`;
}

function renderCards() {
  const query = state.query.trim().toLowerCase();
  let items = references.filter((item) => !query || `${item.title} ${item.tags.join(" ")}`.toLowerCase().includes(query));

  if (state.sort === "similar") items = [...items].sort((a, b) => b.similarity - a.similarity);
  if (state.sort === "latest") items = [...items].sort((a, b) => b.order - a.order);

  resultCount.textContent = `${items.length ? 312 : 0} references`;
  grid.innerHTML = items.length ? items.map((item, index) => `
    <article class="reference-card ${index === 0 && state.sort === "popular" ? "is-hovered" : ""}" data-title="${item.title}">
      <div class="card-media">
        <img src="${item.image}" alt="${item.title}" loading="lazy" />
        <span class="similarity-badge">유사도 ${item.similarity}%</span>
        <button class="capture-action" type="button" data-capture="${item.title}">이 값으로 촬영</button>
      </div>
      <div class="card-body">
        <div class="tag-row">${item.tags.map((tag, tagIndex) => `<span class="capture-tag ${tagIndex === 0 ? "primary" : ""}">${tag}</span>`).join("")}</div>
        <div class="card-footer"><span class="card-title">${item.title}</span><span class="card-price">${item.price}</span><button class="download-button" type="button" aria-label="${item.title} 다운로드" data-download="${item.title}">${iconDownload()}</button></div>
      </div>
    </article>`).join("") : `<div class="empty-state"><strong>조건에 맞는 레퍼런스가 없습니다.</strong><span>검색어를 바꾸거나 필터를 완화해 보세요.</span></div>`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

document.querySelector("#search-input").addEventListener("input", (event) => { state.query = event.target.value; renderCards(); });
document.addEventListener("keydown", (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); document.querySelector("#search-input").focus(); } });

document.querySelectorAll(".sort-tab").forEach((tab) => tab.addEventListener("click", () => {
  document.querySelectorAll(".sort-tab").forEach((item) => item.classList.remove("active")); tab.classList.add("active"); state.sort = tab.dataset.sort; renderCards();
}));

document.querySelectorAll(".category-row").forEach((row) => row.addEventListener("click", () => {
  document.querySelectorAll(".category-row").forEach((item) => item.classList.remove("active")); row.classList.add("active"); state.category = row.dataset.category;
  document.querySelector("#page-title").textContent = state.category;
  document.querySelector("#page-subtitle").innerHTML = `레퍼런스 ${row.dataset.count}장 <span>·</span> 촬영값 역산 완료`;
  showToast(`${state.category} 카테고리를 선택했습니다.`);
}));

document.querySelectorAll(".chip-row").forEach((group) => group.addEventListener("click", (event) => {
  const chip = event.target.closest(".filter-chip"); if (!chip) return;
  group.querySelectorAll(".filter-chip").forEach((item) => item.classList.remove("active")); chip.classList.add("active"); showToast(`${chip.dataset.chip} 필터를 적용했습니다.`);
}));

const range = document.querySelector("#similarity-range");
function updateRange() { const value = Number(range.value); const percent = ((value - Number(range.min)) / (Number(range.max) - Number(range.min))) * 100; range.style.setProperty("--range-progress", `${percent}%`); document.querySelector("#similarity-value").textContent = `${value}% 이상`; }
range.addEventListener("input", updateRange); updateRange();

document.querySelector(".toggle").addEventListener("click", (event) => { const toggle = event.currentTarget; const active = toggle.classList.toggle("active"); toggle.setAttribute("aria-checked", String(active)); showToast(active ? "실촬영 인증 레퍼런스만 표시합니다." : "모든 레퍼런스를 표시합니다."); });
document.querySelector("#upload-button").addEventListener("click", () => document.querySelector("#upload-input").click());
document.querySelector("#upload-input").addEventListener("change", (event) => { const file = event.target.files?.[0]; if (file) showToast(`${file.name} 업로드를 시작했습니다.`); });

document.addEventListener("click", (event) => {
  const capture = event.target.closest("[data-capture]"); const download = event.target.closest("[data-download]"); const toastTrigger = event.target.closest("[data-toast]");
  if (capture) showToast(`${capture.dataset.capture}의 촬영값을 카메라에 적용합니다.`);
  else if (download) showToast(`${download.dataset.download} 레퍼런스를 저장했습니다.`);
  else if (toastTrigger) showToast(toastTrigger.dataset.toast);
});

renderCards();
