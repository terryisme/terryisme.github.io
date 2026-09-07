import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialsFromName,
  formatMonth,
  formatDateRange,
  visibleLinks,
  normalizeTheme,
} from "../profile.mjs";

test("initialsFromName uses first two words", () => {
  assert.equal(initialsFromName("Terry Zhang"), "TZ");
});

test("initialsFromName falls back to TZ when empty", () => {
  assert.equal(initialsFromName(""), "TZ");
  assert.equal(initialsFromName("   "), "TZ");
});

test("formatMonth formats YYYY-MM and present", () => {
  assert.equal(formatMonth("2019-05"), "May 2019");
  assert.equal(formatMonth("present"), "Present");
});

test("formatDateRange covers empty and partial dates", () => {
  assert.equal(formatDateRange("", ""), "Dates TBA");
  assert.equal(formatDateRange("2019-05", "present"), "May 2019 – Present");
  assert.equal(formatDateRange("", "2008-11"), "TBA – November 2008");
  assert.equal(formatDateRange("2019-05", ""), "May 2019 – TBA");
});

test("visibleLinks drops empty strings and labels email", () => {
  const links = visibleLinks({
    linkedin: "https://www.linkedin.com/in/taigoo",
    github: "",
    email: "terry@example.com",
    x: "",
  });
  assert.deepEqual(links, [
    { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/taigoo" },
    { key: "email", label: "Email", href: "mailto:terry@example.com" },
  ]);
});

test("normalizeTheme rejects unknown values", () => {
  assert.equal(normalizeTheme("light"), "light");
  assert.equal(normalizeTheme("dark"), "dark");
  assert.equal(normalizeTheme("nope"), "dark");
});
