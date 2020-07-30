export type RuleFn = (date: Date) => string;
export type Rules = Record<string, RuleFn>;

const regex = /dd|MM|y{1,4}|hh|mm|ss|SSS|O|P/g;

const rules: Rules = {
  dd: (date: Date) => padWithZeros(date.getDate()),
  MM: (date: Date) => padWithZeros(date.getMonth() + 1),
  y: (date: Date) => rules["yy"](date),
  yy: (date: Date) => padWithZeros(rules["yyyy"](date).substring(2, 4)),
  yyy: (date: Date) => rules["yy"](date),
  yyyy: (date: Date) => padWithZeros(date.getFullYear()),
  hh: (date: Date) => padWithZeros(date.getHours()),
  mm: (date: Date) => padWithZeros(date.getMinutes()),
  ss: (date: Date) => padWithZeros(date.getSeconds()),
  SSS: (date: Date) => padWithZeros(date.getMilliseconds(), 3),
  O: (date: Date) => getGMTOffset(date.getTimezoneOffset()),
  P: (date: Date) => getGMTOffset(date.getTimezoneOffset(), true),
};

const formats: Record<string, string> = {
  default: "yyyy-MM-dd hh:mm:ss.SSS",
  iso8601: "yyyy-MM-ddThh:mm:ss.SSS",
  iso8601_with_tz_offset: "yyyy-MM-ddThh:mm:ss.SSSO",
  date: "yyyy-MM-dd",
  time: "hh:mm:ss",
  datetime: "yyyy-MM-dd hh:mm:ss",
  absolutetime: "hh:mm:ss.SSS",
};

/**
 * Register new format or redefine standard formats
 * @param format One or more formats
 *
 * example :
 *
 * ```typescript
 * // new format
 * registerFormat({ myformat: "yyyy/MM/dd hh-mm-ss" });
 *
 * // redefine format
 * registerFormat({ default: "hh:mm:ss dd.MM.yyyy", time: "hh:mm" });
 * ```
 */
export function registerFormat(format: Record<string, string>) {
  for (const key in format) {
    if (Object.prototype.hasOwnProperty.call(format, key)) {
      formats[key.toLowerCase()] = format[key];
    }
  }
}

export function dateToString(
  format: string | Date,
  date?: Date,
): string {
  if (typeof format !== "string") {
    date = format;
    format = formats["default"];
  } else {
    format = getFormat(format);
  }

  if (!date) {
    date = new Date();
  }

  return format.replace(regex, (match: string): string => {
    if (rules[match]) {
      return rules[match](date!);
    }

    return match;
  });
}

export function utcDate(date?: Date): Date {
  if (!date) {
    date = new Date();
  }

  const offset = date.getTimezoneOffset();

  if (offset === 0) {
    return date;
  }

  return new Date(date.getTime() + offset * 6e4);
}

export function getGMTOffset(
  timezoneOffset: number,
  delimiter?: boolean,
): string {
  const os = Math.abs(timezoneOffset);
  const h = padWithZeros(Math.floor(os / 60));
  const m = padWithZeros(os % 60);

  return (timezoneOffset <= 0 ? "+" : "-") + (delimiter ? `${h}:${m}` : h + m);
}

function getFormat(format: string): string {
  if (!format) {
    return formats["default"];
  }

  return formats[format.toLowerCase()] || format;
}

function padWithZeros(value: number | string, width?: number) {
  return String(value).padStart(width ?? 2, "0");
}
