// src/i18n/ui.ts
// Shared UI chrome strings (nav labels, CTA button text, footer labels) — NOT page content.
// Page content (headings, body copy) lives in src/data/*.ts or inline per-page.

export interface UiStrings {
  nav: {
    home: string;
    about: string;
    locations: string;
    faq: string;
    blog: string;
  };
  cta: {
    call: string;
    facebook: string;
    line: string;
  };
  footer: {
    callLabel: string;
    socialFacebook: string;
    socialYoutube: string;
    socialTiktok: string;
    tagline: string;
  };
}

export const UI: Record<"en" | "th", UiStrings> = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      locations: "Locations",
      faq: "FAQ",
      blog: "Blog",
    },
    cta: {
      call: "Call Us Today",
      facebook: "Message us on Facebook",
      line: "Add us on LINE",
    },
    footer: {
      callLabel: "Call Us Today",
      socialFacebook: "Facebook",
      socialYoutube: "Youtube",
      socialTiktok: "Tiktok",
      tagline: "Naturally Confident",
    },
  },
  th: {
    nav: {
      home: "หน้าแรก",
      about: "เกี่ยวกับเรา",
      locations: "สถานที่ตั้ง",
      faq: "คำถามที่พบบ่อย",
      blog: "บล็อก",
    },
    cta: {
      call: "Call Us Today",
      facebook: "พูดคุยกับเราผ่านเฟสบุ๊ค",
      line: "เพิ่มเพื่อนทาง LINE",
    },
    footer: {
      callLabel: "Call Us Today",
      socialFacebook: "Facebook",
      socialYoutube: "Youtube",
      socialTiktok: "Tiktok",
      tagline: "Naturally Confident",
    },
  },
};

// Nav link targets. English pages listed as their eventual URLs (CLAUDE.md §11) even where the
// Astro route doesn't exist yet — they'll be filled in by later Phase 3 batches. Not exposed to
// search engines yet (real domain still points at WordPress), so a temporary 404 on the Vercel
// preview is acceptable mid-migration.
export const NAV_HREFS: Record<"en" | "th", Record<keyof UiStrings["nav"], string>> = {
  en: {
    home: "/",
    about: "/about/",
    locations: "/locations/",
    faq: "/frequently-asked-questions/",
    blog: "/category/blog/",
  },
  th: {
    home: "/th/home/",
    about: "/th/เกี่ยวกับบีชู/",
    locations: "/th/สถานที่ตั้งของร้านค้า/",
    faq: "/th/คำถามที่พบบ่อย/",
    blog: "/th/category/บล็อก/",
  },
};
