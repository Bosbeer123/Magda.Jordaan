@echo off
REM Double-click to save every change and push it to GitHub. Netlify then publishes the site.
cd /d "%~dp0"
echo Saving and pushing the website...
echo.
git add -A
git commit -m "Update %date% %time:~0,5%"
git push
echo.
if errorlevel 1 (
  echo Something went wrong. Take a screenshot of this window and send it to Claude.
) else (
  echo Done. Netlify will publish the new version in about a minute.
)
echo.
pause
