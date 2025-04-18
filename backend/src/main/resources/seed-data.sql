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
    RAISE NOTICE 'Seed data inserted successfully';
  ELSE
    RAISE NOTICE 'Table not empty, skipping seed data insertion';
  END IF;
END
$$;
