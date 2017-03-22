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
//let CANVAS = {
//  width  : 256,
//  height : 256
//};

let GAME = new Phaser.Game(CANVAS.width, CANVAS.height, Phaser.CANVAS, 'eight',
  {
    preload : preload_8eth,
    create  :  create_8eth,
    update  :  update_8eth
  }
);

let TILE_SIZE = 16;
let TILE_TYPES = {
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
  water_border_outer_west : 1935
}
let LANDUSE = {
  bush : 2,
  cliff : 98,
  grass : 0,
  hill: 4,
  house : 6,
  rock : 5,
  misc : 99,
  tree : 3,
  water : 1
}

let NOISE_GENERATOR;
let NOISE;
let INDICES;
let MAP;

//////// PRELOAD ///////////////////////////////////////////////////////////////
function preload_8eth() {
  GAME.load.spritesheet(
    'img-blow-color',
    'assets/surt-blow-harder-256.png',
    TILE_SIZE,
    TILE_SIZE,
    4408
  );
}

//////// CREATE ////////////////////////////////////////////////////////////////
function create_8eth() {
  init_grass_base();
  add_water(0.6);
  //add_water(TILE_TYPES.hills_group_center, 0.4);
}

function init_grass_base() {
  GAME.stage.backgroundColor = "#9FE30E";
  MAP = new Array(CANVAS.width);
  for (let x = 0; x < CANVAS.width; x += TILE_SIZE) {
    MAP[x] = new Array(CANVAS.height);
    for (let y = 0; y < CANVAS.height; y += TILE_SIZE) {
      let grass = TILE_TYPES.grass_0;
      MAP[x][y] = {
        type : grass,
        category : LANDUSE.grass,
        accessible : true
      }
      GAME.add.sprite(x, y, 'img-blow-color').frame = grass;
    }
  }
}

function add_water(threshold) {
  generate_some_noise();
  for (let x = 0; x < CANVAS.width; x += TILE_SIZE) {
    for (let y = 0; y < CANVAS.height; y += TILE_SIZE) {
      if (NOISE[x][y] > threshold) {
        let water = TILE_TYPES.water_0;
        MAP[x][y] = {
          type : water,
          category : LANDUSE.water,
          accessible : false
        }
        GAME.add.sprite(x, y, 'img-blow-color').frame = water;
      }
    }
  }
  add_water_border();
}

function add_water_border() {
  let text = new Array(CANVAS.width);
  INDICES = new Array(CANVAS.width);
  for (let x = 0; x < CANVAS.width; x += TILE_SIZE) {
    INDICES[x] = new Array(CANVAS.height);
    text[x] = new Array(CANVAS.height);
    for (let y = 0; y < CANVAS.height; y += TILE_SIZE) {
      INDICES[x][y] = get_landuse_index(x, y);
      let style = { font: "8px monospace", fill: "#FFFFFF", align: "center"};
      if (INDICES[x][y] == 0) {
        GAME.add.sprite(x, y, 'img-blow-color').frame = TILE_TYPES.water_0;
      } else if (INDICES[x][y] == 1
              || INDICES[x][y] == 257) { // 257: disputed between inner_swest and inner_neast
        GAME.add.sprite(x, y, 'img-blow-color').frame = TILE_TYPES.water_border_inner_swest;
      } else if (INDICES[x][y] == 2
              || INDICES[x][y] == 3
              || INDICES[x][y] == 5
              || INDICES[x][y] == 6
              || INDICES[x][y] == 7) {
        GAME.add.sprite(x, y, 'img-blow-color').frame = TILE_TYPES.water_border_inner_south;
      } else if (INDICES[x][y] == 4
              || INDICES[x][y] == 68) { // 68: disputed with inner_nwest
        GAME.add.sprite(x, y, 'img-blow-color').frame = TILE_TYPES.water_border_inner_seast;
      } else if (INDICES[x][y] == 64) {
        GAME.add.sprite(x, y, 'img-blow-color').frame = TILE_TYPES.water_border_inner_nwest;
      } else if (INDICES[x][y] == 256) {
        GAME.add.sprite(x, y, 'img-blow-color').frame = TILE_TYPES.water_border_inner_neast;
      } else if (INDICES[x][y] == 11
              || INDICES[x][y] == 15
              || INDICES[x][y] == 71
              || INDICES[x][y] == 75
              || INDICES[x][y] == 77
              || INDICES[x][y] == 70
              || INDICES[x][y] == 35
              || INDICES[x][y] == 69
              || INDICES[x][y] == 76
              || INDICES[x][y] == 78
              || INDICES[x][y] == 12
              || INDICES[x][y] == 67
              || INDICES[x][y] == 321
              || INDICES[x][y] == 79) {
        GAME.add.sprite(x, y, 'img-blow-color').frame = TILE_TYPES.water_border_outer_neast;
      } else if (INDICES[x][y] == 38
              || INDICES[x][y] == 39
              || INDICES[x][y] == 33
              || INDICES[x][y] == 262
              || INDICES[x][y] == 34
              || INDICES[x][y] == 263
              || INDICES[x][y] == 259
              || INDICES[x][y] == 293
              || INDICES[x][y] == 294
              || INDICES[x][y] == 295) {
        GAME.add.sprite(x, y, 'img-blow-color').frame = TILE_TYPES.water_border_outer_nwest;
      } else if (INDICES[x][y] == 73
              || INDICES[x][y] == 8
              || INDICES[x][y] == 65
              || INDICES[x][y] == 72
              || INDICES[x][y] == 9) {
        GAME.add.sprite(x, y, 'img-blow-color').frame = TILE_TYPES.water_border_outer_east;
      } else if (INDICES[x][y] == 32
              || INDICES[x][y] == 36
              || INDICES[x][y] == 260
              || INDICES[x][y] == 288
              || INDICES[x][y] == 292) {
        GAME.add.sprite(x, y, 'img-blow-color').frame = TILE_TYPES.water_border_outer_west;
      } else if (INDICES[x][y] == 448
              || INDICES[x][y] == 192
              || INDICES[x][y] == 128
              || INDICES[x][y] == 320
              || INDICES[x][y] == 129 // 129: disputed with inner_swest
              || INDICES[x][y] == 384) {
        GAME.add.sprite(x, y, 'img-blow-color').frame = TILE_TYPES.water_border_outer_south;
      } else if (INDICES[x][y] == 420
              || INDICES[x][y] == 356
              || INDICES[x][y] == 416
              || INDICES[x][y] == 484
              || INDICES[x][y] == 452
              || INDICES[x][y] == 228
              || INDICES[x][y] == 100
              || INDICES[x][y] == 196
              || INDICES[x][y] == 388
              || INDICES[x][y] == 480) {
        GAME.add.sprite(x, y, 'img-blow-color').frame = TILE_TYPES.water_border_outer_swest;
      } else if (INDICES[x][y] == 201
              || INDICES[x][y] == 193
              || INDICES[x][y] == 200
              || INDICES[x][y] == 329
              || INDICES[x][y] == 224
              || INDICES[x][y] == 136
              || INDICES[x][y] == 456
              || INDICES[x][y] == 385
              || INDICES[x][y] == 265
              || INDICES[x][y] == 132
              || INDICES[x][y] == 457
              || INDICES[x][y] == 449) {
        GAME.add.sprite(x, y, 'img-blow-color').frame = TILE_TYPES.water_border_outer_seast;
      } else if (INDICES[x][y] == 511
              || INDICES[x][y] == 47
              || INDICES[x][y] == 199
              || INDICES[x][y] == 455
              || INDICES[x][y] == 300
              || INDICES[x][y] == 454
              || INDICES[x][y] == 391
              || INDICES[x][y] == 203
              || INDICES[x][y] == 331
              || INDICES[x][y] == 367
              || INDICES[x][y] == 493
              || INDICES[x][y] == 495
              || INDICES[x][y] == 459
              || INDICES[x][y] == 423
              || INDICES[x][y] == 359
              || INDICES[x][y] == 492
              || INDICES[x][y] == 422
              || INDICES[x][y] == 485
              || INDICES[x][y] == 486
              || INDICES[x][y] == 386
              || INDICES[x][y] == 365
              || INDICES[x][y] == 254
              || INDICES[x][y] == 440
              || INDICES[x][y] == 304
              || INDICES[x][y] == 120
              || INDICES[x][y] == 248
              || INDICES[x][y] == 254
              || INDICES[x][y] == 25
              || INDICES[x][y] == 123
              || INDICES[x][y] == 48
              || INDICES[x][y] == 109
              || INDICES[x][y] == 207
              || INDICES[x][y] == 364
              || INDICES[x][y] == 301
              || INDICES[x][y] == 198
              || INDICES[x][y] == 487
              || INDICES[x][y] == 431
              || INDICES[x][y] == 451
              || INDICES[x][y] == 325
              || INDICES[x][y] == 318
              || INDICES[x][y] == 247
              || INDICES[x][y] == 247
              || INDICES[x][y] == 253
              || INDICES[x][y] == 126
              || INDICES[x][y] == 478
              || INDICES[x][y] == 433
              || INDICES[x][y] == 443
              || INDICES[x][y] == 118
              || INDICES[x][y] == 17
              || INDICES[x][y] == 272
              || INDICES[x][y] == 361
              || INDICES[x][y] == 41
              || INDICES[x][y] == 421
              || INDICES[x][y] == 408
              || INDICES[x][y] == 376
              || INDICES[x][y] == 499
              || INDICES[x][y] == 24
              || INDICES[x][y] == 249
              || INDICES[x][y] == 105
              || INDICES[x][y] == 434
              || INDICES[x][y] == 400
              || INDICES[x][y] == 312
              || INDICES[x][y] == 112
              || INDICES[x][y] == 220
              || INDICES[x][y] == 481
              || INDICES[x][y] == 111
              || INDICES[x][y] == 461
              || INDICES[x][y] == 303
              || INDICES[x][y] == 267
              || INDICES[x][y] == 417
              || INDICES[x][y] == 271
              || INDICES[x][y] == 31
              || INDICES[x][y] == 63
              || INDICES[x][y] == 124
              || INDICES[x][y] == 248
              || INDICES[x][y] == 102
              || INDICES[x][y] == 55
              || INDICES[x][y] == 447
              || INDICES[x][y] == 319
              || INDICES[x][y] == 127
              || INDICES[x][y] == 444
              || INDICES[x][y] == 313
              || INDICES[x][y] == 59
              || INDICES[x][y] == 25
              || INDICES[x][y] == 59
              || INDICES[x][y] == 208
              || INDICES[x][y] == 474
              || INDICES[x][y] == 16
              || INDICES[x][y] == 506
              || INDICES[x][y] == 464
              || INDICES[x][y] == 60
              || INDICES[x][y] == 30
              || INDICES[x][y] == 26
              || INDICES[x][y] == 255
              || INDICES[x][y] == 31
              || INDICES[x][y] == 95
              || INDICES[x][y] == 505
              || INDICES[x][y] == 504
              || INDICES[x][y] == 472
              || INDICES[x][y] == 251
              || INDICES[x][y] == 89
              || INDICES[x][y] == 223
              || INDICES[x][y] == 475
              || INDICES[x][y] == 473
              || INDICES[x][y] == 507
              || INDICES[x][y] == 504
              || INDICES[x][y] == 472
              || INDICES[x][y] == 217
              || INDICES[x][y] == 219
              || INDICES[x][y] == 479
              || INDICES[x][y] == 91
              || INDICES[x][y] == 216
              || INDICES[x][y] == 311
              || INDICES[x][y] == 439
              || INDICES[x][y] == 502
              || INDICES[x][y] == 510
              || INDICES[x][y] == 500
              || INDICES[x][y] == 432
              || INDICES[x][y] == 496
              || INDICES[x][y] == 436
              || INDICES[x][y] == 27
              || INDICES[x][y] == 62
              || INDICES[x][y] == 52
              || INDICES[x][y] == 54
              || INDICES[x][y] == 503
              || INDICES[x][y] == 509
              || INDICES[x][y] == 310
              || INDICES[x][y] == 438
              || INDICES[x][y] == 316
              || INDICES[x][y] == 56
              || INDICES[x][y] == 121
              || INDICES[x][y] == 316
              || INDICES[x][y] == 383
              || INDICES[x][y] == 239
              || INDICES[x][y] == 477
              || INDICES[x][y] == 375
              || INDICES[x][y] == 494
              || INDICES[x][y] == 509
              || INDICES[x][y] == 88
              || INDICES[x][y] == 240
              || INDICES[x][y] == 222
              || INDICES[x][y] == 23
              || INDICES[x][y] == 191
              || INDICES[x][y] == 230
              || INDICES[x][y] == 206
              || INDICES[x][y] == 44
              || INDICES[x][y] == 476
              || INDICES[x][y] == 119
              || INDICES[x][y] == 508
              || INDICES[x][y] == 218
              || INDICES[x][y] == 446
              || INDICES[x][y] == 308
              || INDICES[x][y] == 387
              || INDICES[x][y] == 488
              || INDICES[x][y] == 489
              || INDICES[x][y] == 463) {
        GAME.add.sprite(x, y, 'img-blow-color').frame = TILE_TYPES.grass_0;
      } else {
        style = { font: "8px monospace", fill: "#FF0000", align: "center"};
      }
      //text[x][y] = GAME.add.text(
      //  x + 8,
      //  y + 8,
      //  String(INDICES[x][y]),
      //  style
      //);
      //text[x][y].anchor.set(0.5);
    }
  }
}

function get_landuse_index(x, y) {
  let landuse_index = 0;
  if (get_landuse_neast(x, y) == LANDUSE.grass) {
    landuse_index += 1;
  }
  if (get_landuse_north(x, y) == LANDUSE.grass) {
    landuse_index += 2;
  }
  if (get_landuse_nwest(x, y) == LANDUSE.grass) {
    landuse_index += 4;
  }
  if (get_landuse_east(x, y) == LANDUSE.grass) {
    landuse_index += 8;
  }
  if (get_landuse_center(x, y) == LANDUSE.grass) {
    landuse_index += 16;
  }
  if (get_landuse_west(x, y) == LANDUSE.grass) {
    landuse_index += 32;
  }
  if (get_landuse_seast(x, y) == LANDUSE.grass) {
    landuse_index += 64;
  }
  if (get_landuse_south(x, y) == LANDUSE.grass) {
    landuse_index += 128;
  }
  if (get_landuse_swest(x, y) == LANDUSE.grass) {
    landuse_index += 256;
  }
  return landuse_index;
}

function get_landuse_center(x, y) {
  return MAP[x][y].category;
}

function get_landuse_neast(x, y) {
  if (x >= CANVAS.width - TILE_SIZE || y < TILE_SIZE) {
    return LANDUSE.grass;
  } else {
    return MAP[x + TILE_SIZE][y - TILE_SIZE].category;
  }
}

function get_landuse_north(x, y) {
  if (y < TILE_SIZE) {
    return LANDUSE.grass;
  } else {
    return MAP[x][y - TILE_SIZE].category;
  }
}

function get_landuse_nwest(x, y) {
  if (x < TILE_SIZE || y < TILE_SIZE) {
    return LANDUSE.grass;
  } else {
    return MAP[x - TILE_SIZE][y - TILE_SIZE].category;
  }
}

function get_landuse_west(x, y) {
  if (x < TILE_SIZE) {
    return LANDUSE.grass;
  } else {
    return MAP[x - TILE_SIZE][y].category;
  }
}

function get_landuse_swest(x, y) {
  if (x < TILE_SIZE || y >= CANVAS.height - TILE_SIZE) {
    return LANDUSE.grass;
  } else {
    return MAP[x - TILE_SIZE][y + TILE_SIZE].category;
  }
}

function get_landuse_south(x, y) {
  if (y >= CANVAS.height - TILE_SIZE) {
    return LANDUSE.grass;
  } else {
    return MAP[x][y + TILE_SIZE].category;
  }
}

function get_landuse_seast(x, y) {
  if (x >= CANVAS.width - TILE_SIZE || y >= CANVAS.height - TILE_SIZE) {
    return LANDUSE.grass;
  } else {
    return MAP[x + TILE_SIZE][y + TILE_SIZE].category;
  }
}

function get_landuse_east(x, y) {
  if (x >= CANVAS.width - TILE_SIZE) {
    return LANDUSE.grass;
  } else {
    return MAP[x + TILE_SIZE][y].category;
  }
}

function generate_some_noise(){
  NOISE_GENERATOR = new SimplexNoise(Math.random);
  NOISE = new Array(CANVAS.width);
  for (let x = 0; x < CANVAS.width; x += TILE_SIZE) {
    NOISE[x] = new Array(CANVAS.height);
    for (let y = 0; y < CANVAS.height; y += TILE_SIZE) {
      let noise_x = x / CANVAS.width - 0.5;
      let noise_y = y / CANVAS.height - 0.5;
      NOISE[x][y]
        = (         generate_noise(     noise_x,      noise_y)
        + 0.5000 * generate_noise( 2 * noise_x,  2 * noise_y)
        + 0.2500 * generate_noise( 4 * noise_x,  4 * noise_y)
        + 0.1250 * generate_noise( 8 * noise_x,  8 * noise_y)
        + 0.0625 * generate_noise(16 * noise_x, 16 * noise_y)
        ) / (1 + 0.5 + 0.25 + 0.125 + 0.0625);
    }
  }
}

function generate_noise(noise_x, noise_y) {
  return NOISE_GENERATOR.noise2D(noise_x, noise_y) / 2 + 0.5;
}

//////// UPDATE ////////////////////////////////////////////////////////////////
function update_8eth() {}
