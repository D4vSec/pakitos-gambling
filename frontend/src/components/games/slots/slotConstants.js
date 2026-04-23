// Staggered stop delays per column (ms after isSpinning→false).
// Each reel stops left-to-right, creating the classic slot machine effect.
export const STOP_DELAYS_BY_COLS = {
  3: [0, 350, 700],
  5: [0, 300, 600, 900, 1200],
}

export const getStopDelays = (cols) =>
  STOP_DELAYS_BY_COLS[cols] ??
  Array.from({ length: cols }, (_, i) => i * 300)

// Total animation time = last reel stops + landing animation (550 ms)
export const getAnimTotalMs = (cols) => {
  const delays = getStopDelays(cols)
  return delays[delays.length - 1] + 550
}

export const COLS_BY_TYPE = {
  "3x3": 3,
  "3x5": 5,
  "5x5": 5,
}

export const DIMS_BY_TYPE = {
  "3x3": { rows: 3, cols: 3 },
  "3x5": { rows: 3, cols: 5 },
  "5x5": { rows: 5, cols: 5 },
}

// Payline cell positions, mirroring backend generatePaylines logic.
export const PAYLINE_POSITIONS = {
  "3x3": {
    H_ROW0: [[0,0],[0,1],[0,2]],
    H_ROW1: [[1,0],[1,1],[1,2]],
    H_ROW2: [[2,0],[2,1],[2,2]],
    D_MAIN: [[0,0],[1,1],[2,2]],
    D_ANTI: [[0,2],[1,1],[2,0]],
  },
  "3x5": {
    H_ROW0: [[0,0],[0,1],[0,2],[0,3],[0,4]],
    H_ROW1: [[1,0],[1,1],[1,2],[1,3],[1,4]],
    H_ROW2: [[2,0],[2,1],[2,2],[2,3],[2,4]],
    D_V:      [[0,0],[1,1],[1,2],[1,3],[0,4]],
    D_LAMBDA: [[2,0],[1,1],[1,2],[1,3],[2,4]],
  },
  "5x5": {
    H_ROW0: [[0,0],[0,1],[0,2],[0,3],[0,4]],
    H_ROW1: [[1,0],[1,1],[1,2],[1,3],[1,4]],
    H_ROW2: [[2,0],[2,1],[2,2],[2,3],[2,4]],
    H_ROW3: [[3,0],[3,1],[3,2],[3,3],[3,4]],
    H_ROW4: [[4,0],[4,1],[4,2],[4,3],[4,4]],
    D_MAIN:   [[0,0],[1,1],[2,2],[3,3],[4,4]],
    D_ANTI:   [[0,4],[1,3],[2,2],[3,1],[4,0]],
    D_V:      [[0,0],[1,1],[2,2],[1,3],[0,4]],
    D_LAMBDA: [[4,0],[3,1],[2,2],[3,3],[4,4]],
  },
}
