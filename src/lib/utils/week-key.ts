export function getCurrentWeekKey(date = new Date()) {
  const target = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNr = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);

  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const firstDayNr = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNr + 3);

  const weekNo =
    1 +
    Math.round(
      ((target.getTime() - firstThursday.getTime()) / 86400000 - 3) / 7
    );

  return `${target.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}
