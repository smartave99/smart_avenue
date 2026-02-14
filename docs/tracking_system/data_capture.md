# Data Capture Strategy

## 1. Implementation Plans
- Plans must be created before execution.
- Format: Markdown with specific headers (Objective, Proposed Changes, Verification).
- Status tracking: Metadata updates in the file (e.g., `status: in-progress`, `completed: 45%`).

## 2. Code Diffs Mapping
- **Mechanism**: The `track-cli` triggers on file save or git stage.
- **Mapping**: Computes diffs and links them to the active `TRACKING_TASK_ID`.
- **Storage**: Diffs are referenced by commit hash, not duplicated, unless strictly necessary for granular replay.

## 3. Chat & Context Capture
- **AI Tools**: Agents dump conversation summaries or full logs to `.tracking/sessions/`.
- **IDEs**: Plugin (VS Code/JetBrains) listens for chat events and writes to the session log at user request or automatically.

## 4. Privacy & Security
- **PII Stripping**: Regex-based filtering for emails, keys, and tokens before writing logs.
- **Access Control**: `.tracking/` directory included in git but sensitive sub-folders (like internal chat logs if private) can be gitignored or encrypted.
