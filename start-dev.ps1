Write-Host "Starting Zenvoice Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\nisht\Zenvoice\server; npm start"

Write-Host "Starting Zenvoice Frontend..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\nisht\Zenvoice; npm run dev"

Write-Host "Both servers starting!" -ForegroundColor Yellow