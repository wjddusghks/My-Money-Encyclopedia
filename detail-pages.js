const DETAIL_STORAGE_KEY = "my-money-home-state-v2";

const detailDefaults = {
  monthlySalaryMan: 320,
  nonTaxableMan: 20,
  householdCount: 1,
  childCount: 0,
  workDays: 5,
  dailyHours: 8,
  hourlyWage: 11000,
  fullAttendance: true,
  overtimeHours: 10,
  nightHours: 0,
  holidayHoursUnder8: 0,
  holidayHoursOver8: 0,
  serviceMonths: 24,
  unusedLeaveDays: 5,
  shutdownDays: 0,
  unemploymentMonths: 24,
  olderWorker: false,
  insuranceDaysReady: true,
  involuntaryExit: true,
  jobSeekingReady: true,
  parentalMonths: 12,
  childAgeEligible: true,
  reducedBeforeHours: 8,
  reducedAfterHours: 6,
  maternityChildren: "single",
  prioritySupportCompany: true,
  savedProfile: null
};

const pageConfigs = {
  salary: {
    kicker: "Salary",
    title: "월급 실수령액 계산기",
    summary: "세전 월급과 비과세 수당을 넣고 실수령액, 4대보험, 간편 세금 추정치를 한 번에 확인합니다.",
    toolbar: (state) => {
      const result = window.MoneyCalc.salaryBrief(state);
      return `월 실수령액 ${window.MoneyCalc.formatWon(result.takeHome)} · 4대보험 ${window.MoneyCalc.formatWon(result.insurance.total)}`;
    },
    steps: [
      "세전 월급과 비과세 수당을 먼저 입력합니다.",
      "부양가족과 자녀 수는 간편 공제 방향에 반영됩니다.",
      "근무일과 근무시간은 최저임금 기준 확인에 사용됩니다."
    ],
    officialLinks: [
      { href: "https://www.4insure.or.kr/", label: "4대사회보험 정보연계센터" },
      { href: "https://www.nhis.or.kr/", label: "국민건강보험" },
      { href: "https://www.nps.or.kr/", label: "국민연금" }
    ],
    relatedLinks: [
      { href: "index.html", label: "홈으로" },
      { href: "overtime.html", label: "수당 계산 보기" }
    ],
    fields: [
      { key: "monthlySalaryMan", label: "세전 월급", unit: "만원", kind: "number", step: 10, presets: [250, 320, 400] },
      { key: "nonTaxableMan", label: "비과세 수당", unit: "만원", kind: "number", step: 10, presets: [0, 20, 30] },
      {
        key: "householdCount",
        label: "부양가족 수",
        unit: "본인 포함",
        kind: "choice",
        valueType: "number",
        options: [
          { label: "1명", value: 1 },
          { label: "2명", value: 2 },
          { label: "3명", value: 3 },
          { label: "4명+", value: 4 }
        ]
      },
      {
        key: "childCount",
        label: "자녀 수",
        unit: "가족 급여 반영",
        kind: "choice",
        valueType: "number",
        options: [
          { label: "0명", value: 0 },
          { label: "1명", value: 1 },
          { label: "2명", value: 2 },
          { label: "3명+", value: 3 }
        ]
      },
      {
        key: "workDays",
        label: "주 근무일",
        unit: "일",
        kind: "choice",
        valueType: "number",
        options: [
          { label: "주 3일", value: 3 },
          { label: "주 4일", value: 4 },
          { label: "주 5일", value: 5 },
          { label: "주 6일", value: 6 }
        ]
      },
      {
        key: "dailyHours",
        label: "하루 근무시간",
        unit: "시간",
        kind: "choice",
        valueType: "number",
        options: [
          { label: "4시간", value: 4 },
          { label: "6시간", value: 6 },
          { label: "8시간", value: 8 },
          { label: "10시간", value: 10 }
        ]
      }
    ],
    buildResults: (state) => {
      const salary = window.MoneyCalc.salaryBrief(state);
      const monthlyHours = window.MoneyCalc.monthlyHours(state);
      const scheduleMinimum = window.MoneyCalc.constants.MIN_WAGE_2026 * monthlyHours;
      const schedulePass = window.MoneyCalc.monthlySalaryWon(state) >= scheduleMinimum;

      return [
        {
          title: "월급 브리핑",
          boxes: [
            { label: "월 실수령 추정", value: window.MoneyCalc.formatWon(salary.takeHome), description: "간편 세금 추정치 포함", tone: "good" },
            { label: "월 4대보험", value: window.MoneyCalc.formatWon(salary.insurance.total), description: "근로자 부담분 기준" },
            { label: "세전 월급", value: window.MoneyCalc.formatWon(salary.gross), description: "현재 입력 기준" },
            { label: "연봉 환산", value: window.MoneyCalc.formatWon(salary.annualGross), description: "월급 x 12개월" }
          ]
        },
        {
          title: "세금과 보험",
          boxes: [
            { label: "국민연금", value: window.MoneyCalc.formatWon(salary.insurance.pension), description: "월 근로자 부담" },
            { label: "건강보험+장기요양", value: window.MoneyCalc.formatWon(salary.insurance.health + salary.insurance.care), description: "월 근로자 부담" },
            { label: "고용보험", value: window.MoneyCalc.formatWon(salary.insurance.employment), description: "월 근로자 부담" },
            { label: "소득세+지방세", value: window.MoneyCalc.formatWon(salary.incomeTax + salary.localTax), description: "간편 추정치" }
          ]
        },
        {
          title: "근무 기준 체크",
          note: "실제 최저임금 위반 여부는 계약 형태와 수당 구조에 따라 달라질 수 있습니다.",
          boxes: [
            { label: "시급 환산", value: window.MoneyCalc.formatWon(window.MoneyCalc.ordinaryHourly(state)), description: "월급/209시간 기준 환산" },
            { label: "월 최소 기준", value: window.MoneyCalc.formatWon(scheduleMinimum), description: "현재 근무시간 기준" },
            { label: "최저임금 점검", value: schedulePass ? "기준 이상" : "기준 미만 가능성", description: "월급 기준 빠른 판단", tone: schedulePass ? "good" : "warn" },
            { label: "월 근로시간", value: `${monthlyHours.toFixed(1)}시간`, description: "주 근무일 x 하루 근무시간" }
          ]
        }
      ];
    }
  },
  unemployment: {
    kicker: "Benefits",
    title: "실업급여 계산기",
    summary: "가입 기간과 이직 사유를 기준으로 자격 가능성과 예상 급여 범위를 빠르게 확인합니다.",
    toolbar: (state) => {
      const result = window.MoneyCalc.unemploymentBenefit(state);
      return `${result.eligible ? "수급 가능성 높음" : "추가 확인 필요"} · 총액 ${window.MoneyCalc.formatWon(result.total)}`;
    },
    steps: [
      "세전 월급과 주 근무시간은 일급 추정에 사용됩니다.",
      "가입 개월과 이직 사유는 수급 가능성 판단의 핵심입니다.",
      "최종 판단은 고용24와 고용보험 심사 기준을 다시 확인해야 합니다."
    ],
    officialLinks: [
      { href: "https://www.work24.go.kr/", label: "고용24" },
      { href: "https://edrm.ei.go.kr/", label: "고용보험" },
      { href: "https://1350.moel.go.kr/", label: "고용노동부 상담센터" }
    ],
    relatedLinks: [
      { href: "index.html", label: "홈으로" },
      { href: "severance.html", label: "퇴직 정산 보기" }
    ],
    fields: [
      { key: "monthlySalaryMan", label: "세전 월급", unit: "만원", kind: "number", step: 10, presets: [250, 320, 400] },
      {
        key: "dailyHours",
        label: "하루 근무시간",
        unit: "시간",
        kind: "choice",
        valueType: "number",
        options: [
          { label: "4시간", value: 4 },
          { label: "6시간", value: 6 },
          { label: "8시간", value: 8 }
        ]
      },
      { key: "unemploymentMonths", label: "가입 개월 수", unit: "개월", kind: "number", step: 1, presets: [12, 24, 36, 60, 120] },
      {
        key: "olderWorker",
        label: "연령 구간",
        unit: "지급일수 반영",
        kind: "choice",
        valueType: "boolean",
        options: [
          { label: "50세 미만", value: false },
          { label: "50세 이상", value: true }
        ]
      },
      {
        key: "insuranceDaysReady",
        label: "피보험 요건",
        unit: "기본 충족 여부",
        kind: "choice",
        valueType: "boolean",
        options: [
          { label: "충족", value: true },
          { label: "불명", value: false }
        ]
      },
      {
        key: "involuntaryExit",
        label: "이직 사유",
        unit: "비자발적 여부",
        kind: "choice",
        valueType: "boolean",
        options: [
          { label: "비자발적", value: true },
          { label: "자발적/불명", value: false }
        ]
      },
      {
        key: "jobSeekingReady",
        label: "재취업 활동 의사",
        unit: "구직활동 여부",
        kind: "choice",
        valueType: "boolean",
        options: [
          { label: "있음", value: true },
          { label: "없음", value: false }
        ]
      }
    ],
    buildResults: (state) => {
      const result = window.MoneyCalc.unemploymentBenefit(state);
      return [
        {
          title: "수급 가능성",
          note: "실제 자격은 이직 사유, 피보험 단위기간, 구직활동 여부를 종합 심사합니다.",
          boxes: [
            { label: "현재 판단", value: result.eligible ? "수급 가능성 높음" : "추가 확인 필요", description: "간편 조건 기준", tone: result.eligible ? "good" : "warn" },
            { label: "일 지급액", value: window.MoneyCalc.formatWon(result.daily), description: "상한·하한 반영" },
            { label: "예상 총액", value: window.MoneyCalc.formatWon(result.total), description: "지급일수 기준 추정" },
            { label: "예상 지급일수", value: `${result.days}일`, description: "연령과 가입기간 반영" }
          ]
        },
        {
          title: "판단 근거",
          boxes: [
            { label: "하한 기준", value: window.MoneyCalc.formatWon(result.lowerLimit), description: "최저임금 기반" },
            { label: "가입 개월 수", value: `${Number(state.unemploymentMonths || 0)}개월`, description: "현재 입력" },
            { label: "비자발적 이직", value: state.involuntaryExit ? "예" : "아니오", description: "핵심 자격 조건" },
            { label: "구직활동 의사", value: state.jobSeekingReady ? "예" : "아니오", description: "수급 지속 조건" }
          ]
        }
      ];
    }
  },
  severance: {
    kicker: "Severance",
    title: "퇴직 정산 계산기",
    summary: "퇴직금, 연차수당, 휴업수당을 퇴사 직전 정산 흐름에 맞춰 빠르게 확인합니다.",
    toolbar: (state) => {
      const result = window.MoneyCalc.severancePay(state);
      return `퇴직금 ${window.MoneyCalc.formatWon(result.estimate)} · 연차수당 ${window.MoneyCalc.formatWon(window.MoneyCalc.leaveAllowance(state).allowance)}`;
    },
    steps: [
      "세전 월급과 재직 개월 수를 먼저 입력합니다.",
      "남은 연차일수와 휴업일수를 넣으면 추가 정산 항목까지 같이 볼 수 있습니다.",
      "평균임금 산정은 실제 3개월 임금과 수당 구조에 따라 달라질 수 있습니다."
    ],
    officialLinks: [
      { href: "https://www.moel.go.kr/", label: "고용노동부" },
      { href: "https://www.work24.go.kr/", label: "고용24" }
    ],
    relatedLinks: [
      { href: "index.html", label: "홈으로" },
      { href: "unemployment.html", label: "실업급여 보기" }
    ],
    fields: [
      { key: "monthlySalaryMan", label: "세전 월급", unit: "만원", kind: "number", step: 10, presets: [250, 320, 400] },
      {
        key: "dailyHours",
        label: "하루 근무시간",
        unit: "시간",
        kind: "choice",
        valueType: "number",
        options: [
          { label: "4시간", value: 4 },
          { label: "6시간", value: 6 },
          { label: "8시간", value: 8 }
        ]
      },
      { key: "serviceMonths", label: "재직 개월 수", unit: "개월", kind: "number", step: 1, presets: [12, 24, 36, 60] },
      { key: "unusedLeaveDays", label: "남은 연차일수", unit: "일", kind: "number", step: 1, presets: [0, 3, 5, 10] },
      { key: "shutdownDays", label: "휴업일수", unit: "일", kind: "number", step: 1, presets: [0, 3, 5, 10] }
    ],
    buildResults: (state) => {
      const severance = window.MoneyCalc.severancePay(state);
      const leave = window.MoneyCalc.leaveAllowance(state);
      const shutdown = window.MoneyCalc.shutdownAllowance(state);

      return [
        {
          title: "퇴직금 요약",
          boxes: [
            { label: "수급 요건", value: severance.eligible ? "가능성 높음" : "1년 미만", description: "12개월 이상 근무 기준", tone: severance.eligible ? "good" : "warn" },
            { label: "예상 퇴직금", value: window.MoneyCalc.formatWon(severance.estimate), description: "간편 월급 기준" },
            { label: "재직 연수 환산", value: `${severance.years.toFixed(1)}년`, description: "개월 수 기준" },
            { label: "평균 일급", value: window.MoneyCalc.formatWon(severance.averageDaily), description: "간편 추정" }
          ]
        },
        {
          title: "추가 정산 항목",
          note: "실제 평균임금 산정은 최근 3개월 임금, 상여, 수당 구조에 따라 달라질 수 있습니다.",
          boxes: [
            { label: "연차수당", value: window.MoneyCalc.formatWon(leave.allowance), description: "남은 연차일수 기준" },
            { label: "하루 통상임금", value: window.MoneyCalc.formatWon(leave.daily), description: "연차수당 계산 기준" },
            { label: "휴업수당 총액", value: window.MoneyCalc.formatWon(shutdown.total), description: "휴업일수 기준" },
            { label: "휴업수당 일액", value: window.MoneyCalc.formatWon(shutdown.dailyAllowance), description: "간편 평균임금 기준" }
          ]
        }
      ];
    }
  },
  family: {
    kicker: "Family",
    title: "육아·출산 급여 계산기",
    summary: "육아휴직, 근로시간 단축, 출산휴가, 배우자 출산휴가 급여를 한 화면에서 빠르게 정리합니다.",
    toolbar: (state) => {
      const parental = window.MoneyCalc.parentalBenefit(state);
      return `육아휴직 총액 ${window.MoneyCalc.formatWon(parental.total)} · 출산휴가 ${window.MoneyCalc.formatWon(window.MoneyCalc.maternityBenefit(state).benefit)}`;
    },
    steps: [
      "월급과 육아휴직 개월 수를 먼저 입력합니다.",
      "고용보험 요건과 자녀 연령 조건은 수급 가능성 판단에 반영됩니다.",
      "근로시간 단축과 배우자 출산휴가는 보조 계산으로 함께 확인합니다."
    ],
    officialLinks: [
      { href: "https://edrm.ei.go.kr/", label: "고용보험" },
      { href: "https://www.work24.go.kr/", label: "고용24" },
      { href: "https://www.bokjiro.go.kr/ssis-tbu/", label: "복지로" }
    ],
    relatedLinks: [
      { href: "index.html", label: "홈으로" },
      { href: "salary.html", label: "월급 계산 보기" }
    ],
    fields: [
      { key: "monthlySalaryMan", label: "세전 월급", unit: "만원", kind: "number", step: 10, presets: [250, 320, 400] },
      { key: "parentalMonths", label: "육아휴직 개월 수", unit: "개월", kind: "number", step: 1, presets: [3, 6, 12] },
      {
        key: "insuranceDaysReady",
        label: "고용보험 요건",
        unit: "기본 충족 여부",
        kind: "choice",
        valueType: "boolean",
        options: [
          { label: "충족", value: true },
          { label: "불명", value: false }
        ]
      },
      {
        key: "childAgeEligible",
        label: "자녀 연령 조건",
        unit: "대상 여부",
        kind: "choice",
        valueType: "boolean",
        options: [
          { label: "대상", value: true },
          { label: "불명", value: false }
        ]
      },
      {
        key: "reducedBeforeHours",
        label: "단축 전 근무시간",
        unit: "시간",
        kind: "choice",
        valueType: "number",
        options: [
          { label: "6시간", value: 6 },
          { label: "8시간", value: 8 },
          { label: "10시간", value: 10 }
        ]
      },
      {
        key: "reducedAfterHours",
        label: "단축 후 근무시간",
        unit: "시간",
        kind: "choice",
        valueType: "number",
        options: [
          { label: "4시간", value: 4 },
          { label: "5시간", value: 5 },
          { label: "6시간", value: 6 },
          { label: "8시간", value: 8 }
        ]
      },
      {
        key: "maternityChildren",
        label: "출산 유형",
        unit: "태아 수 기준",
        kind: "choice",
        valueType: "string",
        options: [
          { label: "단태아", value: "single" },
          { label: "다태아", value: "multiple" }
        ]
      },
      {
        key: "prioritySupportCompany",
        label: "우선지원 대상기업",
        unit: "사업장 구분",
        kind: "choice",
        valueType: "boolean",
        options: [
          { label: "예", value: true },
          { label: "아니오", value: false }
        ]
      }
    ],
    buildResults: (state) => {
      const parental = window.MoneyCalc.parentalBenefit(state);
      const reduced = window.MoneyCalc.reducedHoursBenefit(state);
      const maternity = window.MoneyCalc.maternityBenefit(state);
      const spouse = window.MoneyCalc.spouseBenefit(state);

      return [
        {
          title: "육아휴직 급여",
          boxes: [
            { label: "수급 가능성", value: parental.eligible ? "가능성 높음" : "추가 확인 필요", description: "고용보험·자녀 연령 기준", tone: parental.eligible ? "good" : "warn" },
            { label: "월 기준금액", value: window.MoneyCalc.formatWon(parental.monthlyBase), description: "상·하한 반영" },
            { label: "총 예상액", value: window.MoneyCalc.formatWon(parental.total), description: "입력 개월 수 기준" },
            { label: "사후 지급분", value: window.MoneyCalc.formatWon(parental.after), description: "총액의 25%" }
          ]
        },
        {
          title: "근로시간 단축",
          boxes: [
            { label: "단축 시간", value: `${reduced.reduced}시간`, description: "하루 기준" },
            { label: "월 지원 추정", value: window.MoneyCalc.formatWon(reduced.benefit), description: "간편 기준" },
            { label: "단축 전", value: `${reduced.before}시간`, description: "하루 근무시간" },
            { label: "단축 후", value: `${reduced.after}시간`, description: "하루 근무시간" }
          ]
        },
        {
          title: "출산휴가와 배우자 출산휴가",
          note: "실제 지급 한도와 사업장 구분은 고용보험 공고를 다시 확인하세요.",
          boxes: [
            { label: "출산휴가 급여", value: window.MoneyCalc.formatWon(maternity.benefit), description: `${maternity.totalDays}일 기준` },
            { label: "배우자 출산휴가", value: window.MoneyCalc.formatWon(spouse.benefit), description: "우선지원 대상 기준" },
            { label: "보험 지원일수", value: `${maternity.insuranceDays}일`, description: "사업장 구분 반영" },
            { label: "상한액", value: window.MoneyCalc.formatWon(maternity.cap), description: "간편 반영" }
          ]
        }
      ];
    }
  },
  overtime: {
    kicker: "Allowance",
    title: "수당 계산기",
    summary: "시급, 주휴수당, 연장·야간·휴일근로 수당을 분리해서 빠르게 계산합니다.",
    toolbar: (state) => {
      const holiday = window.MoneyCalc.holidayPay(state);
      const overtime = window.MoneyCalc.overtimePay(state);
      return `주휴수당 ${window.MoneyCalc.formatWon(holiday.monthlyPay)} · 추가수당 ${window.MoneyCalc.formatWon(overtime.overtime + overtime.nightPremium + overtime.holiday)}`;
    },
    steps: [
      "시급과 주 근무일, 하루 근무시간을 먼저 넣습니다.",
      "개근 여부는 주휴수당 판단에 쓰입니다.",
      "연장·야간·휴일근로 시간은 추가 수당 계산에만 반영됩니다."
    ],
    officialLinks: [
      { href: "https://www.moel.go.kr/", label: "고용노동부" },
      { href: "https://www.work24.go.kr/", label: "고용24" }
    ],
    relatedLinks: [
      { href: "index.html", label: "홈으로" },
      { href: "salary.html", label: "월급 계산 보기" }
    ],
    fields: [
      { key: "hourlyWage", label: "시급", unit: "원", kind: "number", step: 100, presets: [10320, 11000, 12000, 15000] },
      {
        key: "workDays",
        label: "주 근무일",
        unit: "일",
        kind: "choice",
        valueType: "number",
        options: [
          { label: "주 3일", value: 3 },
          { label: "주 4일", value: 4 },
          { label: "주 5일", value: 5 },
          { label: "주 6일", value: 6 }
        ]
      },
      {
        key: "dailyHours",
        label: "하루 근무시간",
        unit: "시간",
        kind: "choice",
        valueType: "number",
        options: [
          { label: "4시간", value: 4 },
          { label: "6시간", value: 6 },
          { label: "8시간", value: 8 },
          { label: "10시간", value: 10 }
        ]
      },
      {
        key: "fullAttendance",
        label: "개근 여부",
        unit: "주휴수당 판단",
        kind: "choice",
        valueType: "boolean",
        options: [
          { label: "개근", value: true },
          { label: "미개근", value: false }
        ]
      },
      { key: "overtimeHours", label: "연장근로 시간", unit: "시간", kind: "number", step: 1, presets: [0, 4, 8, 12] },
      { key: "nightHours", label: "야간근로 시간", unit: "시간", kind: "number", step: 1, presets: [0, 2, 4, 8] },
      { key: "holidayHoursUnder8", label: "휴일근로 8시간 이내", unit: "시간", kind: "number", step: 1, presets: [0, 4, 8] },
      { key: "holidayHoursOver8", label: "휴일근로 8시간 초과", unit: "시간", kind: "number", step: 1, presets: [0, 2, 4, 8] }
    ],
    buildResults: (state) => {
      const holiday = window.MoneyCalc.holidayPay(state);
      const overtime = window.MoneyCalc.overtimePay(state);
      const extraTotal = overtime.overtime + overtime.nightPremium + overtime.holiday;

      return [
        {
          title: "주휴수당",
          note: "주휴수당은 주 15시간 이상, 소정근로일 개근 등 요건을 함께 확인해야 합니다.",
          boxes: [
            { label: "수급 가능성", value: holiday.eligible ? "가능성 높음" : "추가 확인 필요", description: "주 15시간·개근 기준", tone: holiday.eligible ? "good" : "warn" },
            { label: "주 주휴수당", value: window.MoneyCalc.formatWon(holiday.weeklyPay), description: "하루 통상 시급 기준" },
            { label: "월 주휴수당", value: window.MoneyCalc.formatWon(holiday.monthlyPay), description: "4.345주 환산" },
            { label: "주 근로시간", value: `${holiday.weeklyHours}시간`, description: "주 근무일 x 하루 근무시간" }
          ]
        },
        {
          title: "추가 수당",
          boxes: [
            { label: "연장근로 수당", value: window.MoneyCalc.formatWon(overtime.overtime), description: "1.5배 기준" },
            { label: "야간 가산분", value: window.MoneyCalc.formatWon(overtime.nightPremium), description: "가산분만 표시" },
            { label: "휴일근로 수당", value: window.MoneyCalc.formatWon(overtime.holiday), description: "8시간 이내 1.5배 / 초과 2배" },
            { label: "추가 수당 합계", value: window.MoneyCalc.formatWon(extraTotal), description: "주휴수당 제외" }
          ]
        }
      ];
    }
  }
};

const body = document.body;
const pageId = body.dataset.page;
const config = pageConfigs[pageId];

if (!config) {
  throw new Error("Unknown detail page.");
}

const state = loadState();

const nodes = {
  kicker: document.querySelector("#page-kicker"),
  title: document.querySelector("#page-title"),
  summary: document.querySelector("#page-summary"),
  relatedLinks: document.querySelector("#hero-links"),
  steps: document.querySelector("#page-steps"),
  officialLinks: document.querySelector("#official-links"),
  toolbar: document.querySelector("#toolbar-summary"),
  fields: document.querySelector("#fields"),
  results: document.querySelector("#results")
};

function cloneDefaults() {
  return JSON.parse(JSON.stringify(detailDefaults));
}

function loadState() {
  try {
    const raw = localStorage.getItem(DETAIL_STORAGE_KEY);
    return raw ? { ...cloneDefaults(), ...JSON.parse(raw) } : cloneDefaults();
  } catch {
    return cloneDefaults();
  }
}

function saveState() {
  localStorage.setItem(DETAIL_STORAGE_KEY, JSON.stringify(state));
}

function parseByType(type, raw) {
  if (type === "number") return Number(raw);
  if (type === "boolean") return raw === "true";
  return raw;
}

function fieldMarkup(field) {
  if (field.kind === "number") {
    return `
      <article class="detail-field">
        <div class="detail-field__meta">
          <h3>${field.label}</h3>
          <span>${field.unit || ""}</span>
        </div>
        <div class="detail-field__control">
          <input
            type="number"
            min="0"
            step="${field.step || 1}"
            inputmode="numeric"
            data-field-input="${field.key}"
          >
          ${field.presets?.length ? `
            <div class="choice-grid">
              ${field.presets.map((preset) => `
                <button type="button" class="choice-chip" data-field-choice="${field.key}" data-value-type="number" data-value="${preset}">
                  ${preset}${field.unit === "만원" ? "" : field.unit === "원" ? "원" : ""}
                </button>
              `).join("")}
            </div>
          ` : ""}
        </div>
      </article>
    `;
  }

  return `
    <article class="detail-field">
      <div class="detail-field__meta">
        <h3>${field.label}</h3>
        <span>${field.unit || ""}</span>
      </div>
      <div class="detail-field__control">
        <div class="choice-grid">
          ${field.options.map((option) => `
            <button
              type="button"
              class="choice-chip"
              data-field-choice="${field.key}"
              data-value-type="${field.valueType || "string"}"
              data-value="${String(option.value)}"
            >
              ${option.label}
            </button>
          `).join("")}
        </div>
      </div>
    </article>
  `;
}

function resultBoxClass(tone) {
  if (tone === "good") return "result-box result-box--good";
  if (tone === "warn") return "result-box result-box--warn";
  return "result-box";
}

function renderPageFrame() {
  nodes.kicker.textContent = config.kicker;
  nodes.title.textContent = config.title;
  nodes.summary.textContent = config.summary;

  nodes.relatedLinks.innerHTML = config.relatedLinks.map((link) => `
    <a class="detail-link" href="${link.href}">${link.label}</a>
  `).join("");

  nodes.steps.innerHTML = config.steps.map((step) => `<li>${step}</li>`).join("");

  nodes.officialLinks.innerHTML = config.officialLinks.map((link) => `
    <a class="detail-link" href="${link.href}" target="_blank" rel="noreferrer">${link.label}</a>
  `).join("");

  nodes.fields.innerHTML = config.fields.map(fieldMarkup).join("");
}

function reflectFieldInputs() {
  document.querySelectorAll("[data-field-input]").forEach((input) => {
    input.value = state[input.dataset.fieldInput];
  });

  document.querySelectorAll("[data-field-choice]").forEach((button) => {
    const key = button.dataset.fieldChoice;
    const value = parseByType(button.dataset.valueType, button.dataset.value);
    button.classList.toggle("is-active", state[key] === value);
  });
}

function renderResults() {
  nodes.toolbar.textContent = config.toolbar(state);
  const groups = config.buildResults(state);

  nodes.results.innerHTML = groups.map((group) => `
    <article class="result-group">
      <h3>${group.title}</h3>
      <div class="detail-result-grid">
        ${group.boxes.map((box) => `
          <div class="${resultBoxClass(box.tone)}">
            <span>${box.label}</span>
            <strong>${box.value}</strong>
            <p>${box.description}</p>
          </div>
        `).join("")}
      </div>
      ${group.note ? `<p class="detail-result-note">${group.note}</p>` : ""}
    </article>
  `).join("");
}

function renderAll() {
  reflectFieldInputs();
  renderResults();
  saveState();
}

renderPageFrame();
renderAll();

document.addEventListener("input", (event) => {
  const input = event.target.closest("[data-field-input]");
  if (!input) return;

  const field = config.fields.find((item) => item.key === input.dataset.fieldInput);
  state[field.key] = parseByType("number", input.value || 0);
  renderAll();
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-field-choice]");
  if (!button) return;

  const key = button.dataset.fieldChoice;
  state[key] = parseByType(button.dataset.valueType, button.dataset.value);
  renderAll();
});
