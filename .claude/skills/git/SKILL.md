# Git branch and commit workflow

Use this skill when you need to switch branches or commit changes in this repository.

## Required scripts

Use the PowerShell helpers in the scripts folder for these operations:

- Checkout a branch:
  - PowerShell: `pwsh -File .claude/skills/git/scripts/checkout.ps1 -branchName <branch-name>`
- Commit staged changes:
  - PowerShell: `pwsh -File .claude/skills/git/scripts/commit.ps1 -commitMessage <message>`

## Branch naming rules

Branch names must follow the repository convention:

- `feature/[owner]-[task-id]-[slug]`
- Example: `feature/lahiru-A-01-google-oauth`

Do not create a branch name that does not follow this pattern.

## Commit message rules

Commit messages must follow the repository convention:

- `[TASK-ID]-[OWNER]-[ROLE] type(scope): short description`
- Example: `[A-01]-[LN]-[AUTH] feat(auth): add Google OAuth domain restriction`

Role tags must be one of:

- `AUTH` for authentication
- `AUTHZ` for authorization
- `ACCT` for user account
- `CONTENT` for content authoring
- `MOD` for content moderation
- `PUB` for content publishing
- `ENGAGE` for engagement
- `NOTIF` for notification
- `AI` for AI integration
- `DASH` for analytics dashboard

## Workflow guidance

1. Confirm the intended branch name before checking it out.
2. Use the checkout script to switch to the correct branch.
3. Make the required code changes.
4. Ensure the branch and commit message both comply with the repository rules before committing.
5. Use the commit script to stage and commit changes with a properly formatted message.

If the task identifier, owner, or role is unclear, ask for clarification instead of guessing.
