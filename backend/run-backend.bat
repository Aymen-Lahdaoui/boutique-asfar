@echo off
setlocal
echo =======================================================
echo     ASFAR BOUTIQUE - DEMARRAGE DU SERVEUR BACKEND     
echo =======================================================

:: 1. Verifier si Java est installe
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Java JDK n'est pas detecte sur votre systeme.
    echo Veuillez installer Java JDK 17 ou plus recent pour lancer le projet.
    echo Vous pouvez le telecharger ici : https://adoptium.net/
    pause
    exit /b
)

:: 2. Verifier si Maven est deja installe globalement
where mvn >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Maven est installe globalement. Lancement...
    call mvn spring-boot:run
    goto :end
)

:: 3. Si Maven est absent, installer un Maven portable localement
echo [INFO] Maven n'est pas installe globalement.
set LOCAL_MAVEN_DIR=%~dp0.maven
set MAVEN_ZIP=%LOCAL_MAVEN_DIR%\maven.zip
set MAVEN_HOME=%LOCAL_MAVEN_DIR%\apache-maven-3.9.6
set PATH=%MAVEN_HOME%\bin;%PATH%

if exist "%MAVEN_HOME%\bin\mvn.cmd" (
    echo [INFO] Utilisation de la version portable locale de Maven...
    call mvn spring-boot:run
    goto :end
)

echo [INFO] Installation automatique d'une version portable de Maven...
mkdir "%LOCAL_MAVEN_DIR%" >nul 2>&1

echo [INFO] Telechargement de Apache Maven v3.9.6...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip' -OutFile '%MAVEN_ZIP%'"

if not exist "%MAVEN_ZIP%" (
    echo [ERREUR] Impossible de telecharger Maven automatiquement.
    echo Verifiez votre connexion internet ou installez Maven manuellement.
    pause
    exit /b
)

echo [INFO] Extraction de l'archive...
powershell -Command "Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%LOCAL_MAVEN_DIR%' -Force"
del "%MAVEN_ZIP%"

echo [INFO] Maven portable installe avec succes !
echo [INFO] Lancement du serveur Spring Boot...
call mvn spring-boot:run

:end
pause
