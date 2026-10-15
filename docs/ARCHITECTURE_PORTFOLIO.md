# Architecture Portfolio

Evidence-based engineering case studies from public repositories. Each link below goes to a file or document that can be inspected. Diagrams are **conceptual summaries of repository structures**, not deployment diagrams of a verified running production system.

## 1. Storefront platform: SSR frontend + contract-driven backend

**Repositories:** [Web](https://github.com/mkwitko/udv-shop) · [API](https://github.com/mkwitko/udv-shop-api)

### Responsibilities and boundaries

\`\`\`mermaid
flowchart TD
  User["Browser / store manager"] --> F["TanStack Start file routes"]
  F --> L["SSR loader"]
  L --> T["TanStack Query cache"]
  T --> H["Kubb-generated API hooks"]
  H --> E["Fastify + Zod route contracts"]
  E --> P["Authorization hooks"]
  P --> C["HTTP controller"]
  C --> U["Use-case service"]
  U --> R["Repository interface"]
  U --> G["Gateway interface"]
  R --> DB[("PostgreSQL via Prisma")]
  G --> Ext["Payments / integrations"]
\`\`\`

**Why this architecture is interesting**

- **SSR & hydration:** route loaders use a shared TanStack Query cache for initial data; the design is explained in [web architecture notes](https://github.com/mkwitko/udv-shop/blob/main/docs/ARCHITECTURE.md).
- **Single API contract:** Fastify routes declare Zod request/response shapes and OpenAPI operations; the frontend generates typed query hooks instead of manually duplicating HTTP types. See [OpenAPI export](https://github.com/mkwitko/udv-shop-api/blob/main/docs/openapi.json) and the [web generation configuration](https://github.com/mkwitko/udv-shop/blob/main/kubb.config.ts).
- **Boundaries:** controllers handle HTTP mapping, services orchestrate business logic, and repositories/gateways isolate I/O. See [backend architecture](https://github.com/mkwitko/udv-shop-api/blob/main/docs/ARCHITECTURE.md) and the [login use case](https://github.com/mkwitko/udv-shop-api/tree/main/src/http/api/auth/login).
- **Authorization:** routes must be marked public or declare permissions per the backend design. This is a design/code observation, not a security certification.
- **Verification hooks:** web E2E scenarios live in [e2e](https://github.com/mkwitko/udv-shop/tree/main/e2e), while backend scenarios live in [test/e2e](https://github.com/mkwitko/udv-shop-api/tree/main/test/e2e). Test existence does not mean the latest runs pass.

**Trade-offs worth discussing:** cached SSR data versus browser-only auth restoration; type-generation workflow maintenance; server-side validation and explicit authorization requirements; gateway design for external services.

## 2. React Native: typed API and household-scoped state

**Repository:** [finance-app](https://github.com/mkwitko/finance-app)

\`\`\`mermaid
flowchart TD
  R["Expo Router"] --> Screens["Today / Transactions / Insights / Settings"]
  Screens --> Query["Generated API hooks + TanStack Query"]
  Screens --> Local["Zustand household state"]
  Screens --> UI["Shared React Native UI"]
  Query --> HTTP["Configured backend API"]
  Screens --> Native["Native integrations"]
\`\`\`

**Source references**

- [Route structure](https://github.com/mkwitko/finance-app/tree/master/src/app)
- [API client and query setup](https://github.com/mkwitko/finance-app/tree/master/src/api)
- [Household store](https://github.com/mkwitko/finance-app/blob/master/src/stores/household-store.ts)
- [Transaction screen](https://github.com/mkwitko/finance-app/blob/master/src/app/%28tabs%29/transactions.tsx)
- [Subscription-gated insights](https://github.com/mkwitko/finance-app/blob/master/src/app/%28tabs%29/insights.tsx)

**Trade-offs:** shared server cache vs small local UI state, navigation structure, platform configuration, and protecting private runtime keys. No App Store release or external API reliability is claimed.

## 3. Real-time frontend: event-driven UI updates

**Repository:** [lunajoy-front](https://github.com/mkwitko/lunajoy-front)

\`\`\`mermaid
flowchart LR
  API["Backend REST API"] --> Hooks["Orval-generated React Query hooks"]
  Hooks --> Cache["TanStack Query cache"]
  Cache --> View["Dashboard / charts / streaks"]
  Events["Ably events"] --> Handler["React event handler"]
  Handler --> Cache
\`\`\`

The [home route implementation](https://github.com/mkwitko/lunajoy-front/blob/main/src/pages/protected/home/home.tsx) subscribes to a daily-log event and updates cached data. The [Orval config](https://github.com/mkwitko/lunajoy-front/blob/main/orval.config.ts) describes the generated client from a Swagger document.

**Trade-offs:** cache consistency and event deduplication, real-time event ordering, re-fetch policies, and clear error/loading states. The code shows a strategy, not independently tested delivery guarantees.

## What these cases do *not* assert

No invented throughput, latency, customer count, security certification, scalability benchmark, production deployment, or test-success claim. Professional performance improvement claims on the profile are from the CV rather than inferred from these repositories.

**Next evidence to collect:** real application screenshots with anonymized content, passing workflow links, test summaries, and measurements before/after an optimization. See [Showcase checklist](SHOWCASE_CHECKLIST.md).
