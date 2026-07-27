// src/data/locations.ts
// Bee Choo Thailand outlets, transcribed verbatim (names/phones/hours — not
// translated, matching the live site's own English-only presentation of this data)
// from the live site's own Locations page content, fetched via WP REST during Phase 1
// inventory (see inventory/_locations_dump.html). 16 outlets confirmed — matches
// Crispin's "16 outlets (17 by August)" feedback exactly. The 17th isn't on the live
// site yet; append it here once it is.
export interface Outlet {
  name: string;
  phoneDisplay: string;
  /** tel: href value, no punctuation. */
  phoneHref: string;
  hours: string;
}

export const OUTLETS: Outlet[] = [
  { name: "Sai Mai", phoneDisplay: "02-121-4419", phoneHref: "+6621214419", hours: "Weekdays 9am–8pm, Weekends 9am–7pm (last walk-in)" },
  { name: "Siam Square", phoneDisplay: "02-115-1300", phoneHref: "+6621151300", hours: "Weekdays 11am–8pm, Weekends 10:30am–8pm (last walk-in)" },
  { name: "Ratchada", phoneDisplay: "06-1729-3434", phoneHref: "+66617293434", hours: "Everyday 9am–7pm (last walk-in)" },
  { name: "Udomsuk", phoneDisplay: "02-072-6698", phoneHref: "+6620726698", hours: "Everyday 9am–8pm (last walk-in)" },
  { name: "Chaiyapruek", phoneDisplay: "02-147-1459 / 093-138-5214", phoneHref: "+6621471459", hours: "Everyday 9am–8pm (last walk-in)" },
  { name: "Kallapaphruk", phoneDisplay: "090-221-7745", phoneHref: "+66902217745", hours: "Everyday 9am–8pm (last walk-in)" },
  { name: "Chonburi", phoneDisplay: "096-904-7964", phoneHref: "+66969047964", hours: "Everyday 9am–8pm (last walk-in)" },
  { name: "The Crystal (Ekamai-Ramindra)", phoneDisplay: "095-536-5556", phoneHref: "+66955365556", hours: "Everyday 10am–8pm (last walk-in)" },
  { name: "Sammakorn", phoneDisplay: "086-004-1122", phoneHref: "+66860041122", hours: "Everyday 9am–7pm (last walk-in)" },
  { name: "Prawet", phoneDisplay: "083-445-0589", phoneHref: "+66834450589", hours: "Weekdays 9am–8pm, Weekends 9am–7pm (last walk-in)" },
  { name: "Chatuchak (Prachachuen)", phoneDisplay: "080-274-1868", phoneHref: "+66802741868", hours: "Everyday 9am–7pm (last walk-in)" },
  { name: "Suksawat", phoneDisplay: "064-153-2662", phoneHref: "+66641532662", hours: "Everyday 9am–8pm (last walk-in)" },
  { name: "Korat", phoneDisplay: "081-741-0763", phoneHref: "+66817410763", hours: "Everyday 9am–8pm (last walk-in 7:30pm)" },
  { name: "Surat Thani", phoneDisplay: "064-380-8888", phoneHref: "+66643808888", hours: "Weekdays 9am–8pm, Weekends 9am–7pm (last walk-in)" },
  { name: "Chiang Mai", phoneDisplay: "082-123-4602", phoneHref: "+66821234602", hours: "Weekdays 9am–8pm, Weekends 9am–8pm (last walk-in)" },
  { name: "Phutthamonthon", phoneDisplay: "083-090-3672", phoneHref: "+66830903672", hours: "Everyday 10am–8pm (last walk-in)" },
];
