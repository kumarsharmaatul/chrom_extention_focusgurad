# Lessons Learned (Mistakes & Fixes)

## Chrome extensionPath Redirect Constraints
- **Mistake**: Tried to pass query parameters dynamically in `declarativeNetRequest` rule's `extensionPath` redirect action, and later attempted regex dynamic generation. Both had edge-case validation issues in Chrome.
- **Lesson**: The `extensionPath` property must be a static path and strictly forbids query/fragment parameters. While `regexFilter` with `regexSubstitution` works in some scenarios, it is prone to regex compilation failures and memory limits in MV3. The most robust, foolproof method is to use standard `urlFilter` with a purely static `extensionPath` (e.g., `"/blocked.html"`) without any query variables. It guarantees all adult and custom sites are blocked securely.

## DeclarativeNetRequest Rule ID Race Conditions
- **Mistake**: Allowed `updateBlockingRules()` to execute concurrently on startup, installation, and storage changes.
- **Lesson**: When writing async dynamic rules updates in Chrome, concurrent calls to `updateDynamicRules` read the same old state before writing new ones, resulting in a `Rule with id X does not have a unique ID` validation error. Always implement a concurrency lock/mutex and clean up redundant initialization calls to serialize rulesets.

## Manifest V3 CSP Inline Script Constraints
- **Mistake**: Left inline `<script>` tags and inline attributes like `onclick="..."` on buttons in `blocked.html`.
- **Lesson**: Chrome Extension Manifest V3 enforces a strict Content Security Policy (CSP) that blocks all inline execution. All JavaScript logic must be moved to an external script file (e.g. `blocked.js`), referenced via `<script src="..."></script>`, and event listeners must be registered dynamically via `.addEventListener()` on DOM content load.

## WebSocket Centralization
- **Mistake**: Initially added WebSocket script only to `dashboard.html`.
- **Lesson**: Trading bots need real-time data on multiple pages (Ledger, Portfolio). Always centralize WebSocket logic in `base.html` and use `data-instrument` attributes for generic updates.

## Historical Data Consistency
- **Mistake**: Added new fields to `Trade` model but didn't populate them for existing trades.
- **Lesson**: When adding metadata fields (like strike price), always run a "healing" script to update existing records if possible, so the UI stays consistent.

## Upstox IP Restrictions
- **Mistake**: Interpreting 403 Forbidden as just an Auth error.
- **Lesson**: Upstox error `UDAPI1154` specifically means Static IP restriction. Always provide clear UI instructions for the user to fix this in the developer portal.

## UI-Driven State Enforcement
- **Lesson**: When hiding UI elements that control state (like toggles), ensure the underlying logic forces the desired state upon initialization. Simply hiding a checked checkbox doesn't guarantee the state is `true` in storage if it was previously `false`. Force-update storage on load to match the new restricted UI.
