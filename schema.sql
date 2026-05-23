-- Inventory Table
CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  name TEXT,
  stock_count INTEGER
);

-- Function to handle atomic reservations
CREATE OR REPLACE FUNCTION reserve_stock(target_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  current_stock INTEGER;
BEGIN
  SELECT stock_count INTO current_stock FROM inventory WHERE id = target_id FOR UPDATE;
  IF current_stock > 0 THEN
    UPDATE inventory SET stock_count = stock_count - 1 WHERE id = target_id;
    RETURN TRUE;
  END IF;
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;