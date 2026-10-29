# TaskNest Productivity Score Improvements

## 1. Project overview

TaskNest is a React 19/Vite client and an Express 5 API backed by PostgreSQL through Prisma 7. The API exposes `/tasks` and `/score`. There is no authentication or user identity in the inspected code; the database therefore represents one shared set of tasks and one shared score.

## 2. Existing Productivity Score implementation

Task creation, completion, score retrieval, and the extra momentum calculation were implemented in `server/controllers/taskController.js`, `server/controllers/scoreController.js`, and `server/utils/scoreHelper.js`.

## 3. Original formula

The original stored score began at zero when no `Score` record existed. Creating a task added 5 to the first stored score, or created a score with value 5. Every request setting a task's `completed` field to true added another 10, including repeated requests for a task already marked complete.

The GET `/score` endpoint returned:

`floor(storedScore + momentumBonus)`

where `momentumBonus` was 1.5 times the number of completed tasks when there were fewer than two, and 3.75 times the number of completed tasks when there were two or more. The score endpoint floored the combined sum. The completed-task count was read from the current task table, but the stored score was cumulative.

## 4. Original action behavior

- Creating a task increased the stored score by 5 whether it was completed or not.
- Completing a task increased the stored score by 10. Repeating the completion update increased it again.
- Reopening a task did not subtract the stored points; it only reduced the dynamic bonus if the completed-task count crossed a threshold.
- Deleting a task did not subtract stored points; it only changed the dynamic bonus.
- Reloading the dashboard fetched the score again, recombining the stored score and current completed-task bonus. The displayed value could therefore change after task edits/deletes without corresponding adjustments to the stored score.
- The `Score` and `Task` records had no user relationship, so the score was not isolated by user. The UI also displayed a fixed “High Energy Today” badge unrelated to recorded activity.

## 5. Confirmed problems

The code confirms that task creation and repeated completion inflated the stored score, and reopening/deleting tasks left those accumulated points behind. The stored component and completed-task bonus made the result inconsistent with current task state. There was no importance field, no input validation for task title/completion, no completion timestamp, and no authentication/user ownership.

These are source-inspection findings. A live database was not available in the workspace, so database-backed behavior has not been exercised here.

## 6. Requirement interpretation

Award points only for completed tasks, give explicitly important tasks greater weight, derive the score from persisted task state, and make the result understandable in the UI. Do not claim a streak without reliable completion history.

## 7. Final formula

`score = (completed normal tasks × 1) + (completed important tasks × 2)`

Incomplete tasks contribute zero. There is no maximum, date window, multiplier, or bonus. For example, one completed normal task plus one completed important task gives `1 + 2 = 3` points. A missing `important` value is treated as normal in the scoring helper for backward compatibility.

The score endpoint derives the score and supporting counts from the task rows on every read. Creating tasks does not change it; completing/reopening/deleting tasks updates it through the current task state. Re-reading unchanged tasks does not award points again.

## 8. Important-task implementation

The Prisma `Task` model now has `important Boolean @default(false)`. The create API defaults this field to false and rejects non-boolean values. PATCH accepts boolean `completed` and/or `important` fields, rejects unsupported fields and invalid types, and responds with 400 for malformed IDs and 404 for nonexistent task records. The UI provides importance controls both during creation and on task cards, with a visible badge and gold border.

## 9. Database and API changes

An additive PostgreSQL migration adds the column with a false default and safely creates the original tables if applying to a new database. Existing task rows are kept and receive `important = false`. The existing `Score` model/table is retained for compatibility but is no longer read or updated by score calculation.

Task endpoints now validate titles, IDs, and boolean fields, and return explicit errors. Prisma 7 requires a PostgreSQL driver adapter at runtime; `@prisma/adapter-pg` and `pg` are configured through one shared Prisma client. The API URL can be configured through `client/.env` using `VITE_API_URL`; the example file contains the local default.

## 10. Frontend changes

The score card shows the value, completed-task count, important-completed count, and the scoring rules. Task cards can toggle completion and importance and display API errors. Task creation can mark a task important. Dashboard/task loading errors are shown to the user. The client API helper rejects non-success responses instead of silently parsing error payloads.

## 11. Consistency or streaks

No streak is implemented. The original task schema only records creation time and a current completion boolean. It has no completion timestamp/event history, so it cannot establish which distinct days had task completions. No historical completion data has been invented.

## 12. Edge cases and backward compatibility

- An empty task list yields zero score and zero counts.
- Incomplete tasks yield zero points regardless of importance.
- Existing records default to normal importance through the migration.
- Missing `important` fields supplied to the pure scoring helper are treated as normal.
- Reopening or deleting a task removes its contribution on the next score read.
- No score ceiling is applied.
- Because the application has no authentication or ownership model, data and score remain shared globally; user isolation is not claimed.
- The seed script no longer deletes existing tasks or scores. It inserts its sample tasks only if the task table is empty.

## 13. Important files

- `server/prisma/schema.prisma`: persisted task importance.
- `server/prisma/migrations/20261029120000_productivity_scoring/migration.sql`: additive database migration.
- `server/controllers/taskController.js`: API validation and task writes without score increments.
- `server/controllers/scoreController.js`, `server/utils/scoreHelper.js`, and `server/utils/taskValidation.js`: derived score and validated task input.
- `server/utils/prisma.js`: shared Prisma 7 PostgreSQL adapter/client.
- `server/tests/scoreHelper.test.js` and `server/tests/taskValidation.test.js`: scoring and input-validation behavior tests.
- `server/package.json` and `server/package-lock.json`: Prisma PostgreSQL adapter and `pg` dependencies.
- `server/prisma/seed.js`: non-destructive sample seeding.
- `client/src/services/api.js`: configurable API endpoint and HTTP errors.
- `client/src/components/TaskForm.jsx`, `TaskCard.jsx`, and `ScoreWidget.jsx`: importance controls and score presentation.
- `client/src/pages/Dashboard.jsx` and `Tasks.jsx`: visible task-loading errors.
- `client/src/index.css`: importance and score styles.
- `README.md`, `.gitignore`, `client/.env.example`, and `server/.env.example`: setup, environment, and secret/build-file handling.
- `Video-Explanation-Script.md`: viva script and recording guidance.

## 14. Testing performed

- `npm test` from `server`: passed (11 tests covering score calculations and task input validation).
- `npm run lint` from `client`: passed.
- `npm run build` from `client`: passed.
- `npx prisma validate` passed with a placeholder PostgreSQL URL; this validates the schema without connecting to a database.
- `npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script` passed and confirmed the expected PostgreSQL Task and Score columns.
- `npx prisma generate` passed with the project-pinned Prisma CLI.
- `npm start` from `server` successfully started the Express API on port 5000 after configuring the Prisma PostgreSQL adapter.
- An HTTP POST to `/tasks` with a non-boolean `important` value was rejected with HTTP 400 as expected.
- PostgreSQL integration and migration application require a configured `DATABASE_URL` and reachable database; no database URL was provided.

## 15. Setup

1. Install dependencies with `npm install` in both `server` and `client`.
2. Copy `server/.env.example` to `server/.env` and set `DATABASE_URL` for PostgreSQL.
3. From `server`, run `npx prisma generate`, `npx prisma migrate deploy`, and optionally `npm run prisma:seed` (the seed now preserves nonempty task data). Prisma 7 uses the PostgreSQL driver adapter configured in `server/utils/prisma.js`.
4. Start the API with `npm run dev` in `server`.
5. Copy `client/.env.example` to `client/.env` if needed and set `VITE_API_URL` to the API origin.
6. Start the client with `npm run dev` in `client`.

## 16. Environment variables

- `DATABASE_URL`: PostgreSQL connection string used by Prisma. Do not commit its secret value.
- `PORT`: optional Express listening port; defaults to `5000`.
- `VITE_API_URL`: optional client API origin; defaults to `http://localhost:5000`.

No actual `.env` files or credentials are included.

## 17. Migration and deployment instructions

Back up the database, configure `DATABASE_URL`, and run `npx prisma migrate deploy` from `server` before deploying the updated API. The migration is additive and uses a false default for existing tasks. Deployment was not attempted because no deployment account/service configuration is present in the workspace.

## 18. Known limitations

- The score is global because the project has no authentication or task ownership.
- There is no completion history, so no daily streak or historical productivity metric is available.
- The database/API could not be exercised without PostgreSQL connection credentials.
- API CORS is currently unrestricted in the original server configuration; configure a production origin allowlist before a public deployment.
- `npm ci` reported dependency audit advisories (server: 21 — 6 moderate, 14 high, 1 critical; client: 16 — 2 low, 2 moderate, 12 high). The server count was unchanged after adding the Prisma adapter. No `npm audit fix` was run because dependency-tree remediation is outside the scoring change and could introduce unrelated upgrades.

## 19. Frontend deployment

Pending. No verified deployment URL.

## 20. Backend deployment

Pending. No verified deployment URL.

## 21. GitHub repository

Repository: https://github.com/ShaikJaveed999/tasknest-productivity-improvement

The implementation was pushed to `feature/productivity-score-improvement`. Its PR targets `main`. The original local commits are retained on the local `local-submission-history` branch; the published feature branch contains the completed project snapshot.

## 22. Pull Request

Pull Request: https://github.com/ShaikJaveed999/tasknest-productivity-improvement/pull/1

The PR was created in the new personal repository from `feature/productivity-score-improvement` into `main`. It is not a PR against the Kalvium upstream repository.

## 23. Video explanation

Script: `Video-Explanation-Script.md`. No video has been recorded or uploaded, and no Drive URL is available. The script explains how to record with your face visible and how to set the requested link-sharing permission.
