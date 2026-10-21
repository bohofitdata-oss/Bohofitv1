# Architecture rules

- Keep MCP tool definitions in `src/lib/mcp/tools/`, register them in `src/lib/mcp/index.ts`, and expose them through the TanStack Vite MCP plugin; this keeps the catalogue and generated endpoints aligned.
- Protect MCP with the app's OAuth issuer and forward each verified caller token through the existing user-scoped data helper; this preserves per-member RLS boundaries.
- Keep public studio facts and class display names in `src/lib/site-facts.ts`, separate from booking schedules and payment identifiers; presentation updates must not change transactional logic.
- Use the shared `TM` component for prominent trademark treatments; consistent superscripts avoid repeated inline styling.