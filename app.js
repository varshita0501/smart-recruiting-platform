const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const upload = multer();

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Database connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'smart_recruiting',
  password: '*******',
  port: 5432,
});

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});
app.get('/Job Creation and Publishing/job-creation-screen.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Job Creation and Publishing', 'job-creation-screen.html'));
});
app.get('/Job Creation and Publishing/job-drafts-screen.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Job Creation and Publishing','job-drafts-screen.html'));
});
app.get('/Job Creation and Publishing/published-jobs-screen.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Job Creation and Publishing', 'published-jobs-screen.html'));
});
app.get('/Job Categories/job-categories-management-screen.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Job Categories', 'job-categories-management-screen.html'));
});
app.get('/Job Categories/job-categories-management-screen.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Job Categories', 'integration-with-job-creation-screen.html'));
});
app.get('/Application Tracking System/form-management.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Application Tracking System', 'form-management.html'));
});
app.get('/Application Tracking System/form-edit.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Application Tracking System', 'form-edit.html'));
});
app.get('/Application Tracking System/application-creation.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Application Tracking System', 'form-creation.html'));
});
// 4.1 Login

// User authentication routes
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1 OR full_name = $1', [username]);
    const user = userQuery.rows[0];

    if (!user) {
      return res.status(400).send('Invalid username or email.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid password.');
    }

    res.redirect('../home.html');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error.');
  }
});

app.post('/register', async (req, res) => {
  const { full_name, email, password, confirm_password } = req.body;
  if (password !== confirm_password) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [full_name, email, hashedPassword]
    );

    res.status(201).redirect('/login/login.html');
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      res.status(400).json({ error: 'Email already registered' });
    } else {
      res.status(500).json({ error: 'Error registering user' });
    }
  }
});


// 4.2



// Save job posting
app.post('/api/save-job', upload.none(), async (req, res) => {
  const {
      jobTitle,
      jobDescription,
      department,
      jobLocation,
      employmentType,
      salaryMin,
      salaryMax,
      applicationDeadline,
      requiredQualifications,
      preferredQualifications,
      responsibilities,
      status,
  } = req.body;

  try {
      const result = await pool.query(
          `INSERT INTO job_postings (title, description, department, location, employment_type, salary_min, salary_max, application_deadline, required_qualifications, preferred_qualifications, responsibilities, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
          [jobTitle, jobDescription, department, jobLocation, employmentType, salaryMin, salaryMax, applicationDeadline, requiredQualifications, preferredQualifications, responsibilities, status]
      );
      res.status(201).json({
          message: 'Job saved successfully!',
          job: result.rows[0],
      });
  } catch (error) {
      console.error('Error saving job:', error);
      res.status(500).json({ error: 'Failed to save job' });
  }
});

// Fetch draft jobs
app.get('/api/get-drafts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM job_postings WHERE status = $1', ['Draft']);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching drafts:', error);
    res.status(500).json({ error: 'Failed to fetch drafts' });
  }
});
// Fetch job details for editing
app.get('/api/get-job/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM job_postings WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// Edit a job posting by ID
app.put('/api/edit-job/:id', upload.none(), async (req, res) => {
  const id = req.params.id;
  const {
    jobTitle,
    jobDescription,
    department,
    jobLocation,
    employmentType,
    salaryMin,
    salaryMax,
    applicationDeadline,
    requiredQualifications,
    preferredQualifications,
    responsibilities,
    status,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE job_postings
      SET title = $1, description = $2, department = $3, location = $4,
          employment_type = $5, salary_min = $6, salary_max = $7,
          application_deadline = $8, required_qualifications = $9,
          preferred_qualifications = $10, responsibilities = $11, status = $12
      WHERE id = $13 RETURNING *`,
      [jobTitle, jobDescription, department, jobLocation, employmentType, salaryMin, salaryMax, applicationDeadline, requiredQualifications, preferredQualifications, responsibilities, status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({
      message: 'Job updated successfully!',
      job: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});


// Delete a draft job
app.delete('/api/delete-draft/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM job_postings WHERE id = $1 AND status = $2', [id, 'Draft']);
    res.json({ message: 'Draft deleted successfully' });
  } catch (error) {
    console.error('Error deleting draft:', error);
    res.status(500).json({ error: 'Failed to delete draft' });
  }
});
// Fetch published jobs
app.get('/api/get-published-jobs', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM job_postings WHERE status = $1', ['Published']);
      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching published jobs:', error);
      res.status(500).json({ error: 'Failed to fetch published jobs' });
  }
});

// Unpublish a job posting
app.delete('/api/unpublish-job/:id', async (req, res) => {
  const id = req.params.id;
  try {
      await pool.query('UPDATE job_postings SET status = $1 WHERE id = $2', ['Draft', id]);
      res.json({ message: 'Job unpublished successfully' });
  } catch (error) {
      console.error('Error unpublishing job:', error);
      res.status(500).json({ error: 'Failed to unpublish job' });
  }
});




// 4.3
app.post('/add-category', async (req, res) => {
  const { 'category-type': categoryType, 'category-name': categoryName } = req.body;

  if (!categoryType || !categoryName) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const query = 'INSERT INTO job_categories (category_type, category_name) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [categoryType, categoryName]);
    res.status(201).json(result.rows[0]); // Return the newly created category
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving the category.' });
  }
});

app.post('/delete-category', async (req, res) => {
  const { id } = req.body;
  try {
    await pool.query('DELETE FROM job_categories WHERE id = $1', [id]);
    res.status(204).send(); // No content response
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting category.' });
  }
});

app.get('/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM job_categories');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching categories.' });
  }
});
// Fetch categories for dropdowns
app.get('/job-categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT category_type, category_name FROM job_categories');
    const categories = result.rows.reduce((acc, row) => {
      const { category_type, category_name } = row;
      if (!acc[category_type]) {
        acc[category_type] = [];
      }
      acc[category_type].push(category_name);
      return acc;
    }, {});
    
    res.json(categories); // { "Department": [...], "Location": [...], "Employment Type": [...] }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching job categories.');
  }
});
app.post('/create-job', async (req, res) => {
  const { department, job_location, employment_type, job_title, job_description } = req.body;

  // Input validation
  if (!department || !job_location || !employment_type || !job_title || !job_description) {
    return res.status(400).send('All fields are required.');
  }

  try {
    const query = `
      INSERT INTO jobs (department, job_location, employment_type, job_title, job_description)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(query, [department, job_location, employment_type, job_title, job_description]);
    res.status(201).send('Job created successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating job.');
  }
});




// 4.4
app.get('/api/forms', async (req, res) => {
  const result = await pool.query('SELECT * FROM forms');
  res.json(result.rows);
});

// Get a specific form
app.get('/api/forms/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM forms WHERE id = $1', [req.params.id]);
  res.json(result.rows[0]);
});

// Create a new form
app.post('/api/forms', async (req, res) => {
  const { name, associatedJob, fields } = req.body;
  await pool.query('INSERT INTO forms (name, associated_job, fields) VALUES ($1, $2, $3)', [name, associatedJob, JSON.stringify(fields)]);
  res.status(201).send('Form created');
});

// Update an existing form
app.put('/api/forms/:id', async (req, res) => {
  const { name, associatedJob, fields } = req.body;
  await pool.query('UPDATE forms SET name = $1, associated_job = $2, fields = $3 WHERE id = $4', [name, associatedJob, JSON.stringify(fields), req.params.id]);
  res.send('Form updated');
});

// Delete a specific form
app.delete('/api/forms/:id', async (req, res) => {
  await pool.query('DELETE FROM forms WHERE id = $1', [req.params.id]);
  res.send('Form deleted');
});

// Get all jobs for dropdown
app.get('/api/jobs', async (req, res) => {
  const result = await pool.query('SELECT * FROM jobs');
  res.json(result.rows);
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
