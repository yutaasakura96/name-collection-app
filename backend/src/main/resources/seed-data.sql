-- Seed data for app_users table
DO $$
BEGIN
  -- Only run seeding if users table is empty
  IF NOT EXISTS (SELECT 1 FROM users LIMIT 1) THEN
    INSERT INTO users (auth0_id, email, name, last_login)
    VALUES
      ('auth0|demo-user-1', 'demo1@example.com', 'Demo User 1', CURRENT_TIMESTAMP),
      ('auth0|demo-user-2', 'demo2@example.com', 'Demo User 2', CURRENT_TIMESTAMP);
    RAISE NOTICE 'User seed data inserted successfully';
  ELSE
    RAISE NOTICE 'Users table not empty, skipping seed data insertion';
  END IF;
END
$$;

-- Seed data for names table
DO $$
BEGIN
  -- Only run seeding if table is empty
  IF NOT EXISTS (SELECT 1 FROM names LIMIT 1) THEN
    INSERT INTO names (first_name, last_name, created_at)
    VALUES
      ('John', 'Doe', CURRENT_TIMESTAMP),
      ('Jane', 'Smith', CURRENT_TIMESTAMP),
      ('Michael', 'Johnson', CURRENT_TIMESTAMP),
      ('Emily', 'Williams', CURRENT_TIMESTAMP),
      ('David', 'Brown', CURRENT_TIMESTAMP);
    RAISE NOTICE 'Name seed data inserted successfully';
  ELSE
    RAISE NOTICE 'Names table not empty, skipping seed data insertion';
  END IF;
END
$$;
