Get-ChildItem -Path 'c:\Users\test\Desktop\DIASPARK UI\diaspark-retail\src' -Recurse -Include *.jsx,*.js | ForEach-Object {
    $content = [System.IO.File]::ReadAllText($_.FullName)
    if ($content.Contains('localhost:5001')) {
        $content = $content.Replace('localhost:5001', 'localhost:5000')
        [System.IO.File]::WriteAllText($_.FullName, $content)
        Write-Output ("Fixed: " + $_.Name)
    }
}
