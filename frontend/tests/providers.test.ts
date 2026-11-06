import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

test("public read transport is deferred until mount while the page prerenders", async () => {
  const previousMode = process.env.NEXT_PUBLIC_ANON_RPC_ENABLED;
  process.env.NEXT_PUBLIC_ANON_RPC_ENABLED = "false";
  try {
    const { Providers, useReadTransport } =
      await import("../components/providers");
    function Probe() {
      const { client, privacy } = useReadTransport();
      return createElement(
        "div",
        null,
        createElement(
          "span",
          null,
          `${privacy.mode}:${client ? "ready" : "waiting"}`,
        ),
        createElement("button", null, "Review inheritance plan"),
      );
    }
    const html = renderToString(
      createElement(Providers, null, createElement(Probe)),
    );
    assert.match(html, /starting:waiting/);
    assert.match(html, /Review inheritance plan/);
    assert.doesNotMatch(html, /public:ready/);
  } finally {
    if (previousMode === undefined)
      delete process.env.NEXT_PUBLIC_ANON_RPC_ENABLED;
    else process.env.NEXT_PUBLIC_ANON_RPC_ENABLED = previousMode;
  }
});
