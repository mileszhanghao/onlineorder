import type { Restaurant } from '../types'

// Same fictional restaurants and dishes as backend/src/main/resources/db/migration/V2__seed_menu.sql.
export const DEMO_RESTAURANTS: Restaurant[] = [
  {
    id: 1,
    name: 'Lakeview Noodle House',
    address: '100 Demo Ave, Redmond, WA',
    phone: '(425) 555-0101',
    imageUrl: null,
    menuItems: [
      { id: 1, name: 'Beef Noodle Soup', description: 'Braised beef shank, bok choy, hand-pulled noodles.', price: 15.5, imageUrl: null },
      { id: 2, name: 'Dan Dan Noodles', description: 'Sesame-chili sauce with minced pork.', price: 13.25, imageUrl: null },
      { id: 3, name: 'Pork & Chive Dumplings (8)', description: 'Pan-fried, served with black vinegar.', price: 10.0, imageUrl: null },
      { id: 4, name: 'Scallion Pancake', description: 'Crispy, flaky, with soy dipping sauce.', price: 7.75, imageUrl: null },
    ],
  },
  {
    id: 2,
    name: 'Rainier Burger Co.',
    address: '200 Sample St, Seattle, WA',
    phone: '(206) 555-0102',
    imageUrl: null,
    menuItems: [
      { id: 5, name: 'Classic Cheeseburger', description: 'Quarter-pound patty, cheddar, pickles.', price: 11.99, imageUrl: null },
      { id: 6, name: 'Mushroom Swiss Burger', description: 'Sauteed mushrooms and Swiss cheese.', price: 12.99, imageUrl: null },
      { id: 7, name: 'Garlic Fries', description: 'Shoestring fries tossed with garlic and parsley.', price: 5.49, imageUrl: null },
      { id: 8, name: 'Vanilla Milkshake', description: 'Hand-spun vanilla shake.', price: 5.99, imageUrl: null },
    ],
  },
  {
    id: 3,
    name: 'Cascade Taco Stand',
    address: '300 Example Blvd, Bellevue, WA',
    phone: '(425) 555-0103',
    imageUrl: null,
    menuItems: [
      { id: 9, name: 'Carne Asada Tacos (3)', description: 'Grilled steak, onion, cilantro, salsa verde.', price: 11.5, imageUrl: null },
      { id: 10, name: 'Al Pastor Tacos (3)', description: 'Marinated pork with pineapple.', price: 11.0, imageUrl: null },
      { id: 11, name: 'Chips & Guacamole', description: 'Fresh guacamole with corn chips.', price: 6.25, imageUrl: null },
      { id: 12, name: 'Horchata', description: 'Cinnamon rice drink.', price: 3.75, imageUrl: null },
    ],
  },
]
