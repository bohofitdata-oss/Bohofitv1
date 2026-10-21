# Architecture rules

- Keep MCP tool definitions in `src/lib/mcp/tools/`, register them in `src/lib/mcp/index.ts`, and expose them through the TanStack Vite MCP plugin; this keeps the catalogue and generated endpoints aligned.
- Protect MCP with the app's OAuth issuer and forward each verified caller token through the existing user-scoped data helper; this preserves per-member RLS boundaries.
- Keep public studio facts and class display names in `src/lib/site-facts.ts`, separate from booking schedules and payment identifiers; presentation updates must not change transactional logic.
- Use the shared `TM` component for prominent trademark treatments; consistent superscripts avoid repeated inline styling.
- Pass page-specific consultation times and concern notes as optional booking props, with defaults unchanged; UnPause and 50+ share slot configuration without altering inserts or notifications.
- Keep 50+ body-map focus data browser-safe and separate from its presentation; map dots, mobile chips and MCP use the same selection catalogue.
- Keep Group Classes plans in a shared catalogue used by the page and Razorpay handlers; derive server charge amounts from plan IDs, never browser prices.
- Bind group membership checkout to a validated plan marker in the existing booking goal field and verify provider order amounts before marking paid; retain legacy booking plan enums and payment RPC.
- Keep paid Group Classes entry in a page-local modal using the existing payment and membership-terms components; the existing booking page remains the free-trial flow.