# Project Mandates

## Session Recovery Habit
- **Persistence:** At the end of every significant task or phase, write a summary of current progress, last processed chunks, and "next steps" to `C:/Users/901479/.gemini/tmp/bionic/memory/session_state.md`.
- **Initialization:** At the start of every new session, immediately read `C:/Users/901479/.gemini/tmp/bionic/memory/session_state.md` to restore context and avoid redundant re-analysis of the codebase.
- **Efficiency:** Use this state to skip general research turns if the previous state is still valid.

## Context Efficiency
- Favor reading `session_state.md` over re-scanning the entire `src` directory if the task is a continuation of the previous session.
