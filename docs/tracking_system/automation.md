# Automation Mechanisms

## 1. Git Hooks
- `prepare-commit-msg`: Appends task ID and agent signature.
- `post-commit`: Updates the task progress file of the current session in `.tracking/sessions/` with the new commit hash.

## 2. Middleware Service (`track-cli`)
- A standardized entry point:
    - `track start <task-id>`: Initializes session, creates session log file.
    - `track log "message"`: Records an event to current session log.
    - `track stop`: Finalizes session and generates markdown report.

## 3. IDE Integrations
- **VS Code Extension**: "Codebase Tracker"
    - Automatically detects active task from `.tracking/HEAD` (or similar).
    - Prompts user for log entry on file close/save (configurable).
    - Side-panel view of current session logs.
