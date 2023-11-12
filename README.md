RANDOM STRING IN WIN:

    -join ((48..57) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
