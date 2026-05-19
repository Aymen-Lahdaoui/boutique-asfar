@echo off
setlocal
echo =======================================================
echo     ASFAR BOUTIQUE - DEMARRAGE DU SERVEUR FRONTEND    
echo =======================================================

:: 1. Verifier si Node.js est installe
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js n'est pas detecte sur votre systeme.
    echo Veuillez installer Node.js version 18 ou superieure pour lancer le frontend.
    echo Vous pouvez le telecharger ici : https://nodejs.org/
    pause
    exit /b
)

:: 2. Aller dans le repertoire du script
cd /d "%~dp0"

:: 3. Verifier si les node_modules existent
if not exist "node_modules" (
    echo [INFO] Premiere execution detectee.
    echo [INFO] Installation des dependances du projet - npm install...
    call npm install
)

:: 4. Démarrer le serveur de développement React + Vite
echo [INFO] Démarrage du serveur de développement Vite...
call npm run dev

pause
