# Student Event Management & Registration Web Application

A visually polished Web Application built using Node.js, Express, and MySQL. It is pre-configured with deliberate SonarQube / SonarCloud issues (SQL Injection, Hardcoded Credentials, Code Smells, Bugs) for a live demonstration of code analysis and GitHub Actions integrations.

## Setup Instructions

1. **MySQL Database**:
   - Ensure local MySQL is running with User: `root` and Password: `admin`.
   - The application automatically initializes the database `eventdb`, creates tables, and seeds dummy registrations on startup.

2. **Installation**:
   ```bash
   npm install
   ```

3. **Running the App**:
   ```bash
   npm start
   ```
   Open `http://localhost:3000` in your web browser.

4. **SonarCloud / SonarQube Integration**:
   - Update `sonar-project.properties` with your actual `sonar.organization` and `sonar.projectKey`.
   - Add `SONAR_TOKEN` to your GitHub Repository Secrets.
   - Push to GitHub to trigger the analysis workflow.
