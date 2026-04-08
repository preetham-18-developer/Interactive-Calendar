export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

export const isSameDay = (date1: Date | null, date2: Date | null) => {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isToday = (date: Date) => {
  return isSameDay(date, new Date());
};

export const formatMonthYear = (date: Date) => {
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

export const getPreviousMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
};

export const getNextMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
};

export const isDateBetween = (date: Date, start: Date, end: Date) => {
  const d = date.getTime();
  return d > start.getTime() && d < end.getTime();
};
