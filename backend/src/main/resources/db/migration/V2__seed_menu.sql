-- Demo data: fictional restaurants and dishes.
INSERT INTO restaurants (name, address, phone, image_url)
VALUES ('Lakeview Noodle House', '100 Demo Ave, Redmond, WA', '(425) 555-0101', NULL),
       ('Rainier Burger Co.', '200 Sample St, Seattle, WA', '(206) 555-0102', NULL),
       ('Cascade Taco Stand', '300 Example Blvd, Bellevue, WA', '(425) 555-0103', NULL);

INSERT INTO menu_items (restaurant_id, name, description, price)
VALUES (1, 'Beef Noodle Soup', 'Braised beef shank, bok choy, hand-pulled noodles.', 15.50),
       (1, 'Dan Dan Noodles', 'Sesame-chili sauce with minced pork.', 13.25),
       (1, 'Pork & Chive Dumplings (8)', 'Pan-fried, served with black vinegar.', 10.00),
       (1, 'Scallion Pancake', 'Crispy, flaky, with soy dipping sauce.', 7.75),
       (2, 'Classic Cheeseburger', 'Quarter-pound patty, cheddar, pickles.', 11.99),
       (2, 'Mushroom Swiss Burger', 'Sauteed mushrooms and Swiss cheese.', 12.99),
       (2, 'Garlic Fries', 'Shoestring fries tossed with garlic and parsley.', 5.49),
       (2, 'Vanilla Milkshake', 'Hand-spun vanilla shake.', 5.99),
       (3, 'Carne Asada Tacos (3)', 'Grilled steak, onion, cilantro, salsa verde.', 11.50),
       (3, 'Al Pastor Tacos (3)', 'Marinated pork with pineapple.', 11.00),
       (3, 'Chips & Guacamole', 'Fresh guacamole with corn chips.', 6.25),
       (3, 'Horchata', 'Cinnamon rice drink.', 3.75);
