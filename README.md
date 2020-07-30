# date-format-deno

Simple helper for `Deno` to convert `Date` format to string. Possibility to use predefined or custom formats.

## Usage

### dateToString

Format Date to string

```ts
import { dateToString } from 'https://raw.githubusercontent.com/Uzumachi02/date-format-deno/master/mod.ts'

// use current date
dateToString("dd-MM-yyyy"); // return : "06-07-2020"
dateToString("hh:mm:ss");   // return : "12-11-10"
...

const myDate = new Date("2020-12-11T10:09:54.321");
dateToString("yyyy-MM-dd hh:mm:ss", myDate); // return : "2020-12-11 10:09:54"
dateToString("hh:mm:ss.SSS", myDate);        // return : "10:09:54.321"
...

// all formats
dateToString("dd-MM-y-yy-yyy-yyyy hh:mm:ss:SSS O P", new Date("2020-12-11T10:09:54.321"));
// return : "11-12-20-20-20-2020 10:09:54:321 +0300 +03:00"
...

// use predefined format
const date = new Date("2020-12-11T10:09:54.321");
dateToString("ISO8601", date);                // return : "2020-12-11T10:09:54.321"
dateToString("ISO8601_WITH_TZ_OFFSET", date); // return : "2020-12-11T10:09:54.321+0300"
dateToString("DATE", date);                   // return : "2020-12-11"
dateToString("TIME", date);                   // return : "10:09:54"
dateToString("DATETIME", date);               // return : "2020-12-11 10:09:54"
dateToString("ABSOLUTETIME", date);           // return : "10:09:54.321"

// use default format
dateToString(date);                           // return : "2020-12-11 10:09:54.321"
...
```

### registerFormat

Register new format or redefine standard formats

```ts
import {
  dateToString,
  registerFormat,
} from 'https://raw.githubusercontent.com/Uzumachi02/date-format-deno/master/mod.ts';

// new format
registerFormat({ myFormat: "yyyy/MM/dd hh-mm-ss" });
...

dateToString("MYFORMAT"); // return : "2020/07/06 05-04-03"
...

// redefine format
registerFormat({ default: "hh:mm:ss dd.MM.yyyy", time: "hh:mm" });
...

const date = new Date("2020-12-11T10:09:54.321");
dateToString(date);         // return : "10:09:54 11.12.2020"
dateToString('TIME', date); // return : "09:54"
...
```

### utcDate

Gets a `Date` object that is set to the current date and time on this computer, expressed as the Coordinated Universal Time (UTC).

```ts
import {
  dateToString,
  utcDate,
} from 'https://raw.githubusercontent.com/Uzumachi02/date-format-deno/master/mod.ts';

const nowDate = new Date();
const utcNowDate = utcDate();

dateToString(nowDate);    // return : "2020-07-30 16:19:14.395"
dateToString(utcNowDate); // return : "2020-07-30 13:19:14.395"
...

const tmpDate = new Date("2020-12-11T10:09:54.321");
const tmpUtcDate = utcDate(tmpDate);

dateToString(nowDate);    // return : "2020-12-11 10:09:54.321"
dateToString(utcNowDate); // return : "2020-12-11 07:09:54.321"
...
```

### getGMTOffset

Convert timezoneOffset number to GMT string

```ts
import { getGMTOffset } from 'https://raw.githubusercontent.com/Uzumachi02/date-format-deno/master/mod.ts';

const nowDate = new Date();

getGMTOffset(nowDate.getTimezoneOffset());       // return : "+0300"

// use delimiter
getGMTOffset(nowDate.getTimezoneOffset(), true); // return : "+03:00"
...

let offset = 345;

getGMTOffset(offset);       // return : "-0545"
getGMTOffset(offset, true); // return : "-05:45"
...

offset = -570;

getGMTOffset(offset);       // return : "+0930"
getGMTOffset(offset, true); // return : "+09:30"
...
```

## Format keys

| Key    | Description                                                                | Example      |
| ------ | -------------------------------------------------------------------------- | ------------ |
| `dd`   | Day of the month, 2 digits with leading zeros                              | 01 to 31     |
| `MM`   | Numeric representation of a month, with leading zeros                      | 01 to 12     |
| `yy`   | A two digit representation of a year                                       | 99 or 09     |
| `yyyy` | A full numeric representation of a year, 4 digits                          | 1999 or 2020 |
| `hh`   | 24-hour format of an hour with leading zeros                               | 00 to 23     |
| `mm`   | Minutes with leading zeros                                                 | 00 to 59     |
| `ss`   | Seconds with leading zeros                                                 | 00 to 59     |
| `SSS`  | Milliseconds, 3 digits with leading zeros                                  | 001 to 999   |
| `O`    | Difference to Greenwich time (GMT) without colon between hours and minutes | +0200        |
| `P`    | Difference to Greenwich time (GMT) with colon between hours and minutes    | +02:00       |

## Predefined formats

| Key                      | Format                     | Example return               |
| ------------------------ | -------------------------- | ---------------------------- |
| `DEFAULT`                | "yyyy-MM-dd hh:mm:ss.SSS"  | 2020-12-11 10:09:54.321      |
| `ISO8601`                | "yyyy-MM-ddThh:mm:ss.SSS"  | 2020-12-11T10:09:54.321      |
| `ISO8601_WITH_TZ_OFFSET` | "yyyy-MM-ddThh:mm:ss.SSSO" | 2020-12-11T10:09:54.321+0300 |
| `DATE`                   | "yyyy-MM-dd"               | 2020-12-11                   |
| `TIME`                   | "hh:mm:ss"                 | 10:09:54                     |
| `DATETIME`               | "yyyy-MM-dd hh:mm:ss"      | 2020-12-11 10:09:54          |
| `ABSOLUTETIME`           | "hh:mm:ss.SSS"             | 10:09:54.321                 |
