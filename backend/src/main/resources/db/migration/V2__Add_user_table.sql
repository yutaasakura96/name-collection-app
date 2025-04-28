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
  ('David', 'Brown', CURRENT_TIMESTAMP, '5d4e3f2g-1h0i-9j8k-7l6m-5d4e3f2g1h0i')
ON CONFLICT (uuid) DO NOTHING;
