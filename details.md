Create a visually polished, production-style Student Event Management & Registration Web Application using Node.js, Express, and MySQL (mysql2) designed for a live SonarQube / SonarCloud GitHub Actions demonstration.

1. UI / Frontend Requirements (Must look modern, not a plain text screen):
- Serve clean semantic HTML/CSS directly via Express static files (public/index.html, public/style.css, public/app.js).
- Clean Dark/Light modern theme with responsive CSS cards, badges, statistics counters (Total Registrations, Active Events, Flagged Entries), and an interactive data table with search/filter.
- Include a working form to add new event registrations that updates the table asynchronously via fetch API.

2. Backend & Database Configuration:
- MySQL config with User: 'root', Password: 'admin', Database: 'eventdb', Host: 'localhost'.
- Include an automatic schema initialization script (or init query inside db.js) that creates the database and table if not exists with 3 dummy records so the UI is populated immediately.

3. Complete Project Directory Layout:
   ├── .github/
   │   └── workflows/
   │       └── sonar-scan.yml     # Complete GitHub Actions workflow for SonarCloud on push/PR
   ├── public/
   │   ├── index.html            # Modern UI layout
   │   ├── style.css             # Polished styling
   │   └── app.js                # Frontend API fetch and DOM logic
   ├── src/
   │   ├── db.js                 # MySQL connection logic
   │   ├── routes.js             # API controllers for events & registrations
   │   └── server.js             # Express app setup and middleware
   ├── sonar-project.properties  # Pre-configured Sonar scanner settings (sources=src,public)
   ├── package.json
   └── README.md                 # Quick setup instructions for demo

4. Deliberate SonarQube Flaws (Must be clearly marked and easily fixable):
Embed 4 distinct, real-world issues across the codebase:
   - [VULNERABILITY - SQL Injection]: A search route using raw template string concatenation (e.g., `SELECT * FROM registrations WHERE name = '${req.query.name}'`).
   - [SECURITY HOTSPOT - Hardcoded Credentials]: Hardcoding the 'admin' password and database config directly in db.js instead of using environment variables.
   - [BUG - Unhandled Null/Promise Rejection]: An empty catch block or calling `.toLowerCase()` directly on an optional/nullable query parameter without checking.
   - [CODE SMELL - Maintainability & Dead Code]: Unused imported modules, duplicated calculation blocks, and complex redundant conditional nesting in routes.js.

5. Comment Format for Demo Presentation:
Above every intentional flaw, include this exact structured comment block:
   /* ========================================================
      [SONARQUBE ISSUE TYPE]: <Vulnerability / Bug / Code Smell / Hotspot>
      [WHAT SONARQUBE FLAGS]: <Brief explanation of the rule violation>
      [DEMO TALKING POINT]: <What to say to the evaluator>
      ======================================================== */
   <FLAWED ACTIVE CODE>
   /* [DEMO FIX - UNCOMMENT TO RESOLVE]:
   <CLEAN PRODUCTION CODE>
   */

Make sure the code is completely written out, clean, modular, and ready to run with `npm install && npm start`.