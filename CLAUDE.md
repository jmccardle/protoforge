# Protoforge (Appsmith Fork)

A fork of [Appsmith](https://github.com/appsmithorg/appsmith) — an open-source low-code platform for building internal tools. This fork is being customized under the name **Protoforge**.

## Project Structure

Monorepo with two main components:

```
app/
├── client/          # React/TypeScript frontend (Yarn 3 workspace)
│   ├── src/
│   │   ├── ce/      # Community Edition overrides (this is where most customization lives)
│   │   ├── ee/      # Enterprise Edition stubs (re-exports CE in this fork)
│   │   ├── pages/   # Page components (Editor, AppViewer, AdminSettings, UserAuth)
│   │   ├── sagas/   # Redux-saga side effects
│   │   ├── reducers/# Redux state
│   │   ├── widgets/ # UI widget implementations
│   │   ├── assets/  # Images, SVGs, icons
│   │   └── utils/   # Utilities (Analytics, Branding, hooks)
│   └── packages/    # Workspace sub-packages (ads, wds, icons, utils, eslint-plugin, storybook, ast, dsl)
├── server/          # Java Spring Boot backend (Maven)
│   ├── appsmith-server/      # Main application
│   ├── appsmith-interfaces/  # Shared types/interfaces
│   ├── appsmith-plugins/     # 26 database/API connector plugins
│   ├── appsmith-git/         # Git integration
│   └── reactive-caching/     # Caching layer
└── util/            # Utility scripts
deploy/              # Deployment configs (Docker, K8s, Ansible, AWS, Heroku)
```

## Tech Stack

- **Frontend:** React 17, TypeScript 5.5, Redux + Redux-Saga, Webpack 5, Tailwind CSS 3, Styled Components
- **Backend:** Java 17, Spring Boot 3.3, Maven, MongoDB, Redis
- **Testing:** Jest (unit), Cypress 13 (E2E)
- **Package Manager:** Yarn 3 (client), Maven (server)
- **Node:** ^20.11.1

## CE/EE Architecture

The codebase uses import aliasing (`ce/` and `ee/` prefixes) to split community vs enterprise code. In this fork, `ee/` generally re-exports from `ce/`. Key patterns:

- `ce/pages/AdminSettings/config/` — Admin settings panel configuration
- `ce/utils/planHelpers.ts` — Feature flag checks (`isOIDCEnabled`, `isSAMLEnabled`, `isGACEnabled`, etc.)
- `ce/constants/messages.ts` — All user-facing string constants
- `ce/utils/AnalyticsUtil.tsx` — Analytics initialization and event logging
- `ce/configs/index.ts` — Environment variable and runtime config loading

Feature gating uses `license_*` feature flags (e.g., `license_sso_oidc_enabled`). In CE, these are always `false`, causing upgrade-page placeholders to render instead of actual features.

## Build & Run

### Client
```bash
cd app/client
yarn install
yarn start        # Dev server
yarn build        # Production build
yarn test:unit    # Jest tests
yarn lint         # ESLint
```

### Server
```bash
cd app/server
mvn clean install         # Full build
mvn spring-boot:run       # Run server (requires MongoDB + Redis)
```

### Docker
```bash
docker build -t protoforge .
```

## Key Configuration

- **Environment variables:** See `.env.example` at project root
- **Server properties:** `app/server/appsmith-server/src/main/resources/application-ce.properties`
- **Client config loader:** `app/client/src/ce/configs/index.ts` (reads from `window.APPSMITH_FEATURE_CONFIGS` injected at runtime)

## Authentication

OAuth2/OIDC flow managed by Spring Security:
- **Security config:** `app/server/.../configurations/SecurityConfig.java`
- **OAuth2 user service:** `app/server/.../authentication/handlers/ce/CustomOAuth2UserServiceCEImpl.java`
- **OIDC user service:** `app/server/.../authentication/handlers/ce/CustomOidcUserServiceCEImpl.java`
- **Auth request resolver:** `app/server/.../authentication/handlers/ce/CustomServerOAuth2AuthorizationRequestResolverCE.java`
- **Client admin settings:** `app/client/src/ce/pages/AdminSettings/config/authentication.tsx`
- **Login sources:** `app/server/.../domains/LoginSource.java` — GOOGLE, GITHUB, KEYCLOAK, OIDC, FORM

Google and GitHub OAuth are fully implemented in CE. OIDC and SAML exist in the codebase but are gated behind `license_sso_oidc_enabled` / `license_sso_saml_enabled` feature flags.

## Conventions

- User-facing strings go in `app/client/src/ce/constants/messages.ts` as exported functions
- Admin settings are declaratively defined in `app/client/src/ce/pages/AdminSettings/config/`
- Server-side services follow the pattern: interface → `*CE.java` (community) → `*CEImpl.java` (implementation) → `*.java` / `*Impl.java` (final, may extend CE)
- Feature flags are defined in `app/client/src/ce/entities/FeatureFlag.ts`

## Important Notes

- The `ee/` directory must maintain parallel structure with `ce/` — do not delete it, but its files can be simplified to re-export CE code
- `APPSMITH_DISABLE_TELEMETRY=true` is the default in `application-ce.properties`
- The upstream uses `com.appsmith` Java package namespace throughout — renaming this is not required for rebranding
