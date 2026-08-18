const express = require('express');
const router = express.Router();
const { pool } = require('./db');

/* ========================================================
   [SONARQUBE ISSUE TYPE]: Code Smell
   [WHAT SONARQUBE FLAGS]: Unused imported modules.
   [DEMO TALKING POINT]: Unused imports clutter the codebase and increase build size. Removing this cleans up the imports.
   ======================================================== */
const fs = require('fs');
const path = require('path');
// (Delete or comment out the 'fs' and 'path' imports above)


// GET all registrations
router.get('/registrations', (req, res) => {
  pool.query('SELECT * FROM registrations ORDER BY created_at DESC', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET stats
router.get('/stats', (req, res) => {
  /* ========================================================
     [SONARQUBE ISSUE TYPE]: Code Smell
     [WHAT SONARQUBE FLAGS]: Duplicated calculation blocks / nested query callbacks.
     [DEMO TALKING POINT]: We have duplicated database query wrappers that can be simplified into a cleaner, single-query structure.
     ======================================================== */
  // pool.query('SELECT COUNT(*) AS total FROM registrations', (err, r1) => {
  //   if (err) return res.status(500).json({ error: err.message });

  //   pool.query('SELECT COUNT(DISTINCT event_name) AS total FROM registrations', (err, r2) => {
  //     if (err) return res.status(500).json({ error: err.message });

  //     pool.query('SELECT COUNT(*) AS total FROM registrations WHERE flagged = TRUE', (err, r3) => {
  //       if (err) return res.status(500).json({ error: err.message });

  //       res.json({
  //         totalRegistrations: r1[0].total,
  //         activeEvents: r2[0].total,
  //         flaggedEntries: r3[0].total
  //       });
  //     });
  //   });
  // });

  // [DEMO FIX - UNCOMMENT TO RESOLVE]:
  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM registrations) as totalRegistrations,
      (SELECT COUNT(DISTINCT event_name) FROM registrations) as activeEvents,
      (SELECT COUNT(*) FROM registrations WHERE flagged = TRUE) as flaggedEntries
  `;
  pool.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });

});

// SEARCH registrations with SQL Injection vulnerability & Bug (Null Pointer)
router.get('/registrations/search', (req, res) => {
  const searchTerm = req.query.query;

  /* ========================================================
     [SONARQUBE ISSUE TYPE]: Bug
     [WHAT SONARQUBE FLAGS]: Accessing property/method on potentially null/undefined value without a check.
     [DEMO TALKING POINT]: Calling '.toLowerCase()' directly on 'searchTerm' (which can be null or undefined if the query parameter is missing) will crash the server. Let's add a null check first.
     ======================================================== */
  // const lowerSearch = searchTerm.toLowerCase();

  // [DEMO FIX - UNCOMMENT TO RESOLVE]:
  const lowerSearch = searchTerm ? searchTerm.toLowerCase() : '';










  /* ========================================================
     [SONARQUBE ISSUE TYPE]: Vulnerability
     [WHAT SONARQUBE FLAGS]: SQL Injection via raw template string concatenation.
     [DEMO TALKING POINT]: Using string template concatenation for query inputs allows attackers to perform SQL Injection. Let's fix it by using a parameterized query.
     ======================================================== */
  // const query = `SELECT * FROM registrations WHERE student_name LIKE '%${lowerSearch}%' OR event_name LIKE '%${lowerSearch}%'`;
  // pool.query(query, (err, results) => {
  //   if (err) {
  //     return res.status(500).json({ error: err.message });
  //   }
  //   res.json(results);
  // });
  // [DEMO FIX - UNCOMMENT TO RESOLVE]:
  const query = 'SELECT * FROM registrations WHERE student_name LIKE ? OR event_name LIKE ?';
  const placeholder = `%${lowerSearch}%`;
  pool.query(query, [placeholder, placeholder], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });

});















// POST new registration
router.post('/registrations', (req, res) => {
  const { student_name, email, event_name, registration_date, flagged } = req.body;

  /* ========================================================
     [SONARQUBE ISSUE TYPE]: Code Smell
     [WHAT SONARQUBE FLAGS]: Deeply nested and redundant conditional logic.
     [DEMO TALKING POINT]: Multiple nested ifs that perform simple validations can be simplified to a single line or early guard clauses, improving readability.
     ======================================================== */
  // if (student_name) {
  //   if (email) {
  //     if (event_name) {
  //       if (registration_date) {
  //         const isFlagged = flagged === true || flagged === 'true' ? 1 : 0;
  //         const query = 'INSERT INTO registrations (student_name, email, event_name, registration_date, flagged) VALUES (?, ?, ?, ?, ?)';
  //         pool.query(query, [student_name, email, event_name, registration_date, isFlagged], (err, results) => {
  //           if (err) {
  //             return res.status(500).json({ error: err.message });
  //           }
  //           return res.status(201).json({ message: 'Registration added successfully', id: results.insertId });
  //         });
  //       } else {
  //         return res.status(400).json({ error: 'Registration date is required' });
  //       }
  //     } else {
  //       return res.status(400).json({ error: 'Event name is required' });
  //     }
  //   } else {
  //     return res.status(400).json({ error: 'Email is required' });
  //   }
  // } else {
  //   return res.status(400).json({ error: 'Student name is required' });
  // }

  //[DEMO FIX - UNCOMMENT TO RESOLVE]:
  if (!student_name || !email || !event_name || !registration_date) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const isFlagged = flagged === true || flagged === 'true' ? 1 : 0;
  const query = 'INSERT INTO registrations (student_name, email, event_name, registration_date, flagged) VALUES (?, ?, ?, ?, ?)';
  pool.query(query, [student_name, email, event_name, registration_date, isFlagged], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Registration added successfully', id: results.insertId });
  });

});

module.exports = router;
