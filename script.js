const resources = [
  {
    title: "실업급여 수급자격",
    category: "지원금",
    audience: "퇴사 예정자 · 이직자",
    summary: "고용보험 가입 기간, 이직 사유, 재취업 활동 기준을 먼저 확인해야 하는 대표 검색 주제입니다.",
    highlights: [
      "이직 전 고용보험 가입 이력을 먼저 확인",
      "비자발적 이직 여부와 예외 인정 사유 체크",
      "수급 중에는 재취업 활동 기록이 중요"
    ],
    tags: ["실업급여", "고용보험", "퇴사", "구직급여"],
    sourceLabel: "고용24 바로가기",
    sourceUrl: "https://www.work24.go.kr"
  },
  {
    title: "근로장려금 신청",
    category: "지원금",
    audience: "근로소득자 · 자영업자",
    summary: "가구 유형, 총소득, 재산 요건에 따라 달라지는 대표 지원금입니다.",
    highlights: [
      "정기 신청과 반기 신청 일정 구분",
      "가구원 구성과 재산 합계 확인",
      "환급 예상액을 함께 보여주기 좋은 주제"
    ],
    tags: ["근로장려금", "장려금", "환급", "국세청"],
    sourceLabel: "국세청 바로가기",
    sourceUrl: "https://www.nts.go.kr"
  },
  {
    title: "자녀장려금",
    category: "가족",
    audience: "자녀 양육 가구",
    summary: "근로장려금과 함께 자주 검색되는 지원 제도라 묶음 유입을 만들기 좋습니다.",
    highlights: [
      "자녀 나이와 소득 기준 함께 체크",
      "근로장려금과 동시 검색이 자주 발생",
      "신청 기간 콘텐츠와 궁합이 좋음"
    ],
    tags: ["자녀장려금", "가족지원", "신청기간", "혜택"],
    sourceLabel: "국세청 바로가기",
    sourceUrl: "https://www.nts.go.kr"
  },
  {
    title: "주휴수당",
    category: "월급·노동",
    audience: "아르바이트 · 단시간 근로자",
    summary: "주 15시간 기준과 결근 여부 때문에 반복 검색이 자주 생기는 노동 키워드입니다.",
    highlights: [
      "주 15시간 이상 근무 여부 확인",
      "소정근로일 개근 조건이 핵심",
      "시급 계산기와 결합하기 좋은 주제"
    ],
    tags: ["주휴수당", "알바", "시급", "근로기준법"],
    sourceLabel: "생활법령정보 바로가기",
    sourceUrl: "https://www.easylaw.go.kr"
  },
  {
    title: "퇴직금",
    category: "월급·노동",
    audience: "퇴사 예정 직장인",
    summary: "1년 이상 근속, 평균임금, 지급 시점을 묻는 검색 의도가 강한 키워드입니다.",
    highlights: [
      "1년 이상 근속과 주 평균 15시간 기준 확인",
      "평균임금과 근속일수로 추정 가능",
      "퇴사 직전 체크리스트 콘텐츠로 확장 쉬움"
    ],
    tags: ["퇴직금", "평균임금", "근속기간", "퇴사"],
    sourceLabel: "고용노동부 바로가기",
    sourceUrl: "https://www.moel.go.kr"
  },
  {
    title: "육아휴직급여",
    category: "가족",
    audience: "직장인 부모",
    summary: "신청 순서, 지급 기간, 사업주 확인 절차를 찾는 수요가 큰 주제입니다.",
    highlights: [
      "고용보험 가입 이력과 자녀 나이 확인",
      "신청 시기와 사후지급 구조 점검",
      "출산전후휴가급여와 묶어보기 좋음"
    ],
    tags: ["육아휴직급여", "고용보험", "부모", "가족지원"],
    sourceLabel: "고용보험 바로가기",
    sourceUrl: "https://www.ei.go.kr"
  },
  {
    title: "출산전후휴가급여",
    category: "가족",
    audience: "임신·출산 예정 근로자",
    summary: "급여 지급 기간, 우선지원 대상 여부, 신청 순서가 핵심입니다.",
    highlights: [
      "휴가 기간과 급여 대상 구간 이해",
      "신청 기한과 제출 서류 정리 필요",
      "육아휴직급여와 함께 방문 흐름 형성"
    ],
    tags: ["출산휴가", "출산전후휴가", "급여", "고용보험"],
    sourceLabel: "고용보험 바로가기",
    sourceUrl: "https://www.ei.go.kr"
  },
  {
    title: "국민취업지원제도",
    category: "지원금",
    audience: "구직자",
    summary: "수당과 취업지원 서비스를 함께 찾는 사용자가 많아 정보 페이지 가치가 높습니다.",
    highlights: [
      "유형별 소득·재산 기준이 다름",
      "구직촉진수당과 취업지원서비스를 같이 이해",
      "실업급여와 비교 검색이 자주 발생"
    ],
    tags: ["국민취업지원제도", "구직촉진수당", "취업지원", "구직자"],
    sourceLabel: "고용24 바로가기",
    sourceUrl: "https://www.work24.go.kr"
  },
  {
    title: "국민내일배움카드",
    category: "청년",
    audience: "취업 준비생 · 재직자",
    summary: "훈련비 지원과 신청 절차가 명확해서 광고형 정보 페이지에 잘 맞는 주제입니다.",
    highlights: [
      "훈련비 지원 한도와 자부담률 확인",
      "실업자와 재직자 흐름을 분리해 설명",
      "훈련과정 검색으로 확장 가능한 키워드"
    ],
    tags: ["내일배움카드", "직업훈련", "지원금", "교육"],
    sourceLabel: "고용24 바로가기",
    sourceUrl: "https://www.work24.go.kr"
  },
  {
    title: "연말정산 환급",
    category: "세금",
    audience: "직장인",
    summary: "신용카드, 월세, 의료비, 교육비 공제처럼 생활 밀착형 세금 검색 수요를 잡는 주제입니다.",
    highlights: [
      "자주 놓치는 공제 항목을 묶어서 설명",
      "직장인 대상 광고 단가가 기대되는 키워드",
      "환급 예상액 계산기로 확장 가능"
    ],
    tags: ["연말정산", "환급", "공제", "직장인"],
    sourceLabel: "국세청 바로가기",
    sourceUrl: "https://www.nts.go.kr"
  },
  {
    title: "종합소득세 신고",
    category: "세금",
    audience: "프리랜서 · 자영업자",
    summary: "5월 시즌성 트래픽이 매우 강해서 광고 실험이나 제휴 상품 연결에 유리합니다.",
    highlights: [
      "신고 대상인지 먼저 체크하는 흐름 중요",
      "단순경비율과 장부 작성 차이를 쉽게 설명",
      "필요경비와 세액공제 키워드로 확장 가능"
    ],
    tags: ["종합소득세", "프리랜서", "자영업자", "5월"],
    sourceLabel: "홈택스·국세청 바로가기",
    sourceUrl: "https://www.nts.go.kr"
  },
  {
    title: "4대보험",
    category: "월급·노동",
    audience: "입사 예정자 · 사회초년생",
    summary: "월급 실수령액과 연결되는 대표 정보라 검색 허브의 체류 시간을 늘리기 좋습니다.",
    highlights: [
      "국민연금, 건강보험, 고용보험, 산재보험 기본 구조 설명",
      "월급 계산과 함께 보면 이해가 쉬움",
      "입사 첫 달 질문이 많이 발생하는 키워드"
    ],
    tags: ["4대보험", "실수령액", "직장인", "월급"],
    sourceLabel: "국민건강보험 바로가기",
    sourceUrl: "https://www.nhis.or.kr"
  },
  {
    title: "청년월세지원",
    category: "청년",
    audience: "청년 1인가구",
    summary: "소득과 거주 요건을 동시에 설명해야 해서 검색형 정리에 적합한 주제입니다.",
    highlights: [
      "나이, 소득, 부모 재산 여부 등 조건이 복합적",
      "신청 기간과 서류 요약 페이지 수요가 큼",
      "청년정책 묶음 페이지로 확장 쉬움"
    ],
    tags: ["청년월세지원", "월세", "청년", "주거지원"],
    sourceLabel: "복지로 바로가기",
    sourceUrl: "https://www.bokjiro.go.kr"
  },
  {
    title: "청년도약계좌",
    category: "청년",
    audience: "자산 형성 관심 청년",
    summary: "가입 조건과 정부기여금 설명이 필요해 정보 페이지 가치가 높은 금융 키워드입니다.",
    highlights: [
      "연령과 개인소득 조건 체크",
      "정부기여금 구조를 한눈에 설명",
      "청년희망적금과 비교 검색이 자주 발생"
    ],
    tags: ["청년도약계좌", "정부기여금", "청년자산", "비교"],
    sourceLabel: "서민금융진흥원 바로가기",
    sourceUrl: "https://www.kinfa.or.kr"
  }
];

const categories = ["전체", "지원금", "월급·노동", "세금", "청년", "가족"];
const quickKeywords = [
  "근로장려금",
  "실업급여",
  "주휴수당",
  "퇴직금",
  "육아휴직급여",
  "연말정산"
];

const searchInput = document.querySelector("#search-input");
const quickTags = document.querySelector("#quick-tags");
const categoryFilters = document.querySelector("#category-filters");
const resultsList = document.querySelector("#results-list");
const resultsCaption = document.querySelector("#results-caption");
const resourceCount = document.querySelector("#resource-count");

const holidayForm = document.querySelector("#holiday-form");
const holidayResult = document.querySelector("#holiday-result");
const severanceForm = document.querySelector("#severance-form");
const severanceResult = document.querySelector("#severance-result");

const state = {
  query: "",
  category: "전체"
};

resourceCount.textContent = String(resources.length);

function formatWon(value) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

function matchesQuery(resource, query) {
  if (!query) {
    return true;
  }

  const haystack = [
    resource.title,
    resource.category,
    resource.audience,
    resource.summary,
    ...resource.highlights,
    ...resource.tags
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function filterResources() {
  return resources.filter((resource) => {
    const matchesCategory = state.category === "전체" || resource.category === state.category;
    return matchesCategory && matchesQuery(resource, state.query);
  });
}

function renderQuickTags() {
  quickTags.innerHTML = "";

  quickKeywords.forEach((keyword) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.textContent = keyword;
    button.addEventListener("click", () => {
      state.query = keyword;
      searchInput.value = keyword;
      updateActiveQuickTag();
      renderResults();
    });
    quickTags.appendChild(button);
  });

  updateActiveQuickTag();
}

function updateActiveQuickTag() {
  const chips = quickTags.querySelectorAll(".chip");
  chips.forEach((chip) => {
    chip.classList.toggle("is-active", chip.textContent === state.query);
  });
}

function renderCategoryFilters() {
  categoryFilters.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-btn";
    button.textContent = category;
    button.classList.toggle("is-active", category === state.category);
    button.addEventListener("click", () => {
      state.category = category;
      renderCategoryFilters();
      renderResults();
    });
    categoryFilters.appendChild(button);
  });
}

function renderResults() {
  const filtered = filterResources();
  resultsList.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("article");
    empty.className = "result-card fade-up";
    empty.innerHTML = `
      <div class="result-card__meta">
        <span class="result-card__category">검색 결과 없음</span>
      </div>
      <h3>다른 키워드로 다시 찾아보세요.</h3>
      <p class="result-card__summary">
        예: 근로장려금, 실업급여, 주휴수당, 종합소득세, 청년월세지원
      </p>
    `;
    resultsList.appendChild(empty);
  }

  filtered.forEach((resource) => {
    const card = document.createElement("article");
    card.className = "result-card fade-up";
    card.innerHTML = `
      <div class="result-card__meta">
        <span class="result-card__category">${resource.category}</span>
        <span class="result-pill">${resource.audience}</span>
      </div>
      <h3>${resource.title}</h3>
      <p class="result-card__summary">${resource.summary}</p>
      <ul class="result-card__highlights">
        ${resource.highlights.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <div class="result-card__tags">
        ${resource.tags.map((tag) => `<span class="result-pill">#${tag}</span>`).join("")}
      </div>
      <div class="result-card__actions">
        <span class="result-card__note">실제 조건과 일정은 공식 사이트에서 다시 확인하세요.</span>
        <a href="${resource.sourceUrl}" target="_blank" rel="noreferrer">${resource.sourceLabel}</a>
      </div>
    `;
    resultsList.appendChild(card);
  });

  const scopeLabel = state.category === "전체" ? "전체 카테고리" : `${state.category} 카테고리`;
  const queryLabel = state.query ? ` · "${state.query}" 검색` : "";
  resultsCaption.textContent = `${scopeLabel}${queryLabel}에서 ${filtered.length}개 주제를 찾았습니다.`;
  updateActiveQuickTag();
}

function handleHolidayPay(event) {
  event.preventDefault();

  const hourlyWage = Number(document.querySelector("#hourly-wage").value);
  const workingDays = Number(document.querySelector("#working-days").value);
  const dailyHours = Number(document.querySelector("#daily-hours").value);

  const weeklyHours = workingDays * dailyHours;
  if (!hourlyWage || !workingDays || !dailyHours) {
    holidayResult.textContent = "모든 값을 입력해 주세요.";
    return;
  }

  if (weeklyHours < 15) {
    holidayResult.textContent = `주 총 ${weeklyHours}시간 근무로 입력되어 있습니다. 일반적으로 주 15시간 미만이면 주휴수당 대상이 아닐 수 있습니다.`;
    return;
  }

  const weeklyHolidayPay = dailyHours * hourlyWage;
  const monthlyHolidayPay = weeklyHolidayPay * 4.345;

  holidayResult.innerHTML = `
    주휴수당 하루치 추정은 <strong>${formatWon(weeklyHolidayPay)}</strong>입니다.
    월 기준으로 보면 약 <strong>${formatWon(monthlyHolidayPay)}</strong> 수준입니다.
    실제 지급 여부는 소정근로일 개근 여부와 계약 형태에 따라 달라질 수 있습니다.
  `;
}

function handleSeverance(event) {
  event.preventDefault();

  const monthlyPay = Number(document.querySelector("#monthly-pay").value);
  const serviceMonths = Number(document.querySelector("#service-months").value);

  if (!monthlyPay || !serviceMonths) {
    severanceResult.textContent = "모든 값을 입력해 주세요.";
    return;
  }

  if (serviceMonths < 12) {
    severanceResult.textContent = "일반적으로 1년 이상 계속 근로한 경우에 퇴직금 대상이 됩니다. 현재 입력은 12개월 미만입니다.";
    return;
  }

  const estimate = monthlyPay * (serviceMonths / 12);
  severanceResult.innerHTML = `
    간편 추정 퇴직금은 <strong>${formatWon(estimate)}</strong>입니다.
    이 값은 월 평균임금을 기준으로 단순 계산한 탐색용 수치이며,
    실제 지급액은 평균임금, 상여금 반영, 미사용 연차수당 등으로 달라질 수 있습니다.
  `;
}

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  state.query = searchInput.value.trim();
  renderResults();
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value.trim();
  renderResults();
});

holidayForm.addEventListener("submit", handleHolidayPay);
severanceForm.addEventListener("submit", handleSeverance);

renderQuickTags();
renderCategoryFilters();
renderResults();
