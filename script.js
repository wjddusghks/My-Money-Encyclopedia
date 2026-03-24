const STORAGE_KEY = "my-money-encyclopedia-state-v3";
const MIN_WAGE_2026 = 10320;
const MIN_WAGE_MONTHLY_2026 = 2156880;
const PENSION_RATE = 0.095 / 2;
const PENSION_CEILING = 6370000;
const HEALTH_RATE = 0.0719 / 2;
const CARE_RATIO = 0.1314;
const EMPLOYMENT_RATE = 0.009;
const UNEMPLOYMENT_DAILY_MAX = 66000;
const SPOUSE_LEAVE_CAP = 401910;
const NON_INSURED_BIRTH_ALLOWANCE = 1500000;

const categories = ["전체", "지원금", "월급·노동", "세금", "가족", "청년", "4대보험"];
const quickKeywords = ["실업급여", "근로장려금", "주휴수당", "퇴직금", "육아휴직급여", "출산휴가급여", "최저임금"];
const calcCategories = ["추천", "월급·시급", "퇴사·노동", "가족", "지원금", "전체"];
const featuredResourceIds = ["net-salary", "unemployment-guide", "holiday-guide", "parental-guide", "severance-guide", "earned-credit"];
const intentMap = {
  "take-home": { query: "실수령액", calcCategory: "월급·시급", category: "세금", scroll: "calculator-section" },
  "quit": { query: "퇴직금", calcCategory: "퇴사·노동", category: "월급·노동", scroll: "calculator-section" },
  "family": { query: "육아휴직급여", calcCategory: "가족", category: "가족", scroll: "calculator-section" },
  "aid": { query: "실업급여", calcCategory: "지원금", category: "지원금", scroll: "results-section" }
};

const calculators = [
  { id: "salary-brief", title: "월급 브리핑", tag: "빠른 추정", lead: "월 실수령 추정과 연봉 환산을 먼저 보여줍니다.", sourceLabel: "국세청 안내", sourceUrl: "https://www.nts.go.kr", spotlight: true },
  { id: "insurance", title: "4대보험 빠른 계산", tag: "4대보험", lead: "근로자 부담분을 바로 나눠 보여줍니다.", sourceLabel: "고용보험 안내", sourceUrl: "https://edrm.ei.go.kr/ei/eih/eg/ei/eiEminsr/retrieveEi0301Info.do" },
  { id: "minimum-wage", title: "최저임금 체크", tag: "노동", lead: "시급과 월 환산액을 동시에 비교합니다.", sourceLabel: "고용노동부", sourceUrl: "https://moel.go.kr/index.do" },
  { id: "converter", title: "시급 · 월급 변환", tag: "환산", lead: "현재 근무 패턴 기준 월급과 시급을 바꿔봅니다." },
  { id: "holiday", title: "주휴수당", tag: "노동", lead: "주 15시간과 개근 여부 중심으로 먼저 판단합니다.", sourceLabel: "생활법령", sourceUrl: "https://www.easylaw.go.kr/CSP/CnpClsMainBtr.laf?ccfNo=3&cciNo=1&cnpClsNo=1&csmSeq=2042&popMenu=ov", note: true },
  { id: "overtime", title: "연장 · 야간 · 휴일수당", tag: "수당", lead: "시간 수만 바꾸면 금액이 즉시 계산됩니다.", sourceLabel: "가산임금 기준", sourceUrl: "https://m.easylaw.go.kr/MOB/CsmInfoRetrieve.laf?ccfNo=3&cciNo=3&cnpClsNo=1&csmSeq=1002" },
  { id: "severance", title: "퇴직금", tag: "퇴직", lead: "근속 개월과 월급 기준으로 빠르게 가늠합니다.", sourceLabel: "퇴직금 계산기", sourceUrl: "https://labor.moel.go.kr/cmmt/calRtrmnt.do" },
  { id: "unemployment", title: "실업급여", tag: "지원금", lead: "일액과 소정급여일수 기준으로 범위를 보여줍니다.", sourceLabel: "고용보험 개인혜택", sourceUrl: "https://edrm.ei.go.kr/ei/eih/eg/pb/pbPersonBnef/retrievePb0100Info.do", note: true },
  { id: "parental", title: "육아휴직급여", tag: "가족", lead: "기본형 중심으로 먼저 계산하고 특례는 링크로 보냅니다.", sourceLabel: "육아휴직급여", sourceUrl: "https://edrm.ei.go.kr/ei/eih/eg/pb/pbPersonBnef/retrievePb0100Info.do", note: true },
  { id: "reduced-hours", title: "육아기 근로시간 단축 급여", tag: "가족", lead: "단축 전후 시간을 기준으로 상한 중심 추정치를 보여줍니다.", sourceLabel: "단축근무 안내", sourceUrl: "https://edrm.ei.go.kr/ei/eih/eg/pb/pbPersonBnef/retrievePb0303Info.do", note: true },
  { id: "maternity", title: "출산휴가급여", tag: "가족", lead: "우선지원대상기업 여부와 단태아·다태아를 반영합니다.", sourceLabel: "출산휴가 안내", sourceUrl: "https://edrm.ei.go.kr/ei/eih/eg/pb/pbPersonBnef/retrievePb0301Info.do" },
  { id: "spouse-leave", title: "배우자 출산휴가 급여", tag: "가족", lead: "최초 5일분 상한액 중심으로 빠르게 계산합니다.", sourceLabel: "배우자 출산휴가", sourceUrl: "https://edrm.ei.go.kr/ei/eih/eg/pb/pbPersonBnef/retrievePb0305Info.do", note: true },
  { id: "non-insured-birth", title: "고용보험 미적용자 출산급여", tag: "가족", lead: "총액과 월 분할액을 고정형으로 보여줍니다.", sourceLabel: "미적용자 출산급여", sourceUrl: "https://edrm.ei.go.kr/ei/eih/eg/pb/pbPersonBnef/retrievePb0304Info.do" },
  { id: "leave-allowance", title: "연차수당", tag: "정산", lead: "미사용 연차일수와 통상임금 추정으로 계산합니다.", sourceLabel: "연차 기준", sourceUrl: "https://www.easylaw.go.kr/CSP/CnpClsMainBtr.laf?ccfNo=3&cciNo=1&cnpClsNo=1&csmSeq=2042&popMenu=ov" },
  { id: "shutdown", title: "휴업수당", tag: "노동", lead: "평균임금 70%와 통상임금을 비교해서 추정합니다.", sourceLabel: "휴업수당 기준", sourceUrl: "https://www.easylaw.go.kr/CSP/CnpClsMainBtr.laf?ccfNo=3&cciNo=1&cnpClsNo=1&csmSeq=1694&popMenu=ov" }
];

const resources = [
  { id: "unemployment-guide", title: "실업급여 신청 조건", category: "지원금", audience: "퇴사 예정자", summary: "비자발적 이직과 피보험 단위기간을 먼저 체크해야 하는 대표 주제입니다.", highlights: ["피보험 단위기간 180일 이상 확인", "비자발적 이직 또는 정당한 사유 여부 확인", "급여 계산과 신청 흐름을 한 화면에 묶기 좋음"], tags: ["실업급여", "구직급여", "고용보험"], calculatorIds: ["unemployment"], sourceLabel: "고용보험 개인혜택", sourceUrl: "https://edrm.ei.go.kr/ei/eih/eg/pb/pbPersonBnef/retrievePb0100Info.do" },
  { id: "earned-credit", title: "근로장려금 정리", category: "지원금", audience: "직장인 · 사업자", summary: "연 소득과 가구 유형에 따라 지급 여부가 갈리는 대표 시즌성 지원금입니다.", highlights: ["정기 신청과 반기 신청 흐름 분리", "가구 유형과 소득 · 재산 기준 요약", "신청 링크와 월급 체감 연결"], tags: ["근로장려금", "국세청", "장려금"], calculatorIds: ["salary-brief"], sourceLabel: "국세청 홈택스", sourceUrl: "https://www.nts.go.kr" },
  { id: "holiday-guide", title: "주휴수당 핵심 정리", category: "월급·노동", audience: "알바 · 시간제", summary: "주 15시간과 개근 여부를 가장 많이 헷갈리는 대표 노동 키워드입니다.", highlights: ["주 15시간 기준과 개근 여부 같이 확인", "시급과 근무시간만으로 먼저 계산", "예외 케이스를 Q&A로 확장 가능"], tags: ["주휴수당", "시급", "알바"], calculatorIds: ["holiday", "converter"], sourceLabel: "주휴수당 기준", sourceUrl: "https://www.easylaw.go.kr/CSP/CnpClsMainBtr.laf?ccfNo=3&cciNo=1&cnpClsNo=1&csmSeq=2042&popMenu=ov" },
  { id: "net-salary", title: "월급 실수령액 보기", category: "세금", audience: "직장인", summary: "월급 검색의 가장 기본 진입점이라 메인 화면에서 바로 계산으로 연결하기 좋은 키워드입니다.", highlights: ["4대보험과 세금 추정을 분리 표시", "부양가족 수와 비과세 수당 차이 안내", "급여명세서 해설 카드로 확장 가능"], tags: ["실수령액", "월급", "4대보험"], calculatorIds: ["salary-brief", "insurance"], sourceLabel: "국세청 안내", sourceUrl: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7870&mi=6434" },
  { id: "severance-guide", title: "퇴직금 계산 전 체크", category: "월급·노동", audience: "퇴사 예정자", summary: "1년 이상 계속근로 여부와 평균임금 개념을 이해하면 대부분의 초기 질문이 정리됩니다.", highlights: ["1년 이상 계속근로 여부 확인", "평균임금과 퇴직 직전 3개월 임금 관계 설명", "퇴사 체크리스트와 연결하기 좋음"], tags: ["퇴직금", "평균임금", "퇴사"], calculatorIds: ["severance"], sourceLabel: "퇴직금 계산기", sourceUrl: "https://labor.moel.go.kr/cmmt/calRtrmnt.do" },
  { id: "overtime-guide", title: "연장 · 야간 · 휴일수당", category: "월급·노동", audience: "교대근무 · 서비스직", summary: "어떤 수당이 1.5배인지 헷갈릴 때 자주 찾는 주제입니다.", highlights: ["연장근로는 통상임금의 50% 이상 가산", "야간근로는 가산분과 총액 분리 표시가 유용", "휴일근로는 8시간 이내와 초과 구간 분리"], tags: ["연장근로", "야간근로", "휴일근로"], calculatorIds: ["overtime"], sourceLabel: "가산임금 기준", sourceUrl: "https://m.easylaw.go.kr/MOB/CsmInfoRetrieve.laf?ccfNo=3&cciNo=3&cnpClsNo=1&csmSeq=1002" },
  { id: "min-wage-guide", title: "최저임금 기준 확인", category: "월급·노동", audience: "구직자 · 첫 직장", summary: "시급과 월 환산액을 같이 보여줘야 실제 체감이 쉬워지는 대표 키워드입니다.", highlights: ["시급뿐 아니라 월 환산액 같이 표시", "내 시급과 차이를 바로 보여주는 비교 카드", "실업급여 하한 계산과도 연결"], tags: ["최저임금", "시급", "월급"], calculatorIds: ["minimum-wage", "converter"], sourceLabel: "고용노동부", sourceUrl: "https://moel.go.kr/index.do" },
  { id: "parental-guide", title: "육아휴직급여 기본형", category: "가족", audience: "직장인 부모", summary: "월 상한과 하한, 사후지급금 구조만 이해해도 대부분의 초기 질문을 해결할 수 있습니다.", highlights: ["통상임금 80%, 월 70만~150만원 기본형", "피보험 180일과 자녀 연령 조건 안내", "복직 후 사후지급금 구조 분리"], tags: ["육아휴직급여", "모성보호", "고용보험"], calculatorIds: ["parental"], sourceLabel: "육아휴직급여", sourceUrl: "https://edrm.ei.go.kr/ei/eih/eg/pb/pbPersonBnef/retrievePb0100Info.do" },
  { id: "reduced-guide", title: "육아기 근로시간 단축", category: "가족", audience: "재직 부모", summary: "휴직 대신 시간을 줄이는 경우가 늘어서 계산 수요가 계속 생기는 주제입니다.", highlights: ["주 15~35시간 범위 확인", "최초 5시간과 나머지 시간을 나눠 설명", "매월 또는 종료 후 일괄 신청 흐름 안내"], tags: ["단축근무", "육아기 근로시간 단축"], calculatorIds: ["reduced-hours"], sourceLabel: "단축근무 안내", sourceUrl: "https://edrm.ei.go.kr/ei/eih/eg/pb/pbPersonBnef/retrievePb0303Info.do" },
  { id: "maternity-guide", title: "출산전후휴가 급여", category: "가족", audience: "임신 · 출산 예정자", summary: "우선지원대상기업 여부에 따라 고용보험 지급 구간이 달라지는 주제입니다.", highlights: ["단태아 90일, 다태아 120일 기본 틀", "우선지원대상기업과 대규모기업 구분", "고용보험 지급 한도와 회사 부담 구간 분리"], tags: ["출산휴가", "모성보호"], calculatorIds: ["maternity"], sourceLabel: "출산휴가 안내", sourceUrl: "https://edrm.ei.go.kr/ei/eih/eg/pb/pbPersonBnef/retrievePb0301Info.do" },
  { id: "spouse-guide", title: "배우자 출산휴가", category: "가족", audience: "배우자 출산 예정 근로자", summary: "총 휴가일수와 고용보험 지급분이 달라서 설명과 계산이 같이 있어야 편한 주제입니다.", highlights: ["총 10일, 급여는 최초 5일분 중심", "우선지원대상기업과 피보험 180일 조건 확인", "상한 중심 빠른 계산 제공"], tags: ["배우자 출산휴가", "출산"], calculatorIds: ["spouse-leave"], sourceLabel: "배우자 출산휴가", sourceUrl: "https://edrm.ei.go.kr/ei/eih/eg/pb/pbPersonBnef/retrievePb0305Info.do" },
  { id: "youth-guide", title: "청년 정책 포털 모음", category: "청년", audience: "청년 · 취업준비생", summary: "전국 포털과 지자체 포털을 한곳에 묶어 두면 검색 이후 이동성이 좋아집니다.", highlights: ["온통청년과 지자체 포털을 함께 노출", "정책 캘린더와 모집 공고로 재방문 유도", "월세 · 교육 · 금융 지원으로 확장 가능"], tags: ["청년", "정책", "지역별 지원"], calculatorIds: [], sourceLabel: "온통청년", sourceUrl: "https://www.youthcenter.go.kr/" }
];

const presets = [
  { id: "office", label: "직장인 기본", description: "월급 320 · 주5일 8시간", values: { monthlySalaryMan: 320, nonTaxableMan: 20, householdCount: 1, childCount: 0, workDays: 5, dailyHours: 8, hourlyWage: 15310, prioritySupportCompany: true, serviceMonths: 24, unemploymentMonths: 24 } },
  { id: "parttime", label: "알바 주5일", description: "최저시급 중심", values: { monthlySalaryMan: 216, nonTaxableMan: 0, householdCount: 1, childCount: 0, workDays: 5, dailyHours: 8, hourlyWage: MIN_WAGE_2026, prioritySupportCompany: false, serviceMonths: 12, unemploymentMonths: 12 } },
  { id: "family", label: "맞벌이 부모", description: "자녀 1명 기준", values: { monthlySalaryMan: 380, nonTaxableMan: 20, householdCount: 3, childCount: 1, workDays: 5, dailyHours: 8, hourlyWage: 18180, prioritySupportCompany: true, parentalMonths: 6, childAgeEligible: true } }
];

const supports = [
  { title: "고용24", summary: "실업급여, 육아휴직, 국민취업지원제도를 한 번에 찾는 공식 포털", tags: ["실업급여", "육아휴직"], url: "https://www.work24.go.kr/" },
  { title: "복지로", summary: "가족 급여와 복지서비스 신청에 가장 기본이 되는 전국 포털", tags: ["복지", "가족"], url: "https://www.bokjiro.go.kr/ssis-tbu/" },
  { title: "온통청년", summary: "중앙정부 청년정책을 한 번에 보는 대표 포털", tags: ["청년", "중앙정책"], url: "https://www.youthcenter.go.kr/" },
  { title: "서울 청년몽땅정보통", summary: "서울 지역 청년 공고와 정책 모음", tags: ["서울", "청년"], url: "https://youth.seoul.go.kr/" },
  { title: "경기청년포털", summary: "경기 지역 청년 정책과 캘린더", tags: ["경기", "청년"], url: "https://youth.gg.go.kr/" },
  { title: "부산청년플랫폼", summary: "부산 지역 공고와 프로그램 정보", tags: ["부산", "청년"], url: "https://young.busan.go.kr/" }
];

const calendarItems = [
  { month: "1~2월", title: "연말정산 자료와 회사 제출 일정 체크", summary: "회사 일정과 홈택스 간소화 자료 오픈 시기 확인", url: "https://www.nts.go.kr" },
  { month: "매월", title: "실업급여 · 단축근무 급여 신청 점검", summary: "고용보험 계열 급여는 월 단위 흐름을 놓치기 쉬움", url: "https://www.work24.go.kr/" },
  { month: "5월", title: "종합소득세 신고 시즌 체크", summary: "부업이나 프리랜서 소득이 있으면 반복 방문이 생기는 시기", url: "https://www.nts.go.kr" },
  { month: "수시", title: "지역 청년정책 공고 확인", summary: "지자체 공고형 정책은 지역 포털을 수시로 보는 구조가 중요", url: "https://www.youthcenter.go.kr/" }
];

const updates = [
  { title: "2026 최저임금", value: "시급 10,320원 · 월 2,156,880원", detail: "고용노동부 기준", url: "https://moel.go.kr/index.do" },
  { title: "2026 국민연금", value: "총 9.5% · 근로자 4.75%", detail: "빠른 계산용 기준", url: "https://www.nps.or.kr/eng/ntnlpnsplan/cntb/getOHAI0013M0.do" },
  { title: "2026 건강보험", value: "총 7.19% · 근로자 3.595%", detail: "장기요양보험료율은 13.14%", url: "https://www.nhis.or.kr/english/wbheaa02500m01.do" },
  { title: "실업급여 일액 상한", value: "1일 66,000원", detail: "하한은 최저임금 80% × 1일 소정근로시간", url: "https://edrm.ei.go.kr/ei/eih/eg/pb/pbPersonBnef/retrievePb0100Info.do" }
];

const officialSources = [
  { title: "고용보험 개인혜택", summary: "실업급여, 육아휴직, 출산휴가급여 기본 안내" },
  { title: "배우자 출산휴가 안내", summary: "총 10일과 최초 5일분 급여 상한액 401,910원 확인" },
  { title: "육아기 근로시간 단축 안내", summary: "최초 5시간분과 나머지 단축분 계산식 확인" },
  { title: "고용노동부 최저임금 안내", summary: "시급과 월 환산액이 바뀔 때 가장 먼저 확인할 카드" },
  { title: "생활법령 주휴수당 · 휴업수당", summary: "주휴수당과 휴업수당을 생활형 언어로 확인" },
  { title: "고용노동부 퇴직금 계산기", summary: "빠른 추정 이후 공식 계산기로 비교 검증" }
];

const nextCatalog = [
  { title: "근로소득세 상세 계산기", description: "간이세액표와 공제 항목을 단계별로 반영하는 상세 모드" },
  { title: "퇴직소득세", description: "퇴직금 추정 다음 단계로 세후 금액까지 연결" },
  { title: "종합소득세", description: "프리랜서와 개인사업자용 신고 준비 계산기" },
  { title: "사업소득세", description: "경비 반영 전후를 비교하는 간단 버전" },
  { title: "기타소득세", description: "강연료와 원고료처럼 단발성 소득 계산용" },
  { title: "이자 · 배당소득세", description: "금융소득 세후 금액 비교" },
  { title: "청약가점", description: "부동산 확장용 생활형 계산기" },
  { title: "청년 주거 지원 체크", description: "월세 · 전세 지원 조건 계산기" }
];

const defaults = {
  monthlySalaryMan: 320,
  nonTaxableMan: 20,
  householdCount: 1,
  childCount: 0,
  workDays: 5,
  dailyHours: 8,
  hourlyWage: MIN_WAGE_2026,
  prioritySupportCompany: true,
  serviceMonths: 24,
  unemploymentMonths: 24,
  parentalMonths: 3,
  maternityChildren: "single",
  unusedLeaveDays: 5,
  overtimeHours: 12,
  nightHours: 4,
  holidayHoursUnder8: 4,
  holidayHoursOver8: 0,
  reducedBeforeHours: 40,
  reducedAfterHours: 30,
  shutdownDays: 5,
  insuranceDaysReady: true,
  involuntaryExit: true,
  jobSeekingReady: true,
  fullAttendance: true,
  childAgeEligible: true,
  olderWorker: false,
  savedProfile: null,
  bookmarks: { resources: [], calculators: [] }
};

const calculatorTitleMap = new Map(calculators.map((item) => [item.id, item.title]));
const resourceTitleMap = new Map(resources.map((item) => [item.id, item.title]));
const state = loadState();
const searchState = { query: "", category: "전체", calcCategory: "추천" };

const searchInput = document.querySelector("#search-input");
const quickTagsNode = document.querySelector("#quick-tags");
const suggestionNode = document.querySelector("#search-suggestions");
const bookmarkCountNode = document.querySelector("#bookmark-count");
const categoryFiltersNode = document.querySelector("#category-filters");
const resultsNode = document.querySelector("#results-list");
const resultsCaptionNode = document.querySelector("#results-caption");
const bookmarkStripNode = document.querySelector("#bookmark-strip");
const presetBarNode = document.querySelector("#preset-bar");
const profileStatusNode = document.querySelector("#profile-status");
const eligibilityResultsNode = document.querySelector("#eligibility-results");
const calculatorBoardNode = document.querySelector("#calculator-board");
const calcToolbarNode = document.querySelector("#calc-toolbar");
const calcStageCopyNode = document.querySelector("#calc-stage-copy");
const supportGridNode = document.querySelector("#support-grid");
const calendarGridNode = document.querySelector("#calendar-grid");
const updateGridNode = document.querySelector("#update-grid");
const sourceListNode = document.querySelector("#source-list");
const catalogGridNode = document.querySelector("#catalog-grid");

document.querySelector("#resource-count").textContent = String(resources.length);
document.querySelector("#calculator-count").textContent = String(calculators.length);

function cloneDefaults() {
  return JSON.parse(JSON.stringify(defaults));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneDefaults();
    const parsed = JSON.parse(raw);
    return {
      ...cloneDefaults(),
      ...parsed,
      bookmarks: {
        resources: Array.isArray(parsed.bookmarks?.resources) ? parsed.bookmarks.resources : [],
        calculators: Array.isArray(parsed.bookmarks?.calculators) ? parsed.bookmarks.calculators : []
      },
      savedProfile: parsed.savedProfile ?? null
    };
  } catch {
    return cloneDefaults();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function parseValue(raw, defaultValue) {
  if (typeof defaultValue === "boolean") return raw === "true";
  if (typeof defaultValue === "number") return Number(raw);
  return raw;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatWon(value) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

function monthlySalaryWon() {
  return state.monthlySalaryMan * 10000;
}

function monthlyHours() {
  return state.workDays * state.dailyHours * 4.345;
}

function ordinaryHourly() {
  return monthlySalaryWon() / 209;
}

function ordinaryDaily() {
  return ordinaryHourly() * state.dailyHours;
}

function insuranceBreakdown(gross) {
  const pension = Math.min(gross, PENSION_CEILING) * PENSION_RATE;
  const health = gross * HEALTH_RATE;
  const care = health * CARE_RATIO;
  const employment = gross * EMPLOYMENT_RATE;
  return { pension, health, care, employment, total: pension + health + care + employment };
}

function earnedIncomeDeduction(annual) {
  if (annual <= 5000000) return annual * 0.7;
  if (annual <= 15000000) return 3500000 + (annual - 5000000) * 0.4;
  if (annual <= 45000000) return 7500000 + (annual - 15000000) * 0.15;
  if (annual <= 100000000) return 12000000 + (annual - 45000000) * 0.05;
  return Math.min(20000000, 14750000 + (annual - 100000000) * 0.02);
}

function progressiveTax(base) {
  if (base <= 14000000) return base * 0.06;
  if (base <= 50000000) return 840000 + (base - 14000000) * 0.15;
  if (base <= 88000000) return 6240000 + (base - 50000000) * 0.24;
  if (base <= 150000000) return 15360000 + (base - 88000000) * 0.35;
  if (base <= 300000000) return 37060000 + (base - 150000000) * 0.38;
  if (base <= 500000000) return 94060000 + (base - 300000000) * 0.4;
  if (base <= 1000000000) return 174060000 + (base - 500000000) * 0.42;
  return 384060000 + (base - 1000000000) * 0.45;
}

function salaryBrief() {
  const gross = monthlySalaryWon();
  const insurance = insuranceBreakdown(gross);
  const annualTaxable = Math.max(0, gross - state.nonTaxableMan * 10000) * 12;
  const deduction = earnedIncomeDeduction(annualTaxable);
  const basic = (state.householdCount + state.childCount) * 1500000;
  const taxBase = Math.max(0, annualTaxable - insurance.total * 12 - deduction - basic);
  const annualIncomeTax = Math.max(0, progressiveTax(taxBase) - Math.min(progressiveTax(taxBase) * 0.55, 740000));
  const annualLocalTax = annualIncomeTax * 0.1;
  return {
    gross,
    annualGross: gross * 12,
    insurance,
    taxBase,
    incomeTax: annualIncomeTax / 12,
    localTax: annualLocalTax / 12,
    takeHome: Math.max(0, gross - insurance.total - annualIncomeTax / 12 - annualLocalTax / 12)
  };
}

function minimumWageCheck() {
  const scheduleMinimum = MIN_WAGE_2026 * monthlyHours();
  return { hourlyPass: state.hourlyWage >= MIN_WAGE_2026, schedulePass: monthlySalaryWon() >= scheduleMinimum, scheduleMinimum };
}

function holidayPay() {
  const weeklyHours = state.workDays * state.dailyHours;
  const eligible = weeklyHours >= 15 && state.fullAttendance;
  return { weeklyHours, eligible, weeklyPay: state.hourlyWage * state.dailyHours, monthlyPay: state.hourlyWage * state.dailyHours * 4.345 };
}

function overtimePay() {
  return {
    overtime: state.overtimeHours * state.hourlyWage * 1.5,
    nightPremium: state.nightHours * state.hourlyWage * 0.5,
    nightTotal: state.nightHours * state.hourlyWage * 1.5,
    holiday: state.holidayHoursUnder8 * state.hourlyWage * 1.5 + state.holidayHoursOver8 * state.hourlyWage * 2
  };
}

function severancePay() {
  return { eligible: state.serviceMonths >= 12, years: state.serviceMonths / 12, estimate: monthlySalaryWon() * (state.serviceMonths / 12), averageDaily: (monthlySalaryWon() * 3) / 91.25 };
}

function unemploymentBenefit() {
  const lowerLimit = MIN_WAGE_2026 * state.dailyHours * 0.8;
  let days = 120;
  if (state.olderWorker) {
    if (state.unemploymentMonths >= 120) days = 270;
    else if (state.unemploymentMonths >= 60) days = 240;
    else if (state.unemploymentMonths >= 36) days = 210;
    else if (state.unemploymentMonths >= 12) days = 180;
  } else {
    if (state.unemploymentMonths >= 120) days = 240;
    else if (state.unemploymentMonths >= 60) days = 210;
    else if (state.unemploymentMonths >= 36) days = 180;
    else if (state.unemploymentMonths >= 12) days = 150;
  }
  let daily = monthlySalaryWon() / 30 * 0.6;
  daily = daily < lowerLimit ? lowerLimit : Math.min(daily, UNEMPLOYMENT_DAILY_MAX);
  return { eligible: state.insuranceDaysReady && state.involuntaryExit && state.jobSeekingReady, lowerLimit, days, daily, total: daily * days };
}

function parentalBenefit() {
  const monthlyBase = clamp(monthlySalaryWon() * 0.8, 700000, 1500000);
  const total = monthlyBase * state.parentalMonths;
  return { eligible: state.insuranceDaysReady && state.childAgeEligible, monthlyBase, total, during: total * 0.75, after: total * 0.25 };
}

function reducedHoursBenefit() {
  const before = Math.max(1, state.reducedBeforeHours);
  const after = Math.min(state.reducedAfterHours, before);
  const reduced = Math.max(0, before - after);
  const firstHours = Math.min(reduced, 5);
  const restHours = Math.max(0, reduced - 5);
  const benefit = Math.min(monthlySalaryWon(), 2000000) * (firstHours / before) + Math.min(monthlySalaryWon() * 0.8, 1500000) * (restHours / before);
  return { eligible: state.insuranceDaysReady && state.childAgeEligible, before, after, reduced, benefit };
}

function maternityBenefit() {
  const multi = state.maternityChildren === "multiple";
  const totalDays = multi ? 120 : 90;
  const insuranceDays = state.prioritySupportCompany ? totalDays : multi ? 45 : 30;
  const cap = state.prioritySupportCompany ? (multi ? 8400000 : 6300000) : multi ? 3150000 : 2100000;
  return { eligible: state.insuranceDaysReady, totalDays, insuranceDays, cap, benefit: Math.min(monthlySalaryWon() * (insuranceDays / 30), cap) };
}

function spouseBenefit() {
  return { eligible: state.prioritySupportCompany && state.insuranceDaysReady, benefit: state.prioritySupportCompany ? Math.min(ordinaryHourly() * 8 * 5, SPOUSE_LEAVE_CAP) : 0 };
}

function leaveAllowance() {
  return { hourly: ordinaryHourly(), daily: ordinaryDaily(), allowance: ordinaryDaily() * state.unusedLeaveDays };
}

function shutdownAllowance() {
  const averageDaily = monthlySalaryWon() * 12 / 365;
  const dailyAllowance = Math.min(averageDaily * 0.7, ordinaryDaily());
  return { averageDaily, dailyAllowance, total: dailyAllowance * state.shutdownDays };
}

function isBookmarked(type, id) {
  return state.bookmarks[type].includes(id);
}

function toggleBookmark(type, id) {
  const list = state.bookmarks[type];
  const index = list.indexOf(id);
  if (index >= 0) list.splice(index, 1);
  else list.push(id);
  renderAll();
}

function renderBoxes(containerId, items) {
  const node = document.getElementById(containerId);
  if (!node) return;
  node.innerHTML = items.map((item) => `
    <article class="result-box${item.variant ? ` result-box--${item.variant}` : ""}">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      ${item.detail ? `<p>${item.detail}</p>` : ""}
      ${item.helper ? `<small>${item.helper}</small>` : ""}
    </article>
  `).join("");
}

function setText(id, text) {
  const node = document.getElementById(id);
  if (node) node.textContent = text;
}

function calculatorGroup(id) {
  if (["salary-brief", "insurance", "minimum-wage", "converter"].includes(id)) return "월급·시급";
  if (["holiday", "overtime", "severance", "leave-allowance", "shutdown"].includes(id)) return "퇴사·노동";
  if (["parental", "reduced-hours", "maternity", "spouse-leave", "non-insured-birth"].includes(id)) return "가족";
  if (["unemployment"].includes(id)) return "지원금";
  return "전체";
}

function recommendedCalculatorIds() {
  const picks = ["salary-brief", "insurance", "holiday", "unemployment", "severance"];
  if (state.childCount > 0 || searchState.category === "가족") picks.splice(3, 0, "parental");
  else picks.splice(3, 0, "minimum-wage");
  return picks;
}

function getVisibleCalculators() {
  if (searchState.calcCategory === "전체") return calculators;
  if (searchState.calcCategory === "추천") {
    const ids = new Set(recommendedCalculatorIds());
    return calculators.filter((card) => ids.has(card.id));
  }
  return calculators.filter((card) => calculatorGroup(card.id) === searchState.calcCategory);
}

function stageCopy() {
  if (searchState.calcCategory === "추천") return "지금 가장 많이 쓰는 계산기만 먼저 보여줍니다.";
  if (searchState.calcCategory === "월급·시급") return "월급, 시급, 실수령액처럼 첫 방문자가 가장 먼저 보는 계산기 묶음입니다.";
  if (searchState.calcCategory === "퇴사·노동") return "퇴직금, 연차수당, 수당 계산처럼 퇴사와 노동 정산에 가까운 카드만 모았습니다.";
  if (searchState.calcCategory === "가족") return "육아휴직, 출산휴가, 배우자 출산휴가처럼 가족 급여 계산기만 모았습니다.";
  if (searchState.calcCategory === "지원금") return "실업급여와 지원금 탐색 흐름에 가까운 카드만 먼저 보여줍니다.";
  return "전체 계산기를 한 번에 보되, 먼저 검색이나 의도 버튼으로 좁혀서 보는 편이 더 편합니다.";
}

function renderCalcToolbar() {
  calcToolbarNode.innerHTML = calcCategories.map((category) => `
    <button type="button" class="choice-chip ${searchState.calcCategory === category ? "is-active" : ""}" data-calc-category="${category}">
      ${category}
    </button>
  `).join("");
  calcStageCopyNode.textContent = stageCopy();
}

function renderCalculatorBoard() {
  const visible = getVisibleCalculators();
  calculatorBoardNode.innerHTML = visible.map((card, index) => `
    <article class="calc-card${(card.spotlight && searchState.calcCategory !== "전체") || index === 0 ? " calc-card--spotlight" : ""}" id="calc-${card.id}">
      <div class="calc-card__header">
        <div><p class="section__eyebrow">${card.tag}</p><h3>${card.title}</h3></div>
        <button type="button" class="bookmark-toggle${isBookmarked("calculators", card.id) ? " is-active" : ""}" data-toggle-calculator="${card.id}">${isBookmarked("calculators", card.id) ? "즐겨찾기됨" : "즐겨찾기"}</button>
      </div>
      <p class="calc-card__lead">${card.lead}</p>
      ${card.note ? `<p class="calc-note" id="${card.id}-note"></p>` : ""}
      <div class="result-grid" id="${card.id}-result"></div>
      ${card.sourceUrl ? `<a class="source-link" href="${card.sourceUrl}" target="_blank" rel="noreferrer">${card.sourceLabel}</a>` : ""}
    </article>
  `).join("");
}

function renderPresets() {
  presetBarNode.innerHTML = presets.map((preset) => `
    <button type="button" class="quick-link" data-apply-preset="${preset.id}">
      <strong>${preset.label}</strong>
      <span>${preset.description}</span>
    </button>
  `).join("");
}

function renderSupport() {
  supportGridNode.innerHTML = supports.map((item) => `
    <article class="portal-card">
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <div class="result-card__tags">${item.tags.map((tag) => `<span class="result-pill">#${tag}</span>`).join("")}</div>
      <a class="source-link" href="${item.url}" target="_blank" rel="noreferrer">공식 포털 열기</a>
    </article>
  `).join("");
  calendarGridNode.innerHTML = calendarItems.map((item) => `
    <article class="calendar-card">
      <strong>${item.month}</strong><h3>${item.title}</h3><p>${item.summary}</p>
      <a class="source-link" href="${item.url}" target="_blank" rel="noreferrer">공식 확인</a>
    </article>
  `).join("");
  updateGridNode.innerHTML = updates.map((item) => `
    <article class="update-card">
      <strong>${item.title}</strong><h3>${item.value}</h3><p>${item.detail}</p>
      <a class="source-link" href="${item.url}" target="_blank" rel="noreferrer">근거 보기</a>
    </article>
  `).join("");
  sourceListNode.innerHTML = officialSources.map((item) => `<article class="source-item"><strong>${item.title}</strong><p>${item.summary}</p></article>`).join("");
  catalogGridNode.innerHTML = nextCatalog.map((item) => `<article class="catalog-card"><span class="catalog-card__badge catalog-card__badge--next">다음 차수</span><h3>${item.title}</h3><p>${item.description}</p></article>`).join("");
}

function renderQuickTags() {
  quickTagsNode.innerHTML = quickKeywords.map((word) => `<button type="button" class="choice-chip ${searchState.query === word ? "is-active" : ""}" data-search-tag="${word}">${word}</button>`).join("");
}

function renderCategoryFilters() {
  categoryFiltersNode.innerHTML = categories.map((category) => `<button type="button" class="choice-chip ${searchState.category === category ? "is-active" : ""}" data-filter-category="${category}">${category}</button>`).join("");
}

function matchesQuery(item, query) {
  if (!query) return true;
  const haystack = [item.title, item.category, item.audience, item.summary, ...item.highlights, ...item.tags].join(" ").toLowerCase();
  return haystack.includes(query);
}

function renderSuggestions() {
  const query = searchState.query.trim().toLowerCase();
  if (!query) {
    suggestionNode.classList.remove("is-visible");
    suggestionNode.innerHTML = "";
    return;
  }
  const items = resources.filter((item) => matchesQuery(item, query)).slice(0, 5);
  if (items.length === 0) {
    suggestionNode.classList.remove("is-visible");
    suggestionNode.innerHTML = "";
    return;
  }
  suggestionNode.classList.add("is-visible");
  suggestionNode.innerHTML = items.map((item) => `<button type="button" data-suggestion="${item.title}">${item.title}</button>`).join("");
}

function renderResults() {
  const browsingMode = !searchState.query && searchState.category === "전체";
  const filtered = browsingMode
    ? resources.filter((item) => featuredResourceIds.includes(item.id))
    : resources.filter((item) => (searchState.category === "전체" || item.category === searchState.category) && matchesQuery(item, searchState.query.trim().toLowerCase()));
  resultsCaptionNode.textContent = browsingMode
    ? "많이 찾는 대표 주제만 먼저 보여줍니다. 검색하면 더 자세하게 좁혀집니다."
    : `${searchState.category} 범위에서 ${filtered.length}개 주제를 찾았습니다.`;
  if (filtered.length === 0) {
    resultsNode.innerHTML = `<article class="result-card"><h3>다른 키워드로 다시 찾아보세요.</h3><p class="result-card__summary">예: 실업급여, 근로장려금, 주휴수당, 최저임금</p></article>`;
    return;
  }
  resultsNode.innerHTML = filtered.map((item) => `
    <article class="result-card${browsingMode ? " is-compact" : ""}" id="topic-${item.id}">
      <div class="result-card__meta">
        <span class="result-card__category">${item.category}</span>
        <span class="result-pill">${item.audience}</span>
      </div>
      <div class="calc-card__header">
        <h3>${item.title}</h3>
        <button type="button" class="result-card__bookmark ${isBookmarked("resources", item.id) ? "is-active" : ""}" data-toggle-resource="${item.id}">
          ${isBookmarked("resources", item.id) ? "저장됨" : "즐겨찾기"}
        </button>
      </div>
      <p class="result-card__summary">${item.summary}</p>
      <ul class="result-card__highlights">${item.highlights.slice(0, browsingMode ? 1 : 3).map((line) => `<li>${line}</li>`).join("")}</ul>
      <div class="result-card__tags">${item.tags.map((tag) => `<span class="result-pill">#${tag}</span>`).join("")}</div>
      <div class="result-card__calc-links">${item.calculatorIds.map((id) => `<button type="button" class="calculator-link" data-scroll-target="calc-${id}">${calculatorTitleMap.get(id)}</button>`).join("")}</div>
      <div class="result-card__actions">
        <span class="result-card__summary">${browsingMode ? "계산기로 바로 이동하거나 검색을 더 좁혀보세요." : "실제 신청 전에는 공식 공고를 다시 확인하세요."}</span>
        <a href="${item.sourceUrl}" target="_blank" rel="noreferrer">${item.sourceLabel}</a>
      </div>
    </article>
  `).join("");
}

function renderBookmarks() {
  const resourcesMarkup = state.bookmarks.resources.map((id) => `<button type="button" class="bookmark-pill" data-scroll-target="topic-${id}">${resourceTitleMap.get(id)}</button>`);
  const calculatorMarkup = state.bookmarks.calculators.map((id) => `<button type="button" class="bookmark-pill" data-scroll-target="calc-${id}">${calculatorTitleMap.get(id)}</button>`);
  const merged = [...resourcesMarkup, ...calculatorMarkup].filter(Boolean);
  bookmarkStripNode.innerHTML = merged.length ? merged.join("") : `<p class="bookmark-empty">관심 계산기나 주제를 저장하면 여기에 다시 모입니다.</p>`;
  bookmarkCountNode.textContent = String(state.bookmarks.resources.length + state.bookmarks.calculators.length);
}

function renderProfileStatus() {
  if (!state.savedProfile?.values) {
    profileStatusNode.textContent = "아직 저장된 프로필이 없습니다.";
    return;
  }
  const label = new Intl.DateTimeFormat("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(state.savedProfile.timestamp));
  profileStatusNode.textContent = `저장 프로필 있음 · 최근 저장 ${label}`;
}

function renderEligibility() {
  const holiday = holidayPay();
  const targets = ["unemployment", "holiday", "parental", "spouse-leave"];
  const cards = [
    { title: "실업급여 가능성", active: state.insuranceDaysReady && state.involuntaryExit && state.jobSeekingReady, text: "이직 사유와 고용보험 조건 확인" },
    { title: "주휴수당 가능성", active: holiday.eligible, text: "주 15시간과 개근 조건 기준" },
    { title: "육아휴직 · 단축급여", active: state.insuranceDaysReady && state.childAgeEligible, text: "자녀 연령과 피보험 조건 기준" },
    { title: "배우자 출산휴가 급여", active: state.prioritySupportCompany && state.insuranceDaysReady, text: "우선지원대상기업과 피보험 조건 기준" }
  ];
  eligibilityResultsNode.innerHTML = cards.map((card, index) => `
    <article class="eligibility-card ${card.active ? "eligibility-card--ok" : "eligibility-card--warn"}">
      <span>${card.active ? "가능성 높음" : "추가 확인 필요"}</span>
      <strong>${card.title}</strong>
      <p>${card.text}</p>
      <button type="button" class="calculator-link" data-scroll-target="calc-${targets[index]}">계산기로 이동</button>
    </article>
  `).join("");
}

function reflectInputs() {
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

function clampState() {
  state.monthlySalaryMan = clamp(Number(state.monthlySalaryMan) || 0, 0, 10000);
  state.nonTaxableMan = clamp(Number(state.nonTaxableMan) || 0, 0, 1000);
  state.householdCount = clamp(Number(state.householdCount) || 1, 1, 8);
  state.childCount = clamp(Number(state.childCount) || 0, 0, 8);
  state.workDays = clamp(Number(state.workDays) || 1, 1, 6);
  state.dailyHours = clamp(Number(state.dailyHours) || 1, 1, 12);
  state.hourlyWage = clamp(Number(state.hourlyWage) || 0, 0, 100000);
  state.serviceMonths = clamp(Number(state.serviceMonths) || 1, 1, 600);
  state.unemploymentMonths = clamp(Number(state.unemploymentMonths) || 1, 1, 600);
  state.parentalMonths = clamp(Number(state.parentalMonths) || 1, 1, 12);
  state.unusedLeaveDays = clamp(Number(state.unusedLeaveDays) || 0, 0, 60);
  state.overtimeHours = clamp(Number(state.overtimeHours) || 0, 0, 300);
  state.nightHours = clamp(Number(state.nightHours) || 0, 0, 300);
  state.holidayHoursUnder8 = clamp(Number(state.holidayHoursUnder8) || 0, 0, 300);
  state.holidayHoursOver8 = clamp(Number(state.holidayHoursOver8) || 0, 0, 300);
  state.reducedBeforeHours = clamp(Number(state.reducedBeforeHours) || 1, 1, 52);
  state.reducedAfterHours = clamp(Number(state.reducedAfterHours) || 1, 1, state.reducedBeforeHours);
  state.shutdownDays = clamp(Number(state.shutdownDays) || 0, 0, 365);
  state.bookmarks.resources = state.bookmarks.resources.filter((id) => resourceTitleMap.has(id));
  state.bookmarks.calculators = state.bookmarks.calculators.filter((id) => calculatorTitleMap.has(id));
}

function renderSummaries() {
  const salary = salaryBrief();
  const holiday = holidayPay();
  document.querySelector("#summary-annual-salary").textContent = formatWon(salary.annualGross);
  document.querySelector("#summary-insurance-total").textContent = formatWon(salary.insurance.total);
  document.querySelector("#summary-take-home").textContent = formatWon(salary.takeHome);
  let title = "월급 브리핑";
  let note = "월 실수령 추정과 보험 공제를 먼저 보는 흐름이 좋습니다.";
  if (state.childCount > 0 && state.childAgeEligible) {
    title = "육아휴직급여";
    note = "자녀 연령 조건이 맞는 상태라 가족 급여 계열부터 보는 흐름이 좋습니다.";
  } else if (holiday.eligible) {
    title = "주휴수당";
    note = "주 15시간 이상과 개근 조건이 맞아 보여 주휴수당 카드부터 확인하는 편이 좋습니다.";
  } else if (state.serviceMonths >= 12) {
    title = "퇴직금";
    note = "근속 개월이 충분해 퇴직 정산 계열을 먼저 보는 흐름이 자연스럽습니다.";
  }
  document.querySelector("#summary-recommendation").textContent = title;
  document.querySelector("#summary-recommendation-note").textContent = note;
}

function renderCalculations() {
  const salary = salaryBrief();
  const insurance = salary.insurance;
  const minimum = minimumWageCheck();
  const holiday = holidayPay();
  const overtime = overtimePay();
  const severance = severancePay();
  const unemployment = unemploymentBenefit();
  const parental = parentalBenefit();
  const reduced = reducedHoursBenefit();
  const maternity = maternityBenefit();
  const spouse = spouseBenefit();
  const leave = leaveAllowance();
  const shutdown = shutdownAllowance();

  renderBoxes("salary-brief-result", [
    { label: "세전 월급", value: formatWon(salary.gross), detail: `연봉 환산 ${formatWon(salary.annualGross)}` },
    { label: "월 4대보험", value: formatWon(insurance.total), detail: "근로자 부담분 빠른 추정" },
    { label: "월 근로소득세 추정", value: formatWon(salary.incomeTax), detail: `지방소득세 ${formatWon(salary.localTax)}` },
    { label: "월 실수령 추정", value: formatWon(salary.takeHome), detail: "간편 공제 기준", helper: `과세표준 추정 ${formatWon(salary.taxBase)}` }
  ]);
  renderBoxes("insurance-result", [
    { label: "국민연금", value: formatWon(insurance.pension), detail: "근로자 4.75%" },
    { label: "건강보험", value: formatWon(insurance.health), detail: "근로자 3.595%" },
    { label: "장기요양보험", value: formatWon(insurance.care), detail: "건강보험료의 13.14%" },
    { label: "고용보험", value: formatWon(insurance.employment), detail: "근로자 0.9%" }
  ]);
  renderBoxes("minimum-wage-result", [
    { label: "현재 시급", value: formatWon(state.hourlyWage), detail: minimum.hourlyPass ? "최저임금 이상" : "최저임금 미달 가능성", variant: minimum.hourlyPass ? "ok" : "warn" },
    { label: "2026 최저시급", value: formatWon(MIN_WAGE_2026), detail: "고용노동부 기준" },
    { label: "현재 패턴 월 환산 최저액", value: formatWon(minimum.scheduleMinimum), detail: `${state.workDays}일 × ${state.dailyHours}시간 기준` },
    { label: "현재 월급 비교", value: formatWon(monthlySalaryWon()), detail: minimum.schedulePass ? "월 환산 기준 이상" : "월 환산 기준 미달 가능성", variant: minimum.schedulePass ? "ok" : "warn" }
  ]);
  renderBoxes("converter-result", [
    { label: "현재 패턴 월 총시간", value: `${monthlyHours().toFixed(1)}시간`, detail: "4.345주 환산" },
    { label: "시급 기준 월급", value: formatWon(state.hourlyWage * monthlyHours()), detail: "현재 시급으로 환산" },
    { label: "월급 기준 시급", value: formatWon(monthlySalaryWon() / Math.max(monthlyHours(), 1)), detail: "현재 월급을 시급으로 역산" },
    { label: "주40시간 최저 월급", value: formatWon(MIN_WAGE_MONTHLY_2026), detail: "2026 기준" }
  ]);
  document.getElementById("holiday-note").textContent = holiday.eligible ? `현재 입력은 주 ${holiday.weeklyHours}시간, 개근 조건 충족으로 보입니다.` : `현재 입력은 주 ${holiday.weeklyHours}시간이거나 개근 조건이 달라 대상이 아닐 수 있습니다.`;
  renderBoxes("holiday-result", [
    { label: "주 근무시간", value: `${holiday.weeklyHours}시간`, detail: "주휴 기준 15시간 여부 확인" },
    { label: "주당 주휴수당", value: formatWon(holiday.weeklyPay), detail: "하루 소정근로시간 기준", variant: holiday.eligible ? "ok" : "warn" },
    { label: "월 환산 주휴수당", value: formatWon(holiday.monthlyPay), detail: "4.345주 환산" }
  ]);
  renderBoxes("overtime-result", [
    { label: "연장근로 총액", value: formatWon(overtime.overtime), detail: `${state.overtimeHours}시간 × 시급 × 1.5` },
    { label: "야간 가산분", value: formatWon(overtime.nightPremium), detail: `${state.nightHours}시간 × 시급 × 0.5` },
    { label: "야간 총액", value: formatWon(overtime.nightTotal), detail: "기본급 포함 총액" },
    { label: "휴일근로 총액", value: formatWon(overtime.holiday), detail: "8시간 이내 1.5배, 초과 2배" }
  ]);
  renderBoxes("severance-result", [
    { label: "근속 개월", value: `${state.serviceMonths}개월`, detail: severance.eligible ? "퇴직금 추정 가능 구간" : "1년 미만은 일반적으로 대상 아님", variant: severance.eligible ? "ok" : "warn" },
    { label: "계속근로 연수", value: `${severance.years.toFixed(1)}년`, detail: "개월 기준 단순 환산" },
    { label: "빠른 추정 퇴직금", value: formatWon(severance.estimate), detail: "현재 월급 기준 추정" },
    { label: "1일 평균임금 추정", value: formatWon(severance.averageDaily), detail: "최근 3개월 기준 간이 추정" }
  ]);
  document.getElementById("unemployment-note").textContent = unemployment.eligible ? "핵심 자격 체크상 가능성이 높아 보입니다." : "이직 사유, 재취업 활동, 피보험 조건 중 추가 확인이 필요합니다.";
  renderBoxes("unemployment-result", [
    { label: "1일 구직급여 추정", value: formatWon(unemployment.daily), detail: `하한 기준 ${formatWon(unemployment.lowerLimit)}` },
    { label: "소정급여일수", value: `${unemployment.days}일`, detail: "연령과 가입기간 기준" },
    { label: "월 환산 추정", value: formatWon(unemployment.daily * 30), detail: "30일 단순 환산" },
    { label: "총 예상액", value: formatWon(unemployment.total), detail: "실제 일정에 따라 달라질 수 있음", variant: unemployment.eligible ? "ok" : "warn" }
  ]);
  document.getElementById("parental-note").textContent = parental.eligible ? "기본형 육아휴직급여 기준으로 계산했습니다." : "자녀 연령 또는 피보험 단위기간을 먼저 확인하세요.";
  renderBoxes("parental-result", [
    { label: "월 급여 기본형", value: formatWon(parental.monthlyBase), detail: "통상임금 80%, 월 70만~150만원" },
    { label: "휴직 중 지급분", value: formatWon(parental.during), detail: "총액의 75%" },
    { label: "복직 후 사후지급금", value: formatWon(parental.after), detail: "총액의 25%" },
    { label: "총 육아휴직급여", value: formatWon(parental.total), detail: `${state.parentalMonths}개월 기준`, variant: parental.eligible ? "ok" : "warn" }
  ]);
  document.getElementById("reduced-hours-note").textContent = reduced.after < 15 || reduced.after > 35 ? "단축 후 근로시간은 일반적으로 주 15시간 이상 35시간 이하여야 합니다." : "상한 중심 간이 계산이며 하한과 일할 계산은 공식 신청 단계에서 다시 확인해야 합니다.";
  renderBoxes("reduced-hours-result", [
    { label: "단축 전 주당 시간", value: `${reduced.before}시간`, detail: "기준 소정근로시간" },
    { label: "단축 후 주당 시간", value: `${reduced.after}시간`, detail: "신청 후 근로시간" },
    { label: "줄어든 시간", value: `${reduced.reduced}시간`, detail: "주당 감소 시간" },
    { label: "월 급여 추정", value: formatWon(reduced.benefit), detail: "최초 5시간분 + 나머지 단축분", variant: reduced.eligible ? "ok" : "warn" }
  ]);
  renderBoxes("maternity-result", [
    { label: "총 휴가일수", value: `${maternity.totalDays}일`, detail: state.maternityChildren === "multiple" ? "다태아 기준" : "단태아 기준" },
    { label: "고용보험 지급일수", value: `${maternity.insuranceDays}일`, detail: state.prioritySupportCompany ? "우선지원대상기업 기준" : "대규모기업 고용보험 구간" },
    { label: "고용보험 지급 한도", value: formatWon(maternity.cap), detail: "기업 유형에 따라 다름" },
    { label: "고용보험 지급 추정", value: formatWon(maternity.benefit), detail: "회사 부담 구간은 별도 확인", variant: maternity.eligible ? "ok" : "warn" }
  ]);
  document.getElementById("spouse-leave-note").textContent = spouse.eligible ? "우선지원대상기업과 피보험 조건이 맞는 경우 기준으로 계산했습니다." : "기업 규모 또는 피보험 조건 때문에 확인이 더 필요합니다.";
  renderBoxes("spouse-leave-result", [
    { label: "배우자 출산휴가 총일수", value: "10일", detail: "유급 휴가 기준" },
    { label: "고용보험 지급분", value: "최초 5일", detail: "상한 중심 빠른 계산" },
    { label: "지급 상한", value: formatWon(SPOUSE_LEAVE_CAP), detail: "공식 안내 기준" },
    { label: "급여 추정", value: formatWon(spouse.benefit), detail: "통상임금 상당액 기준", variant: spouse.eligible ? "ok" : "warn" }
  ]);
  renderBoxes("non-insured-birth-result", [
    { label: "총 지급액", value: formatWon(NON_INSURED_BIRTH_ALLOWANCE), detail: "고정형 지원금" },
    { label: "월 분할액", value: formatWon(NON_INSURED_BIRTH_ALLOWANCE / 3), detail: "3개월 분할 기준" },
    { label: "대상 방향", value: "보험 미적용자", detail: "프리랜서 · 특고 등" },
    { label: "꼭 확인할 것", value: "소득활동 기간", detail: "출산 전 18개월 중 3개월 이상" }
  ]);
  renderBoxes("leave-allowance-result", [
    { label: "1시간 통상임금 추정", value: formatWon(leave.hourly), detail: "월급 ÷ 209시간 기준" },
    { label: "1일 통상임금 추정", value: formatWon(leave.daily), detail: `${state.dailyHours}시간 기준` },
    { label: "미사용 연차", value: `${state.unusedLeaveDays}일`, detail: "현재 입력값" },
    { label: "연차수당 추정", value: formatWon(leave.allowance), detail: "통상임금 기준 간이 계산" }
  ]);
  renderBoxes("shutdown-result", [
    { label: "1일 평균임금 추정", value: formatWon(shutdown.averageDaily), detail: "월급 기준 간단 환산" },
    { label: "1일 휴업수당 추정", value: formatWon(shutdown.dailyAllowance), detail: "평균임금 70%와 통상임금 비교" },
    { label: "총 휴업수당 추정", value: formatWon(shutdown.total), detail: `${state.shutdownDays}일 기준` }
  ]);
}

function saveProfile() {
  const values = {};
  Object.keys(defaults).forEach((key) => {
    if (key !== "bookmarks" && key !== "savedProfile") values[key] = state[key];
  });
  state.savedProfile = { timestamp: new Date().toISOString(), values };
  renderAll();
}

function loadProfile() {
  if (!state.savedProfile?.values) {
    profileStatusNode.textContent = "저장된 프로필이 없어 불러올 값이 없습니다.";
    return;
  }
  Object.assign(state, state.savedProfile.values);
  renderAll();
}

function resetProfile() {
  const bookmarks = JSON.parse(JSON.stringify(state.bookmarks));
  const savedProfile = state.savedProfile;
  Object.assign(state, cloneDefaults());
  state.bookmarks = bookmarks;
  state.savedProfile = savedProfile;
  renderAll();
}

function applyPreset(id) {
  const preset = presets.find((item) => item.id === id);
  if (!preset) return;
  Object.assign(state, preset.values);
  renderAll();
}

function renderAll() {
  clampState();
  reflectInputs();
  renderQuickTags();
  renderCategoryFilters();
  renderSuggestions();
  renderResults();
  renderBookmarks();
  renderProfileStatus();
  renderEligibility();
  renderSummaries();
  renderCalcToolbar();
  renderCalculatorBoard();
  renderCalculations();
  saveState();
}

function scrollToTarget(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  searchState.query = searchInput.value.trim();
  searchState.category = "전체";
  searchState.calcCategory = "추천";
  renderAll();
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

document.querySelectorAll("[data-step-field]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.stepField;
    state[key] = Number(state[key]) + Number(button.dataset.step);
    renderAll();
  });
});

document.addEventListener("click", (event) => {
  const presetButton = event.target.closest("[data-apply-preset]");
  if (presetButton) return applyPreset(presetButton.dataset.applyPreset);
  const intentButton = event.target.closest("[data-intent]");
  if (intentButton) {
    const intent = intentMap[intentButton.dataset.intent];
    if (!intent) return;
    searchState.query = intent.query;
    searchState.category = intent.category;
    searchState.calcCategory = intent.calcCategory;
    searchInput.value = searchState.query;
    renderAll();
    return scrollToTarget(intent.scroll);
  }
  const tagButton = event.target.closest("[data-search-tag]");
  if (tagButton) {
    searchState.query = tagButton.dataset.searchTag;
    searchInput.value = searchState.query;
    searchState.category = "전체";
    searchState.calcCategory = "추천";
    return renderAll();
  }
  const suggestionButton = event.target.closest("[data-suggestion]");
  if (suggestionButton) {
    searchState.query = suggestionButton.dataset.suggestion;
    searchInput.value = searchState.query;
    searchState.category = "전체";
    searchState.calcCategory = "추천";
    return renderAll();
  }
  const categoryButton = event.target.closest("[data-filter-category]");
  if (categoryButton) {
    searchState.category = categoryButton.dataset.filterCategory;
    return renderAll();
  }
  const calcCategoryButton = event.target.closest("[data-calc-category]");
  if (calcCategoryButton) {
    searchState.calcCategory = calcCategoryButton.dataset.calcCategory;
    return renderAll();
  }
  const resourceButton = event.target.closest("[data-toggle-resource]");
  if (resourceButton) return toggleBookmark("resources", resourceButton.dataset.toggleResource);
  const calculatorButton = event.target.closest("[data-toggle-calculator]");
  if (calculatorButton) return toggleBookmark("calculators", calculatorButton.dataset.toggleCalculator);
  const scrollButton = event.target.closest("[data-scroll-target]");
  if (scrollButton) return scrollToTarget(scrollButton.dataset.scrollTarget);
});

document.querySelector("#save-profile").addEventListener("click", saveProfile);
document.querySelector("#load-profile").addEventListener("click", loadProfile);
document.querySelector("#reset-profile").addEventListener("click", resetProfile);

renderPresets();
renderSupport();
renderAll();
