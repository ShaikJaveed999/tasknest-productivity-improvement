# TaskNest Productivity Score: Viva Script

**Estimated duration:** 3–5 minutes
**Recording note:** Record yourself on camera while sharing the screen; the script is a guide, not a claim that a video has been recorded.

## 0:00–0:25 — Introduction

“Hello, I’m presenting TaskNest, a task-management application built with React and Vite on the frontend, an Express API on the backend, and PostgreSQL managed through Prisma. This challenge was to make the Productivity Score meaningful and to include important tasks.”

## 0:25–1:10 — Original behavior and problems

“The original score was not calculated solely from task completion. Creating any task added five points to a stored score. Each request that marked a task complete added another ten points, even if it was already completed. Reopening or deleting a task did not remove points. The score endpoint then added a separate bonus based on the number of completed tasks: 1.5 points per task below two completions, or 3.75 points per task at two or more. This mixed a stored value with a changing bonus, so the displayed score could not be explained by the current task list.”

## 1:10–1:50 — Important tasks and scoring

“Tasks now have an important flag, defaulting to false for existing and newly created normal tasks. I can set it in the create form or change it on a task card. Important tasks have a gold indicator. The score is recalculated from the current tasks: a completed normal task is worth one point, and a completed important task is worth two points. Incomplete tasks are worth zero. So one normal completion and one important completion produce three points. Creating a task does not add points.”

## 1:50–2:50 — Live demonstration

“I’ll create a normal task and an important task. The score stays at zero because neither is complete. I’ll complete the normal task, and the score becomes one. Completing the important task increases it to three. If I reopen the important task, its two points disappear; completing it again brings the score back to three, not five. Deleting a completed task also removes its contribution because the score is derived from the task records.”

## 2:50–3:35 — Dashboard and implementation

“The dashboard shows the score, total completed tasks, and important tasks completed. It also explains the point values. API validation accepts only boolean importance and completion values. The Prisma migration adds the field with a false default, preserving existing tasks. There is no authentication in this project, so tasks and the score are shared application-wide rather than isolated by user.”

## 3:35–4:15 — Consistency and verification

“The existing schema does not record completion timestamps or completion history, so a reliable consecutive-day streak cannot be calculated without inventing data. I have not added a streak. The scoring helper has automated tests for empty, incomplete, normal, important, mixed, reopened, deleted, and unchanged task data. I’ll show the actual test and build results from the project.”

## 4:15–4:30 — Conclusion

“The revised score is transparent, reproducible from current task state, and rewards completing important work. Thank you.”

## Recording and Google Drive

1. Use a screen recorder that captures both your webcam and the application screen. Keep your face visible while demonstrating tasks.
2. Record the demonstration after starting the frontend and backend and applying the database migration; show the project running rather than a mock-up.
3. Upload the recording to Google Drive. In **Share**, set **General access** to **Anyone with the link** and select **Editor** if the assignment specifically requires link recipients to edit. This allows anyone with the link to modify the file, so share the link only with the intended evaluator and change access after assessment if appropriate.
4. Copy the actual Drive URL into the submission documentation. No recording or upload is included with this script.
