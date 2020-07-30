import { test, assertEquals } from "./test_deps.ts";
import {
  dateToString,
  registerFormat,
  getGMTOffset,
  utcDate,
} from "./mod.ts";

function getDate() {
  return new Date("2020-12-11T10:09:54.321");
}

test({
  name: "test getGMTOffset",
  fn() {
    const timezoneOffsets = [
      {
        offset: -570,
        tests: ["+0930", "+09:30"],
      },
      {
        offset: -345,
        tests: ["+0545", "+05:45"],
      },
      {
        offset: -180,
        tests: ["+0300", "+03:00"],
      },
      {
        offset: 0,
        tests: ["+0000", "+00:00"],
      },
      {
        offset: 180,
        tests: ["-0300", "-03:00"],
      },
      {
        offset: 345,
        tests: ["-0545", "-05:45"],
      },
      {
        offset: 570,
        tests: ["-0930", "-09:30"],
      },
    ];

    for (const timezoneOffset of timezoneOffsets) {
      assertEquals(
        getGMTOffset(timezoneOffset.offset),
        timezoneOffset.tests[0],
      );
      assertEquals(
        getGMTOffset(timezoneOffset.offset, true),
        timezoneOffset.tests[1],
      );
    }
  },
});

test({
  name: "dateToString default format",
  fn() {
    const date = getDate();

    assertEquals(dateToString(date), "2020-12-11 10:09:54.321");
  },
});

test({
  name: "dateToString ISO8601 format",
  fn() {
    const date = getDate();

    assertEquals(dateToString("ISO8601", date), "2020-12-11T10:09:54.321");
  },
});

test({
  name: "dateToString ISO8601_WITH_TZ_OFFSET format",
  fn() {
    const date = getDate();
    const GMTOffset = getGMTOffset(date.getTimezoneOffset());

    assertEquals(
      dateToString("ISO8601_WITH_TZ_OFFSET", date),
      "2020-12-11T10:09:54.321" + GMTOffset,
    );
  },
});

test({
  name: "dateToString DATETIME format",
  fn() {
    const date = getDate();

    assertEquals(
      dateToString("DATETIME", date),
      "2020-12-11 10:09:54",
    );
  },
});

test({
  name: "dateToString ABSOLUTETIME format",
  fn() {
    const date = getDate();

    assertEquals(
      dateToString("ABSOLUTETIME", date),
      "10:09:54.321",
    );
  },
});

test({
  name: "dateToString custom format",
  fn() {
    const date = getDate();

    assertEquals(dateToString("dd-MM-yyyy hh:mm", date), "11-12-2020 10:09");
  },
});

test({
  name: "dateToString all formats",
  fn() {
    const date = getDate();
    const GMTOffset = getGMTOffset(date.getTimezoneOffset());
    const GMTOffsetDelimiter = getGMTOffset(date.getTimezoneOffset(), true);

    assertEquals(
      dateToString("dd-MM-y-yy-yyy-yyyy hh:mm:ss:SSS O P", date),
      `11-12-20-20-20-2020 10:09:54:321 ${GMTOffset} ${GMTOffsetDelimiter}`,
    );
  },
});

test({
  name: "register new format",
  fn() {
    const date = getDate();

    registerFormat({ test: "yyyy MM dd hh mm ss SSS" });

    assertEquals(dateToString("test", date), "2020 12 11 10 09 54 321");
  },
});

test({
  name: "redefine default format",
  fn() {
    const date = getDate();

    registerFormat({ default: "hh:mm:ss dd.MM.yyyy" });

    assertEquals(dateToString(date), "10:09:54 11.12.2020");
  },
});

test({
  name: "test utcDate",
  fn() {
    const date = new Date();
    const utcString = dateToString("ISO8601", utcDate(date)) + "Z";

    assertEquals(utcString, date.toISOString());
  },
});
