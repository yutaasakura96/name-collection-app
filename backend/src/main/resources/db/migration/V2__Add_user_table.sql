-- Seed data for app_users table
INSERT INTO users (auth0_id, email, name, last_login)
VALUES
  ('auth0|demo-user-1', 'demo1@example.com', 'Demo User 1', CURRENT_TIMESTAMP),
  ('auth0|demo-user-2', 'demo2@example.com', 'Demo User 2', CURRENT_TIMESTAMP)
ON CONFLICT (auth0_id) DO NOTHING;

-- Seed data for names table
INSERT INTO names (first_name, last_name, created_at, uuid)
VALUES
  ('John', 'Doe', CURRENT_TIMESTAMP, '2a40ffd0-1d3e-4885-9064-27f9a6317f3e'),
  ('Jane', 'Smith', CURRENT_TIMESTAMP, '8b6e4d7c-9a3f-4b2e-8d1c-6f5e4d3c2b1a'),
  ('Michael', 'Johnson', CURRENT_TIMESTAMP, '7c6e5d4c-3b2a-1f0e-9d8c-7b6a5d4c3b2a'),
  ('Emily', 'Williams', CURRENT_TIMESTAMP, '6a5b4c3d-2e1f-0a9b-8c7d-6a5b4c3d2e1f'),
  ('David', 'Brown', CURRENT_TIMESTAMP, '5d4e3f2g-1h0i-9j8k-7l6m-5d4e3f2g1h0i'),
  ('Emma', 'Wilson', CURRENT_TIMESTAMP, '3c42a194-7a45-4e8d-9c5b-1d3e8f2a6c9b'),
  ('James', 'Taylor', CURRENT_TIMESTAMP, '4d53b8a7-6b78-5f9e-8d1c-2a3b4c5d6e7f'),
  ('Olivia', 'Anderson', CURRENT_TIMESTAMP, '5e64c9b8-7c89-6d1e-9f2a-3b4c5d6e7f8a'),
  ('William', 'Thomas', CURRENT_TIMESTAMP, '6f75d1c9-8d9a-7e2f-1a3b-4c5d6e7f8a9b'),
  ('Sophia', 'Jackson', CURRENT_TIMESTAMP, '7a86e2d1-9e1b-8f3a-2b4c-5d6e7f8a9b1c'),
  ('Benjamin', 'White', CURRENT_TIMESTAMP, '8b97f3e2-1f2c-9a4b-3c5d-6e7f8a9b1c2d'),
  ('Charlotte', 'Harris', CURRENT_TIMESTAMP, '9c18a4f3-2a3d-1b5c-4d6e-7f8a9b1c2d3e'),
  ('Henry', 'Martin', CURRENT_TIMESTAMP, '1d29b5a4-3b4e-2c6d-5e7f-8a9b1c2d3e4f'),
  ('Amelia', 'Thompson', CURRENT_TIMESTAMP, '2e31c6b5-4c5f-3d7e-6f8a-9b1c2d3e4f5a'),
  ('Alexander', 'Garcia', CURRENT_TIMESTAMP, '3f42d7c6-5d6a-4e8f-7a9b-1c2d3e4f5a6b'),
  ('Mia', 'Martinez', CURRENT_TIMESTAMP, '4a53e8d7-6e7b-5f9a-8b1c-2d3e4f5a6b7c'),
  ('Ethan', 'Robinson', CURRENT_TIMESTAMP, '5b64f9e8-7f8c-6a1b-9c2d-3e4f5a6b7c8d'),
  ('Isabella', 'Clark', CURRENT_TIMESTAMP, '6c75a1f9-8a9d-7b2c-1d3e-4f5a6b7c8d9e'),
  ('Daniel', 'Rodriguez', CURRENT_TIMESTAMP, '7d86b2a1-9b1e-8c3d-2e4f-5a6b7c8d9e1f'),
  ('Harper', 'Lewis', CURRENT_TIMESTAMP, '8e97c3b2-1c2f-9d4e-3f5a-6b7c8d9e1f2a'),
  ('Matthew', 'Lee', CURRENT_TIMESTAMP, '9f18d4c3-2d3a-1e5f-4a6b-7c8d9e1f2a3b'),
  ('Evelyn', 'Walker', CURRENT_TIMESTAMP, '1a29e5d4-3e4b-2f6a-5b7c-8d9e1f2a3b4c'),
  ('Joseph', 'Hall', CURRENT_TIMESTAMP, '2b31f6e5-4f5c-3a7b-6c8d-9e1f2a3b4c5d'),
  ('Abigail', 'Allen', CURRENT_TIMESTAMP, '3c42a7f6-5a6d-4b8c-7d9e-1f2a3b4c5d6e'),
  ('Samuel', 'Young', CURRENT_TIMESTAMP, '4d53b8a7-6b7e-5c9d-8e1f-2a3b4c5d6e7f'),
  ('Elizabeth', 'Hernandez', CURRENT_TIMESTAMP, '5e64c9b8-7c8f-6d1e-9f2a-3b4c5d6e7f8a'),
  ('David', 'King', CURRENT_TIMESTAMP, '6f75d1c9-8d9a-7e2f-1a3b-4c5d6e7f8a9b'),
  ('Sofia', 'Wright', CURRENT_TIMESTAMP, '7a86e2d1-9e1b-8f3a-2b4c-5d6e7f8a9b1c'),
  ('Andrew', 'Lopez', CURRENT_TIMESTAMP, '8b97f3e2-1f2c-9a4b-3c5d-6e7f8a9b1c2d'),
  ('Avery', 'Hill', CURRENT_TIMESTAMP, '9c18a4f3-2a3d-1b5c-4d6e-7f8a9b1c2d3e'),
  ('Joshua', 'Scott', CURRENT_TIMESTAMP, '1d29b5a4-3b4e-2c6d-5e7f-8a9b1c2d3e4f'),
  ('Scarlett', 'Green', CURRENT_TIMESTAMP, '2e31c6b5-4c5f-3d7e-6f8a-9b1c2d3e4f5a'),
  ('Christopher', 'Adams', CURRENT_TIMESTAMP, '3f42d7c6-5d6a-4e8f-7a9b-1c2d3e4f5a6b'),
  ('Victoria', 'Baker', CURRENT_TIMESTAMP, '4a53e8d7-6e7b-5f9a-8b1c-2d3e4f5a6b7c'),
  ('Wyatt', 'Gonzalez', CURRENT_TIMESTAMP, '5b64f9e8-7f8c-6a1b-9c2d-3e4f5a6b7c8d')
ON CONFLICT (uuid) DO NOTHING;
