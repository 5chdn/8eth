////////////////////////////////////////////////////////////////////////////////
/// Title            8bit ethereum procedural transaction visualization   [8eth]
/// Copyright        (c) 2017, Afri Schoedon                             [5chdn]
/// License          GNU General Public License                            [GPL]
/// License Version  3.0, 29 June 2007                                      [v3]
////////////////////////////////////////////////////////////////////////////////

                                                            //.TODO
let GAME = new Phaser.Game(CANVAS.width, CANVAS.height, Phaser.CANVAS, 'eight',
  {
    preload : preload_8eth,
    create  :  create_8eth,
    update  :  update_8eth
  }
);

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
  //debug();
  init_ocean();
  add_continents();
  detect_coasts();
  add_forrest(0);
  add_forrest(1);
}

function init_ocean() {
  GAME.stage.backgroundColor = "#0FD7FF";
  generate_noise_map();
  MAP = new Array(CANVAS.width);
  for (let x = 0; x < CANVAS.width; x += TILE_SIZE) {
    MAP[x] = new Array(CANVAS.height);
    for (let y = 0; y < CANVAS.height; y += TILE_SIZE) {
      let water = TILE_TYPES.water_0;
      if (NOISE[x][y] < 0.2) {
        water = TILE_TYPES.water_2;
      } else if (NOISE[x][y] < 0.3) {
        water = TILE_TYPES.water_1;
      }
      MAP[x][y] = {
        type : water,
        landuse : LANDUSE.water,
        accessible : false
      }
      GAME.add.sprite(x, y, 'img-blow-color').frame = water;
    }
  }
}

function add_continents () {
  generate_noise_map();
  for (let x = 0; x < CANVAS.width; x += TILE_SIZE) {
    for (let y = 0; y < CANVAS.height; y += TILE_SIZE) {
      let grass = TILE_TYPES.grass_0;
      if (NOISE[x][y] > 0.9) {
        grass = TILE_TYPES.grass_1;
      } else if (NOISE[x][y] > 0.8) {
        grass = TILE_TYPES.grass_2;
      } else if (NOISE[x][y] > 0.7) {
        grass = TILE_TYPES.grass_3;
      } else if (NOISE[x][y] > 0.6) {
        grass = TILE_TYPES.grass_4;
      } else if (NOISE[x][y] < 0.4) {
        continue;
      }
      MAP[x][y] = {
        type : grass,
        landuse : LANDUSE.grass,
        accessible : true
      }
      GAME.add.sprite(x, y, 'img-blow-color').frame = grass;
    }
  }
}

function detect_coasts() {
  let text = new Array(CANVAS.width);
  INDICES = new Array(CANVAS.width);
  for (let x = 0; x < CANVAS.width; x += TILE_SIZE) {
    INDICES[x] = new Array(CANVAS.height);
    text[x] = new Array(CANVAS.height);
    for (let y = 0; y < CANVAS.height; y += TILE_SIZE) {
      INDICES[x][y] = get_landuse_index(x, y);
      let coast = TILE_TYPES.water_2;
      let access = false;
      let style = { font: "8px monospace", fill: "#FFFFFF", align: "center"};
      if (COAST_TYPES.water.includes(INDICES[x][y])) {
        continue;
      } else if (COAST_TYPES.continent.includes(INDICES[x][y])) {
        continue;
      } else if (COAST_TYPES.wetlands.includes(INDICES[x][y])) {
        if (Math.random() < 0.3) {
          coast = TILE_TYPES.bush_0;
        } else if (Math.random() < 0.3)  {
          coast = TILE_TYPES.bush_1;
        } else {
          coast = TILE_TYPES.grass_4;
        }
        access = true;
      } else if (COAST_TYPES.inner_nwest.includes(INDICES[x][y])) {
        coast = TILE_TYPES.water_border_inner_nwest;
      } else if (COAST_TYPES.inner_neast.includes(INDICES[x][y])) {
        coast = TILE_TYPES.water_border_inner_neast;
      } else if (COAST_TYPES.inner_swest.includes(INDICES[x][y])) {
        coast = TILE_TYPES.water_border_inner_swest;
      } else if (COAST_TYPES.inner_seast.includes(INDICES[x][y])) {
        coast = TILE_TYPES.water_border_inner_seast;
      } else if (COAST_TYPES.outer_north.includes(INDICES[x][y])) {
        coast = TILE_TYPES.water_border_outer_north;
      } else if (COAST_TYPES.outer_nwest.includes(INDICES[x][y])) {
        coast = TILE_TYPES.water_border_outer_nwest;
      } else if (COAST_TYPES.outer_west.includes(INDICES[x][y])) {
        coast = TILE_TYPES.water_border_outer_west;
      } else if (COAST_TYPES.outer_swest.includes(INDICES[x][y])) {
        coast = TILE_TYPES.water_border_outer_swest;
      } else if (COAST_TYPES.outer_south.includes(INDICES[x][y])) {
        coast = TILE_TYPES.water_border_outer_south;
      } else if (COAST_TYPES.outer_seast.includes(INDICES[x][y])) {
        coast = TILE_TYPES.water_border_outer_seast;
      } else if (COAST_TYPES.outer_east.includes(INDICES[x][y])) {
        coast = TILE_TYPES.water_border_outer_east;
      } else if (COAST_TYPES.outer_neast.includes(INDICES[x][y])) {
        coast = TILE_TYPES.water_border_outer_neast;
      } else {
        style = { font: "8px monospace", fill: "#FF0000", align: "center"};
        text[x][y] = GAME.add.text(
          x + 8,
          y + 8,
          String(INDICES[x][y]),
          style
        );
        text[x][y].anchor.set(0.5);
        text[x][y].coast_index = INDICES[x][y];
        text[x][y].inputEnabled = true;
        text[x][y].events.onInputDown.add(debug_tile, this);
        continue;
      }
//      MAP[x][y] = {
//        type : coast,
//        landuse : LANDUSE.water,
//        accessible : access
//      }
      let tile = GAME.add.sprite(x, y, 'img-blow-color')
      tile.frame = coast;
      tile.coast_index = INDICES[x][y];
      tile.inputEnabled = true;
      tile.events.onInputDown.add(debug_tile, this);
    }
  }
}

function add_forrest(type) {
  generate_noise_map();
  for (let x = 0; x < CANVAS.width; x += TILE_SIZE) {
    for (let y = 0; y < CANVAS.height; y += TILE_SIZE) {
      if (MAP[x][y].landuse == LANDUSE.grass) {
        let threshold = Math.random();
        if (NOISE[x][y] < 0.2) {
          let rock = TILE_TYPES.rocks_single_small;
          if (threshold < 0.4) {
            rock = TILE_TYPES.rocks_single_big;
          } else if (threshold < 0.8) {
            rock = TILE_TYPES.rocks_single_medium;
          }
          MAP[x][y] = {
            type : rock,
            landuse : LANDUSE.rock,
            accessible : false
          }
          GAME.add.sprite(x, y, 'img-blow-color').frame = rock;
        } else if (NOISE[x][y] > 0.8) {
          let tree = TILE_TYPES.tree_leaf_single_small;
          switch (type) {
            case 0:
              if (threshold < 0.4) {
                tree = TILE_TYPES.tree_leaf_single_big;
              } else if (threshold < 0.8) {
                tree = TILE_TYPES.tree_leaf_single_medium;
              }
              break;
            case 1:
              if (threshold < 0.4) {
                tree = TILE_TYPES.tree_needle_single_big;
              } else if (threshold < 0.8) {
                tree = TILE_TYPES.tree_needle_single_medium;
              } else {
                tree = TILE_TYPES.tree_needle_single_small;
              }
              break;
            default:
              tree = TILE_TYPES.tree_leaf_single_small;
          }
          MAP[x][y] = {
            type : tree,
            landuse : LANDUSE.tree,
            accessible : false
          }
          GAME.add.sprite(x, y, 'img-blow-color').frame = tree;
        }
      }
    }
  }
}

//function detect_forrest_edge(type) {
//  let text = new Array(CANVAS.width);
//  for (let x = 0; x < CANVAS.width; x += TILE_SIZE) {
//    text[x] = new Array(CANVAS.height);
//    for (let y = 0; y < CANVAS.height; y += TILE_SIZE) {
//      if (MAP[x][y] == LANDUSE.tree) {
//        INDICES[x][y] = get_landuse_index(x, y);
//      }
//    }
//  }
//}

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
  return MAP[x][y].landuse;
}

function get_landuse_neast(x, y) {
  if (x >= CANVAS.width - TILE_SIZE || y < TILE_SIZE) {
    return LANDUSE.grass;
  } else {
    return MAP[x + TILE_SIZE][y - TILE_SIZE].landuse;
  }
}

function get_landuse_north(x, y) {
  if (y < TILE_SIZE) {
    return LANDUSE.grass;
  } else {
    return MAP[x][y - TILE_SIZE].landuse;
  }
}

function get_landuse_nwest(x, y) {
  if (x < TILE_SIZE || y < TILE_SIZE) {
    return LANDUSE.grass;
  } else {
    return MAP[x - TILE_SIZE][y - TILE_SIZE].landuse;
  }
}

function get_landuse_west(x, y) {
  if (x < TILE_SIZE) {
    return LANDUSE.grass;
  } else {
    return MAP[x - TILE_SIZE][y].landuse;
  }
}

function get_landuse_swest(x, y) {
  if (x < TILE_SIZE || y >= CANVAS.height - TILE_SIZE) {
    return LANDUSE.grass;
  } else {
    return MAP[x - TILE_SIZE][y + TILE_SIZE].landuse;
  }
}

function get_landuse_south(x, y) {
  if (y >= CANVAS.height - TILE_SIZE) {
    return LANDUSE.grass;
  } else {
    return MAP[x][y + TILE_SIZE].landuse;
  }
}

function get_landuse_seast(x, y) {
  if (x >= CANVAS.width - TILE_SIZE || y >= CANVAS.height - TILE_SIZE) {
    return LANDUSE.grass;
  } else {
    return MAP[x + TILE_SIZE][y + TILE_SIZE].landuse;
  }
}

function get_landuse_east(x, y) {
  if (x >= CANVAS.width - TILE_SIZE) {
    return LANDUSE.grass;
  } else {
    return MAP[x + TILE_SIZE][y].landuse;
  }
}

function generate_noise_map(){
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

//////// DEBUG /////////////////////////////////////////////////////////////////
function debug() {
  GAME.stage.backgroundColor = "#FF0000";

  let x = 0;
  let y = 0;
  let i = 0;
  let b = true;
  do {
    i = 0;
    let w = TILE_TYPES.water_2;
    let g = TILE_TYPES.grass_2;
    let tile = [w, w, w,
                w, w, w,
                w, w, w];

    if (Math.random() > 0.5) { tile[0] = g; i +=   1; }
    if (Math.random() > 0.5) { tile[1] = g; i +=   2; }
    if (Math.random() > 0.5) { tile[2] = g; i +=   4; }
    if (Math.random() > 0.5) { tile[3] = g; i +=   8; }
    if (Math.random() > 0.5) { tile[4] = g; i +=  16; }
    if (Math.random() > 0.5) { tile[5] = g; i +=  32; }
    if (Math.random() > 0.5) { tile[6] = g; i +=  64; }
    if (Math.random() > 0.5) { tile[7] = g; i += 128; }
    if (Math.random() > 0.5) { tile[8] = g; i += 256; }

    if (COAST_TYPES.water.includes(i) || COAST_TYPES.continent.includes(i) || COAST_TYPES.wetlands.includes(i) || COAST_TYPES.inner_nwest.includes(i) || COAST_TYPES.inner_neast.includes(i) || COAST_TYPES.inner_swest.includes(i) || COAST_TYPES.inner_seast.includes(i) || COAST_TYPES.outer_north.includes(i) || COAST_TYPES.outer_nwest.includes(i) || COAST_TYPES.outer_west.includes(i) || COAST_TYPES.outer_swest.includes(i) || COAST_TYPES.outer_south.includes(i) || COAST_TYPES.outer_seast.includes(i) || COAST_TYPES.outer_east.includes(i) || COAST_TYPES.outer_neast.includes(i)) {
      continue;
    } else {
      GAME.add.sprite( x +  0, y +  0, 'img-blow-color').frame = tile[0];
      GAME.add.sprite( x + 16, y +  0, 'img-blow-color').frame = tile[1];
      GAME.add.sprite( x + 32, y +  0, 'img-blow-color').frame = tile[2];
      GAME.add.sprite( x +  0, y + 16, 'img-blow-color').frame = tile[3];
      GAME.add.sprite( x + 16, y + 16, 'img-blow-color').frame = tile[4];
      GAME.add.sprite( x + 32, y + 16, 'img-blow-color').frame = tile[5];
      GAME.add.sprite( x +  0, y + 32, 'img-blow-color').frame = tile[6];
      GAME.add.sprite( x + 16, y + 32, 'img-blow-color').frame = tile[7];
      GAME.add.sprite( x + 32, y + 32, 'img-blow-color').frame = tile[8];

      window.console.log(String(i));

      let style = { font: "16px monospace", fill: "#FFFFFF", align: "center"};
      let text = GAME.add.text(
        x + 64,
        y + 16,
        String(i),
        style
      );
      text.anchor.set(0.5);
      text.inputEnabled = true;
      text.events.onInputDown.add(color_text, this);
      y += 64;
      if (y > CANVAS.height - 64) {
        y = 0;
        x += 128;
        if (x > CANVAS.width - 128) {
          b = false;
        }
      }
    }
  } while (b)
}

function color_text(text) {
  text.fill = "#000000";
}

function debug_tile (tile) {
  window.console.log(tile.coast_index);
}
