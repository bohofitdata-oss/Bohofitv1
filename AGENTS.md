# Architecture rules

- Keep MCP tool definitions in `src/lib/mcp/tools/`, register them in `src/lib/mcp/index.ts`, and expose them through the TanStack Vite MCP plugin; this keeps the catalogue and generated endpoints aligned.
- Protect MCP with the app's OAuth issuer and forward each verified caller token through the existing user-scoped data helper; this preserves per-member RLS boundaries.