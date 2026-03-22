const STORAGE_KEY = "my-money-encyclopedia-profile-v2";
const MIN_WAGE_2026 = 10320;
const PENSION_TOTAL_RATE_2026 = 0.095;
const PENSION_EMPLOYEE_RATE_2026 = PENSION_TOTAL_RATE_2026 / 2;
const PENSION_MONTHLY_CEILING = 6370000;
const HEALTH_TOTAL_RATE_2026 = 0.0719;
const HEALTH_EMPLOYEE_RATE_2026 = HEALTH_TOTAL_RATE_2026 / 2;
const LONG_TERM_CARE_RATIO_2026 = 0.1314;
const EMPLOYMENT_EMPLOYEE_RATE = 0.009;
const UNEMPLOYMENT_DAILY_MAX = 66000;

const resources = [
  {
    title: "실업급여 수급자격",
    category: "지원금",
    audience: "퇴사 예정자 · 이직자",
    summary: "비자발적 이직 여부와 고용보험 가입기간, 재취업 활동 기준을 먼저 확인해야 하는 대표 검색 주제입니다.",
    highlights: [
      "이직 전 18개월 동안 피보험단위기간 통산 180일 이상 확인",
      "비자발적 이직 여부와 예외 인정 사유 체크",
      "구직활동 인정 절차까지 함께 안내하기 좋은 키워드"
    ],
    tags: ["실업급여", "구직급여", "고용보험", "고용24"],
    sourceLabel: "고용보험 안내 보기",
    sourceUrl: "https://edrm.ei.go.kr/ei/eih/eg/pb/pbPersonBnef/retrievePb0100Info.do"
  },
  {
    title: "근로장려금 신청",
    category: "지원금",
    audience: "근로소득자 · 자영업자",
    summary: "가구 유형과 총소득, 재산 요건에 따라 갈리는 대표 지원금이라 매년 반복 검색이 큽니다.",
    highlights: [
      "정기 신청과 반기 신청 일정 구분",
      "가구원 구성과 재산 합계 기준 정리",
      "환급 예상액 계산과 묶어두기 좋은 주제"
    ],
    tags: ["근로장려금", "장려금", "환급", "국세청"],
    sourceLabel: "국세청 바로가기",
    sourceUrl: "https://www.nts.go.kr"
  },
  {
    title: "주휴수당",
    category: "월급·노동",
    audience: "알바 · 단시간 근로자",
    summary: "주 15시간 기준과 개근 여부 때문에 반복 검색이 자주 생기는 노동 키워드입니다.",
    highlights: [
      "주 15시간 이상인지 먼저 확인",
      "소정근로일 개근 조건이 핵심",
      "시급 계산기와 붙이면 체류시간이 길어짐"
    ],
    tags: ["주휴수당", "시급", "알바", "근로기준법"],
    sourceLabel: "생활법령 바로가기",
    sourceUrl: "https://www.easylaw.go.kr"
  },
  {
    title: "퇴직금",
    category: "월급·노동",
    audience: "퇴사 예정 직장인",
    summary: "1년 이상 계속근로와 평균임금, 지급 시점을 묻는 검색 의도가 강한 키워드입니다.",
    highlights: [
      "1년 이상 계속근로와 주 평균 15시간 기준 확인",
      "평균임금과 상여금 반영 방식 설명 필요",
      "퇴사 체크리스트 콘텐츠로 확장 쉬움"
    ],
    tags: ["퇴직금", "평균임금", "퇴사", "고용노동부"],
    sourceLabel: "노동포털 계산기 보기",
    sourceUrl: "https://labor.moel.go.kr/cmmt/calRtrmnt.do"
  },
  {
    title: "육아휴직급여",
    category: "가족",
    audience: "직장인 부모",
    summary: "신청 순서와 월 상한, 복직 후 일시지급 구조를 찾는 수요가 큰 주제입니다.",
    highlights: [
      "피보험단위기간 180일 이상 여부 확인",
      "지급분과 복직 후 일시지급분을 나눠 설명",
      "출산휴가급여와 묶으면 가족 카테고리 강해짐"
    ],
    tags: ["육아휴직급여", "고용보험", "부모", "급여"],
    sourceLabel: "고용보험 안내 보기",
    sourceUrl: "https://edrm.ei.go.kr/ei/eih/eg/pb/pbPersonBnef/retrievePb0100Info.do"
  },
  {
    title: "출산휴가급여",
    category: "가족",
    audience: "임신·출산 예정 근로자",
    summary: "우선지원대상기업과 대규모기업의 지급구간이 달라서 요약형 정보 페이지 가치가 높습니다.",
    highlights: [
      "90일과 120일 기준 구분",
      "우선지원대상기업과 대규모기업을 분리 설명",
      "신청기한과 필요서류 정리 수요 큼"
    ],
    tags: ["출산휴가급여", "출산전후휴가", "고용보험", "모성보호"],
    sourceLabel: "고용보험 안내 보기",
    sourceUrl: "https://edrm.ei.go.kr/ei/eih/eg/pb/pbPersonBnef/retrievePb0301Info.do"
  },
  {
    title: "연차수당",
    category: "월급·노동",
    audience: "재직자 · 퇴사 예정자",
    summary: "남은 연차를 돈으로 받을 수 있는지와 기준임금을 묻는 검색이 꾸준히 생깁니다.",
    highlights: [
      "미사용 연차일수와 통상임금 기준 설명",
      "퇴사 직전 정산 흐름과 연결",
      "연차 계산기와 함께 보여주기 좋은 주제"
    ],
    tags: ["연차수당", "연차", "통상임금", "미사용연차"],
    sourceLabel: "생활법령 바로가기",
    sourceUrl: "https://www.easylaw.go.kr"
  },
  {
    title: "연말정산 환급",
    category: "세금",
    audience: "직장인",
    summary: "카드, 월세, 의료비, 교육비 공제를 묶으면 광고형 정보 페이지로 확장하기 좋습니다.",
    highlights: [
      "총급여와 공제항목에 따라 환급폭 차이 큼",
      "직장인 검색량이 커서 광고 단가 기대 가능",
      "근로소득세 상세 계산기와 궁합이 좋음"
    ],
    tags: ["연말정산", "환급", "공제", "국세청"],
    sourceLabel: "국세청 바로가기",
    sourceUrl: "https://www.nts.go.kr"
  },
  {
    title: "월급 실수령액",
    category: "세금",
    audience: "직장인 · 사회초년생",
    summary: "4대보험과 세금이 함께 움직이는 대표 계산 주제라 메인 페이지 진입점으로 좋습니다.",
    highlights: [
      "부양가족 수와 비과세 수당에 따라 달라짐",
      "연봉 계산기와 자연스럽게 연결",
      "4대보험 상세 브리핑과 같이 제공하기 좋음"
    ],
    tags: ["실수령액", "월급", "4대보험", "근로소득세"],
    sourceLabel: "국세청 안내 보기",
    sourceUrl: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7870&mi=6434"
  },
  {
    title: "국민취업지원제도",
    category: "지원금",
    audience: "구직자",
    summary: "실업급여와 비교 검색이 많아서 묶음 유입을 만들기 좋은 주제입니다.",
    highlights: [
      "유형별 소득·재산 기준이 다름",
      "구직촉진수당과 취업지원서비스를 같이 설명해야 함",
      "실업급여와 차이를 묻는 질문형 페이지로 확장 가능"
    ],
    tags: ["국민취업지원제도", "구직촉진수당", "취업지원", "구직자"],
    sourceLabel: "고용24 바로가기",
    sourceUrl: "https://www.work24.go.kr"
  },
  {
    title: "국민내일배움카드",
    category: "지원금",
    audience: "취업준비생 · 재직자",
    summary: "훈련비 지원과 자부담률을 한 번에 정리하기 좋아 체류시간이 길게 나오는 키워드입니다.",
    highlights: [
      "지원 한도와 자부담률을 이해하기 쉽게 정리",
      "재직자와 실업자 흐름 분리 필요",
      "훈련과정 추천 페이지로 확장 쉬움"
    ],
    tags: ["내일배움카드", "훈련비", "지원금", "교육"],
    sourceLabel: "고용24 바로가기",
    sourceUrl: "https://www.work24.go.kr"
  },
  {
    title: "청년월세지원",
    category: "지원금",
    audience: "청년 1인가구",
    summary: "소득과 거주 요건이 복합적이라 질문형 검색 랜딩에 적합한 주제입니다.",
    highlights: [
      "나이, 소득, 부모 재산 여부 등 조건이 복합적",
      "신청 기간과 서류 정리 수요가 큼",
      "청년 정책 묶음 카테고리의 핵심 주제"
    ],
    tags: ["청년월세지원", "월세", "청년", "주거지원"],
    sourceLabel: "복지로 바로가기",
    sourceUrl: "https://www.bokjiro.go.kr"
  }
];

const calculatorCatalog = [
  { title: "월급 브리핑", status: "live", description: "4대보험과 세후 추정치를 함께 보여주는 생활형 메인 카드" },
  { title: "4대보험", status: "live", description: "국민연금, 건강보험, 장기요양보험, 고용보험 빠른 계산" },
  { title: "주휴수당", status: "live", description: "시급과 근무 패턴으로 바로 보는 단시간 근로 계산" },
  { title: "퇴직금", status: "live", description: "월 평균임금 기준의 빠른 퇴직금 감 잡기" },
  { title: "실업급여", status: "live", description: "연령과 가입기간을 반영한 구직급여 추정" },
  { title: "육아휴직급여", status: "live", description: "지급분과 복직 후 일시지급분을 나눠서 확인" },
  { title: "출산휴가급여", status: "live", description: "사업장 유형과 단태아·다태아 구분 반영" },
  { title: "연차수당", status: "live", description: "남은 연차일수에 따라 빠르게 보는 정산 금액" },
  { title: "근로소득세 상세", status: "next", description: "간이세액표 중심의 상세 모드 추가 예정" },
  { title: "퇴직소득세", status: "next", description: "퇴직금 이후 실제 세액 계산 흐름 추가 예정" },
  { title: "종합소득세", status: "next", description: "프리랜서·개인사업자용 시즌 계산기" },
  { title: "사업소득세", status: "next", description: "경비율과 장부 기준을 나눈 소득세 계산" },
  { title: "기타소득세", status: "next", description: "강연료·원고료 등 단발성 소득 계산" },
  { title: "이자소득세", status: "next", description: "예적금 이자 세후 수익 계산" },
  { title: "배당소득세", status: "next", description: "배당 세후 수익과 금융소득 비교" },
  { title: "양도소득세", status: "next", description: "주식·부동산 양도세는 별도 상세 페이지로 확장 예정" }
];

const categories = ["전체", "지원금", "월급·노동", "세금", "가족"];
const quickKeywords = ["실업급여", "근로장려금", "주휴수당", "퇴직금", "육아휴직급여", "연차수당"];

const defaults = {
  monthlySalaryMan: 320,
  nonTaxableMan: 20,
  householdCount: 1,
  childCount: 0,
  workDays: 5,
  dailyHours: 8,
  hourlyWage: MIN_WAGE_2026,
  serviceMonths: 24,
  olderWorker: false,
  unemploymentMonths: 48,
  parentalMonths: 3,
  maternityMode: "priority",
  maternityChildren: "single",
  unusedLeaveDays: 5
};

const state = loadState();
const searchState = {
  query: "",
  category: "전체"
};

const searchInput = document.querySelector("#search-input");
const quickTags = document.querySelector("#quick-tags");
const categoryFilters = document.querySelector("#category-filters");
const resultsList = document.querySelector("#results-list");
const resultsCaption = document.querySelector("#results-caption");
const resourceCount = document.querySelector("#resource-count");
const calculatorCount = document.querySelector("#calculator-count");
const catalogGrid = document.querySelector("#catalog-grid");

resourceCount.textContent = String(resources.length);
calculatorCount.textContent = String(calculatorCatalog.filter((item) => item.status === "live").length);

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...defaults };
    }

    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch (error) {
    return { ...defaults };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatWon(value) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

function monthlySalaryWon() {
  return state.monthlySalaryMan * 10000;
}

function nonTaxableWon() {
  return state.nonTaxableMan * 10000;
}

function pensionEmployee(grossMonthly) {
  return Math.min(grossMonthly, PENSION_MONTHLY_CEILING) * PENSION_EMPLOYEE_RATE_2026;
}

function healthEmployee(grossMonthly) {
  return grossMonthly * HEALTH_EMPLOYEE_RATE_2026;
}

function longTermCare(healthPremium) {
  return healthPremium * LONG_TERM_CARE_RATIO_2026;
}

function employmentEmployee(grossMonthly) {
  return grossMonthly * EMPLOYMENT_EMPLOYEE_RATE;
}

function insuranceBreakdown(grossMonthly) {
  const pension = pensionEmployee(grossMonthly);
  const health = healthEmployee(grossMonthly);
  const care = longTermCare(health);
  const employment = employmentEmployee(grossMonthly);
  const total = pension + health + care + employment;

  return { pension, health, care, employment, total };
}

function earnedIncomeDeduction(annualTaxablePay) {
  if (annualTaxablePay <= 5000000) {
    return annualTaxablePay * 0.7;
  }

  if (annualTaxablePay <= 15000000) {
    return 3500000 + (annualTaxablePay - 5000000) * 0.4;
  }

  if (annualTaxablePay <= 45000000) {
    return 7500000 + (annualTaxablePay - 15000000) * 0.15;
  }

  if (annualTaxablePay <= 100000000) {
    return 12000000 + (annualTaxablePay - 45000000) * 0.05;
  }

  return Math.min(20000000, 14750000 + (annualTaxablePay - 100000000) * 0.02);
}

function progressiveIncomeTax(taxBase) {
  if (taxBase <= 14000000) {
    return taxBase * 0.06;
  }

  if (taxBase <= 50000000) {
    return 840000 + (taxBase - 14000000) * 0.15;
  }

  if (taxBase <= 88000000) {
    return 6240000 + (taxBase - 50000000) * 0.24;
  }

  if (taxBase <= 150000000) {
    return 15360000 + (taxBase - 88000000) * 0.35;
  }

  if (taxBase <= 300000000) {
    return 37060000 + (taxBase - 150000000) * 0.38;
  }

  if (taxBase <= 500000000) {
    return 94060000 + (taxBase - 300000000) * 0.4;
  }

  if (taxBase <= 1000000000) {
    return 174060000 + (taxBase - 500000000) * 0.42;
  }

  return 384060000 + (taxBase - 1000000000) * 0.45;
}

function workTaxCredit(annualTax, annualTaxablePay) {
  const rawCredit =
    annualTax <= 1300000
      ? annualTax * 0.55
      : 715000 + (annualTax - 1300000) * 0.3;

  let ceiling;

  if (annualTaxablePay <= 33000000) {
    ceiling = 740000;
  } else if (annualTaxablePay <= 70000000) {
    ceiling = Math.max(660000, 740000 - (annualTaxablePay - 33000000) * 0.008);
  } else if (annualTaxablePay <= 120000000) {
    ceiling = Math.max(500000, 660000 - (annualTaxablePay - 70000000) * 0.5);
  } else {
    ceiling = Math.max(200000, 500000 - (annualTaxablePay - 120000000) * 0.5);
  }

  return Math.min(rawCredit, ceiling);
}

function monthlyBriefing() {
  const grossMonthly = monthlySalaryWon();
  const annualGross = grossMonthly * 12;
  const annualTaxablePay = Math.max(0, grossMonthly - nonTaxableWon()) * 12;
  const insurance = insuranceBreakdown(grossMonthly);
  const annualInsurance = insurance.total * 12;
  const personalDeduction = state.householdCount * 1500000;
  const earnedDeduction = earnedIncomeDeduction(annualTaxablePay);
  const taxBase = Math.max(0, annualTaxablePay - earnedDeduction - annualInsurance - personalDeduction);
  const annualIncomeTax = progressiveIncomeTax(taxBase);
  const annualTaxCredit = workTaxCredit(annualIncomeTax, annualTaxablePay);
  const finalAnnualIncomeTax = Math.max(0, annualIncomeTax - annualTaxCredit);
  const finalAnnualLocalTax = finalAnnualIncomeTax * 0.1;
  const monthlyIncomeTax = finalAnnualIncomeTax / 12;
  const monthlyLocalTax = finalAnnualLocalTax / 12;
  const monthlyTakeHome = grossMonthly - insurance.total - monthlyIncomeTax - monthlyLocalTax;

  return {
    grossMonthly,
    annualGross,
    insurance,
    monthlyIncomeTax,
    monthlyLocalTax,
    monthlyTakeHome,
    taxBase
  };
}

function holidayPay() {
  const weeklyHours = state.workDays * state.dailyHours;

  if (weeklyHours < 15) {
    return {
      eligible: false,
      weeklyHours,
      dailyHolidayPay: 0,
      monthlyHolidayPay: 0
    };
  }

  const dailyHolidayPay = state.hourlyWage * state.dailyHours;
  const monthlyHolidayPay = dailyHolidayPay * 4.345;

  return {
    eligible: true,
    weeklyHours,
    dailyHolidayPay,
    monthlyHolidayPay
  };
}

function severancePay() {
  const grossMonthly = monthlySalaryWon();
  const eligible = state.serviceMonths >= 12;
  const estimate = grossMonthly * (state.serviceMonths / 12);

  return {
    eligible,
    estimate
  };
}

function unemploymentBenefit() {
  const grossMonthly = monthlySalaryWon();
  const dailyBase = grossMonthly / 30;
  const rawDailyBenefit = dailyBase * 0.6;
  const lowerLimit = MIN_WAGE_2026 * state.dailyHours * 0.8;
  let dailyBenefit = rawDailyBenefit;

  if (rawDailyBenefit < lowerLimit) {
    dailyBenefit = lowerLimit;
  } else {
    dailyBenefit = Math.min(rawDailyBenefit, UNEMPLOYMENT_DAILY_MAX);
  }

  let benefitDays = 120;
  const years = state.unemploymentMonths / 12;

  if (state.olderWorker) {
    if (years >= 10) {
      benefitDays = 270;
    } else if (years >= 5) {
      benefitDays = 240;
    } else if (years >= 3) {
      benefitDays = 210;
    } else if (years >= 1) {
      benefitDays = 180;
    }
  } else if (years >= 10) {
    benefitDays = 240;
  } else if (years >= 5) {
    benefitDays = 210;
  } else if (years >= 3) {
    benefitDays = 180;
  } else if (years >= 1) {
    benefitDays = 150;
  }

  return {
    dailyBenefit,
    benefitDays,
    totalBenefit: dailyBenefit * benefitDays,
    lowerLimit
  };
}

function parentalLeaveBenefit() {
  const ordinaryMonthlyWage = monthlySalaryWon();
  const monthlyBenefit = Math.min(Math.max(ordinaryMonthlyWage * 0.8, 700000), 1500000);
  const totalBenefit = monthlyBenefit * state.parentalMonths;
  const paidDuringLeave = totalBenefit * 0.75;
  const paidAfterReturn = totalBenefit * 0.25;

  return {
    monthlyBenefit,
    totalBenefit,
    paidDuringLeave,
    paidAfterReturn
  };
}

function maternityLeaveBenefit() {
  const ordinaryMonthlyWage = monthlySalaryWon();
  const multiple = state.maternityChildren === "multiple";
  const priority = state.maternityMode === "priority";
  const coveredDays = priority ? (multiple ? 120 : 90) : (multiple ? 45 : 30);
  const coveredMonths = coveredDays / 30;
  const totalCap = priority ? (multiple ? 8400000 : 6300000) : (multiple ? 3150000 : 2100000);
  const benefit = Math.min(ordinaryMonthlyWage * coveredMonths, totalCap);

  return {
    coveredDays,
    coveredMonths,
    totalCap,
    benefit
  };
}

function leaveAllowance() {
  const ordinaryHourly = monthlySalaryWon() / 209;
  const ordinaryDaily = ordinaryHourly * state.dailyHours;
  const allowance = ordinaryDaily * state.unusedLeaveDays;

  return {
    ordinaryHourly,
    ordinaryDaily,
    allowance
  };
}

function renderResultBoxes(container, items) {
  container.innerHTML = items
    .map((item) => {
      const variantClass = item.variant ? ` result-box--${item.variant}` : "";
      const detailMarkup = item.detail ? `<p>${item.detail}</p>` : "";
      const helperMarkup = item.helper ? `<small>${item.helper}</small>` : "";

      return `
        <article class="result-box${variantClass}">
          <span>${item.label}</span>
          <strong>${item.value}</strong>
          ${detailMarkup}
          ${helperMarkup}
        </article>
      `;
    })
    .join("");
}

function renderSummaries() {
  const salary = monthlyBriefing();
  const holiday = holidayPay();

  document.querySelector("#summary-annual-salary").textContent = formatWon(salary.annualGross);
  document.querySelector("#summary-insurance-total").textContent = formatWon(salary.insurance.total);
  document.querySelector("#summary-take-home").textContent = formatWon(salary.monthlyTakeHome);

  let recommendation = "월급 브리핑";
  let note = "부양가족과 비과세 수당을 반영해 가장 먼저 보기 좋은 카드";

  if (state.childCount > 0) {
    recommendation = "육아휴직급여";
    note = "자녀 수가 입력되어 있어 가족 급여 계산부터 확인하기 좋습니다.";
  } else if (holiday.eligible) {
    recommendation = "주휴수당";
    note = "주 15시간 이상 근무로 보여 주휴수당 체크가 먼저 필요합니다.";
  } else if (state.serviceMonths >= 12) {
    recommendation = "퇴직금";
    note = "1년 이상 근속으로 입력되어 퇴사 준비 계산을 함께 보기 좋습니다.";
  }

  document.querySelector("#summary-recommendation").textContent = recommendation;
  document.querySelector("#summary-recommendation-note").textContent = note;
}

function renderCalculators() {
  const salary = monthlyBriefing();
  const insurance = salary.insurance;
  const holiday = holidayPay();
  const severance = severancePay();
  const unemployment = unemploymentBenefit();
  const parental = parentalLeaveBenefit();
  const maternity = maternityLeaveBenefit();
  const leave = leaveAllowance();

  renderResultBoxes(document.querySelector("#salary-brief-result"), [
    {
      label: "세전 월급",
      value: formatWon(salary.grossMonthly),
      detail: `연봉 환산 ${formatWon(salary.annualGross)}`
    },
    {
      label: "4대보험 공제",
      value: formatWon(insurance.total),
      detail: "근로자 부담분 합계"
    },
    {
      label: "소득세 추정",
      value: formatWon(salary.monthlyIncomeTax),
      detail: `지방소득세 ${formatWon(salary.monthlyLocalTax)}`
    },
    {
      label: "세후 빠른 추정",
      value: formatWon(salary.monthlyTakeHome),
      detail: "간이세액표를 단순화한 탐색용 값",
      helper: `과세표준 추정 ${formatWon(salary.taxBase)}`
    }
  ]);

  renderResultBoxes(document.querySelector("#insurance-result"), [
    {
      label: "국민연금",
      value: formatWon(insurance.pension),
      detail: "2026년 근로자 부담률 4.75%"
    },
    {
      label: "건강보험",
      value: formatWon(insurance.health),
      detail: "2026년 직장가입자 부담률 3.595%"
    },
    {
      label: "장기요양보험",
      value: formatWon(insurance.care),
      detail: "건강보험료의 13.14%"
    },
    {
      label: "고용보험",
      value: formatWon(insurance.employment),
      detail: "근로자 부담률 0.9%"
    }
  ]);

  const holidayNote = document.querySelector("#holiday-note");
  if (holiday.eligible) {
    holidayNote.textContent = `현재 입력은 주 ${holiday.weeklyHours}시간 근무입니다.`;
  } else {
    holidayNote.textContent = `현재 입력은 주 ${holiday.weeklyHours}시간 근무라 일반적으로 주휴수당 대상이 아닐 수 있습니다.`;
  }

  renderResultBoxes(document.querySelector("#holiday-result"), [
    {
      label: "하루 주휴수당",
      value: formatWon(holiday.dailyHolidayPay),
      detail: "하루 근무시간 기준"
    },
    {
      label: "월 기준 추정",
      value: formatWon(holiday.monthlyHolidayPay),
      detail: "4.345주 기준 추정",
      variant: holiday.eligible ? "ok" : "warn"
    }
  ]);

  renderResultBoxes(document.querySelector("#severance-result"), [
    {
      label: "근속 개월",
      value: `${state.serviceMonths.toLocaleString("ko-KR")}개월`,
      detail: severance.eligible ? "퇴직금 대상 가능 구간" : "12개월 미만은 일반적으로 대상 아님",
      variant: severance.eligible ? "ok" : "warn"
    },
    {
      label: "빠른 추정 퇴직금",
      value: formatWon(severance.estimate),
      detail: "상여금·연차수당 반영 전 단순 추정"
    }
  ]);

  renderResultBoxes(document.querySelector("#unemployment-result"), [
    {
      label: "1일 구직급여 추정",
      value: formatWon(unemployment.dailyBenefit),
      detail: `하한액 추정 ${formatWon(unemployment.lowerLimit)}`
    },
    {
      label: "소정급여일수",
      value: `${unemployment.benefitDays.toLocaleString("ko-KR")}일`,
      detail: "연령·가입기간 기준"
    },
    {
      label: "월 기준 감",
      value: formatWon(unemployment.dailyBenefit * 30),
      detail: "30일 단순 환산"
    },
    {
      label: "총 예상수급액",
      value: formatWon(unemployment.totalBenefit),
      detail: "실제 지급일정에 따라 달라질 수 있음"
    }
  ]);

  renderResultBoxes(document.querySelector("#parental-result"), [
    {
      label: "월 지급 기준",
      value: formatWon(parental.monthlyBenefit),
      detail: "통상임금 80%, 월 70만~150만원"
    },
    {
      label: "휴직 중 지급분",
      value: formatWon(parental.paidDuringLeave),
      detail: "총액의 75%"
    },
    {
      label: "복직 후 일시지급",
      value: formatWon(parental.paidAfterReturn),
      detail: "총액의 25%"
    },
    {
      label: "총 육아휴직급여",
      value: formatWon(parental.totalBenefit),
      detail: `${state.parentalMonths.toLocaleString("ko-KR")}개월 기준`
    }
  ]);

  renderResultBoxes(document.querySelector("#maternity-result"), [
    {
      label: "보험 지원일수",
      value: `${maternity.coveredDays.toLocaleString("ko-KR")}일`,
      detail: state.maternityMode === "priority" ? "우선지원대상기업 기준" : "대규모기업의 보험 지원 구간"
    },
    {
      label: "보험 지원 개월",
      value: `${maternity.coveredMonths.toLocaleString("ko-KR")}개월`,
      detail: state.maternityChildren === "multiple" ? "다태아 기준" : "단태아 기준"
    },
    {
      label: "최대 한도",
      value: formatWon(maternity.totalCap),
      detail: "보험에서 지원하는 총 상한"
    },
    {
      label: "빠른 추정 급여",
      value: formatWon(maternity.benefit),
      detail: "실제 기준은 통상임금과 사업장 유형에 따라 달라짐"
    }
  ]);

  renderResultBoxes(document.querySelector("#leave-result"), [
    {
      label: "1시간 통상임금 추정",
      value: formatWon(leave.ordinaryHourly),
      detail: "월급 ÷ 209시간 기준"
    },
    {
      label: "1일 통상임금 추정",
      value: formatWon(leave.ordinaryDaily),
      detail: `하루 ${state.dailyHours.toLocaleString("ko-KR")}시간 기준`
    },
    {
      label: "미사용 연차",
      value: `${state.unusedLeaveDays.toLocaleString("ko-KR")}일`,
      detail: "남은 연차일수"
    },
    {
      label: "연차수당 추정",
      value: formatWon(leave.allowance),
      detail: "통상임금 기준 빠른 추정"
    }
  ]);
}

function renderCatalog() {
  catalogGrid.innerHTML = calculatorCatalog
    .map((item) => {
      const badgeClass = item.status === "live" ? "catalog-card__badge--live" : "catalog-card__badge--next";
      const badgeLabel = item.status === "live" ? "지금 사용 가능" : "다음 차수";

      return `
        <article class="catalog-card">
          <span class="catalog-card__badge ${badgeClass}">${badgeLabel}</span>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </article>
      `;
    })
    .join("");
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
    const matchesCategory = searchState.category === "전체" || resource.category === searchState.category;
    return matchesCategory && matchesQuery(resource, searchState.query);
  });
}

function renderQuickTags() {
  quickTags.innerHTML = "";

  quickKeywords.forEach((keyword) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-chip";
    button.textContent = keyword;
    button.classList.toggle("is-active", keyword === searchState.query);
    button.addEventListener("click", () => {
      searchState.query = keyword;
      searchInput.value = keyword;
      renderQuickTags();
      renderResults();
    });
    quickTags.appendChild(button);
  });
}

function renderCategoryFilters() {
  categoryFilters.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-chip";
    button.textContent = category;
    button.classList.toggle("is-active", category === searchState.category);
    button.addEventListener("click", () => {
      searchState.category = category;
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
    resultsList.innerHTML = `
      <article class="result-card">
        <div class="result-card__meta">
          <span class="result-card__category">검색 결과 없음</span>
        </div>
        <h3>다른 키워드로 다시 찾아보세요.</h3>
        <p class="result-card__summary">
          예: 실업급여, 근로장려금, 주휴수당, 육아휴직급여, 연차수당
        </p>
      </article>
    `;
  } else {
    filtered.forEach((resource) => {
      const card = document.createElement("article");
      card.className = "result-card";
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
          <span class="result-card__note">실제 일정과 요건은 공식 사이트에서 다시 확인하세요.</span>
          <a href="${resource.sourceUrl}" target="_blank" rel="noreferrer">${resource.sourceLabel}</a>
        </div>
      `;
      resultsList.appendChild(card);
    });
  }

  const scopeLabel = searchState.category === "전체" ? "전체 카테고리" : `${searchState.category} 카테고리`;
  const queryLabel = searchState.query ? ` · "${searchState.query}" 검색` : "";
  resultsCaption.textContent = `${scopeLabel}${queryLabel}에서 ${filtered.length}개 주제를 찾았습니다.`;
}

function reflectStateToInputs() {
  document.querySelectorAll("[data-input-field]").forEach((input) => {
    const key = input.dataset.inputField;
    input.value = state[key];
  });

  document.querySelectorAll("[data-choice-field]").forEach((button) => {
    const key = button.dataset.choiceField;
    const value = parseValue(button.dataset.value, defaults[key]);
    button.classList.toggle("is-active", state[key] === value);
  });
}

function parseValue(rawValue, defaultValue) {
  if (typeof defaultValue === "boolean") {
    return rawValue === "true";
  }

  if (typeof defaultValue === "number") {
    return Number(rawValue);
  }

  return rawValue;
}

function clampState() {
  state.monthlySalaryMan = Math.max(0, state.monthlySalaryMan);
  state.nonTaxableMan = Math.max(0, state.nonTaxableMan);
  state.householdCount = Math.max(1, state.householdCount);
  state.childCount = Math.max(0, state.childCount);
  state.workDays = Math.min(6, Math.max(1, state.workDays));
  state.dailyHours = Math.min(12, Math.max(1, state.dailyHours));
  state.hourlyWage = Math.max(0, state.hourlyWage);
  state.serviceMonths = Math.max(1, state.serviceMonths);
  state.unemploymentMonths = Math.max(1, state.unemploymentMonths);
  state.parentalMonths = Math.min(12, Math.max(1, state.parentalMonths));
  state.unusedLeaveDays = Math.max(0, state.unusedLeaveDays);
}

function renderAll() {
  clampState();
  reflectStateToInputs();
  renderSummaries();
  renderCalculators();
  saveState();
}

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  searchState.query = searchInput.value.trim();
  renderQuickTags();
  renderResults();
});

searchInput.addEventListener("input", (event) => {
  searchState.query = event.target.value.trim();
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

document.querySelectorAll("[data-step-field]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.stepField;
    const step = Number(button.dataset.step);
    state[key] = Number(state[key]) + step;
    renderAll();
  });
});

renderCatalog();
renderQuickTags();
renderCategoryFilters();
renderResults();
renderAll();
