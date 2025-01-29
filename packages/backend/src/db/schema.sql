CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  hiboutik_id TEXT UNIQUE,
  communication_preferences TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS repairs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL,
  description TEXT NOT NULL,
  customer_id INTEGER NOT NULL,
  technician_notes TEXT,
  estimated_completion DATETIME,
  FOREIGN KEY (customer_id) REFERENCES customers (id)
);
