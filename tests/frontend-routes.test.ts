import { expect } from "chai";

const { frontendRoutes } = require("../config/http.js").http.middleware;

const BROWSER_NAVIGATION = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
const RESOURCE_FETCH = "*/*";

function route(method: string, url: string, accept?: string): string {
  const req: any = { method, url, path: url.split("?")[0], headers: accept ? { accept } : {}, isSocket: false };
  let outcome = "";
  const res: any = { view(name: string) { outcome = `view:${name}`; } };
  frontendRoutes(req, res, () => { outcome = "next"; });
  return outcome;
}

describe("frontendRoutes", () => {
  it("serves the storefront for its pages, from a browser or a plain client", () => {
    for (const url of ["/", "/menu", "/dish/borsch", "/cart?step=2", "/cabinet/order-history", "/stocks/1f0c"]) {
      expect(route("GET", url, BROWSER_NAVIGATION), url).to.equal("view:index");
      expect(route("GET", url), url).to.equal("view:index");
    }
  });

  it("serves the storefront on HEAD like on GET", () => {
    expect(route("HEAD", "/menu")).to.equal("view:index");
  });

  it("lets a missing file fall through to 404 instead of the storefront", () => {
    for (const url of ["/site.webmanifest", "/logo.png", "/favicon-32x32.png", "/assets/i18n/en.json"]) {
      expect(route("GET", url, RESOURCE_FETCH), url).to.equal("next");
    }
  });

  it("still serves a page whose slug has a dot when the browser navigates to it", () => {
    expect(route("GET", "/articles/akciya-1.10", BROWSER_NAVIGATION)).to.equal("view:index");
  });

  it("never serves the storefront for an unknown backend path, even to a browser", () => {
    for (const url of ["/admin", "/admin/orders", "/admin/modules", "/api/0.5/nothing", "/graphql/nothing", "/assets/nothing"]) {
      expect(route("GET", url, BROWSER_NAVIGATION), url).to.equal("next");
    }
  });

  it("does not treat a page that only starts like a backend prefix as backend", () => {
    expect(route("GET", "/administration", BROWSER_NAVIGATION)).to.equal("view:index");
    expect(route("GET", "/apiary", BROWSER_NAVIGATION)).to.equal("view:index");
  });

  it("leaves non-page methods alone", () => {
    expect(route("POST", "/menu", BROWSER_NAVIGATION)).to.equal("next");
  });
});
