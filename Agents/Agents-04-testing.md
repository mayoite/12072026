# Testing

- Test real behavior.
- Never suppress failures or skips.
- Tests must not mutate canonical catalog files.
- Use temporary fixtures and cleanup in `finally`.
- Run focused checks during work.
- UI acceptance requires a browser check.
- Store raw output under `results/<track>/<run-id>/`.
- Never treat result files as completion status.
- Record fresh commands in the relevant checklist.
