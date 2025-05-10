export const level1Mice = [
    // First 30 seconds — Setup Time (no mice)

    // First minute (30 - 89) — Basic Mice only
    { time: 30, type: 'basicMouse', row: 2 },
    { time: 45, type: 'basicMouse', row: 0 },
    { time: 57, type: 'basicMouse', row: 3 },
    { time: 63, type: 'basicMouse', row: 1 },
    { time: 76, type: 'basicMouse', row: 0 },
    { time: 84, type: 'basicMouse', row: 1 },
    
    // Minute 2 (90 - 149) — introduce Helmet Mouse
    { time: 92, type: 'helmetMouse', row: 0 },
    { time: 98, type: 'basicMouse', row: 4 },
    { time: 105, type: 'basicMouse', row: 2 },
    { time: 115, type: 'helmetMouse', row: 1 },
    { time: 125, type: 'helmetMouse', row: 3 },
    { time: 138, type: 'basicMouse', row: 3},
    { time: 149, type: 'basicMouse', row: 4},
    
    // Minute 3 (150 - 209) — introduce Sporty Mouse
    { time: 161, type: 'sportyMouse', row: 1 },
    { time: 167, type: 'basicMouse', row: 0 },
    { time: 175, type: 'helmetMouse', row: 2 },
    { time: 179, type: 'basicMouse', row: 2 },
    { time: 185, type: 'sportyMouse', row: 4 },
    { time: 194, type: 'basicMouse', row: 3},
    { time: 208, type: 'basicMouse', row: 1},

    // Minute 4 (210 - 269) — mixed mice
    { time: 212, type: 'basicMouse', row: 3 },
    { time: 216, type: 'helmetMouse', row: 4 },
    { time: 219, type: 'sportyMouse', row: 1 },
    { time: 230, type: 'basicMouse', row: 0 },
    { time: 235, type: 'helmetMouse', row: 2 },
    { time: 238, type: 'sportyMouse', row: 0 },
    { time: 243, type: 'sportyMouse', row: 3 },
    { time: 246, type: 'helmetMouse', row: 4 },
    { time: 251, type: 'sportyMouse', row: 2},
    { time: 253, type: 'helmetMouse', row: 1},
    { time: 257, type: 'basicMouse', row: 0 },
    { time: 260, type: 'helmetMouse', row: 1},
    { time: 266, type: 'sportyMouse', row: 4 },
    
    // Minute 5 (270 - 329) — boss and support
    { time: 272, type: 'bossMouse', row: 2 },
    { time: 275, type: 'basicMouse', row: 1 },
    { time: 280, type: 'basicMouse', row: 4},
    { time: 282, type: 'helmetMouse', row: 1},
    { time: 285, type: 'sportyMouse', row: 0 },
    { time: 290, type: 'helmetMouse', row: 3 },
    { time: 296, type: 'sportyMouse', row: 2},
    { time: 299, type: 'basicMouse', row: 4 },
    { time: 303, type: 'helmetMouse', row: 2 },
    { time: 305, type: 'bossMouse', row: 3},
    { time: 307, type: 'sportyMouse', row: 0 },
    { time: 310, type: 'sportyMouse', row: 1 },
    { time: 312, type: 'basicMouse', row: 0},
    { time: 314, type: 'sportyMouse', row: 2 },
    { time: 317, type: 'helmetMouse', row: 1 },
    { time: 320, type: 'basicMouse', row: 3 },
    { time: 323, type: 'helmetMouse', row: 4},
    { time: 327, type: 'basicMouse', row: 0}
];
  