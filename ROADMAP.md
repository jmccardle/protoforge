# Protoforge Roadmap

## 1. Rebrand: Remove Appsmith Branding

Replace all user-visible "Appsmith" branding with "Protoforge" or transparent placeholders.

### 1.1 Logos and Images

Replace or remove these logo files (swap with Protoforge logos or transparent PNGs):

| File | Usage |
|------|-------|
| `app/client/public/static/img/appsmith-logo.svg` | Login/public pages |
| `app/client/src/assets/images/appsmith_logo.png` | In-app branding |
| `app/client/src/assets/images/appsmith_logo_square.png` | Square variant |
| `app/client/src/assets/images/appsmith_logo_white.png` | Dark background variant |
| `app/client/src/assets/svg/appsmith-logo-no-pad.svg` | Compact logo (used in editor header via `AppsmithLink.tsx`) |
| `app/client/src/assets/svg/appsmith_logo_primary.svg` | Primary SVG logo |
| `app/client/src/assets/images/appsmith-ai.svg` | AI feature branding |
| `static/appsmith_logo_primary.png` | Documentation/static assets |
| `static/appsmith_logo_white.png` | Documentation/static assets |

**Favicon:**
- `app/client/public/static/img/favicon-orange.ico` — replace with Protoforge favicon
- `app/client/public/favicon-black.ico` — replace with Protoforge favicon

### 1.2 HTML and Manifest

- **`app/client/public/index.html`** — Change `<title>Appsmith</title>` to `<title>Protoforge</title>`
- **`app/client/public/404.html`** — Change `<title>Appsmith</title>`, replace inline SVG logo
- **`app/client/public/manifest.json`** — Change `"short_name": "Appsmith App"` → `"Protoforge"`, `"name": "Appsmith Client Web UI"` → `"Protoforge"`
- **`app/client/public/privacy-policy.html`** — Replace "Appsmith Inc." references or replace entire page with Protoforge privacy policy
- **`app/client/public/terms-and-conditions.html`** — Same as above

### 1.3 User-Facing Text in Code

**Primary file:** `app/client/src/ce/constants/messages.ts`
- Line ~10: `"Appsmith Community v1.10.0"` → `"Protoforge"`
- Line ~13: `` `Appsmith ${edition} ${version}` `` → `` `Protoforge ${version}` ``
- Lines ~87-90: Self-hosting and "Using Appsmith?" prompts — reword or remove
- Line ~128: Email reset message mentioning "Appsmith" — reword
- Line ~163: Error message with "Appsmith admin" — change to "Protoforge admin"
- Line ~215: "Learn about Appsmith Partner Program" — remove or reword
- Lines ~325, 459, 472, 492, 497, 510, 526, 605, 612: Various error/support messages — search for "Appsmith" and replace
- Lines ~2111-2118: Branding form labels

**Other code files:**
- `app/client/src/pages/Editor/CustomWidgetBuilder/index.tsx:70` — Page title: `` `${context.name} | Builder | Appsmith` `` → `Protoforge`
- `app/client/src/pages/AppViewer/BrandingBadge.tsx` — "Built on" badge with Appsmith logo; replace logo or remove badge entirely
- `app/client/src/pages/AppViewer/BrandingBadgeMobile.tsx` — Mobile version; links to `https://appsmith.com`; replace or remove
- `app/client/src/pages/Editor/AppsmithLink.tsx` — Logo alt text "Appsmith logo"; update alt text and logo reference
- `app/client/src/ce/pages/AdminSettings/config/general.tsx` — "Hide Appsmith watermark" setting label

### 1.4 Branding Defaults

- **`app/client/src/utils/BrandingUtils.ts`** — Default brand color `#E15615` (Appsmith orange); default logo URLs pointing to `assets.appsmith.com`. Replace defaults with Protoforge branding or self-hosted URLs.

### 1.5 Server-Side

- `app/server/appsmith-server/src/main/resources/application-ce.properties` line 1: `spring.application.name=appsmith-server` — cosmetic, low priority
- `mail.support=support@appsmith.com` and `reply.to=appsmith@localhost` — update to Protoforge email addresses
- Log pattern contains `X-Appsmith-Request-Id` — cosmetic, low priority

---

## 2. Remove Telemetry

Strip all analytics, tracking, and telemetry code from both client and server.

### 2.1 Client-Side Telemetry Removal

**Analytics utilities to gut/no-op:**

| File | System | Action |
|------|--------|--------|
| `app/client/src/utils/Analytics/segment.ts` | Segment | Remove or replace with no-op |
| `app/client/src/utils/Analytics/mixpanel.ts` | Mixpanel session recording | Remove |
| `app/client/src/utils/Analytics/betterbugs.ts` | BetterBugs support widget | Remove |
| `app/client/src/utils/Analytics/smartlook.ts` | Smartlook session recording | Remove |
| `app/client/src/ce/utils/AnalyticsUtil.tsx` | Central analytics orchestrator | Replace all methods with no-ops |
| `app/client/src/instrumentation/index.ts` | OpenTelemetry/Grafana Faro | Remove |
| `app/client/src/instrumentation/generateTraces.ts` | Trace generation | Remove |
| `app/client/src/instrumentation/utils.ts` | Instrumentation utils | Remove |

**Usage pulse (heartbeat telemetry):**
- `app/client/src/usagePulse/index.ts` — Remove or no-op the pulse mechanism
- `app/client/src/usagePulse/utils.ts` — Remove
- `app/client/src/ce/constants/UsagePulse.ts` — Remove

**Redux analytics state:**
- `app/client/src/selectors/analyticsSelectors.ts` — Simplify
- `app/client/src/reducers/uiReducers/analyticsReducer.ts` — Simplify
- `app/client/src/ce/sagas/analyticsSaga.ts` — Remove event-logging side effects
- `app/client/src/sagas/AnalyticsSaga.ts` — Remove event-logging side effects

**Configuration cleanup:**
- `app/client/src/ce/configs/index.ts` — Remove Sentry, Segment, Mixpanel, SmartLook, BetterBugs config loading

**NPM dependencies to remove from `app/client/package.json`:**
- `@segment/analytics-next`
- `@betterbugs/web-sdk`
- `mixpanel-browser`
- `smartlook-client`
- `@sentry/react`, `@sentry/utils`
- `@opentelemetry/api`, `@opentelemetry/sdk-trace-web`, `@opentelemetry/exporter-trace-otlp-http`, `@opentelemetry/instrumentation`
- `@grafana/faro-react` (and related Grafana packages)

### 2.2 Server-Side Telemetry Removal

**Segment integration:**
- `app/server/.../configurations/SegmentConfig.java` — Remove bean definitions or make them permanently disabled
- `app/server/.../services/ce/AnalyticsServiceCEImpl.java` — Replace `sendEvent()`, `identifyUser()`, etc. with no-ops
- `app/server/.../services/AnalyticsServiceImpl.java` — Ensure overrides also no-op

**Domain-specific analytics utilities (make all methods return empty maps / no-ops):**
- `app/server/.../helpers/DatasourceAnalyticsUtils.java`
- `app/server/.../helpers/RunBehaviourAnalyticsUtils.java`
- `app/server/.../git/utils/GitAnalyticsUtils.java`
- `app/server/.../staticurl/StaticUrlAnalyticsUtils.java`

**Sentry:**
- `app/server/appsmith-server/src/main/resources/application-ce.properties` — Clear Sentry config lines (dsn, environment, debug)
- Remove `io.sentry:sentry-spring-boot-starter-jakarta` from `pom.xml`

**Environment variables to remove/ignore:**
- `APPSMITH_SEGMENT_KEY`, `APPSMITH_SEGMENT_CE_KEY`
- `APPSMITH_SENTRY_DSN`, `APPSMITH_SERVER_SENTRY_DSN`, `APPSMITH_SERVER_SENTRY_ENVIRONMENT`
- `APPSMITH_SMART_LOOK_ID`
- `APPSMITH_DISABLE_INTERCOM`

### 2.3 Approach

The safest approach is to **no-op the AnalyticsUtil/AnalyticsService** rather than deleting all call sites. Hundreds of files call `AnalyticsUtil.logEvent()` — deleting every call site is error-prone. Instead:

1. Make `AnalyticsUtil.logEvent()`, `identifyUser()`, `initialize()` into empty functions
2. Make server `AnalyticsServiceCEImpl.sendEvent()` return `Mono.empty()`
3. Remove the third-party SDK dependencies so no telemetry code is bundled
4. Clean up environment variable references in `.env.example` and deployment configs

---

## 3. Remove Enterprise/Business Upsell

Remove all upgrade prompts, business-tier advertisements, and enterprise feature gates from the UI.

### 3.1 Upgrade Pages to Remove

These pages render "Upgrade to Business/Enterprise" instead of actual features:

| File | Feature |
|------|---------|
| `app/client/src/ce/pages/Upgrade/UpgradePage.tsx` | Generic upgrade page container |
| `app/client/src/ce/pages/Upgrade/AccessControlUpgradePage.tsx` | Granular Access Control upsell |
| `app/client/src/ce/pages/Upgrade/AuditLogsUpgradePage.tsx` | Audit Logs upsell |
| `app/client/src/ce/pages/Upgrade/ProvisioningUpgradePage.tsx` | User Provisioning upsell |

**Action:** Delete these files or replace with "Feature not available" stubs without pricing/upgrade CTAs.

### 3.2 Upgrade Banner and Business Tags

- `app/client/src/ce/pages/AdminSettings/Branding/UpgradeBanner.tsx` — Remove the upgrade banner from the branding settings page
- `app/client/src/components/BusinessTag.tsx` — Remove the "Business" premium tag component
- `app/client/src/ce/utils/BusinessFeatures/brandingPageHelpers.tsx` — Simplify; remove UpgradeBanner logic

### 3.3 Admin Settings Entries to Modify

These settings configs show upgrade pages for gated features:

| File | Change |
|------|--------|
| `app/client/src/ce/pages/AdminSettings/config/auditlogs.ts` | Remove or hide this settings entry entirely |
| `app/client/src/ce/pages/AdminSettings/config/provisioning.ts` | Remove or hide this settings entry entirely |
| `app/client/src/ce/pages/AdminSettings/config/userlisting.ts` | Remove or hide this settings entry entirely |
| `app/client/src/ce/pages/AdminSettings/config/branding.tsx` | Remove `isFeatureEnabled` gating; always enable the branding form |

### 3.4 Upgrade Hook and Product Ramps

- `app/client/src/utils/hooks/useOnUpgrade.ts` — Remove or no-op; it drives all upgrade CTAs
- Remove `RampFeature` and `RampSection` enums if they serve no other purpose

### 3.5 Message Constants

In `app/client/src/ce/constants/messages.ts`, remove or replace:
- `BUSINESS_EDITION_TEXT`
- `ENTERPRISE_EDITION_TEXT`
- `EXCLUSIVE_TO_BUSINESS()`
- `AVAILABLE_ON_BUSINESS`
- `AVAILABLE_ON_ENTERPRISE`
- `MOVE_TO_BUSINESS_EDITION()`

### 3.6 Feature Flags

In `app/client/src/ce/entities/FeatureFlag.ts`, the `license_*` flags that gate enterprise features should default to `true` (or the gating checks removed entirely) so that features are unconditionally available:
- `license_branding_enabled` → `true`
- `license_sso_saml_enabled` → `true`
- `license_sso_oidc_enabled` → `true`
- `license_gac_enabled` → `true`
- `license_private_embeds_enabled` → `true`

In `app/client/src/ce/utils/planHelpers.ts`, make all helper functions (`isBrandingEnabled`, `isOIDCEnabled`, `isSAMLEnabled`, `isGACEnabled`, etc.) return `true` unconditionally.

### 3.7 License Helpers

- `app/client/src/ce/utils/licenseHelpers.tsx` — Remove `ShowUpgradeMenuItem`, `Banner` components (they return null in CE anyway, but clean up references)

---

## 4. Implement Generic OIDC Authentication

Add a fully functional generic OIDC provider that works in the community edition, bypassing the `license_sso_oidc_enabled` gate. Model it after the existing Google/GitHub OAuth implementations.

### 4.1 Context: How Google/GitHub Auth Works

**Client flow:**
1. Admin configures client ID + secret in Admin Settings → Authentication → Google/GitHub
2. Settings saved via API → stored as env vars (`APPSMITH_OAUTH2_GOOGLE_CLIENT_ID`, etc.)
3. Login page shows social login buttons based on `thirdPartyAuths` list from server
4. User clicks button → redirected to `/oauth2/authorization/google` (or `/github`)
5. Spring Security handles OAuth2 redirect, callback at `/login/oauth2/code/google`
6. `CustomOAuth2UserServiceCEImpl` processes the OAuth2 user
7. User created/matched in MongoDB, session established

**Key files for reference:**
- Client settings UI: `app/client/src/ce/pages/AdminSettings/config/authentication.tsx` (see `GoogleAuth`, `GithubAuth` configs)
- Login URLs: `app/client/src/ce/constants/ApiConstants.tsx` (`GoogleOAuthURL`, `GithubOAuthURL`)
- Social login buttons: `app/client/src/ce/constants/SocialLogin.tsx`
- Server properties: `app/server/.../resources/application-ce.properties` (Spring Security OAuth2 client registrations)
- OAuth2 user service: `app/server/.../authentication/handlers/ce/CustomOAuth2UserServiceCEImpl.java`
- OIDC user service: `app/server/.../authentication/handlers/ce/CustomOidcUserServiceCEImpl.java`
- Login sources: `app/server/.../domains/LoginSource.java`

### 4.2 What Already Exists for OIDC

The codebase already has OIDC infrastructure that is currently gated behind the enterprise license:

- **`CustomOidcUserServiceImpl.java`** — Server handler for OIDC user loading (extends `CustomOidcUserServiceCEImpl`)
- **`LoginSource.OIDC`** — Already defined in the enum
- **`SettingCategories.OIDC_AUTH`** — Already defined in settings types
- **`OidcAuthCallout`** in `authentication.tsx` — Already defined but gated: `isFeatureEnabled: isOIDCEnabled(featureFlags)` which returns `false` in CE
- **OIDC test env vars suggest required fields:** client ID, client secret, auth URL, token URL, user info URL, JWKS URL

### 4.3 Implementation Plan

#### Step 1: Unlock OIDC in CE Feature Flags

In `app/client/src/ce/utils/planHelpers.ts`:
```typescript
export const isOIDCEnabled = () => true;  // Was: (featureFlags) => featureFlags.license_sso_oidc_enabled
```

This makes `OidcAuthCallout.isFeatureEnabled` return `true`, showing OIDC as a configurable auth method in the admin settings.

#### Step 2: Add OIDC Admin Settings Configuration (Client)

In `app/client/src/ce/pages/AdminSettings/config/authentication.tsx`, add an `OidcAuth` config modeled after `GoogleAuth`:

```typescript
export const OidcAuth: AdminConfigType = {
  type: SettingCategories.OIDC_AUTH,
  categoryType: CategoryType.USER_MANAGEMENT,
  controlType: SettingTypes.GROUP,
  title: "OIDC authentication",
  subText: createMessage(OIDC_AUTH_DESC),
  canSave: true,
  settings: [
    // Client ID
    { id: "APPSMITH_OAUTH2_OIDC_CLIENT_ID", controlType: SettingTypes.TEXTINPUT, label: "Client ID", isRequired: true },
    // Client Secret
    { id: "APPSMITH_OAUTH2_OIDC_CLIENT_SECRET", controlType: SettingTypes.TEXTINPUT, label: "Client secret", isRequired: true },
    // Authorization URL
    { id: "APPSMITH_OAUTH2_OIDC_AUTH_URL", controlType: SettingTypes.TEXTINPUT, label: "Authorization URL", isRequired: true },
    // Token URL
    { id: "APPSMITH_OAUTH2_OIDC_TOKEN_URL", controlType: SettingTypes.TEXTINPUT, label: "Token URL", isRequired: true },
    // User Info URL
    { id: "APPSMITH_OAUTH2_OIDC_USER_INFO", controlType: SettingTypes.TEXTINPUT, label: "User info URL", isRequired: true },
    // JWKS URL
    { id: "APPSMITH_OAUTH2_OIDC_JWKS_URL", controlType: SettingTypes.TEXTINPUT, label: "JWK set URL", isRequired: true },
    // Redirect URL (read-only, computed)
    { id: "APPSMITH_OAUTH2_OIDC_REDIRECT_URL", controlType: SettingTypes.UNEDITABLEFIELD, label: "Redirect URL", value: "/login/oauth2/code/oidc" },
  ],
};
```

Add `OidcAuth` to the `children` array in the main `config` export (alongside `FormAuth`, `GoogleAuth`, `GithubAuth`).

#### Step 3: Add OIDC Login Button (Client)

In `app/client/src/ce/constants/ApiConstants.tsx`:
```typescript
export const OidcOAuthURL = `${OAuthURL}/oidc`;
```

In `app/client/src/ce/constants/SocialLogin.tsx`, add OIDC to the social login list so the login page renders an OIDC button when enabled.

Update `app/client/src/pages/UserAuth/Login.tsx` to check `socialLoginList.includes("oidc")`.

#### Step 4: Register OIDC Provider in Spring Security (Server)

In `app/server/.../resources/application-ce.properties`, add:

```properties
# OIDC
spring.security.oauth2.client.registration.oidc.client-id=${APPSMITH_OAUTH2_OIDC_CLIENT_ID:missing_value_sentinel}
spring.security.oauth2.client.registration.oidc.client-secret=${APPSMITH_OAUTH2_OIDC_CLIENT_SECRET:}
spring.security.oauth2.client.registration.oidc.scope=openid,email,profile
spring.security.oauth2.client.registration.oidc.redirect-uri={baseUrl}/login/oauth2/code/oidc
spring.security.oauth2.client.registration.oidc.client-name=OIDC
spring.security.oauth2.client.registration.oidc.authorization-grant-type=authorization_code
spring.security.oauth2.client.provider.oidc.authorization-uri=${APPSMITH_OAUTH2_OIDC_AUTH_URL:}
spring.security.oauth2.client.provider.oidc.token-uri=${APPSMITH_OAUTH2_OIDC_TOKEN_URL:}
spring.security.oauth2.client.provider.oidc.user-info-uri=${APPSMITH_OAUTH2_OIDC_USER_INFO:}
spring.security.oauth2.client.provider.oidc.jwk-set-uri=${APPSMITH_OAUTH2_OIDC_JWKS_URL:}
spring.security.oauth2.client.provider.oidc.user-name-attribute=email
```

Spring Security auto-discovers OIDC providers from `registration.*` properties. The existing `CustomOidcUserServiceCEImpl` will handle the OIDC user loading automatically since it already processes any OIDC login request.

#### Step 5: Add OIDC to LoginSource Processing

In `app/server/.../domains/LoginSource.java`, verify that `OIDC` is already present and that `LoginSource.fromString("oidc")` resolves correctly.

In the `AuthMain` component in `authentication.tsx`, add OIDC connected state:
```typescript
OidcAuth.isConnected = OidcAuthCallout.isConnected = socialLoginList.includes("oidc");
```

#### Step 6: Server-Side Settings Persistence

Verify that the admin settings API (`/api/v1/admin/env`) can persist the new `APPSMITH_OAUTH2_OIDC_*` environment variables. The existing `EnvManager` service reads from `application-ce.properties` and writes to the docker env file. The new OIDC properties should work automatically since they follow the same `APPSMITH_*` naming convention — but this needs to be verified by checking:
- `app/server/.../configurations/CommonConfig.java` — ensure it doesn't filter out unknown env vars
- `app/server/.../services/ce/EnvironmentServiceCEImpl.java` (or similar) — ensure OIDC vars are in the allowed list

#### Step 7: Environment Variable Documentation

Update `.env.example` to include:
```bash
# OIDC
APPSMITH_OAUTH2_OIDC_CLIENT_ID=
APPSMITH_OAUTH2_OIDC_CLIENT_SECRET=
APPSMITH_OAUTH2_OIDC_AUTH_URL=
APPSMITH_OAUTH2_OIDC_TOKEN_URL=
APPSMITH_OAUTH2_OIDC_USER_INFO=
APPSMITH_OAUTH2_OIDC_JWKS_URL=
```

### 4.4 Testing Checklist

- [ ] OIDC appears as a configurable auth method in Admin Settings → Authentication
- [ ] Admin can enter client ID, secret, and all endpoint URLs and save successfully
- [ ] After configuration, "Sign in with OIDC" button appears on the login page
- [ ] Clicking the button redirects to the OIDC provider's authorization endpoint
- [ ] After authenticating, user is redirected back and a session is established
- [ ] New users are created in MongoDB on first OIDC login
- [ ] Existing users (matched by email) can log in via OIDC without duplicate accounts
- [ ] Tested with at least one real OIDC provider (e.g., Keycloak, Authentik, Auth0)

### 4.5 Risks and Considerations

- The existing `CustomOidcUserServiceCEImpl` may have enterprise-only logic in its EE override (`CustomOidcUserServiceImpl`). Verify the CE implementation handles the full flow independently.
- The `OAuth2PropertiesCustomizer` replaces empty client IDs with `missing_value_sentinel` to prevent Spring Boot startup failures — the OIDC registration must follow this same pattern.
- PKCE support: The `CustomServerOAuth2AuthorizationRequestResolverCE` already adds PKCE parameters for OIDC flows. Verify this works with the new `oidc` registration ID.
- Some OIDC providers use `sub` instead of `email` as the username attribute. Consider making `user-name-attribute` configurable in the admin UI.
