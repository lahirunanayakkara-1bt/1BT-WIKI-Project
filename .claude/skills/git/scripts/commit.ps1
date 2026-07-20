param (
    [string]$commitMessage
)

function Commit {
    param (
        [string]$commitMessage
    )

    Write-Host "Committing changes with message: $commitMessage"
    git add .
    git commit -m $commitMessage
}

Commit -commitMessage $commitMessage