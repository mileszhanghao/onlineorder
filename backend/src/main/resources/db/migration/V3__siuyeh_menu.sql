-- SiuYeh menu: three fictional late-night spots in Seattle.
-- Rewrites the V2 sample rows in place so existing ids (and carts) stay valid,
-- then adds the rest. Dish photos are from Wikimedia Commons; see CREDITS.md.
UPDATE restaurants r SET name = v.name, address = v.address, phone = v.phone, image_url = v.image_url
FROM (VALUES
    (1, '九龍夜 Kowloon Nights', 'Cha chaan teng · U District, Seattle · 6 pm – 2 am', '(206) 555-0118', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/HK_Causeway_Bay_%E8%AD%A6%E5%AE%98%E4%BF%B1%E6%A8%82%E9%83%A8_Police_Officers%27_Club_drink_paper_bag_MilkTea_cup_23-Mar-2013.JPG/960px-HK_Causeway_Bay_%E8%AD%A6%E5%AE%98%E4%BF%B1%E6%A8%82%E9%83%A8_Police_Officers%27_Club_drink_paper_bag_MilkTea_cup_23-Mar-2013.JPG'),
    (2, '金燈籠 Golden Lantern', 'Dim sum · Chinatown–International District, Seattle · until midnight', '(206) 555-0127', 'https://upload.wikimedia.org/wikipedia/commons/a/aa/HK_dim_sum_food_-_streamed_%E8%9D%A6%E9%A4%83_Har_gow_prawn_dumping_white_flour_Feb-2014_MCK.jpg'),
    (3, 'Elliott Bay Night Market', 'Seattle late-night classics · Waterfront, Seattle · until 1 am', '(206) 555-0144', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/Grilled_Salmon_1_2018-07-03.jpg/960px-Grilled_Salmon_1_2018-07-03.jpg')
) AS v(id, name, address, phone, image_url)
WHERE r.id = v.id;

UPDATE menu_items m SET restaurant_id = v.restaurant_id, name = v.name, description = v.description,
    price = v.price, image_url = v.image_url
FROM (VALUES
    (1, 1, 'Shrimp Wonton Noodles · 鮮蝦雲吞麵', 'Springy egg noodles and plump shrimp wontons in a clear broth simmered with dried flounder.', 14.50::NUMERIC, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/%E3%83%AF%E3%83%B3%E3%82%BF%E3%83%B3%E9%BA%BA%EF%BC%88%E6%BA%90%E6%9D%A5%E8%BB%92%EF%BC%89.jpg/960px-%E3%83%AF%E3%83%B3%E3%82%BF%E3%83%B3%E9%BA%BA%EF%BC%88%E6%BA%90%E6%9D%A5%E8%BB%92%EF%BC%89.jpg'),
    (2, 1, 'Pineapple Bun with Butter · 菠蘿油', 'Crackly sugar crust (no pineapple, never was) with a cold slab of butter tucked inside the warm bun.', 5.25::NUMERIC, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/King%27s_Bakery%2C_Portland%2C_Oregon_%282022%29_-_3_%28crop%29.jpg/960px-King%27s_Bakery%2C_Portland%2C_Oregon_%282022%29_-_3_%28crop%29.jpg'),
    (3, 1, 'HK Milk Tea · 港式奶茶', 'Black tea pulled through a cloth "silk stocking" filter and finished with evaporated milk. Hot or iced.', 4.75::NUMERIC, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/HK_Causeway_Bay_%E8%AD%A6%E5%AE%98%E4%BF%B1%E6%A8%82%E9%83%A8_Police_Officers%27_Club_drink_paper_bag_MilkTea_cup_23-Mar-2013.JPG/960px-HK_Causeway_Bay_%E8%AD%A6%E5%AE%98%E4%BF%B1%E6%A8%82%E9%83%A8_Police_Officers%27_Club_drink_paper_bag_MilkTea_cup_23-Mar-2013.JPG'),
    (4, 1, 'Egg Tarts (3) · 蛋撻', 'Wobbly egg custard in a buttery short-crust shell, best eaten while still warm.', 6.50::NUMERIC, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Egg_custard_tarts.jpg/960px-Egg_custard_tarts.jpg'),
    (5, 1, 'Honey Char Siu · 蜜汁叉燒', 'Cantonese barbecued pork lacquered with honey until the edges catch. Served with steamed rice.', 16.50::NUMERIC, 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Char_siu_ribs_by_avlxyz.jpg'),
    (6, 1, 'Dry-Fried Beef Chow Fun · 乾炒牛河', 'Wide rice noodles, sliced beef, bean sprouts and scallion, tossed over a roaring wok for that smoky wok hei.', 15.25::NUMERIC, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/HK_SYP_%E8%A5%BF%E7%92%B0_Sai_Ying_Pun_%E5%BE%B7%E8%BC%94%E9%81%93%E8%A5%BF_308_Des_Voeux_Road_West_%E9%A3%9F%E7%A5%9E%E9%BA%97%E5%AE%AE%E9%85%92%E5%AE%B6_Chinese_Banquet_Seafood_Restaurant_food_%E4%B9%BE%E7%82%92%E7%89%9B%E6%B2%B3_Dry-fried_beef_ho_fun_January_2026_N13P_02.jpg/960px-thumbnail.jpg'),
    (7, 2, 'Har Gow (4) · 蝦餃', 'Whole shrimp wrapped in a thin, translucent wheat-starch skin, pleated by hand.', 7.50::NUMERIC, 'https://upload.wikimedia.org/wikipedia/commons/a/aa/HK_dim_sum_food_-_streamed_%E8%9D%A6%E9%A4%83_Har_gow_prawn_dumping_white_flour_Feb-2014_MCK.jpg'),
    (8, 2, 'Siu Mai (4) · 燒賣', 'Open-topped pork and shrimp dumplings, steamed in bamboo.', 7.00::NUMERIC, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Dim_sim.jpg/960px-Dim_sim.jpg'),
    (9, 2, 'Cheung Fun · 腸粉', 'Silky steamed rice-noodle rolls, finished with sweet soy sauce.', 7.25::NUMERIC, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Chee_cheong_fun_1.jpg/960px-Chee_cheong_fun_1.jpg'),
    (10, 2, 'Char Siu Bao (3) · 叉燒包', 'Fluffy steamed buns that split open on top to show the sweet barbecued pork inside.', 6.75::NUMERIC, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Chashaobao.jpg/960px-Chashaobao.jpg'),
    (11, 2, 'Lo Mai Gai · 糯米雞', 'Sticky rice with chicken, shiitake and Chinese sausage, steamed inside a lotus leaf.', 7.95::NUMERIC, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Lo_mai_gai.JPG/960px-Lo_mai_gai.JPG'),
    (12, 2, 'Mango Pudding · 芒果布甸', 'Chilled mango pudding with a pour of evaporated milk.', 5.50::NUMERIC, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Mango_pudding_by_stu_spivack_in_San_Francisco.jpg/960px-Mango_pudding_by_stu_spivack_in_San_Francisco.jpg')
) AS v(id, restaurant_id, name, description, price, image_url)
WHERE m.id = v.id;

INSERT INTO menu_items (restaurant_id, name, description, price, image_url)
VALUES
    (3, 'Seattle Teriyaki Chicken', 'Grilled chicken thighs with a sweet teriyaki glaze over rice. The city''s unofficial late-night dish.', 13.95, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9b/Fried_chicken_thighs_with_rice.jpg/960px-Fried_chicken_thighs_with_rice.jpg'),
    (3, 'Pan-Fried Gyoza (6)', 'Pork and cabbage dumplings with crisp, golden bottoms and a ponzu dip.', 8.25, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/Gyoza_%288664264357%29.jpg/960px-Gyoza_%288664264357%29.jpg'),
    (3, 'Clam Chowder', 'Creamy chowder with clams and potato, oyster crackers on the side. Fog-on-the-Sound weather food.', 9.50, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Quail_07_bg_041506.jpg/960px-Quail_07_bg_041506.jpg'),
    (3, 'Fish & Chips', 'Battered Pacific cod, thick-cut chips, tartar sauce and a lemon wedge.', 16.95, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Viking_Cinderella%2C_Melody%2C_Fish%27n_chips%2C_20240416_-_30.jpg/960px-Viking_Cinderella%2C_Melody%2C_Fish%27n_chips%2C_20240416_-_30.jpg'),
    (3, 'Grilled Salmon Bowl', 'Pacific Northwest salmon off the grill over rice and greens with a citrus-soy glaze.', 19.50, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/Grilled_Salmon_1_2018-07-03.jpg/960px-Grilled_Salmon_1_2018-07-03.jpg');
