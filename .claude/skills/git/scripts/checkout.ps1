param (
    [string]$branchName
)

function Checkout {
    param (
        [string]$branchName
    )

    Write-Host "Checking out branch: $branchName"
    git checkout -b $branchName
}

Checkout -branchName $branchName