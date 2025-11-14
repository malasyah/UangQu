import { format, startOfMonth, endOfMonth, addMonths, subMonths, setDate, isBefore, isAfter } from 'date-fns';

/**
 * Calculate the start date of the current payday period
 * @param paydayDate - Day of month when salary is received (1-31)
 * @param referenceDate - Reference date (default: today)
 * @returns Start date of current payday period
 */
export function getPaydayPeriodStart(paydayDate: number, referenceDate: Date = new Date()): Date {
  const today = referenceDate;
  const currentDay = today.getDate();
  
  // If today is before payday this month, period started last month
  if (currentDay < paydayDate) {
    const lastMonth = subMonths(today, 1);
    return setDate(lastMonth, paydayDate);
  } else {
    // Period started this month on payday
    return setDate(today, paydayDate);
  }
}

/**
 * Calculate the end date of the current payday period
 * @param paydayDate - Day of month when salary is received (1-31)
 * @param referenceDate - Reference date (default: today)
 * @returns End date of current payday period (day before next payday)
 */
export function getPaydayPeriodEnd(paydayDate: number, referenceDate: Date = new Date()): Date {
  const today = referenceDate;
  const currentDay = today.getDate();
  
  // If today is before payday this month, period ends day before payday this month
  if (currentDay < paydayDate) {
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), paydayDate);
    const dayBefore = new Date(thisMonth);
    dayBefore.setDate(dayBefore.getDate() - 1);
    return dayBefore;
  } else {
    // Period ends day before next month's payday
    const nextMonth = addMonths(today, 1);
    const nextPayday = setDate(nextMonth, paydayDate);
    const dayBefore = new Date(nextPayday);
    dayBefore.setDate(dayBefore.getDate() - 1);
    return dayBefore;
  }
}

/**
 * Get previous payday period
 * @param paydayDate - Day of month when salary is received (1-31)
 * @param referenceDate - Reference date (default: today)
 * @returns Object with start and end dates of previous period
 */
export function getPreviousPaydayPeriod(paydayDate: number, referenceDate: Date = new Date()) {
  const currentStart = getPaydayPeriodStart(paydayDate, referenceDate);
  const previousStart = subMonths(currentStart, 1);
  const previousEnd = new Date(currentStart);
  previousEnd.setDate(previousEnd.getDate() - 1);
  
  return {
    start: previousStart,
    end: previousEnd,
  };
}

/**
 * Get all payday periods for the last N periods
 * @param paydayDate - Day of month when salary is received (1-31)
 * @param periods - Number of periods to get (default: 6)
 * @returns Array of period objects with start, end, and label
 */
export function getPaydayPeriods(paydayDate: number, periods: number = 6) {
  const periodsList = [];
  const today = new Date();
  
  for (let i = 0; i < periods; i++) {
    const referenceDate = subMonths(today, i);
    const start = getPaydayPeriodStart(paydayDate, referenceDate);
    const end = getPaydayPeriodEnd(paydayDate, referenceDate);
    
    periodsList.push({
      start,
      end,
      label: format(start, 'MMM dd') + ' - ' + format(end, 'MMM dd, yyyy'),
      periodNumber: i,
    });
  }
  
  return periodsList.reverse(); // Oldest first
}

/**
 * Check if a date is within a payday period
 * @param date - Date to check
 * @param paydayDate - Day of month when salary is received (1-31)
 * @param periodStart - Start of the period
 * @param periodEnd - End of the period
 */
export function isDateInPaydayPeriod(
  date: Date,
  paydayDate: number,
  periodStart: Date,
  periodEnd: Date
): boolean {
  const dateToCheck = new Date(date);
  return !isBefore(dateToCheck, periodStart) && !isAfter(dateToCheck, periodEnd);
}

/**
 * Format payday period for display
 * @param paydayDate - Day of month when salary is received (1-31)
 * @param referenceDate - Reference date (default: today)
 */
export function formatPaydayPeriod(paydayDate: number, referenceDate: Date = new Date()): string {
  const start = getPaydayPeriodStart(paydayDate, referenceDate);
  const end = getPaydayPeriodEnd(paydayDate, referenceDate);
  return `${format(start, 'MMM dd')} - ${format(end, 'MMM dd, yyyy')}`;
}

