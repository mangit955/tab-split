# Tab Split

A small tip calculator: type the bill, pick a tip, read the total. Plain TypeScript and Vite, no
framework.

```sh
bun install
bun run dev        # http://localhost:5173
bun run test       # the money math in src/tip.ts
bun run typecheck
bun run build
```

Amounts are kept in cents so a tip never picks up a floating-point stray.
