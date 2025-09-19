# OPie — Features, Architecture & Migration Notes

Purpose
- Give Copilot and engineers a compact source-of-truth describing current behavior and the target multi-server, DB-driven design with a web control panel.

High-level goals
- Multi-server: per-guild persistent config (DB) instead of static files / global Collections.
- Web control panel: OAuth2-authenticated UI for moderators to manage triggers, jobs, prompts, and enabled commands.
- Workers: separate real-time gateway bot from scheduled/long-running jobs and OpenAI/RAG operations.
- Per-server OpenAI prompts & RAG: server-specific system prompts and optional Chroma-based retrieval.
- Permission model: only designated roles or server admins can edit server settings.

Observed behavior (from existing code)
- Events: ready (presence, load jobs), messageCreate (triggers, AI replies, attachment rate-limits, milestones, boosts), messageDelete, guildMemberUpdate, interactionCreate (slash & button handling).
- Jobs: cron-based rollCallPoll that posts/pins polls.
- Reactions: regex-triggered reaction modules in /reactions.
- Modules: optionsComponents (button UI), openaiChat/openaiCommand/openaiEmoji (OpenAI wrappers), chromaClient (RAG).
- Commands: dynamic slash command loader from /commands.
- Settings: short-lived in-memory Collections (client.params) with defaults from options.json.

Recommended persistent schema (relational or document)
- servers
  - id (guild id), name, icon, settings JSON, mod_roles[], timezone, createdAt, updatedAt
- commands
  - id, server_id, name, enabled, metadata
- triggers
  - id, server_id, name, regex, action_type (react/post/exec_command), action_payload JSON, enabled
- jobs
  - id, server_id, name, cron, payload (message / action), enabled, pinned, last_run
- openai_prompts
  - id, server_id, name, role (system/mod/booster/user), content, priority
- reactions (optional alternative to triggers)
  - id, server_id, regex, emoji(s), response, rate_limits
- audits
  - id, server_id, actor_id, action, details, timestamp

API endpoints (examples)
- GET/PUT /api/servers/:serverId/settings
- GET/POST/PUT /api/servers/:serverId/triggers
- GET/POST/PUT /api/servers/:serverId/jobs
- POST /api/servers/:serverId/jobs/:id/execute-now
- GET/POST /api/servers/:serverId/prompts
- GET /api/servers/:serverId/commands
Authentication
- Web UI uses Discord OAuth2; backend verifies user is mod/admin of the guild or holds a mod role defined in servers.settings.

Bot vs Worker responsibilities
- Bot (gateway)
  - Immediate: event handling (slash commands, button interactions), quick replies, cache server settings (LRU with TTL), enqueue heavy jobs.
  - Small tasks only; forward heavy OpenAI/RAG jobs to workers.
- Workers
  - JobRunner: monitor jobs table and execute scheduled tasks (posting, pin/unpin).
  - ReactorWorker: optional async regex evaluation for heavy I/O.
  - OpenAIWorker: perform chat completions and RAG, store debug logs if enabled.

OpenAI/RAG best practices
- Per-server prompts prioritized by openai_prompts.priority.
- Build messages: system prompts (server), relevant RAG docs, user context (limit tokens).
- Rate limiting: global and per-server quotas; configurable via settings.
- Debugging: store prompts/responses as optional DB entries or S3 objects, not always as local files.

Chroma integration
- Keep chromaClient but adapt it to accept collection names and server-level toggles.
- Return filtered+sorted results and only include in prompt when relevance < threshold.

Migration plan (priority)
1. Create DB schema and minimal API for server settings and prompts.
2. Modify bot to read settings from DB on guild join and cache them. Replace client.params with per-guild cache.
3. Replace static jobs loader with jobs table polled by JobRunner worker; keep cron implementation as reference.
4. Move reaction modules to database-driven triggers (regex + action payload).
5. Refactor OpenAI modules to accept serverId and use server prompts; extract RAG calls into OpenAIWorker.
6. Build web control panel endpoints and OAuth2 flow; expose safe APIs to moderators.
7. Add audits/logs and a debug toggle to store OpenAI inputs/outputs externally.
8. Fully remove static options.json where appropriate (keep as seed/defaults).

Implementation notes / tips
- Use an ORM (Prisma/TypeORM) or ODM (Mongoose) so schema evolution is predictable.
- Consider BullMQ + Redis for scheduling/execution and retries (replace cron for scalability).
- Keep existing modules' public interfaces where possible to simplify refactor (e.g., openaiChat(message, serverId)).
- Unit-test regex triggers and job payload execution (posting/pinning) with a mocked Discord client.
- Preserve filenames and behavior while incrementally swapping in DB-backed implementations.

Priorities
- Immediate: DB + per-guild settings cache, preserve current behavior.
- Short-term: job runner, triggers API, OpenAI prompt storage.
- Mid-term: Web UI, OpenAI worker, RAG tuning.
- Long-term: horizontal scaling, multi-worker orchestration, analytics.

Summary
- Replace static config with DB-backed per-server configs.
- Provide a web UI to allow moderators to manage triggers, jobs, prompts, and commands.
- Separate real-time events (bot) from scheduled/heavy tasks (workers).
- Keep existing behavior as compatibility layer while migrating.
