import type { Restaurant } from '../types'

// Same menu as backend/src/main/resources/db/migration/V3__siuyeh_menu.sql (generated from one list).
// Dish photos: Wikimedia Commons, see CREDITS.md.
export const DEMO_RESTAURANTS: Restaurant[] = [
  {
    id: 1,
    name: "九龍夜 Kowloon Nights",
    address: "Cha chaan teng · U District, Seattle · 6 pm – 2 am",
    phone: "(206) 555-0118",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/HK_Causeway_Bay_%E8%AD%A6%E5%AE%98%E4%BF%B1%E6%A8%82%E9%83%A8_Police_Officers%27_Club_drink_paper_bag_MilkTea_cup_23-Mar-2013.JPG/960px-HK_Causeway_Bay_%E8%AD%A6%E5%AE%98%E4%BF%B1%E6%A8%82%E9%83%A8_Police_Officers%27_Club_drink_paper_bag_MilkTea_cup_23-Mar-2013.JPG",
    menuItems: [
      { id: 1, name: "Shrimp Wonton Noodles · 鮮蝦雲吞麵", description: "Springy egg noodles and plump shrimp wontons in a clear broth simmered with dried flounder.", price: 14.5, imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/%E3%83%AF%E3%83%B3%E3%82%BF%E3%83%B3%E9%BA%BA%EF%BC%88%E6%BA%90%E6%9D%A5%E8%BB%92%EF%BC%89.jpg/960px-%E3%83%AF%E3%83%B3%E3%82%BF%E3%83%B3%E9%BA%BA%EF%BC%88%E6%BA%90%E6%9D%A5%E8%BB%92%EF%BC%89.jpg" },
      { id: 2, name: "Pineapple Bun with Butter · 菠蘿油", description: "Crackly sugar crust (no pineapple, never was) with a cold slab of butter tucked inside the warm bun.", price: 5.25, imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/King%27s_Bakery%2C_Portland%2C_Oregon_%282022%29_-_3_%28crop%29.jpg/960px-King%27s_Bakery%2C_Portland%2C_Oregon_%282022%29_-_3_%28crop%29.jpg" },
      { id: 3, name: "HK Milk Tea · 港式奶茶", description: "Black tea pulled through a cloth \"silk stocking\" filter and finished with evaporated milk. Hot or iced.", price: 4.75, imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/HK_Causeway_Bay_%E8%AD%A6%E5%AE%98%E4%BF%B1%E6%A8%82%E9%83%A8_Police_Officers%27_Club_drink_paper_bag_MilkTea_cup_23-Mar-2013.JPG/960px-HK_Causeway_Bay_%E8%AD%A6%E5%AE%98%E4%BF%B1%E6%A8%82%E9%83%A8_Police_Officers%27_Club_drink_paper_bag_MilkTea_cup_23-Mar-2013.JPG" },
      { id: 4, name: "Egg Tarts (3) · 蛋撻", description: "Wobbly egg custard in a buttery short-crust shell, best eaten while still warm.", price: 6.5, imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Egg_custard_tarts.jpg/960px-Egg_custard_tarts.jpg" },
      { id: 5, name: "Honey Char Siu · 蜜汁叉燒", description: "Cantonese barbecued pork lacquered with honey until the edges catch. Served with steamed rice.", price: 16.5, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Char_siu_ribs_by_avlxyz.jpg" },
      { id: 6, name: "Dry-Fried Beef Chow Fun · 乾炒牛河", description: "Wide rice noodles, sliced beef, bean sprouts and scallion, tossed over a roaring wok for that smoky wok hei.", price: 15.25, imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/HK_SYP_%E8%A5%BF%E7%92%B0_Sai_Ying_Pun_%E5%BE%B7%E8%BC%94%E9%81%93%E8%A5%BF_308_Des_Voeux_Road_West_%E9%A3%9F%E7%A5%9E%E9%BA%97%E5%AE%AE%E9%85%92%E5%AE%B6_Chinese_Banquet_Seafood_Restaurant_food_%E4%B9%BE%E7%82%92%E7%89%9B%E6%B2%B3_Dry-fried_beef_ho_fun_January_2026_N13P_02.jpg/960px-thumbnail.jpg" },
    ],
  },
  {
    id: 2,
    name: "金燈籠 Golden Lantern",
    address: "Dim sum · Chinatown–International District, Seattle · until midnight",
    phone: "(206) 555-0127",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/aa/HK_dim_sum_food_-_streamed_%E8%9D%A6%E9%A4%83_Har_gow_prawn_dumping_white_flour_Feb-2014_MCK.jpg",
    menuItems: [
      { id: 7, name: "Har Gow (4) · 蝦餃", description: "Whole shrimp wrapped in a thin, translucent wheat-starch skin, pleated by hand.", price: 7.5, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/aa/HK_dim_sum_food_-_streamed_%E8%9D%A6%E9%A4%83_Har_gow_prawn_dumping_white_flour_Feb-2014_MCK.jpg" },
      { id: 8, name: "Siu Mai (4) · 燒賣", description: "Open-topped pork and shrimp dumplings, steamed in bamboo.", price: 7.0, imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Dim_sim.jpg/960px-Dim_sim.jpg" },
      { id: 9, name: "Cheung Fun · 腸粉", description: "Silky steamed rice-noodle rolls, finished with sweet soy sauce.", price: 7.25, imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Chee_cheong_fun_1.jpg/960px-Chee_cheong_fun_1.jpg" },
      { id: 10, name: "Char Siu Bao (3) · 叉燒包", description: "Fluffy steamed buns that split open on top to show the sweet barbecued pork inside.", price: 6.75, imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Chashaobao.jpg/960px-Chashaobao.jpg" },
      { id: 11, name: "Lo Mai Gai · 糯米雞", description: "Sticky rice with chicken, shiitake and Chinese sausage, steamed inside a lotus leaf.", price: 7.95, imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Lo_mai_gai.JPG/960px-Lo_mai_gai.JPG" },
      { id: 12, name: "Mango Pudding · 芒果布甸", description: "Chilled mango pudding with a pour of evaporated milk.", price: 5.5, imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Mango_pudding_by_stu_spivack_in_San_Francisco.jpg/960px-Mango_pudding_by_stu_spivack_in_San_Francisco.jpg" },
    ],
  },
  {
    id: 3,
    name: "Elliott Bay Night Market",
    address: "Seattle late-night classics · Waterfront, Seattle · until 1 am",
    phone: "(206) 555-0144",
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/Grilled_Salmon_1_2018-07-03.jpg/960px-Grilled_Salmon_1_2018-07-03.jpg",
    menuItems: [
      { id: 13, name: "Seattle Teriyaki Chicken", description: "Grilled chicken thighs with a sweet teriyaki glaze over rice. The city's unofficial late-night dish.", price: 13.95, imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9b/Fried_chicken_thighs_with_rice.jpg/960px-Fried_chicken_thighs_with_rice.jpg" },
      { id: 14, name: "Pan-Fried Gyoza (6)", description: "Pork and cabbage dumplings with crisp, golden bottoms and a ponzu dip.", price: 8.25, imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/Gyoza_%288664264357%29.jpg/960px-Gyoza_%288664264357%29.jpg" },
      { id: 15, name: "Clam Chowder", description: "Creamy chowder with clams and potato, oyster crackers on the side. Fog-on-the-Sound weather food.", price: 9.5, imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Quail_07_bg_041506.jpg/960px-Quail_07_bg_041506.jpg" },
      { id: 16, name: "Fish & Chips", description: "Battered Pacific cod, thick-cut chips, tartar sauce and a lemon wedge.", price: 16.95, imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Viking_Cinderella%2C_Melody%2C_Fish%27n_chips%2C_20240416_-_30.jpg/960px-Viking_Cinderella%2C_Melody%2C_Fish%27n_chips%2C_20240416_-_30.jpg" },
      { id: 17, name: "Grilled Salmon Bowl", description: "Pacific Northwest salmon off the grill over rice and greens with a citrus-soy glaze.", price: 19.5, imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/Grilled_Salmon_1_2018-07-03.jpg/960px-Grilled_Salmon_1_2018-07-03.jpg" },
    ],
  },
]
