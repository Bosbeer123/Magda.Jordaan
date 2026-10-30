// ONE place for every fact about Magda that appears on the site.
// Anything in [BRACKETS] is still to be confirmed with her (docs/CONTENT-TODO.md).
// Never hard-code these facts in a page: import them from here.

export const site = {
  name: 'Magda Jordaan',
  tagline: 'The adviser who has wound up the estates that bad planning leaves behind.',
  mission: 'My mission is simple — awareness before desire.',
  roles: 'Financial Adviser and admitted attorney',
  qualifications: 'BProc · Advanced Postgraduate Diploma in Financial Planning',

  phone: '[PHONE]',
  whatsapp: '[WHATSAPP NUMBER, international format e.g. 27821234567]',
  email: '[EMAIL]',
  officeHours: '[OFFICE HOURS]',
  address: '235 Monument Avenue, Lyttelton, Centurion',
  areas: ['Centurion', 'Lyttelton', 'Irene', 'Midstream', 'Pretoria East'],

  lawPractice: '[M Jordaan Attorney — confirm registered name]',
  linkedin: 'https://www.linkedin.com/in/magda-jordaan-a0766371/',
  bookingUrl: '[CAL.COM BOOKING LINK]',

  /** false = test version: search engines are asked not to index it. Set true on launch day. */
  launched: false,
} as const;

/** Magda's LinkedIn profile, or null while it is still a [PLACEHOLDER] (the link is then only shown in dev, pointing to #). */
export const linkedin: { href: string; real: boolean } | null = !site.linkedin.startsWith('[')
  ? { href: site.linkedin, real: true }
  : import.meta.env.DEV ? { href: '#', real: false } : null;

// Compliance text. Wording agreed in the plan; do not edit without Momentum Consult sign-off.
export const compliance = {
  fspFooter:
    'Magda Jordaan is a representative of Momentum Consult (Pty) Ltd (Reg. No. 1969/009289/07), ' +
    'an authorised financial services provider (FSP 5503), a subsidiary of Momentum Strategic Investments (Pty) Ltd.',
  legalServicesFlag:
    'Legal services (wills, estates and trusts) are rendered by M Jordaan Attorney, a separate legal practice, ' +
    'not regulated by the FSCA and not covered by FAIS.',
  generalInfo: 'General information only, not financial or legal advice.',
  postDisclaimer:
    'General information only, not financial or legal advice. Magda Jordaan is a representative of ' +
    'Momentum Consult (Pty) Ltd, an authorised FSP (5503), and an admitted attorney.',
  privacyNoticeVersion: '2026-10-draft',
} as const;
