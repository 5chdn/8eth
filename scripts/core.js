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
  init_ocean();
  add_continents();
  detect_coasts();
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
        accessible : false
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
        continue;
      }
      GAME.add.sprite(x, y, 'img-blow-color').frame = coast;
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
