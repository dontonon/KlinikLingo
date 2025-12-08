-- Clear all lessons and reset sequence
DELETE FROM lessons;
ALTER SEQUENCE lessons_id_seq RESTART WITH 1;

-- Verify
SELECT COUNT(*) FROM lessons;
