import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "Varshi#0501",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.html");
});

app.get("/login", (req, res) => {
  res.render("login/login.html");
});

app.get("/register", (req, res) => {
  res.render("login/Registration Screen(Sign Up).html");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      const result = await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2)",
        [email, password]
      );
      console.log(result);
      res.render("home.html");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password;

      if (password === storedPassword) {
        res.render("home.html");
      } else {
        res.send("Incorrect Password");
      }
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});

// Save job
app.post('/api/save-job', async (req, res) => {
  const { jobTitle, jobDescription, department, jobLocation, employmentType, salaryMin, salaryMax, applicationDeadline, requiredQualifications, preferredQualifications, responsibilities, status } = req.body;

  try {
      await pool.query(
          `INSERT INTO job_postings (title, description, department, location, employment_type, salary_min, salary_max, application_deadline, required_qualifications, preferred_qualifications, responsibilities, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [jobTitle, jobDescription, department, jobLocation, employmentType, salaryMin, salaryMax, applicationDeadline, requiredQualifications, preferredQualifications, responsibilities, status]
      );

      res.status(201).send('Job saved');
  } catch (error) {
      console.error('Error saving job:', error);
      res.status(500).send('Error saving job posting.');
  }
});

// Get drafts
app.get('/api/get-drafts', async (req, res) => {
  try {
      const result = await pool.query(`SELECT * FROM job_postings WHERE status = 'Draft'`);
      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching drafts:', error);
      res.status(500).send('Error fetching draft job postings.');
  }
});

// Delete draft
app.delete('/api/delete-draft/:id', async (req, res) => {
  const { id } = req.params;
  try {
      await pool.query(`DELETE FROM job_postings WHERE id = $1`, [id]);
      res.send('Draft deleted');
  } catch (error) {
      console.error('Error deleting draft:', error);
      res.status(500).send('Error deleting draft job posting.');
  }
});

// Get published jobs
app.get('/api/get-published-jobs', async (req, res) => {
  try {
      const result = await pool.query(`SELECT * FROM job_postings WHERE status = 'Published'`);
      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching published jobs:', error);
      res.status(500).send('Error fetching published job postings.');
  }
});

// Unpublish job
app.delete('/api/unpublish-job/:id', async (req, res) => {
  const { id } = req.params;
  try {
      await pool.query(`UPDATE job_postings SET status = 'Draft' WHERE id = $1`, [id]);
      res.send('Job unpublished');
  } catch (error) {
      console.error('Error unpublishing job:', error);
      res.status(500).send('Error unpublishing job posting.');
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
