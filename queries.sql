CREATE TABLE job_postings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    department VARCHAR(255),
    location VARCHAR(255),
    employment_type VARCHAR(50),
    salary_min NUMERIC,
    salary_max NUMERIC,
    application_deadline DATE,
    required_qualifications TEXT,
    preferred_qualifications TEXT,
    responsibilities TEXT,
    status VARCHAR(50),
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_published TIMESTAMP
);
CREATE TABLE job_categories (
  id SERIAL PRIMARY KEY,
  category_type VARCHAR(50),
  category_name VARCHAR(100)
);
CREATE TABLE application_forms (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

