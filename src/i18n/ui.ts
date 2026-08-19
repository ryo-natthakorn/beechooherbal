// src/i18n/ui.ts
// Shared UI chrome strings (nav labels, CTA button text, footer labels) — NOT page content.
// Page content (headings, body copy) lives in src/data/*.ts or inline per-page.

export interface UiStrings {
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
  // Accessibility / chrome labels (not page content).
  misc: {
    menu: string;
    skipToContent: string;
    languageSwitcher: string;
    viewLocations: string;
    enableMapInteraction: string;
    lockMap: string;
    onThisPage: string;
  };
  // Per-outlet card labels (LocationsSection's mobile list).
  outlet: {
    call: string;
    hours: string;
    directions: string;
  };
  // Short table-of-contents labels for treatment pages (TreatmentToc.astro). Navigation
  // chrome, not page copy — the section headings themselves carry the real (verbatim)
  // wording. `partConcern`/`partBrand` group the TOC into the page's two halves: the
  // visitor's own condition vs. the shared "about Bee Choo Herbal" material.
  // `crossSell` is ALSO rendered as a visible <h2> above the treatments grid on
  // treatment pages (there was no heading there before) — it is still chrome, so do not
  // swap in a legacy heading string.
  // ⚠ TH values here are newly composed (not transcribed from the legacy site, since
  // this list never existed there) — human/Crispin sign-off needed before launch.
  toc: {
    about: string;
    beforeAfter: string;
    benefits: string;
    howItWorks: string;
    pricing: string;
    reviews: string;
    recognitions: string;
    crossSell: string;
    partConcern: string;
    partBrand: string;
  };
}

export const UI: Record<"en" | "th", UiStrings> = {
  en: {
    // CTA labels are short by design: three full sentences wrapped onto three stacked
    // bars on a 375px hero and swallowed the first screen. Brand names stay as brand
    // names. `call` no longer dials — it routes to the locations page, because the
    // number it used to dial (02-072-6698) is the Udomsuk BRANCH line, not a hotline,
    // and the business has 16+ branches each with its own number (src/data/locations.ts).
    // The label says "Find a Branch" so it doesn't promise a dialer it won't open.
    cta: {
      call: "Find a Branch",
      facebook: "Facebook",
      line: "LINE",
    },
    footer: {
      callLabel: "Find a Branch",
      socialFacebook: "Facebook",
      socialYoutube: "Youtube",
      socialTiktok: "Tiktok",
      tagline: "Naturally Confident",
    },
    misc: {
      menu: "Menu",
      skipToContent: "Skip to content",
      languageSwitcher: "Language",
      viewLocations: "View all locations",
      enableMapInteraction: "Click to interact with map",
      lockMap: "Lock map",
      onThisPage: "On this page",
    },
    outlet: {
      call: "Call",
      hours: "Hours",
      directions: "Directions",
    },
    toc: {
      about: "About the Condition",
      beforeAfter: "Before & After",
      benefits: "Benefits of Herbal Treatment",
      howItWorks: "How It Works",
      pricing: "Pricing",
      reviews: "Reviews",
      recognitions: "Recognitions and Rewards",
      crossSell: "Other Treatments",
      partConcern: "This Treatment",
      partBrand: "About Bee Choo Herbal",
    },
  },
  th: {
    // `call`/`callLabel` previously read "Call Us Today" — English, on the Thai site.
    // Fixed here. Facebook and LINE stay in Latin script, which is how both brands are
    // normally written in Thai interfaces and keeps the hero row on one line.
    cta: {
      call: "สาขาใกล้คุณ",
      facebook: "Facebook",
      line: "LINE",
    },
    footer: {
      callLabel: "สาขาใกล้คุณ",
      socialFacebook: "Facebook",
      socialYoutube: "Youtube",
      socialTiktok: "Tiktok",
      tagline: "Naturally Confident",
    },
    misc: {
      menu: "เมนู",
      skipToContent: "ข้ามไปยังเนื้อหา",
      languageSwitcher: "เลือกภาษา",
      viewLocations: "ดูสาขาทั้งหมด",
      enableMapInteraction: "คลิกเพื่อใช้งานแผนที่",
      lockMap: "ล็อกแผนที่",
      onThisPage: "หัวข้อในหน้านี้",
    },
    outlet: {
      call: "โทร",
      hours: "เวลาทำการ",
      directions: "นำทาง",
    },
    toc: {
      about: "เกี่ยวกับอาการ",
      beforeAfter: "ผลก่อน-หลัง",
      benefits: "ข้อดีของทรีทเม้นท์สมุนไพร",
      howItWorks: "ขั้นตอนทรีทเม้นท์",
      pricing: "ราคา",
      reviews: "รีวิว",
      // "รางวัลการันตีคุณภาพ" — Ryo's wording. `การันตี` and `รางวัล` both already appear
      // in CROSS_SELL_FOUNDER.th ("การันตีโดยรางวัลมากมายในสิงคโปร์"), so this is existing
      // site vocabulary rather than newly invented phrasing.
      recognitions: "รางวัลการันตีคุณภาพ",
      crossSell: "ทรีทเม้นท์อื่นๆ",
      partConcern: "ทรีทเม้นท์นี้",
      partBrand: "เกี่ยวกับ บีชู เฮอร์เบิล",
    },
  },
};

// Nav structure — reproduces the live WordPress site's actual header menu (verified
// against a screenshot of the real mobile nav 2026-08-12: Home / Treatments (7-item
// dropdown) / Contact Us (Locations, About, Team dropdown) / Reviews / FAQs (3-item
// dropdown) / Blog / Products / Events and News). All hrefs are copied verbatim from
// the verified pairs in `src/i18n/pairs.ts` — do not hand-retype a Thai slug here.
// Pages the later Phase-3 batches haven't built yet will 404 on preview; that's
// expected mid-migration (real domain still points at WordPress, nothing SEO-facing
// is exposed yet).
export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  label: string;
  children: NavLink[];
}

export type NavEntry = NavLink | NavGroup;

export const NAV: Record<"en" | "th", NavEntry[]> = {
  en: [
    { label: "Home", href: "/" },
    {
      label: "Treatments",
      children: [
        { label: "Hair Loss", href: "/scalp-hair-loss-treatment-salon-clinic-in-bangkok/" },
        { label: "Grey / White Hair", href: "/reverse-premature-grey-white-hair-by-herbal-treatment/" },
        { label: "Oily Scalp", href: "/herbal-treatment-to-get-rid-of-oily-scalp-hair/" },
        { label: "Dandruff", href: "/cure-dandruff-hair-with-herbal-treatment/" },
        { label: "Damaged / Dry Hair", href: "/repair-chemically-damaged-dry-hair-with-herbal-treatment/" },
        { label: "Bacterial Infection", href: "/herbal-treatment-cure-for-bacteria-infection-alopecia-areata-and-other-hair-diseases/" },
        { label: "Postpartum Hair Loss", href: "/postpartum-hair-loss-treatment-in-thailand/" },
      ],
    },
    {
      label: "Contact Us",
      children: [
        { label: "Locations", href: "/locations/" },
        { label: "About Us", href: "/about/" },
        { label: "Our Team", href: "/team/" },
      ],
    },
    { label: "Reviews", href: "/reviews-and-testimonials-of-bee-choo-origin-treatment/" },
    {
      label: "FAQs",
      children: [
        { label: "FAQ", href: "/frequently-asked-questions/" },
        { label: "Herbal Treatment vs Hair Transplant", href: "/hair-transplant-vs-stem-cell-vs-keratin-treatment-vs-natural-herbal-treatment/" },
        { label: "Treatment Cost in Thailand", href: "/hair-loss-treatment-cost-in-thailand-prices-revealed/" },
      ],
    },
    { label: "Blog", href: "/category/blog/" },
    { label: "Products", href: "/bee-choo-hair-care-products/" },
    { label: "Events and News", href: "/events-news-release/" },
  ],
  th: [
    { label: "หน้าหลัก", href: "/th/home/" },
    {
      label: "ทรีทเม้นท์",
      children: [
        { label: "ผมร่วง", href: "/th/ซาลอน-คลินิกรักษาผมร่วง/" },
        { label: "ผมหงอก", href: "/th/ปิดผมหงอกวิธีธรรมชาติ/" },
        { label: "ผมมัน", href: "/th/วิธีแก้หนังศีรษะมัน/" },
        { label: "รังแค", href: "/th/รักษารังแค-ขจัดรังแค-ให้/" },
        { label: "ผมเสีย/ผมแห้ง", href: "/th/แก้ผมเสียเร่งด่วน/" },
        { label: "ติดเชื้อจากแบคทีเรีย", href: "/th/หนังศีรษะติดเชื้อ/" },
        { label: "ผมร่วงสำหรับคุณแม่หลังคลอด", href: "/th/ภาวะผมร่วงเฉียบพลันของ/" },
      ],
    },
    {
      label: "ติดต่อเรา",
      children: [
        { label: "สาขา", href: "/th/สถานที่ตั้งของร้านค้า/" },
        { label: "เกี่ยวกับเรา", href: "/th/เกี่ยวกับบีชู/" },
        { label: "ทีมของเรา", href: "/th/ทีม/" },
      ],
    },
    { label: "รีวิว", href: "/th/รีวิวทรีทเม้นท์ที่ดี/" },
    {
      label: "คำถามที่พบบ่อย (FAQS)",
      children: [
        { label: "FAQ", href: "/th/คำถามที่พบบ่อย/" },
        { label: "ทรีทเม้นท์สมุนไพร VS การปลูกผม", href: "/th/สมุนไพร-vs-การปลูกผม/" },
        { label: "ราคาการทำทรีทเม้นท์รักษาปัญหาผมร่วงในประเทศไทยเป็นอย่างไร?", href: "/th/ราคาการทำทรีทเม้นท์/" },
      ],
    },
    { label: "บล็อก", href: "/th/category/บล็อก/" },
    { label: "ผลิตภัณฑ์", href: "/th/แชมพูบีชูป้องกันผมร่วง/" },
    { label: "เหตุการณ์และข่าว", href: "/th/เหตุการณ์และข่าว/" },
  ],
};
