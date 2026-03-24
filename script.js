const HOME_STORAGE_KEY = "my-money-home-state-v2";

const quickKeywords = ["실업급여", "퇴직금", "주휴수당", "육아휴직급여"];
const categories = ["인기", "지원금", "월급·노동", "가족"];
const featuredResourceIds = ["net-salary", "unemployment", "holiday", "parental"];

const resources = [
  {
    id: "net-salary",
    title: "월급 실수령액 보기",
    category: "월급·노동",
    audience: "직장인",
    summary: "월급, 비과세 수당, 가족 수를 바탕으로 실수령 추정과 4대보험 흐름을 먼저 보는 주제입니다.",
    highlights: ["실수령액과 4대보험을 한 번에 보기 좋음"],
    tags: ["실수령액", "월급", "4대보험"],
    href: "salary.html",
    sourceLabel: "상세 계산 열기"
  },
  {
    id: "unemployment",
    title: "실업급여 신청 조건",
    category: "지원금",
    audience: "퇴사 예정자",
    summary: "비자발적 이직, 피보험 단위기간, 수급 가능성을 빠르게 정리하는 대표 주제입니다.",
    highlights: ["이직 사유와 가입 기간을 먼저 체크"],
    tags: ["실업급여", "구직급여", "고용보험"],
    href: "unemployment.html",
    sourceLabel: "상세 계산 열기"
  },
  {
    id: "holiday",
    title: "주휴수당 핵심 정리",
    category: "월급·노동",
    audience: "알바 · 시간제",
    summary: "주 15시간과 개근 여부만 알아도 먼저 판단하기 쉬운 대표 노동 주제입니다.",
    highlights: ["주휴수당과 시간외수당을 같이 보기 좋음"],
    tags: ["주휴수당", "알바", "시급"],
    href: "overtime.html",
    sourceLabel: "상세 계산 열기"
  },
  {
    id: "parental",
    title: "육아휴직급여 기본형",
    category: "가족",
    audience: "직장인 부모",
    summary: "월 상한과 하한, 자녀 연령 조건, 단축근무까지 같이 묶어 보기 좋은 가족 급여 주제입니다.",
    highlights: ["육아휴직과 출산휴가를 한 흐름으로 보기 좋음"],
    tags: ["육아휴직급여", "출산휴가", "모성보호"],
    href: "family.html",
    sourceLabel: "상세 계산 열기"
  },
  {
    id: "severance",
    title: "퇴직금 계산 전 체크",
    category: "월급·노동",
    audience: "퇴사 준비",
    summary: "퇴직금, 연차수당, 휴업수당처럼 퇴사 전 정산 문제를 한 번에 묶어보는 데 적합한 주제입니다.",
    highlights: ["퇴직금과 연차수당을 함께 정리"],
    tags: ["퇴직금", "연차수당", "정산"],
    href: "severance.html",
    sourceLabel: "상세 계산 열기"
  },
  {
    id: "earned-credit",
    title: "근로장려금 정리",
    category: "지원금",
    audience: "직장인 · 사업자",
    summary: "가구 유형과 연 소득 기준을 바탕으로 신청 시기와 방향을 먼저 잡는 데 적합합니다.",
    highlights: ["정기 신청과 반기 신청 시기 확인"],
    tags: ["근로장려금", "국세청", "지원금"],
    href: "https://www.nts.go.kr",
    sourceLabel: "국세청 보기"
  },
  {
    id: "youth",
    title: "청년 정책 포털 모음",
    category: "지원금",
    audience: "청년 · 취업준비생",
    summary: "중앙정부와 지자체 청년 정책 포털을 먼저 모아 보고 공고를 좁혀갈 때 유용합니다.",
    highlights: ["온통청년과 지자체 포털부터 확인"],
    tags: ["청년", "정책", "포털"],
    href: "https://www.youthcenter.go.kr/",
    sourceLabel: "포털 열기"
  }
];

const defaults = {
  monthlySalaryMan: 320,
  nonTaxableMan: 20,
  householdCount: 1,
  childCount: 0,
  workDays: 5,
  dailyHours: 8,
  savedProfile: null
};

const state = loadState();
const searchState = { query: "", category: "인기" };

const searchInput = document.querySelector("#search-input");
const suggestionNode = document.querySelector("#search-suggestions");
const quickTagsNode = document.querySelector("#quick-tags");
const categoryFiltersNode = document.querySelector("#category-filters");
const resultsStatusNode = document.querySelector("#results-status");
const resultsNode = document.querySelector("#results-list");
const setupSummaryNode = document.querySelector("#setup-summary");
const profileStatusNode = document.querySelector("#profile-status");
const recommendationValueNode = document.querySelector("#recommendation-value");
const recommendationNoteNode = document.querySelector("#recommendation-note");
const recommendationLinkNode = document.querySelector("#recommendation-link");
const recommendationLinkLabelNode = document.querySelector("#recommendation-link-label");

function cloneDefaults() {
  return JSON.parse(JSON.stringify(defaults));
}

function loadState() {
  try {
    const raw = localStorage.getItem(HOME_STORAGE_KEY);
    return raw ? { ...cloneDefaults(), ...JSON.parse(raw) } : cloneDefaults();
  } catch {
    return cloneDefaults();
  }
}

function saveState() {
  localStorage.setItem(HOME_STORAGE_KEY, JSON.stringify(state));
}

function parseValue(raw, defaultValue) {
  return typeof defaultValue === "number" ? Number(raw) : raw;
}

function matchesQuery(item, query) {
  if (!query) return true;
  const haystack = [item.title, item.category, item.audience, item.summary, ...item.highlights, ...item.tags].join(" ").toLowerCase();
  return haystack.includes(query);
}

function getVisibleResources() {
  const query = searchState.query.trim().toLowerCase();
  let filtered = resources.filter((item) => matchesQuery(item, query));

  if (searchState.category !== "인기") {
    filtered = filtered.filter((item) => item.category === searchState.category);
  }

  if (!query && searchState.category === "인기") {
    return resources.filter((item) => featuredResourceIds.includes(item.id)).slice(0, 4);
  }

  return filtered.slice(0, query ? 6 : 4);
}

function reflectInputs() {
  document.querySelectorAll("[data-input-field]").forEach((input) => {
    input.value = state[input.dataset.inputField];
  });

  document.querySelectorAll("[data-choice-field]").forEach((button) => {
    const key = button.dataset.choiceField;
    button.classList.toggle("is-active", state[key] === parseValue(button.dataset.value, defaults[key]));
  });
}

function renderQuickTags() {
  quickTagsNode.innerHTML = quickKeywords.map((item) => `
    <button type="button" class="choice-chip ${searchState.query === item ? "is-active" : ""}" data-search-tag="${item}">${item}</button>
  `).join("");
}

function renderSuggestions() {
  const query = searchState.query.trim().toLowerCase();
  if (!query) {
    suggestionNode.classList.remove("is-visible");
    suggestionNode.innerHTML = "";
    return;
  }

  const matches = resources.filter((item) => matchesQuery(item, query)).slice(0, 5);
  if (!matches.length) {
    suggestionNode.classList.remove("is-visible");
    suggestionNode.innerHTML = "";
    return;
  }

  suggestionNode.classList.add("is-visible");
  suggestionNode.innerHTML = matches.map((item) => `
    <button type="button" data-suggestion="${item.title}">${item.title}</button>
  `).join("");
}

function renderCategoryFilters() {
  categoryFiltersNode.innerHTML = categories.map((category) => `
    <button type="button" class="choice-chip ${searchState.category === category ? "is-active" : ""}" data-filter-category="${category}">
      ${category}
    </button>
  `).join("");
}

function renderResults() {
  const filtered = getVisibleResources();
  const query = searchState.query.trim();

  if (!query && searchState.category === "인기") {
    resultsStatusNode.textContent = "";
  } else if (query) {
    resultsStatusNode.textContent = `${filtered.length}개 결과`;
  } else {
    resultsStatusNode.textContent = `${searchState.category} 주제 ${filtered.length}개`;
  }

  if (!filtered.length) {
    resultsNode.innerHTML = `
      <article class="topic-card empty-card">
        <h3>검색 결과가 없습니다</h3>
        <p>검색어를 조금 짧게 바꾸거나 대표 계산기에서 먼저 시작해 보세요.</p>
      </article>
    `;
    return;
  }

  resultsNode.innerHTML = filtered.map((item) => `
    <article class="topic-card">
      <div class="topic-card__meta">
        <span class="topic-pill">${item.category}</span>
        <span class="topic-pill">${item.audience}</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <div class="topic-card__meta">
        ${item.tags.slice(0, 3).map((tag) => `<span class="topic-pill">#${tag}</span>`).join("")}
      </div>
      <div class="topic-card__links">
        <a href="${item.href}" ${item.href.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}>${item.sourceLabel}</a>
      </div>
    </article>
  `).join("");
}

function setupSummaryText() {
  return `월급 ${Number(state.monthlySalaryMan || 0)}만원 · 주 ${Number(state.workDays || 0)}일 · 하루 ${Number(state.dailyHours || 0)}시간`;
}

function renderSetupSummary() {
  setupSummaryNode.textContent = setupSummaryText();
}

function renderProfileStatus() {
  if (!state.savedProfile) {
    profileStatusNode.textContent = "저장된 빠른 입력 값이 없습니다.";
    return;
  }

  const label = new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(state.savedProfile.timestamp));

  profileStatusNode.textContent = `최근 저장 ${label} · 빠른 입력 값을 다시 불러올 수 있습니다.`;
}

function recommendationContent() {
  const salary = window.MoneyCalc.salaryBrief(state);
  let href = "salary.html";
  let label = "월급 계산기 열기";
  let note = "월급 상세 페이지에서 세금과 4대보험 항목을 더 자세히 확인할 수 있습니다.";

  if (Number(state.childCount) > 0) {
    href = "family.html";
    label = "가족 급여 계산기 열기";
    note = "자녀 수가 있어 육아휴직과 출산휴가 계산도 함께 보는 편이 좋습니다.";
  } else if (Number(state.workDays) < 5 || Number(state.dailyHours) < 8) {
    href = "overtime.html";
    label = "수당 계산기 열기";
    note = "근무일이나 근무시간이 다르면 주휴수당과 시간외수당도 함께 확인해 보세요.";
  }

  return {
    value: `월 실수령액 약 ${window.MoneyCalc.formatWon(salary.takeHome)}`,
    note,
    href,
    label
  };
}

function renderRecommendation() {
  const recommendation = recommendationContent();
  recommendationValueNode.textContent = recommendation.value;
  recommendationNoteNode.textContent = recommendation.note;
  recommendationLinkNode.href = recommendation.href;
  recommendationLinkLabelNode.textContent = recommendation.label;
}

function renderAll() {
  reflectInputs();
  renderQuickTags();
  renderSuggestions();
  renderCategoryFilters();
  renderResults();
  renderSetupSummary();
  renderProfileStatus();
  renderRecommendation();
  saveState();
}

function saveProfile() {
  state.savedProfile = {
    timestamp: new Date().toISOString(),
    values: {
      monthlySalaryMan: state.monthlySalaryMan,
      nonTaxableMan: state.nonTaxableMan,
      householdCount: state.householdCount,
      childCount: state.childCount,
      workDays: state.workDays,
      dailyHours: state.dailyHours
    }
  };
  renderAll();
}

function loadProfile() {
  if (!state.savedProfile?.values) return;
  Object.assign(state, state.savedProfile.values);
  renderAll();
}

function resetProfile() {
  const savedProfile = state.savedProfile;
  Object.assign(state, cloneDefaults());
  state.savedProfile = savedProfile;
  renderAll();
}

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  searchState.query = searchInput.value.trim();
  searchState.category = "인기";
  renderAll();
  document.querySelector("#results-section").scrollIntoView({ behavior: "smooth", block: "start" });
});

searchInput.addEventListener("input", (event) => {
  searchState.query = event.target.value.trim();
  renderSuggestions();
  renderQuickTags();
  renderResults();
});

document.querySelectorAll("[data-input-field]").forEach((input) => {
  input.addEventListener("input", (event) => {
    const key = event.target.dataset.inputField;
    state[key] = parseValue(event.target.value || 0, defaults[key]);
    renderAll();
  });
});

document.querySelectorAll("[data-choice-field]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.choiceField;
    state[key] = parseValue(button.dataset.value, defaults[key]);
    renderAll();
  });
});

document.addEventListener("click", (event) => {
  const tagButton = event.target.closest("[data-search-tag]");
  if (tagButton) {
    searchState.query = tagButton.dataset.searchTag;
    searchInput.value = searchState.query;
    searchState.category = "인기";
    renderAll();
    return;
  }

  const suggestionButton = event.target.closest("[data-suggestion]");
  if (suggestionButton) {
    searchState.query = suggestionButton.dataset.suggestion;
    searchInput.value = searchState.query;
    searchState.category = "인기";
    renderAll();
    document.querySelector("#results-section").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const filterButton = event.target.closest("[data-filter-category]");
  if (filterButton) {
    searchState.category = filterButton.dataset.filterCategory;
    renderCategoryFilters();
    renderResults();
    return;
  }

  const intentButton = event.target.closest("[data-intent-search]");
  if (intentButton) {
    searchState.query = intentButton.dataset.intentSearch;
    searchInput.value = searchState.query;
    searchState.category = "인기";
    renderAll();
    document.querySelector("#results-section").scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

document.querySelector("#save-profile").addEventListener("click", saveProfile);
document.querySelector("#load-profile").addEventListener("click", loadProfile);
document.querySelector("#reset-profile").addEventListener("click", resetProfile);

renderAll();
