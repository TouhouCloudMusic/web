-- Custom SQL migration file, put you code below! --
CREATE TYPE location_tuple AS (
		country text,
  	subdivision text,
  	city text
);

CREATE OR REPLACE FUNCTION update_updated_at_on_update()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = now();
	RETURN NEW;
END
$$ language 'plpgsql'
