////////////////////////////////////////////////////////////////////////////////
/// Title            8bit ethereum procedural transaction visualization   [8eth]
/// Copyright        (c) 2017, Afri Schoedon                             [5chdn]
/// License          GNU General Public License                            [GPL]
/// License Version  3.0, 29 June 2007                                      [v3]
////////////////////////////////////////////////////////////////////////////////

//////// PARAMETERS ////////////////////////////////////////////////////////////
let CANVAS = {
  width  : document.getElementById("eight").clientWidth,
  height : document.getElementById("eight").clientHeight
};

let GAME = new Phaser.Game(CANVAS.width, CANVAS.height, Phaser.AUTO, 'eight',
  {
    preload : preload_8eth,
    create  :  create_8eth,
    update  :  update_8eth
  }
);

let TILES = {
  bush_0 : 2038,
  bush_1 : 2039,
  cliff_border_inner_east : 2282,
  cliff_border_inner_neast : 2166,
  cliff_border_inner_north : 2165,
  cliff_border_inner_nwest : 2164,
  cliff_border_inner_seast : 2398,
  cliff_border_inner_south : 2397,
  cliff_border_inner_swest : 2396,
  cliff_border_inner_west : 2280,
  cliff_border_outer_east : 2285,
  cliff_border_outer_neast : 2169,
  cliff_border_outer_north : 2168,
  cliff_border_outer_nwest : 2167,
  cliff_border_outer_seast : 2401,
  cliff_border_outer_south : 2400,
  cliff_border_outer_swest : 2399,
  cliff_border_outer_west : 2283,
  grass_0 : 1805,
  grass_1 : 1806,
  grass_2 : 1807,
  grass_3 : 1922,
  grass_4 : 1923,
  hill_0: 2737,
  hills_group_center : 2623,
  hills_group_east : 2624,
  hills_group_neast : 2508,
  hills_group_north : 2507,
  hills_group_nwest : 2506,
  hills_group_seast : 2740,
  hills_group_south : 2739,
  hills_group_swest : 2738,
  hills_group_west : 2622,
  house_0 : 2154,
  house_1 : 2155,
  rocks_group_center : 2971,
  rocks_group_east : 2972,
  rocks_group_gap_north : 2858,
  rocks_group_gap_south : 2974,
  rocks_group_neast : 2856,
  rocks_group_north : 2855,
  rocks_group_nwest : 2854,
  rocks_group_seast : 3088,
  rocks_group_small_north : 2857,
  rocks_group_small_south : 2973,
  rocks_group_south : 3087,
  rocks_group_swest : 3086,
  rocks_group_west : 2970,
  rocks_single_big : 3085,
  rocks_single_medium : 2969,
  rocks_single_small: 2853,
  shrooms_0 : 2040,
  tomb_0 : 2966,
  tomb_1 : 2967,
  tomb_2 : 3082,
  tomb_3 : 3083,
  tree_leaf_group_center : 2275,
  tree_leaf_group_dead_north : 2161,
  tree_leaf_group_dead_south : 2277,
  tree_leaf_group_east : 2276,
  tree_leaf_group_gap_north : 2162,
  tree_leaf_group_gap_south : 2278,
  tree_leaf_group_neast : 2160,
  tree_leaf_group_north : 2159,
  tree_leaf_group_nwest : 2158,
  tree_leaf_group_seast : 2392,
  tree_leaf_group_south : 2391,
  tree_leaf_group_swest : 2390,
  tree_leaf_group_west : 2274,
  tree_leaf_single_big : 2389,
  tree_leaf_single_medium : 2273,
  tree_leaf_single_small : 2157,
  tree_needle_group_center : 1927,
  tree_needle_group_dead_north : 1813,
  tree_needle_group_dead_south : 1929,
  tree_needle_group_east : 1928,
  tree_needle_group_gap_north : 1814,
  tree_needle_group_gap_south : 1930,
  tree_needle_group_neast : 1812,
  tree_needle_group_north : 1811,
  tree_needle_group_nwest : 1810,
  tree_needle_group_seast : 2044,
  tree_needle_group_south : 2043,
  tree_needle_group_swest : 2042,
  tree_needle_group_west : 1926,
  tree_needle_single_big : 2041,
  tree_needle_single_medium : 1925,
  tree_needle_single_small : 1809,
  tree_stub_medium : 1924,
  tree_stub_small : 1808,
  water_0 : 1815,
  water_1 : 1931,
  water_2 : 2047,
  water_border_inner_east : 1934,
  water_border_inner_neast : 1818,
  water_border_inner_north : 1817,
  water_border_inner_nwest : 1816,
  water_border_inner_seast : 2050,
  water_border_inner_south : 2049,
  water_border_inner_swest : 2048,
  water_border_inner_west : 1932,
  water_border_outer_east : 1937,
  water_border_outer_neast : 1821,
  water_border_outer_north : 1820,
  water_border_outer_nwest : 1819,
  water_border_outer_seast : 2053,
  water_border_outer_south : 2052,
  water_border_outer_swest : 2051,
  water_border_outer_west : 1935,
}

let NOISE_GENERATOR;
let TERRAIN;

//////// PRELOAD ///////////////////////////////////////////////////////////////
function preload_8eth() {
  GAME.load.spritesheet(
    'img-blow-color',
    'assets/surt-blow-harder-256.png',
    16,
    16,
    4408
  );
}

//////// CREATE ////////////////////////////////////////////////////////////////
function create_8eth() {
  create_grass_base();
  add_biome(TILES.water_0, 0.6);
}

function create_grass_base() {
  GAME.stage.backgroundColor = "#9FE30E";
  for (let x = 0; x < CANVAS.width; x += 16) {
    for (let y = 0; y < CANVAS.height; y += 16) {
      let threshold = Math.random() * 100.0;
      if        (threshold > 95) {
        GAME.add.sprite(x, y, 'img-blow-color').frame = TILES.grass_1;
      } else if (threshold > 90) {
        GAME.add.sprite(x, y, 'img-blow-color').frame = TILES.grass_2;
      } else if (threshold > 85) {
        GAME.add.sprite(x, y, 'img-blow-color').frame = TILES.grass_3;
      } else if (threshold > 80) {
        GAME.add.sprite(x, y, 'img-blow-color').frame = TILES.grass_4;
      } else {
        if        (threshold < 0.001) {
          GAME.add.sprite(x, y, 'img-blow-color').frame = TILES.tomb_0;
        } else if (threshold < 0.002) {
          GAME.add.sprite(x, y, 'img-blow-color').frame = TILES.tomb_1;
        } else if (threshold < 0.003) {
          GAME.add.sprite(x, y, 'img-blow-color').frame = TILES.tomb_2;
        } else if (threshold < 0.004) {
          GAME.add.sprite(x, y, 'img-blow-color').frame = TILES.tomb_3;
        } else if (threshold < 0.005) {
          GAME.add.sprite(x, y, 'img-blow-color').frame = TILES.house_0;
        } else if (threshold < 0.006) {
          GAME.add.sprite(x, y, 'img-blow-color').frame = TILES.house_1;
        } else if (threshold < 0.007) {
          GAME.add.sprite(x, y, 'img-blow-color').frame = TILES.shrooms_0;
        } else if (threshold < 0.008) {
          GAME.add.sprite(x, y, 'img-blow-color').frame = TILES.bush_0;
        } else if (threshold < 0.009) {
          GAME.add.sprite(x, y, 'img-blow-color').frame = TILES.bush_1;
        } else {
          GAME.add.sprite(x, y, 'img-blow-color').frame = TILES.grass_0;
        }
      }
    }
  }
}

function add_biome(biome, threshold) {
  generate_some_noise();
  for (let x = 0; x < CANVAS.width; x += 16) {
    for (let y = 0; y < CANVAS.height; y += 16) {
      if (TERRAIN[x][y] > threshold)
        GAME.add.sprite(x, y, 'img-blow-color').frame = biome;
    }
  }
}

function generate_some_noise(){
  NOISE_GENERATOR = new SimplexNoise(Math.random);
  TERRAIN = new Array(CANVAS.width);
  for (let x = 0; x < CANVAS.width; x += 16) {
    TERRAIN[x] = new Array(CANVAS.height);
    for (let y = 0; y < CANVAS.height; y += 16) {
      let noise_x = x / CANVAS.width - 0.5;
      let noise_y = y / CANVAS.height - 0.5;
      TERRAIN[x][y]
        =          generate_noise(     noise_x,      noise_y)
        + 0.5000 * generate_noise( 2 * noise_x,  2 * noise_y)
        + 0.2500 * generate_noise( 4 * noise_x,  4 * noise_y)
        + 0.1250 * generate_noise( 8 * noise_x,  8 * noise_y)
        + 0.0625 * generate_noise(16 * noise_x, 16 * noise_y)
        - 0.6375;
    }
  }
}

function generate_noise(noise_x, noise_y) {
  return NOISE_GENERATOR.noise2D(noise_x, noise_y) / 2 + 0.5;
}

//////// UPDATE ////////////////////////////////////////////////////////////////
function update_8eth() {}
