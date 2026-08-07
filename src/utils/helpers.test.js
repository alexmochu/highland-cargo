import { describe, it, expect } from "vitest";
import { escapeForOrFilter } from "./helpers";

// Regression test for the product-search PostgREST injection fix
// (src/app/products/page.jsx used to interpolate the raw search term into
// a .or() filter string).
describe("escapeForOrFilter", () => {
  it("wraps a plain value in double quotes", () => {
    expect(escapeForOrFilter("%sneakers%")).toBe('"%sneakers%"');
  });

  it("neutralizes commas so they can't split the or() filter into extra clauses", () => {
    const malicious = "x%,role.eq.admin,name.ilike.%";
    const escaped = escapeForOrFilter(malicious);
    // the comma must stay inside the quoted string, not become a filter separator
    expect(escaped).toBe('"x%,role.eq.admin,name.ilike.%"');
  });

  it("escapes embedded double quotes and backslashes", () => {
    expect(escapeForOrFilter('a"b\\c')).toBe('"a\\"b\\\\c"');
  });
});
