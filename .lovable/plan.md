# Plan: /longevity (50+) full overhaul

Rebuild the 50+ page around health, not classes. Keep the route at `/longevity`. All schema changes target the external bohofitdata-oss project — I'll generate one SQL file you run there.

## Information architecture

New flow on `/longevity`:

```text
1. Hero            "Move pain-free. Age strong."          + Language switcher (EN/HI/KN/TE/TA)
2. Who this is for Condition chips: knee pain, back pain, diabetes,
                   BP, cholesterol, osteoporosis, sarcopenia, balance,
                   post-surgery recovery, frozen shoulder
3. Three tiers     Preventive  | Corrective | Critical (doctor-supervised)
                   ₹X/mo         ₹Y/mo        ₹Z/mo
4. Step 1 CTA      "Book free 30-min health assessment"  (NOT a trial class)
5. How it works    Assessment -> Tier -> 1:1 coach -> 90-day re-check
6. 90-day tracking Baseline + 90-day blood panel via our diagnostic partner
7. Dedicated batch "Mon-Sat, 50+ only batch, separate from general floor"
8. Slot picker     Morning + Evening + "Request another time" button (50+ only)
9. For sons & daughters  Gift card / "Buy this for mom or dad" block
                         Family WhatsApp opt-in explained
10. Testimonials   Structured cards with hard numbers:
                   "HbA1c 8.2 -> 6.4 in 12 weeks", "Off BP meds in 16 weeks",
                   "Knee pain 7/10 -> 0/10 in 6 weeks"
11. Rules + consent
12. Two CTAs       Book free assessment   |   Reserve my slot
```

## New components

- `LanguageSwitcher.tsx` — chips for EN/HI/KN/TE/TA, writes to `localStorage` + URL `?lang=`
- `HealthAssessmentForm.tsx` — replaces the current intake. Captures: conditions (multi-select), pain points, current meds (free text), mobility level (1-5), goals, family contact (name + phone + relation), preferred language
- `TierPicker.tsx` — three cards (Preventive / Corrective / Critical) with what's included, who it's for, price
- `ConditionChips.tsx` — selectable condition list, drives tier recommendation
- `RequestAnotherSlot.tsx` — 50+ only button next to SlotPicker, opens a small form (preferred time + day), inserts into `slot_requests`
- `StructuredTestimonials.tsx` — cards with metric, before, after, weeks
- `GiftForParentCTA.tsx` — block targeted at 30-40 year olds, "Gift Boho at 50+"
- `FamilyUpdatesOptIn.tsx` — explains WhatsApp updates, captures family contact

## Translations

- `src/i18n/longevity.ts` — single dictionary keyed by language code: `{ en, hi, kn, te, ta }`. Every string on `/longevity` reads from `t(key)`. Keys grouped by section (hero, tiers, conditions, assessment, testimonials, family, rules, cta).
- Tiny hook `useLang()` returns the current code + `t()` resolver. No i18n library — keeps the bundle small.
- Translations done by me in plain language for all 5 languages. You can correct any phrasing later by editing the dictionary.

## Database changes (one migration file: `bohofit_longevity_overhaul.sql`)

New tables in the external project:

- `health_assessments`
  - id, user_id (nullable), name, phone, email, age, city, language
  - conditions (text[]), pain_points (text[]), current_meds (text), mobility_level (int 1-5)
  - goal (text), recommended_tier (`preventive` | `corrective` | `critical`)
  - family_name, family_phone, family_relation, family_updates_opt_in (bool)
  - status (`new` | `contacted` | `enrolled` | `dropped`), notes, created_at
  - RLS: anyone can insert; admins/coaches read+update

- `slot_requests` (50+ "request another time")
  - id, name, phone, email, preferred_day, preferred_time, note, status, created_at
  - RLS: anyone insert; staff read+update

- `family_updates`
  - id, member_id (-> longevity_members), sent_to_phone, message, sent_at
  - RLS: staff only (server-side writes via admin client)

- New enum: `wellness_tier` ('preventive','corrective','critical')

Existing `longevity_members` gets `tier wellness_tier` column.

## Server functions

- `submitHealthAssessment.functions.ts` — validates, inserts into `health_assessments`, returns recommended tier
- `requestAnotherSlot.functions.ts` — inserts into `slot_requests`
- `sendFamilyUpdate.functions.ts` — admin/coach only, sends WhatsApp link (deep-link only, no API integration yet — we just record + open `wa.me` from the dashboard)

Each uses the existing `bohofitAdmin` client + `requireSupabaseAuth` where needed.

## Out of scope (call out for later)

- Real WhatsApp Business API send (we deep-link to wa.me from the staff dashboard for now)
- Actual diagnostic lab partner integration (page copy only, "via our diagnostic partner")
- Payment for the three tiers (existing Razorpay flow stays; we'll wire tier amounts in a follow-up)
- Admin dashboard views for `health_assessments` and `slot_requests` (next pass — I'll add tabs to `/admin`)

## Files changed (rough)

Created:
- `bohofit_longevity_overhaul.sql`
- `src/i18n/longevity.ts`, `src/i18n/useLang.tsx`
- `src/components/LanguageSwitcher.tsx`
- `src/components/HealthAssessmentForm.tsx`
- `src/components/TierPicker.tsx`
- `src/components/ConditionChips.tsx`
- `src/components/RequestAnotherSlot.tsx`
- `src/components/StructuredTestimonials.tsx`
- `src/components/GiftForParentCTA.tsx`
- `src/components/FamilyUpdatesOptIn.tsx`
- `src/lib/submitHealthAssessment.functions.ts`
- `src/lib/requestAnotherSlot.functions.ts`
- `src/lib/sendFamilyUpdate.functions.ts`

Edited:
- `src/routes/longevity.tsx` (full rewrite to new IA)
- `src/components/SlotPicker.tsx` (accept `showRequestAnother` prop)
- `src/components/PaymentScreen.tsx` (accept tier-based pricing)

## Order of execution

1. Write + show you `bohofit_longevity_overhaul.sql` for you to run in the external project
2. Build i18n dictionary (all 5 languages) + `useLang`
3. Build new components
4. Rewrite `/longevity` route
5. Wire server functions
6. Smoke-test in the preview at 360px and desktop
