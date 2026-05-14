export function perthDateString(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Perth",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function startOfDate(dateString: string) {
  return new Date(`${dateString}T00:00:00.000`);
}

export function endOfDate(dateString: string) {
  return new Date(`${dateString}T23:59:59.999`);
}

export function isAfter8PMPerth() {
  const hour = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Perth",
    hour: "2-digit",
    hour12: false,
  }).format(new Date());

  return Number(hour) >= 20;
}
