import test from "node:test";
import assert from "node:assert/strict";
import { cronAuthorized, cronUnconfigured } from "../lib/cronAuth.ts";

test("a deployment without CRON_SECRET skips scheduled work", () => {
  const previous = process.env.CRON_SECRET;
  delete process.env.CRON_SECRET;
  try {
    assert.equal(cronUnconfigured(), true);
    assert.equal(cronAuthorized(new Request("https://example.com/api/cron/monday")), false);
  } finally {
    if (previous === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = previous;
  }
});

test("a configured cron still requires the matching secret", () => {
  const previous = process.env.CRON_SECRET;
  process.env.CRON_SECRET = "test-secret";
  try {
    assert.equal(cronUnconfigured(), false);
    assert.equal(cronAuthorized(new Request("https://example.com/api/cron/monday")), false);
    assert.equal(
      cronAuthorized(new Request("https://example.com/api/cron/monday?secret=test-secret")),
      true,
    );
    assert.equal(
      cronAuthorized(new Request("https://example.com/api/cron/monday", {
        headers: { authorization: "Bearer test-secret" },
      })),
      true,
    );
  } finally {
    if (previous === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = previous;
  }
});
