# Plan: Rebél white-label app developer handoff

## Deliverable
Create a polished, shareable **PDF** plus an **editable DOCX** containing the same handoff. This documents the existing Rebél experience for an external app team; it does not redesign or change the live app. Place both files in Files.

## What the handoff will cover
1. **Brand and visual system:** wordmark usage and asset references; exact black/crimson/bright-red/white/grey palette with swatches and roles; typography, hierarchy, spacing, glass surfaces, borders, buttons, chips, iconography, photography, motion, and mobile/desktop behavior. Include representative screenshots from the current app where useful.
2. **App structure:** a sitemap and screen-by-screen inventory covering public discovery, the three offerings, booking, sign-in, onboarding, member views, care/progress, admin/coach, family sharing, café, method content, and privacy. For each screen, document its purpose, primary action, and key UI states.
3. **Programs and journeys:** distinguish Group Classes (Levels 1/2/3 and package/trial/payment paths), Rebél Unpause (women's perimenopause/menopause 1:1), and Rebél at 50+ (joint/mobility-focused 1:1). Diagram the consultation, group-class, onboarding, and member journeys, including the user's next step and consent checkpoints.
4. **Functional/data handoff:** summarize the actual data entities, roles, permissions, progress features, slot behavior, payment and messaging integrations, and media inventory. List configuration names and integration responsibilities **without disclosing keys, project identifiers, private customer data, or medical records**.
5. **Build checklist and open decisions:** separate what exists now from placeholders, unfinished integrations, or contradictory copy/flows. Flag items requiring owner confirmation rather than presenting them as completed or inventing business rules.

## Accuracy and presentation
- Use the current source and current preview as the reference, not an old plan or prior chat promises. Verify the main paths and capture a small set of representative mobile/desktop screenshots.
- Explicitly flag known mismatches, including the group-class pricing page versus the trial-first booking page, the unfinished Today area, and consultation notifications that currently have a placeholder sender; do not claim those are production-ready.
- Include a concise cover, contents, annotated specification tables, screen/journey map, and a handoff checklist. Match the document's look to Rebél's dark/red visual identity.
- Render and inspect **every page** of the PDF and DOCX before delivery, fixing any clipping, overflow, or missing assets. Deliver links to both files and a brief list of owner decisions still needed.

## Technical notes
Document the existing React/TanStack web app and its cloud data/API boundaries as implementation reference, not as a requirement that the white-label mobile team use the same framework. Only include verified feature status; avoid copying secrets or raw health data into the handoff.
