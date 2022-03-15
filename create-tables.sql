	CREATE TABLE IF NOT EXISTS
	product(
		id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
		name VARCHAR(50) NOT NULL,
        description VARCHAR(500) NOT NULL,
        brand VARCHAR(30) NOT NULL,
		image_url TEXT NOT NULL,
		price INTEGER NOT NULL CHECK(price>0),
        category VARCHAR(30)
		created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
	);

CREATE TABLE IF NOT EXISTS
	review(
		id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
		comment VARCHAR(100) NOT NULL,
		rate INTEGER NOT NULL CHECK(price>0 AND price<6),
		product_id VARCHAR(50) NOT NULL,
		created_at TIMESTAMPTZ DEFAULT NOW()
	);
