(function createMoneyCalc() {
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

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function formatWon(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}원`;
  }

  function monthlySalaryWon(state) {
    return Number(state.monthlySalaryMan || 0) * 10000;
  }

  function monthlyHours(state) {
    return Number(state.workDays || 0) * Number(state.dailyHours || 0) * 4.345;
  }

  function ordinaryHourly(state) {
    return monthlySalaryWon(state) / 209;
  }

  function ordinaryDaily(state) {
    return ordinaryHourly(state) * Number(state.dailyHours || 0);
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

  function salaryBrief(state) {
    const gross = monthlySalaryWon(state);
    const insurance = insuranceBreakdown(gross);
    const annualTaxable = Math.max(0, gross - Number(state.nonTaxableMan || 0) * 10000) * 12;
    const deduction = earnedIncomeDeduction(annualTaxable);
    const basic = (Number(state.householdCount || 0) + Number(state.childCount || 0)) * 1500000;
    const taxBase = Math.max(0, annualTaxable - insurance.total * 12 - deduction - basic);
    const rawAnnualIncomeTax = progressiveTax(taxBase);
    const annualIncomeTax = Math.max(0, rawAnnualIncomeTax - Math.min(rawAnnualIncomeTax * 0.55, 740000));
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

  function minimumWageCheck(state) {
    const scheduleMinimum = MIN_WAGE_2026 * monthlyHours(state);
    return {
      hourlyPass: Number(state.hourlyWage || 0) >= MIN_WAGE_2026,
      schedulePass: monthlySalaryWon(state) >= scheduleMinimum,
      scheduleMinimum
    };
  }

  function holidayPay(state) {
    const weeklyHours = Number(state.workDays || 0) * Number(state.dailyHours || 0);
    const eligible = weeklyHours >= 15 && Boolean(state.fullAttendance);
    return {
      weeklyHours,
      eligible,
      weeklyPay: Number(state.hourlyWage || 0) * Number(state.dailyHours || 0),
      monthlyPay: Number(state.hourlyWage || 0) * Number(state.dailyHours || 0) * 4.345
    };
  }

  function overtimePay(state) {
    const hourlyWage = Number(state.hourlyWage || 0);
    return {
      overtime: Number(state.overtimeHours || 0) * hourlyWage * 1.5,
      nightPremium: Number(state.nightHours || 0) * hourlyWage * 0.5,
      nightTotal: Number(state.nightHours || 0) * hourlyWage * 1.5,
      holiday:
        Number(state.holidayHoursUnder8 || 0) * hourlyWage * 1.5 +
        Number(state.holidayHoursOver8 || 0) * hourlyWage * 2
    };
  }

  function severancePay(state) {
    return {
      eligible: Number(state.serviceMonths || 0) >= 12,
      years: Number(state.serviceMonths || 0) / 12,
      estimate: monthlySalaryWon(state) * (Number(state.serviceMonths || 0) / 12),
      averageDaily: (monthlySalaryWon(state) * 3) / 91.25
    };
  }

  function unemploymentBenefit(state) {
    const lowerLimit = MIN_WAGE_2026 * Number(state.dailyHours || 0) * 0.8;
    const months = Number(state.unemploymentMonths || 0);
    let days = 120;

    if (state.olderWorker) {
      if (months >= 120) days = 270;
      else if (months >= 60) days = 240;
      else if (months >= 36) days = 210;
      else if (months >= 12) days = 180;
    } else {
      if (months >= 120) days = 240;
      else if (months >= 60) days = 210;
      else if (months >= 36) days = 180;
      else if (months >= 12) days = 150;
    }

    let daily = monthlySalaryWon(state) / 30 * 0.6;
    daily = daily < lowerLimit ? lowerLimit : Math.min(daily, UNEMPLOYMENT_DAILY_MAX);

    return {
      eligible: Boolean(state.insuranceDaysReady) && Boolean(state.involuntaryExit) && Boolean(state.jobSeekingReady),
      lowerLimit,
      days,
      daily,
      total: daily * days
    };
  }

  function parentalBenefit(state) {
    const monthlyBase = clamp(monthlySalaryWon(state) * 0.8, 700000, 1500000);
    const months = Number(state.parentalMonths || 0);
    const total = monthlyBase * months;
    return {
      eligible: Boolean(state.insuranceDaysReady) && Boolean(state.childAgeEligible),
      monthlyBase,
      total,
      during: total * 0.75,
      after: total * 0.25
    };
  }

  function reducedHoursBenefit(state) {
    const before = Math.max(1, Number(state.reducedBeforeHours || 1));
    const after = Math.min(Number(state.reducedAfterHours || before), before);
    const reduced = Math.max(0, before - after);
    const firstHours = Math.min(reduced, 5);
    const restHours = Math.max(0, reduced - 5);
    const benefit =
      Math.min(monthlySalaryWon(state), 2000000) * (firstHours / before) +
      Math.min(monthlySalaryWon(state) * 0.8, 1500000) * (restHours / before);

    return {
      eligible: Boolean(state.insuranceDaysReady) && Boolean(state.childAgeEligible),
      before,
      after,
      reduced,
      benefit
    };
  }

  function maternityBenefit(state) {
    const multiple = state.maternityChildren === "multiple";
    const totalDays = multiple ? 120 : 90;
    const insuranceDays = state.prioritySupportCompany ? totalDays : multiple ? 45 : 30;
    const cap = state.prioritySupportCompany ? (multiple ? 8400000 : 6300000) : multiple ? 3150000 : 2100000;

    return {
      eligible: Boolean(state.insuranceDaysReady),
      totalDays,
      insuranceDays,
      cap,
      benefit: Math.min(monthlySalaryWon(state) * (insuranceDays / 30), cap)
    };
  }

  function spouseBenefit(state) {
    return {
      eligible: Boolean(state.prioritySupportCompany) && Boolean(state.insuranceDaysReady),
      benefit: state.prioritySupportCompany ? Math.min(ordinaryHourly(state) * 8 * 5, SPOUSE_LEAVE_CAP) : 0
    };
  }

  function leaveAllowance(state) {
    return {
      hourly: ordinaryHourly(state),
      daily: ordinaryDaily(state),
      allowance: ordinaryDaily(state) * Number(state.unusedLeaveDays || 0)
    };
  }

  function shutdownAllowance(state) {
    const averageDaily = monthlySalaryWon(state) * 12 / 365;
    const dailyAllowance = Math.min(averageDaily * 0.7, ordinaryDaily(state));
    return {
      averageDaily,
      dailyAllowance,
      total: dailyAllowance * Number(state.shutdownDays || 0)
    };
  }

  window.MoneyCalc = {
    constants: {
      MIN_WAGE_2026,
      MIN_WAGE_MONTHLY_2026,
      SPOUSE_LEAVE_CAP,
      NON_INSURED_BIRTH_ALLOWANCE
    },
    clamp,
    formatWon,
    monthlySalaryWon,
    monthlyHours,
    ordinaryHourly,
    ordinaryDaily,
    insuranceBreakdown,
    salaryBrief,
    minimumWageCheck,
    holidayPay,
    overtimePay,
    severancePay,
    unemploymentBenefit,
    parentalBenefit,
    reducedHoursBenefit,
    maternityBenefit,
    spouseBenefit,
    leaveAllowance,
    shutdownAllowance
  };
})();
