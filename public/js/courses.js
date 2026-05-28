// FPG Course Database - UPDATED WITH OFFICIAL USGA RATINGS
// Last updated: 2026-01-15
// Source: Official USGA Course Handicap Calculator (ncrdb.usga.org)
// All slope ratings and course ratings verified from USGA database

const FPG_COURSES = {
  
  // ============================================
  // HUNTINGTON HILLS GOLF CLUB - Lakeland, FL
  // ============================================
  'Huntington Hills Golf Club': {
    aliases: ['Huntington Hills', 'Huntington Hills GC', 'Huntington Hills Golf & Country Club'],
    defaultTees: { men: 'blue', women: 'red' },
    tees: {
      // Men's tees
      gold: { rating: 71.0, slope: 125, par: 72 },
      blue: { rating: 68.6, slope: 121, par: 72 },      // FPG Default Men
      white: { rating: 66.5, slope: 117, par: 72 },     // FPG Alt Men
      black: { rating: 63.5, slope: 103, par: 72 },
      red: { rating: 63.2, slope: 90, par: 72 },
      green: { rating: 61.7, slope: 93, par: 72 },
      // Women's tees
      'blue-female': { rating: 73.6, slope: 136, par: 72 },
      'white-female': { rating: 71.1, slope: 132, par: 72 },
      'black-female': { rating: 67.2, slope: 127, par: 72 },
      'red-female': { rating: 66.7, slope: 122, par: 72 }, // FPG Default Women
      'green-female': { rating: 64.4, slope: 113, par: 72 }
    },
    holes: [
      { par_m: 4, par_f: 4, hcp_m: 15, hcp_f: 13 },  // Hole 1
      { par_m: 4, par_f: 4, hcp_m: 3,  hcp_f: 3 },   // Hole 2
      { par_m: 4, par_f: 4, hcp_m: 1,  hcp_f: 1 },   // Hole 3
      { par_m: 3, par_f: 3, hcp_m: 13, hcp_f: 11 },  // Hole 4 - PAR 3
      { par_m: 5, par_f: 5, hcp_m: 7,  hcp_f: 5 },   // Hole 5
      { par_m: 3, par_f: 3, hcp_m: 11, hcp_f: 9 },   // Hole 6 - PAR 3
      { par_m: 5, par_f: 5, hcp_m: 9,  hcp_f: 7 },   // Hole 7
      { par_m: 4, par_f: 4, hcp_m: 17, hcp_f: 17 },  // Hole 8
      { par_m: 4, par_f: 4, hcp_m: 5,  hcp_f: 15 },  // Hole 9
      { par_m: 5, par_f: 5, hcp_m: 8,  hcp_f: 6 },   // Hole 10
      { par_m: 3, par_f: 3, hcp_m: 10, hcp_f: 10 },  // Hole 11 - PAR 3
      { par_m: 4, par_f: 4, hcp_m: 2,  hcp_f: 2 },   // Hole 12
      { par_m: 4, par_f: 4, hcp_m: 4,  hcp_f: 16 },  // Hole 13
      { par_m: 3, par_f: 3, hcp_m: 14, hcp_f: 12 },  // Hole 14 - PAR 3
      { par_m: 5, par_f: 5, hcp_m: 6,  hcp_f: 4 },   // Hole 15
      { par_m: 4, par_f: 4, hcp_m: 12, hcp_f: 8 },   // Hole 16
      { par_m: 4, par_f: 4, hcp_m: 18, hcp_f: 18 },  // Hole 17
      { par_m: 4, par_f: 4, hcp_m: 16, hcp_f: 14 }   // Hole 18
    ]
  },

  // ============================================
  // CYPRESS CREEK GOLF CLUB - Ruskin, FL
  // ============================================
  'Cypress Creek Golf Club': {
    aliases: ['Cypress Creek'],
    defaultTees: { men: 'white', women: 'green' },
    tees: {
      // Men's tees
      black: { rating: 73.4, slope: 143, par: 72 },
      blue: { rating: 71.6, slope: 136, par: 72 },
      white: { rating: 69.0, slope: 128, par: 72 },     // FPG Default Men
      creek: { rating: 67.1, slope: 124, par: 72 },
      yellow: { rating: 66.7, slope: 120, par: 72 },    // FPG Alt Men
      green: { rating: 63.7, slope: 114, par: 72 },
      // Women's tees
      'yellow-female': { rating: 72.0, slope: 127, par: 72 },
      'green-female': { rating: 68.1, slope: 118, par: 72 } // FPG Default Women
    },
    holes: [
      { par_m: 4, par_f: 4, hcp_m: 11, hcp_f: 11 },  // Hole 1
      { par_m: 4, par_f: 4, hcp_m: 1,  hcp_f: 9 },   // Hole 2
      { par_m: 4, par_f: 4, hcp_m: 15, hcp_f: 15 },  // Hole 3
      { par_m: 5, par_f: 5, hcp_m: 5,  hcp_f: 1 },   // Hole 4
      { par_m: 4, par_f: 4, hcp_m: 3,  hcp_f: 7 },   // Hole 5
      { par_m: 3, par_f: 3, hcp_m: 17, hcp_f: 17 },  // Hole 6 - PAR 3
      { par_m: 5, par_f: 5, hcp_m: 7,  hcp_f: 5 },   // Hole 7
      { par_m: 3, par_f: 3, hcp_m: 9,  hcp_f: 13 },  // Hole 8 - PAR 3
      { par_m: 4, par_f: 4, hcp_m: 13, hcp_f: 3 },   // Hole 9
      { par_m: 4, par_f: 4, hcp_m: 12, hcp_f: 12 },  // Hole 10
      { par_m: 4, par_f: 4, hcp_m: 14, hcp_f: 10 },  // Hole 11
      { par_m: 4, par_f: 4, hcp_m: 4,  hcp_f: 6 },   // Hole 12
      { par_m: 3, par_f: 3, hcp_m: 18, hcp_f: 18 },  // Hole 13 - PAR 3
      { par_m: 5, par_f: 5, hcp_m: 16, hcp_f: 2 },   // Hole 14
      { par_m: 4, par_f: 4, hcp_m: 2,  hcp_f: 8 },   // Hole 15
      { par_m: 4, par_f: 4, hcp_m: 8,  hcp_f: 14 },  // Hole 16
      { par_m: 3, par_f: 3, hcp_m: 10, hcp_f: 16 },  // Hole 17 - PAR 3
      { par_m: 5, par_f: 5, hcp_m: 6,  hcp_f: 4 }    // Hole 18
    ]
  },

  // ============================================
  // DIAMOND HILL GOLF CLUB - Dover, FL
  // ============================================
  'Diamond Hill Golf Club': {
    aliases: ['Diamond Hill GC', 'Diamond Hill'],
    defaultTees: { men: 'white', women: 'red' },
    tees: {
      // Men's tees
      black: { rating: 72.6, slope: 134, par: 72 },
      blue: { rating: 70.8, slope: 131, par: 72 },
      white: { rating: 68.1, slope: 123, par: 72 },     // FPG Default Men
      yellow: { rating: 66.2, slope: 118, par: 72 },    // FPG Alt Men
      red: { rating: 63.6, slope: 112, par: 72 },
      // Women's tees (Par 74!)
      'black-female': { rating: 79.2, slope: 141, par: 74 },
      'blue-female': { rating: 77.6, slope: 137, par: 74 },
      'white-female': { rating: 74.9, slope: 132, par: 74 },
      'yellow-female': { rating: 72.7, slope: 127, par: 74 },
      'red-female': { rating: 69.3, slope: 118, par: 74 } // FPG Default Women - PAR 74!
    },
    holes: [
      { par_m: 4, par_f: 4, hcp_m: 11, hcp_f: 15, yds_w: 323, yds_g: 303, yds_r: 282 },  // Hole 1
      { par_m: 5, par_f: 5, hcp_m: 7,  hcp_f: 3,  yds_w: 440, yds_g: 390, yds_r: 368 },  // Hole 2
      { par_m: 3, par_f: 3, hcp_m: 17, hcp_f: 11, yds_w: 184, yds_g: 151, yds_r: 108 },  // Hole 3 - PAR 3
      { par_m: 4, par_f: 4, hcp_m: 13, hcp_f: 7,  yds_w: 366, yds_g: 340, yds_r: 264 },  // Hole 4
      { par_m: 4, par_f: 4, hcp_m: 9,  hcp_f: 9,  yds_w: 384, yds_g: 343, yds_r: 304 },  // Hole 5
      { par_m: 3, par_f: 3, hcp_m: 15, hcp_f: 13, yds_w: 171, yds_g: 157, yds_r: 123 },  // Hole 6 - PAR 3
      { par_m: 4, par_f: 4, hcp_m: 5,  hcp_f: 17, yds_w: 380, yds_g: 319, yds_r: 226 },  // Hole 7
      { par_m: 4, par_f: 4, hcp_m: 3,  hcp_f: 5,  yds_w: 368, yds_g: 344, yds_r: 286 },  // Hole 8
      { par_m: 5, par_f: 6, hcp_m: 1,  hcp_f: 1,  yds_w: 573, yds_g: 554, yds_r: 468 },  // Hole 9 - Women Par 6!
      { par_m: 4, par_f: 4, hcp_m: 18, hcp_f: 14, yds_w: 337, yds_g: 312, yds_r: 265 },  // Hole 10
      { par_m: 4, par_f: 4, hcp_m: 8,  hcp_f: 12, yds_w: 370, yds_g: 301, yds_r: 252 },  // Hole 11
      { par_m: 3, par_f: 3, hcp_m: 16, hcp_f: 18, yds_w: 147, yds_g: 129, yds_r: 118 },  // Hole 12 - PAR 3
      { par_m: 5, par_f: 6, hcp_m: 2,  hcp_f: 2,  yds_w: 549, yds_g: 529, yds_r: 444 },  // Hole 13 - Women Par 6!
      { par_m: 4, par_f: 4, hcp_m: 14, hcp_f: 8,  yds_w: 371, yds_g: 326, yds_r: 295 },  // Hole 14
      { par_m: 3, par_f: 3, hcp_m: 12, hcp_f: 16, yds_w: 158, yds_g: 127, yds_r: 124 },  // Hole 15 - PAR 3
      { par_m: 4, par_f: 4, hcp_m: 10, hcp_f: 10, yds_w: 390, yds_g: 355, yds_r: 266 },  // Hole 16
      { par_m: 5, par_f: 5, hcp_m: 4,  hcp_f: 6,  yds_w: 487, yds_g: 438, yds_r: 363 },  // Hole 17
      { par_m: 4, par_f: 4, hcp_m: 6,  hcp_f: 4,  yds_w: 367, yds_g: 348, yds_r: 329 }   // Hole 18
    ]
  },

  // ============================================
  // HERITAGE ISLES GOLF & COUNTRY CLUB - Tampa, FL
  // ============================================
  'Heritage Isles Golf & Country Club': {
    aliases: ['Heritage Isles', 'Heritage Isles GCC'],
    defaultTees: { men: 'blue', women: 'red' },
    tees: {
      // Men's tees
      gold: { rating: 74.1, slope: 138, par: 72 },
      blue: { rating: 71.0, slope: 130, par: 72 },      // FPG Default Men
      white: { rating: 68.0, slope: 118, par: 72 },     // FPG Alt Men
      green: { rating: 64.6, slope: 105, par: 72 },
      red: { rating: 63.9, slope: 104, par: 72 },
      // Women's tees
      'blue-female': { rating: 76.3, slope: 135, par: 72 },
      'white-female': { rating: 73.5, slope: 128, par: 72 },
      'green-female': { rating: 69.5, slope: 123, par: 72 },
      'red-female': { rating: 68.6, slope: 122, par: 72 } // FPG Default Women
    },
    holes: [
      { par_m: 4, par_f: 4, hcp_m: 12, hcp_f: 12 },  // Hole 1
      { par_m: 5, par_f: 5, hcp_m: 4,  hcp_f: 4 },   // Hole 2
      { par_m: 4, par_f: 4, hcp_m: 8,  hcp_f: 8 },   // Hole 3
      { par_m: 4, par_f: 4, hcp_m: 6,  hcp_f: 6 },   // Hole 4
      { par_m: 3, par_f: 3, hcp_m: 18, hcp_f: 18 },  // Hole 5 - PAR 3
      { par_m: 4, par_f: 4, hcp_m: 10, hcp_f: 10 },  // Hole 6
      { par_m: 5, par_f: 5, hcp_m: 2,  hcp_f: 2 },   // Hole 7
      { par_m: 3, par_f: 3, hcp_m: 16, hcp_f: 16 },  // Hole 8 - PAR 3
      { par_m: 4, par_f: 4, hcp_m: 14, hcp_f: 14 },  // Hole 9
      { par_m: 4, par_f: 4, hcp_m: 7,  hcp_f: 7 },   // Hole 10
      { par_m: 5, par_f: 5, hcp_m: 1,  hcp_f: 1 },   // Hole 11
      { par_m: 4, par_f: 4, hcp_m: 11, hcp_f: 11 },  // Hole 12
      { par_m: 3, par_f: 3, hcp_m: 15, hcp_f: 15 },  // Hole 13 - PAR 3
      { par_m: 4, par_f: 4, hcp_m: 5,  hcp_f: 5 },   // Hole 14
      { par_m: 5, par_f: 5, hcp_m: 3,  hcp_f: 3 },   // Hole 15
      { par_m: 3, par_f: 3, hcp_m: 17, hcp_f: 17 },  // Hole 16 - PAR 3
      { par_m: 4, par_f: 4, hcp_m: 13, hcp_f: 13 },  // Hole 17
      { par_m: 4, par_f: 4, hcp_m: 9,  hcp_f: 9 }    // Hole 18
    ]
  },

  // ============================================
  // LEXINGTON OAKS GOLF CLUB - Wesley Chapel, FL
  // ============================================
  'Lexington Oaks Golf Club': {
    aliases: ['Lexington Oaks'],
    defaultTees: { men: 'blue', women: 'red' },
    tees: {
      // Men's tees
      black: { rating: 72.4, slope: 139, par: 72 },
      blue: { rating: 69.9, slope: 131, par: 72 },      // FPG Default Men
      white: { rating: 67.9, slope: 126, par: 72 },     // FPG Alt Men
      gold: { rating: 65.3, slope: 117, par: 72 },
      // Women's tees (Par 71!)
      'gold-female': { rating: 69.7, slope: 124, par: 71 },
      'red-female': { rating: 65.9, slope: 115, par: 71 } // FPG Default Women - PAR 71!
    },
    holes: [
      { par_m: 4, par_f: 4, hcp_m: 15, hcp_f: 11 },  // Hole 1
      { par_m: 3, par_f: 3, hcp_m: 9,  hcp_f: 1 },   // Hole 2 - PAR 3
      { par_m: 4, par_f: 4, hcp_m: 11, hcp_f: 7 },   // Hole 3
      { par_m: 5, par_f: 5, hcp_m: 1,  hcp_f: 3 },   // Hole 4
      { par_m: 3, par_f: 3, hcp_m: 17, hcp_f: 13 },  // Hole 5 - PAR 3
      { par_m: 5, par_f: 5, hcp_m: 5,  hcp_f: 5 },   // Hole 6
      { par_m: 4, par_f: 4, hcp_m: 7,  hcp_f: 9 },   // Hole 7
      { par_m: 4, par_f: 4, hcp_m: 3,  hcp_f: 15 },  // Hole 8
      { par_m: 4, par_f: 4, hcp_m: 13, hcp_f: 17 },  // Hole 9
      { par_m: 4, par_f: 4, hcp_m: 8,  hcp_f: 6 },   // Hole 10
      { par_m: 4, par_f: 4, hcp_m: 2,  hcp_f: 4 },   // Hole 11
      { par_m: 4, par_f: 4, hcp_m: 16, hcp_f: 12 },  // Hole 12
      { par_m: 3, par_f: 3, hcp_m: 18, hcp_f: 16 },  // Hole 13 - PAR 3
      { par_m: 5, par_f: 5, hcp_m: 6,  hcp_f: 10 },  // Hole 14
      { par_m: 4, par_f: 4, hcp_m: 4,  hcp_f: 2 },   // Hole 15
      { par_m: 4, par_f: 4, hcp_m: 14, hcp_f: 18 },  // Hole 16
      { par_m: 3, par_f: 3, hcp_m: 12, hcp_f: 14 },  // Hole 17 - PAR 3
      { par_m: 5, par_f: 4, hcp_m: 10, hcp_f: 8 }    // Hole 18 - Women Par 4!
    ]
  },

  // ============================================
  // SUMMERFIELD CROSSING GOLF CLUB - Riverview, FL
  // ============================================
  'Summerfield Crossing Golf Club': {
    aliases: ['Summerfield Crossings Golf Club', 'Summerfield Crossings', 'Summerfield Crossing', 'Summerfield'],
    defaultTees: { men: 'gold', women: 'silver' },
    tees: {
      // Men's tees (Par 71!)
      green: { rating: 73.0, slope: 137, par: 71 },
      gold: { rating: 71.0, slope: 133, par: 71 },      // FPG Default Men - PAR 71!
      black: { rating: 68.2, slope: 124, par: 71 },     // FPG Alt Men - PAR 71!
      silver: { rating: 64.8, slope: 112, par: 71 },
      // Women's tees (Par 71!)
      'black-female': { rating: 74.3, slope: 133, par: 71 },
      'silver-female': { rating: 70.6, slope: 125, par: 71 } // FPG Default Women - PAR 71!
    },
    holes: [
      { par_m: 4, par_f: 4, hcp_m: 13, hcp_f: 13 },  // Hole 1
      { par_m: 3, par_f: 3, hcp_m: 17, hcp_f: 17 },  // Hole 2 - PAR 3
      { par_m: 5, par_f: 5, hcp_m: 1,  hcp_f: 1 },   // Hole 3
      { par_m: 4, par_f: 4, hcp_m: 9,  hcp_f: 9 },   // Hole 4
      { par_m: 4, par_f: 4, hcp_m: 3,  hcp_f: 3 },   // Hole 5
      { par_m: 4, par_f: 4, hcp_m: 11, hcp_f: 11 },  // Hole 6
      { par_m: 4, par_f: 4, hcp_m: 5,  hcp_f: 5 },   // Hole 7
      { par_m: 3, par_f: 3, hcp_m: 15, hcp_f: 15 },  // Hole 8 - PAR 3
      { par_m: 5, par_f: 5, hcp_m: 7,  hcp_f: 7 },   // Hole 9
      { par_m: 4, par_f: 4, hcp_m: 14, hcp_f: 14 },  // Hole 10
      { par_m: 4, par_f: 4, hcp_m: 6,  hcp_f: 6 },   // Hole 11
      { par_m: 3, par_f: 3, hcp_m: 18, hcp_f: 18 },  // Hole 12 - PAR 3
      { par_m: 4, par_f: 4, hcp_m: 8,  hcp_f: 8 },   // Hole 13
      { par_m: 4, par_f: 4, hcp_m: 10, hcp_f: 10 },  // Hole 14
      { par_m: 3, par_f: 3, hcp_m: 16, hcp_f: 16 },  // Hole 15 - PAR 3
      { par_m: 4, par_f: 4, hcp_m: 12, hcp_f: 12 },  // Hole 16
      { par_m: 4, par_f: 4, hcp_m: 2,  hcp_f: 2 },   // Hole 17
      { par_m: 5, par_f: 5, hcp_m: 4,  hcp_f: 4 }    // Hole 18
    ]
  },

  // ============================================
  // GREENFIELD PLANTATION - Bradenton, FL
  // ============================================
  'The Links at Greenfield Plantation': {
    aliases: ['Greenfield Plantation', 'The Links at Greenfield', 'Greenfield'],
    defaultTees: { men: 'blue', women: 'red' },
    tees: {
      // Men's tees
      black: { rating: 72.8, slope: 136, par: 72 },
      blue: { rating: 70.6, slope: 130, par: 72 },      // FPG Default Men
      white: { rating: 68.2, slope: 116, par: 72 },     // FPG Alt Men
      silver: { rating: 64.8, slope: 109, par: 72 },
      // Women's tees
      'black-female': { rating: 79.0, slope: 138, par: 72 },
      'blue-female': { rating: 76.2, slope: 131, par: 72 },
      'white-female': { rating: 73.4, slope: 125, par: 72 },
      'silver-female': { rating: 69.4, slope: 117, par: 72 },
      'red-female': { rating: 68.4, slope: 115, par: 72 }, // FPG Default Women
      'orange-female': { rating: 61.8, slope: 103, par: 72 }
    },
    holes: [
      { par_m: 5, par_f: 5, hcp_m: 7,  hcp_f: 1 },   // Hole 1
      { par_m: 4, par_f: 4, hcp_m: 11, hcp_f: 13 },  // Hole 2
      { par_m: 3, par_f: 3, hcp_m: 15, hcp_f: 15 },  // Hole 3 - PAR 3
      { par_m: 4, par_f: 4, hcp_m: 5,  hcp_f: 7 },   // Hole 4
      { par_m: 4, par_f: 4, hcp_m: 13, hcp_f: 11 },  // Hole 5
      { par_m: 3, par_f: 3, hcp_m: 17, hcp_f: 17 },  // Hole 6 - PAR 3
      { par_m: 4, par_f: 4, hcp_m: 3,  hcp_f: 5 },   // Hole 7
      { par_m: 5, par_f: 5, hcp_m: 1,  hcp_f: 3 },   // Hole 8
      { par_m: 4, par_f: 4, hcp_m: 9,  hcp_f: 9 },   // Hole 9
      { par_m: 5, par_f: 5, hcp_m: 6,  hcp_f: 2 },   // Hole 10
      { par_m: 4, par_f: 4, hcp_m: 4,  hcp_f: 12 },  // Hole 11
      { par_m: 3, par_f: 3, hcp_m: 12, hcp_f: 18 },  // Hole 12 - PAR 3
      { par_m: 4, par_f: 4, hcp_m: 8,  hcp_f: 14 },  // Hole 13
      { par_m: 4, par_f: 4, hcp_m: 18, hcp_f: 8 },   // Hole 14
      { par_m: 3, par_f: 3, hcp_m: 10, hcp_f: 16 },  // Hole 15 - PAR 3
      { par_m: 5, par_f: 5, hcp_m: 14, hcp_f: 6 },   // Hole 16
      { par_m: 4, par_f: 4, hcp_m: 16, hcp_f: 10 },  // Hole 17
      { par_m: 4, par_f: 4, hcp_m: 2,  hcp_f: 4 }    // Hole 18
    ]
  },

  // ============================================
  // THE RIVER CLUB GOLF COURSE - Bradenton, FL
  // ============================================
  'The River Club': {
    aliases: ['River Club', 'The River Club Golf Course'],
    defaultTees: { men: 'blue', women: 'red' },
    tees: {
      // Men's tees
      black: { rating: 74.5, slope: 148, par: 72 },
      blue: { rating: 72.1, slope: 140, par: 72 },      // FPG Default Men
      white: { rating: 69.7, slope: 129, par: 72 },     // FPG Alt Men
      silver: { rating: 67.8, slope: 126, par: 72 },
      red: { rating: 64.3, slope: 121, par: 72 },
      orange: { rating: 61.6, slope: 114, par: 72 },
      // Women's tees
      'blue-female': { rating: 78.6, slope: 146, par: 72 },
      'white-female': { rating: 75.6, slope: 138, par: 72 },
      'silver-female': { rating: 73.4, slope: 135, par: 72 },
      'red-female': { rating: 69.8, slope: 125, par: 72 }, // FPG Default Women
      'orange-female': { rating: 65.1, slope: 117, par: 72 }
    },
    holes: [
      { par_m: 4, par_f: 4, hcp_m: 4,  hcp_f: 4 },   // Hole 1
      { par_m: 3, par_f: 3, hcp_m: 14, hcp_f: 16 },  // Hole 2 - PAR 3
      { par_m: 5, par_f: 5, hcp_m: 8,  hcp_f: 8 },   // Hole 3
      { par_m: 4, par_f: 4, hcp_m: 18, hcp_f: 14 },  // Hole 4
      { par_m: 5, par_f: 5, hcp_m: 2,  hcp_f: 2 },   // Hole 5
      { par_m: 4, par_f: 4, hcp_m: 10, hcp_f: 10 },  // Hole 6
      { par_m: 4, par_f: 4, hcp_m: 6,  hcp_f: 12 },  // Hole 7
      { par_m: 3, par_f: 3, hcp_m: 16, hcp_f: 18 },  // Hole 8 - PAR 3
      { par_m: 4, par_f: 4, hcp_m: 12, hcp_f: 6 },   // Hole 9
      { par_m: 4, par_f: 4, hcp_m: 7,  hcp_f: 13 },  // Hole 10
      { par_m: 4, par_f: 4, hcp_m: 5,  hcp_f: 5 },   // Hole 11
      { par_m: 3, par_f: 3, hcp_m: 15, hcp_f: 15 },  // Hole 12 - PAR 3
      { par_m: 5, par_f: 5, hcp_m: 9,  hcp_f: 11 },  // Hole 13
      { par_m: 4, par_f: 4, hcp_m: 3,  hcp_f: 3 },   // Hole 14
      { par_m: 3, par_f: 3, hcp_m: 17, hcp_f: 17 },  // Hole 15 - PAR 3
      { par_m: 4, par_f: 4, hcp_m: 1,  hcp_f: 1 },   // Hole 16
      { par_m: 5, par_f: 5, hcp_m: 11, hcp_f: 9 },   // Hole 17
      { par_m: 4, par_f: 3, hcp_m: 13, hcp_f: 7 }    // Hole 18
    ]
  }
};

// Helper function to get course by name (handles aliases)
function getCourse(courseName) {
  if (!courseName) return null;
  
  const normalizedName = courseName.trim();
  
  // Direct match
  if (FPG_COURSES[normalizedName]) {
    return FPG_COURSES[normalizedName];
  }
  
  // Check aliases
  for (const [key, course] of Object.entries(FPG_COURSES)) {
    if (course.aliases && course.aliases.some(alias => 
      alias.toLowerCase() === normalizedName.toLowerCase()
    )) {
      return course;
    }
  }
  
  return null;
}

// Helper function to calculate course handicap using OFFICIAL USGA formula
function calculateCourseHandicap(handicapIndex, isFemale, courseName, teeName = null) {
  const course = getCourse(courseName);
  if (!course) {
    console.error(`Course not found: ${courseName}`);
    return 0;
  }
  
  // Determine which tees to use
  let teeToUse = teeName;
  if (!teeToUse) {
    teeToUse = isFemale ? course.defaultTees.women : course.defaultTees.men;
  }
  
  // Add gender suffix for female tees if needed
  const teeKey = isFemale && !teeToUse.includes('-female') ? `${teeToUse}-female` : teeToUse;
  
  const teeData = course.tees[teeKey];
  if (!teeData) {
    console.error(`Tee not found: ${teeKey} for course ${courseName}`);
    return 0;
  }
  
  // OFFICIAL WHS FORMULA: Course Handicap = (Index × (Slope / 113)) + (Rating - Par)
  const courseHandicap = Math.round((handicapIndex * (teeData.slope / 113)) + (teeData.rating - teeData.par));
  
  // FPG League Rule: Cap at 18 strokes maximum
  const cappedHandicap = Math.min(courseHandicap, 18);
  
  console.log(`Course Handicap Calculation:
    Player: HI ${handicapIndex} (${isFemale ? 'Female' : 'Male'})
    Course: ${courseName}
    Tees: ${teeToUse} (${teeKey})
    Slope: ${teeData.slope}, Rating: ${teeData.rating}, Par: ${teeData.par}
    Formula: (${handicapIndex} × (${teeData.slope} / 113)) + (${teeData.rating} - ${teeData.par})
    = ${courseHandicap} → Capped: ${cappedHandicap} strokes`);
  
  return cappedHandicap;
}

// Make functions available globally
if (typeof window !== 'undefined') {
  window.FPG_COURSES = FPG_COURSES;
  window.getCourse = getCourse;
  window.calculateCourseHandicap = calculateCourseHandicap;
}
