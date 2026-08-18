const mysql = require('mysql2');
// require('dotenv').config();

/* ========================================================
   [SONARQUBE ISSUE TYPE]: Hotspot
   [WHAT SONARQUBE FLAGS]: Hardcoded credentials/secrets. Plain-text passwords should not be hardcoded in connection configs.
   [DEMO TALKING POINT]: Developers sometimes leave plaintext secrets in codebase which gets flagged as a Security Hotspot. Let's fix this by using environment variables.
   ======================================================== */
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'eventdb'
};
/* [DEMO FIX - UNCOMMENT TO RESOLVE]:
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'eventdb'
};
*/

// Create the pool
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Auto initialize Database and Table
function initializeDbSchema() {
  const initConnection = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password
  });

  initConnection.query('CREATE DATABASE IF NOT EXISTS eventdb', (err) => {
    if (err) {
      console.error('Error creating database:', err);
      initConnection.end();
      return;
    }

    initConnection.query('USE eventdb', (err) => {
      if (err) {
        console.error('Error selecting database:', err);
        initConnection.end();
        return;
      }

      const createTableSql = `
        CREATE TABLE IF NOT EXISTS registrations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          student_name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL,
          event_name VARCHAR(100) NOT NULL,
          registration_date DATE NOT NULL,
          flagged BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      initConnection.query(createTableSql, (err) => {
        if (err) {
          console.error('Error creating table:', err);
          initConnection.end();
          return;
        }

        // Check if table is empty to seed it
        initConnection.query('SELECT COUNT(*) AS count FROM registrations', (err, results) => {
          if (err) {
            console.error('Error counting registrations:', err);
            initConnection.end();
            return;
          }

          if (results[0].count === 0) {
            const seedSql = `
              INSERT INTO registrations (student_name, email, event_name, registration_date, flagged) VALUES
              ('Alice Smith', 'alice@university.edu', 'Annual Tech Symposium', '2026-09-10', FALSE),
              ('Bob Johnson', 'bob@university.edu', 'AI Hackathon 2026', '2026-09-15', FALSE),
              ('Charlie Davis', 'charlie@university.edu', 'Cloud Computing Seminar', '2026-10-01', TRUE)
            `;
            initConnection.query(seedSql, (err) => {
              if (err) {
                console.error('Error seeding data:', err);
              } else {
                console.log('Database initialized and seeded with 3 dummy records successfully.');
              }
              initConnection.end();
            });
          } else {
            console.log('Database already initialized. Seed skipped.');
            initConnection.end();
          }
        });
      });
    });
  });
}

module.exports = {
  pool,
  initializeDbSchema
};
