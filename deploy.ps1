# Update-Deploy: im Projektordner ausführen:  .\deploy.ps1 "Commit-Nachricht"
param([string]$msg="update")
git add -A; git commit -m $msg; git push
npx wrangler pages deploy public --project-name leonidaguide
