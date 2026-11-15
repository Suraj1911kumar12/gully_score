# GullyScore 🏏

> **Every Ball Counts.**
> Production-ready mobile application foundation for offline-first gully, street, and tennis-ball cricket scoring.

---

## 1. Overview

**GullyScore** is a purpose-built mobile application engineered for informal cricket communities—street players, school and college tournaments, and friends organizing local matches. Built with **React Native**, **Expo (SDK 58)**, **TypeScript (Strict Mode)**, **Expo Router**, and local **SQLite (`expo-sqlite`)**, GullyScore operates **100% offline** with zero backend servers, zero ads, and zero mandatory accounts.

### Phase 1 Foundation Scope
Phase 1 delivers the complete architectural, visual, navigation, state, and persistence foundation:
- **Design System**: Dark-first, high-contrast cricket-inspired visual identity.
- **Navigation Structure**: 8 full screens implemented via Expo Router file-based routing.
- **SQLite Database**: Robust SQLite persistence layer with versioned schema migrations, foreign keys, transactions, and repository pattern.
- **Match Setup & Squad Entry**: Step-by-step match configuration forms with Zod validation and React Hook Form.
- **Scoring & Scorecard UI**: Finished scoring controls (keypad, extras, timelines, fall of wickets) designed to connect seamlessly to the Phase 2 scoring engine.
- **Tactile Feedback**: Haptics integration with user preferences.

---

## 2. Technology Stack & Installed Dependencies

| Technology / Library | Version | Purpose |
|---|---|---|
| **Expo** | `~58.0.25` | Mobile Application Framework |
| **React** | `19.3.0` | UI Library |
| **React Native** | `0.88.1` | Mobile Runtime |
| **Expo Router** | `~58.0.31` | File-based Routing |
| **expo-sqlite** | `~58.0.18` | Offline-First Local Database Engine |
| **expo-haptics** | `~58.0.5` | Tactile Haptic Feedback |
| **lucide-react-native** | `^1.16.0` | Iconography System |
| **react-native-svg** | `^15.15.1` | Vector Graphics Rendering |
| **react-native-reanimated** | `4.7.1` | Micro-interactions and Motion |
| **react-native-safe-area-context** | `~5.11.1` | Safe Area Handling |
| **zustand** | `^5.0.11` | Transient State Management |
| **zod** | `^4.3.6` | Type-safe Validation Schemas |
| **react-hook-form** | `^7.71.1` | Form State and Validation |
| **TypeScript** | `~6.0.3` | Static Type Checker (Strict Mode) |
| **Jest & jest-expo** | `^54.0.17` | Unit and Integration Testing |

---

## 3. Project Directory Architecture

```text
gullyscore/
│
├── app/                                 # Expo Router Screens
│   ├── _layout.tsx                      # Root stack, database init & modal host
│   ├── index.tsx                        # Screen 1: Home Dashboard
│   ├── match/
│   │   ├── create.tsx                   # Screen 2: Create Match (Format & Rules)
│   │   ├── players.tsx                  # Screen 3: Players & Openers Setup
│   │   └── [id]/
│   │       ├── live.tsx                 # Screen 4: Live Scoring Interface
│   │       ├── scorecard.tsx            # Screen 5: Full Scorecard (4 Tabs)
│   │       ├── innings-break.tsx        # Screen 6: Innings Break & Target
│   │       └── result.tsx               # Screen 7: Match Result & Summary
│   └── settings.tsx                     # Screen 8: App Settings & Preferences
│
├── src/
│   ├── theme/                           # Design Tokens
│   │   ├── colors.ts                    # Dark-first cricket palette tokens
│   │   ├── typography.ts                # Scaled typography tokens
│   │   ├── spacing.ts                   # Layout grid spacing tokens
│   │   ├── radius.ts                    # Border radius tokens
│   │   └── index.ts                     # Unified theme export
│   │
│   ├── domain/                          # Pure Domain Contracts & Models
│   │   ├── match.types.ts               # Match, MatchRules, MatchStatus, Toss
│   │   ├── player.types.ts              # Team, MatchPlayer, Openers
│   │   ├── scoring.types.ts             # BallEvent, ScorecardViewModel, Batting/Bowling rows
│   │   └── voice.types.ts               # VoiceIntent, VoiceRecognitionState
│   │
│   ├── database/                        # Local SQLite Foundation
│   │   ├── schema.ts                    # DDL (8 relational tables, indexes, triggers)
│   │   ├── sqlite.ts                    # SQLite singleton & transaction coordinator
│   │   ├── migrations/
│   │   │   └── index.ts                 # Version-tracked idempotent migrations runner
│   │   └── repositories/
│   │       ├── matches.repository.ts    # Match draft & ready persistence
│   │       ├── players.repository.ts    # Match squads & openers persistence
│   │       ├── settings.repository.ts   # Persistent key-value settings
│   │       └── scoring.repository.ts    # Contracts for Phase 2 scoring events
│   │
│   ├── stores/                          # Zustand Stores
│   │   ├── matchDraft.store.ts          # Setup draft state & DB synchronization
│   │   ├── settings.store.ts            # Persistent settings store
│   │   └── ui.store.ts                  # Modals & transient presentation state
│   │
│   ├── components/
│   │   ├── ui/                          # Reusable Primitive Components
│   │   │   ├── AppText.tsx              # Typography with 10 variants
│   │   │   ├── AppButton.tsx            # Button with press animations & haptics
│   │   │   ├── AppCard.tsx              # Elevated dark surface container
│   │   │   ├── AppInput.tsx             # Validated input field
│   │   │   ├── AppBadge.tsx             # Status tag badge
│   │   │   ├── AppDivider.tsx           # Layout divider line
│   │   │   ├── AppIconButton.tsx        # Circular/square tactile icon button
│   │   │   ├── AppModal.tsx             # Accessible centered dialog
│   │   │   ├── AppBottomSheet.tsx       # Bottom slide-up sheet
│   │   │   ├── AppHeader.tsx            # Screen navigation bar
│   │   │   ├── AppEmptyState.tsx        # Cricket-themed empty state
│   │   │   ├── AppLoadingState.tsx      # Database & screen spinner
│   │   │   ├── AppScreen.tsx            # Safe-area & keyboard container
│   │   │   └── Phase2NoticeModal.tsx    # Informational modal for deferred actions
│   │   │
│   │   ├── match/                       # Match Setup Components
│   │   │   ├── MatchCard.tsx            # Match list history card
│   │   │   ├── TeamNameInput.tsx        # Styled team input with badges
│   │   │   ├── OversSelector.tsx        # Preset chips (2, 3, 5, 6, 10, 20) + Stepper
│   │   │   ├── PlayerCountSelector.tsx  # Squad count stepper (3 to 11)
│   │   │   ├── MatchRulesCard.tsx       # Expandable rules & extras toggles
│   │   │   └── TossSelector.tsx         # Toss winner & decision selector
│   │   │
│   │   ├── scoring/                     # Live Scoring Components
│   │   │   ├── LiveScoreHeader.tsx      # Match info & innings header
│   │   │   ├── ScoreboardCard.tsx       # High-contrast 48/2 primary scoreboard
│   │   │   ├── BatterScoreRow.tsx       # Rahul * and Aman batting stats
│   │   │   ├── BowlerScoreRow.tsx       # Active bowler figures & economy
│   │   │   ├── CurrentOverTimeline.tsx  # Scrollable ball-by-ball delivery timeline
│   │   │   ├── RunButtonGrid.tsx        # Primary scoring keypad (0-6, W)
│   │   │   ├── ExtrasActionBar.tsx      # WD, NB, BYE, LB, PEN buttons
│   │   │   ├── WicketActionButton.tsx   # Danger-themed wicket trigger
│   │   │   └── ScoringActionPanel.tsx   # Scoring keypad container
│   │   │
│   │   └── voice/                       # Voice Components
│   │       ├── VoiceScoringButton.tsx   # Animated mic CTA button
│   │       ├── VoiceStatusIndicator.tsx # Idle/Listening/Processing status
│   │       └── VoiceCommandPreview.tsx  # Sample voice intent prompts
│   │
│   ├── utils/                           # Utilities
│   │   ├── uuid.ts                      # RFC4122 UUID v4 generator
│   │   ├── validation.ts                # Zod schemas for forms
│   │   └── haptics.ts                   # Tactile feedback wrapper
│   │
│   └── mocks/
│       └── previewData.ts               # Cleanly segregated Phase 1 preview fixtures
│
└── tests/                               # Jest Test Suite
    ├── unit/
    │   ├── validation.test.ts           # Schema validation tests
    │   ├── matchDraft.store.test.ts     # Store state tests
    │   └── settings.store.test.ts       # Settings store tests
    ├── database/
    │   └── schema.test.ts               # SQLite schema & migration tests
    └── components/
        └── ui.test.tsx                  # Component rendering tests
```

---

## 4. SQLite Schema Summary

The local SQLite database (`gullyscore.db`) enforces relational integrity with foreign keys enabled (`PRAGMA foreign_keys = ON;`) across 8 core tables:

1. **`schema_migrations`**: Tracks applied incremental database versions.
2. **`app_settings`**: Key-value persistent preferences (scoring language, haptics, voice alerts, default overs/players).
3. **`matches`**: Core match entity storing format overs, balls per over, rules, toss, status (`DRAFT`, `READY`, `LIVE`, `INNINGS_BREAK`, `COMPLETED`, `ABANDONED`), and opener IDs.
4. **`match_teams`**: Team records with normalized names and sides (`TEAM_A`, `TEAM_B`).
5. **`match_players`**: Squad members for each team with batting order.
6. **`innings`**: Innings tracking table prepared for Phase 2 scoring engine.
7. **`ball_events`**: Detailed ball-by-ball audit trail prepared for Phase 2 scoring engine.
8. **`event_corrections`**: Audit trail for undos and delivery edits.
9. **`match_snapshots`**: Serialized state snapshots for instant recovery.

---

## 5. Screen Inventory

| Route | Screen | Purpose & Status |
|---|---|---|
| `/` | **Home Dashboard** | Branding, cricket-pitch hero CTA, recent matches from SQLite, empty state, offline features summary. |
| `/match/create` | **Create Match** | Form for team names, overs (2, 3, 5, 6, 10, 20, custom), squad size (3–11), rules, and toss. Zod validated. |
| `/match/players` | **Players Setup** | Team A / Team B squad entries, temporary auto-labels, striker, non-striker, and opening bowler selectors. Saves match as `READY` to SQLite. |
| `/match/[id]/live` | **Live Scoring Interface** | Visual showcase: Section A (Header), Section B (Scoreboard `48/2`), Section C (Batting `Rahul *`), Section D (Bowling `Bumrah`), Section E (Timeline), Section F (Scoring keypad), Section G (Voice scoring). Controls provide tactile feedback and informational triggers. |
| `/match/[id]/scorecard` | **Full Scorecard** | 4-tab professional layout: Batting, Bowling, Fall of Wickets, Ball History. |
| `/match/[id]/innings-break`| **Innings Break** | First innings score summary, target chase calculation, and second innings openers selector. |
| `/match/[id]/result` | **Match Result** | Trophy presentation, winner badge, team scorecards comparison, Player of the Match, and share options. |
| `/settings` | **Settings** | Scoring language (Hindi, English, Hinglish), haptics toggle, voice announcements, match defaults. Persists to SQLite. |

---

## 6. Setup & Run Instructions

### Prerequisites
- Node.js `v20+` or `v22+`
- npm `v10+` or `v11+`

### Installation
```bash
# Clone and enter workspace
cd gullyscorer

# Install dependencies
npm install
```

### Running the Application
```bash
# Start Expo development server
npx expo start

# Run on Android emulator / connected device
npm run android

# Run on iOS simulator (requires macOS)
npm run ios

# Run web preview
npm run web
```

### Running Verification & Tests
```bash
# Run strict TypeScript type checks
npm run lint

# Run Jest test suites
npm test

# Run Expo project health checks
npx expo-doctor
```

---

## 7. Working vs. Deferred Functionality

### Working in Phase 1
- Full Expo Router navigation across all 8 screens.
- Dark-first custom design system with custom components.
- SQLite database initialization, versioned migrations, and transactions.
- Match creation and draft persistence to SQLite.
- Custom team names and player squad setup (3 to 11 players).
- Opening batter and bowler selection with validation.
- Settings persistence (language, haptics, default overs, squad sizes).
- Tactile haptic feedback on button interactions.
- Metro bundling and Hermes bytecode compilation verified.

### Intentionally Deferred to Phase 2
- **Cricket Scoring Engine**: Calculation of runs, wickets, strike rotation, run rates, and innings transitions.
- **Microphone / Speech Recognition**: Real-time voice processing and natural language command parsing.
- **Historical Statistics Aggregation**: Long-term player records or tournament standings.
