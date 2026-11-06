import { chromium } from "@playwright/test";

const routes = [
  "/dashboard",
  "/vault",
  "/create",
  "/builder",
  "/beneficiaries",
  "/recovery",
  "/activity",
  "/notifications",
  "/privacy",
  "/settings",
];
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "laptop", width: 1366, height: 768 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "mobile", width: 390, height: 844 },
];
const browser = await chromium.launch({ channel: "msedge" });
const failures = [];

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of routes) {
    await page.goto(`http://127.0.0.1:3100${route}`, {
      waitUntil: "networkidle",
    });
    const result = await page.evaluate(() => {
      const rootOverflow = document.documentElement.scrollWidth - innerWidth;
      const offenders = [...document.querySelectorAll("body *")]
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          const hiddenMobileNavigation = element.closest(".sidebar:not(.mobile-open)");
          return (
            rect.width > 0 &&
            !hiddenMobileNavigation &&
            style.position !== "fixed" &&
            (rect.right > innerWidth + 1 || rect.left < -1)
          );
        })
        .slice(0, 8)
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            selector: `${element.tagName.toLowerCase()}.${[...element.classList].join(".")}`,
            left: Math.round(rect.left),
            right: Math.round(rect.right),
          };
        });
      const minimap = document.querySelector(".react-flow__minimap");
      const canvas = document.querySelector(".canvas-container");
      const sidebar = document.querySelector(".sidebar");
      const sidebarFooter = document.querySelector(".sidebar-footer");
      let sidebarStatus = null;
      if (sidebar instanceof HTMLElement && sidebarFooter && innerWidth > 720) {
        sidebar.scrollTop = sidebar.scrollHeight;
        const footer = sidebarFooter.getBoundingClientRect();
        sidebarStatus = {
          reachable: footer.top >= 0 && footer.bottom <= innerHeight + 1,
          scrollable: sidebar.scrollHeight >= sidebar.clientHeight,
        };
        sidebar.scrollTop = 0;
      }
      let minimapStatus = null;
      if (minimap && canvas) {
        const map = minimap.getBoundingClientRect();
        const box = canvas.getBoundingClientRect();
        minimapStatus = {
          visible: map.width > 0 && map.height > 0,
          contained:
            map.left >= box.left &&
            map.right <= box.right &&
            map.top >= box.top &&
            map.bottom <= box.bottom,
          map: [map.left, map.top, map.right, map.bottom].map(Math.round),
          canvas: [box.left, box.top, box.right, box.bottom].map(Math.round),
        };
      }
      return { rootOverflow, offenders, minimapStatus, sidebarStatus };
    });
    if (
      result.rootOverflow > 1 ||
      result.offenders.length ||
      result.minimapStatus?.visible === false ||
      result.minimapStatus?.contained === false ||
      result.sidebarStatus?.reachable === false
    ) {
      failures.push({ viewport: viewport.name, route, ...result });
    }
  }
  await page.close();
}

await browser.close();
console.log(JSON.stringify({ failures }, null, 2));
if (failures.length) process.exitCode = 1;
