const board = document.querySelector(".board");

const statuses = {
  HIDDEN: "hidden",
  MARKED: "marked",
  MINE: "mine",
  NUMBER: "number",
  EMPTY: "empty",
};

let min = 0;
let sec = 0;
let intervalId = null;
let minDisplay = document.querySelector(".mm");
let secDisplay = document.querySelector(".ms");
let tiles = [];
const minesLeft = document.querySelector(".bombs");
let minesLeftCount = 0;
let loose = false;
const pause = document.querySelector(".pause");
let isPaused = false;
const module_lose = document.querySelector(".module_lose");
const module_win = document.querySelector(".module_win");
const reset = document.querySelector(".reset");

function minesRandom(x, y, bombs) {
  const max = x * y;
  const random = [];
  for (let i = 1; i <= bombs; i++) {
    const num = Math.floor(Math.random() * max);
    if (random.length === 0 || !random.includes(num)) {
      random.push(num);
    } else {
      i--;
    }
  }
  console.log(random);
  return random;
}

function* createIndex() {
  for (let i = 1; i; i++) {
    yield i;
  }
}

export function createBoard(x, y, bombs) {
  board.style.setProperty("--size-columns", x);
  board.style.setProperty("--size-rows", y);

  const random = minesRandom(x, y, bombs);
  let id = createIndex();

  for (let xDir = 0; xDir < y; xDir++) {
    let rows = [];
    for (let yDir = 0; yDir < x; yDir++) {
      let idGen = id.next().value;
      let tile = {};
      if (random.includes(idGen)) {
        tile = {
          xDir,
          yDir,
          mines: true,
          status: "hidden",
          index: idGen,
          number: 0,
          get tileStatus() {
            return this.status;
          },
        };
        console.log("hi");
      } else {
        tile = {
          xDir,
          yDir,
          mines: false,
          status: "hidden",
          index: idGen,
          number: 0,
          get tileStatus() {
            return this.status;
          },
        };
      }

      rows.push(tile);
    }
    tiles.push(rows);
  }
  console.log(tiles);
  createNumbers(tiles);
  tiles.forEach((rows) => {
    rows.forEach((tile) => {
      createElement(tile);
    });
  });
  minesLeftCount = bombs;
  minesLeft.innerText = minesLeftCount;
}

function createNumbers(tiles) {
  const mines = [];
  for (let rows of tiles) {
    for (let tile of rows) {
      if (tile.mines == true) {
        mines.push([tile.xDir, tile.yDir]);
      }
    }
  }

  for (let [x, y] of mines) {
    tiles.forEach((row) => {
      row.forEach((tile) => {
        if (tile.xDir == x - 1 && tile.yDir == y && tile.mines == false) {
          console.log("top tile", tile);
          tile.number++;
        }
        if (tile.xDir == x + 1 && tile.yDir == y && tile.mines == false) {
          console.log("bottom tile", tile);
          tile.number++;
        }
        if (tile.xDir == x - 1 && tile.yDir == y - 1 && tile.mines == false) {
          console.log("top left tile", tile);
          tile.number++;
        }
        if (tile.xDir == x - 1 && tile.yDir == y + 1 && tile.mines == false) {
          console.log("top right tile", tile);
          tile.number++;
        }
        if (tile.xDir == x + 1 && tile.yDir == y - 1 && tile.mines == false) {
          console.log("bottom left tile", tile);
          tile.number++;
        }
        if (tile.xDir == x + 1 && tile.yDir == y + 1 && tile.mines == false) {
          console.log("bottom right tile", tile);
          tile.number++;
        }
        if (tile.xDir == x && tile.yDir == y - 1 && tile.mines == false) {
          console.log("left tile", tile);
          tile.number++;
        }
        if (tile.xDir == x && tile.yDir == y + 1 && tile.mines == false) {
          console.log("right tile", tile);
          tile.number++;
        }
      });
    });
  }
}

function createElement(tile) {
  const tileEl = document.createElement("div");
  board.append(tileEl);
  tileEl.classList.add("tile");
  tileEl.dataset.status = tile.status;
  tileEl.dataset.id = tile.index;
}

document.addEventListener("click", (e) => {
  if (!e.target.matches(".tile")) return;
  if (loose) {
    return;
  }
  if (isPaused) {
    return;
  }
 
  const tile = e.target;
  if (secDisplay.innerHTML == false) {
    countTime();
  }
  tiles.forEach((rows) => {
    rows.forEach((tileObj) => {
      if (tileObj.index == tile.dataset.id) {
        if (tileObj.mines) {
          tileObj.status = statuses.MINE;
          tile.dataset.status = tileObj.status;
          endCountTime();
        }
        if (tileObj.number > 0) {
          tileObj.status = statuses.NUMBER;
          tile.dataset.status = tileObj.status;
          tile.innerText = tileObj.number;
        }
        if (tileObj.number == 0 && !tileObj.mines) {
          tileObj.status = statuses.EMPTY;
          tile.dataset.status = tileObj.status;

          openZeroNeighbors(tileObj);
        }
      }
    });
  });

  checkForWin();
});

function checkForWin() {
  let isHidden = [];
  tiles.forEach((rows) => {
    rows.forEach((tileObj) => {
      if (tileObj.status === statuses.HIDDEN) {
        isHidden.push(tileObj);
      }
    });
  });
  if (!isHidden.length) {
    clearInterval(intervalId);
    module_win.classList.remove("invisible");
    let final_time = document.querySelector(".final_time_win");
    let zm = "";
    let zs = "";
    zm = min < 10 ? "0" : "";
    zs = sec < 10 ? "0" : "";
    final_time.innerHTML = `${zm + min}:${zs + sec}`;
  }
}

function openZeroNeighbors(tileObj) {
  const neighbors = getNeighbors(tileObj);
  for (let neighbor of neighbors) {
    const tile = document.querySelector(`[data-id="${neighbor.index}"]`);
    if (
      neighbor.number == 0 &&
      neighbor.mines == false &&
      neighbor.status == statuses.HIDDEN
    ) {
      neighbor.status = statuses.EMPTY;
      tile.dataset.status = neighbor.status;
      openZeroNeighbors(neighbor);
    }
    if (neighbor.number > 0) {
      neighbor.status = statuses.NUMBER;
      tile.dataset.status = neighbor.status;
      tile.innerHTML = neighbor.number;
    }
  }
}

function getNeighbors(tileObj) {
  const neighbors = [];
  const x = tileObj.xDir;
  const y = tileObj.yDir;
  console.log(tileObj, `empty tile is on the "${x}x"`);
  tiles.forEach((rows) => {
    rows.forEach((tile) => {
      if (
        (tile.xDir == x - 1 && tile.yDir == y) ||
        (tile.xDir == x - 1 && tile.yDir == y - 1) ||
        (tile.xDir == x - 1 && tile.yDir == y + 1) ||
        (tile.xDir == x + 1 && tile.yDir == y) ||
        (tile.xDir == x + 1 && tile.yDir == y - 1) ||
        (tile.xDir == x + 1 && tile.yDir == y + 1) ||
        (tile.xDir == x && tile.yDir == y - 1) ||
        (tile.xDir == x && tile.yDir == y + 1)
      ) {
        if (!neighbors.includes(tile)) neighbors.push(tile);
      }
    });
  });
  return neighbors;
}

document.addEventListener("contextmenu", (e) => {
  if (!e.target.matches(".tile")) return;
  e.preventDefault();
  if (isPaused) {
    return;
  }
  const tile = e.target;
  if (secDisplay.innerHTML == false) {
    countTime();
  }
  tiles.forEach((rows) => {
    rows.forEach((tileObj) => {
      if (tileObj.index == tile.dataset.id) {
        if (minesLeftCount > 0 && tileObj.status == statuses.HIDDEN) {
          tileObj.status = statuses.MARKED;
          tile.dataset.status = tileObj.status;
          minesLeftCount--;
          minesLeft.innerText = minesLeftCount;
        } else if (minesLeftCount >= 0 && tileObj.status == statuses.MARKED) {
          tileObj.status = statuses.HIDDEN;
          tile.dataset.status = tileObj.status;
          minesLeftCount++;
          minesLeft.innerText = minesLeftCount;
        }
      }
    });
  });
  checkForWin();
});

let colon = document.querySelector(".colon");

function countTime() {
  let z = "";
  if (!isPaused) {
    if (min < 3) {
      z = sec < 10 ? "0" : "";
      secDisplay.innerHTML = z + sec;
      sec++;

      if (sec == 60) {
        sec = 0;
        min++;
        colon.classList.remove("invisible");
        z = min < 10 ? "0" : "";
        secDisplay.innerHTML = z + sec;
        minDisplay.innerHTML = z + min;
      }

      intervalId = setTimeout(countTime, 1000);
    } else {
      endCountTime();
    }
  }
}

function endCountTime() {
  clearInterval(intervalId);
  loose = true;
  module_lose.classList.remove("invisible");
  let final_time = document.querySelector(".final_time_lose");
  let zm = "";
  let zs = "";
  zm = min < 10 ? "0" : "";
  zs = sec < 10 ? "0" : "";
  final_time.innerHTML = `${zm + min}:${zs + sec}`;

}

export function resetGame() {
  while (board.firstChild) board.removeChild(board.firstChild);
  clearInterval(intervalId);
  sec = 0;
  minDisplay.innerHTML = "";
  secDisplay.innerHTML = "";
  colon.classList.add("invisible");
  tiles = [];
  loose = false;
}

pause.addEventListener("click", (e) => {
  if (!sec) {
    return;
  }
  if (isPaused === false) {
    isPaused = true;
    pause.style =
      "transform:scale(0.9); box-shadow:2px 2px 1px rgba(0, 0, 0, 0.1)";
  } else if (isPaused === true) {
    isPaused = false;
    pause.style = "transform:scale(1); box-shadow:var(--PRIMARY-shadow)";
    countTime();
  }
});


export function makeModuleLoseInvisible(x, y, bombs) {
  module_lose.addEventListener("click", (e) => {
    if (!module_lose.classList.contains(".invisible")) {
      module_lose.classList.add("invisible");
      resetGame();
      createBoard(x, y, bombs);
    }
  });
}

export function makeModuleWinInvisible(x, y, bombs) {
  module_win.addEventListener("click", (e) => {
    if (!module_win.classList.contains(".invisible")) {
      module_win.classList.add("invisible");
      resetGame();
      createBoard(x, y, bombs);
    }
  });
}

export function resetGameButton(x, y, bombs) {
  reset.addEventListener("click", (e) => {
    resetGame();
    createBoard(x, y, bombs);
  });
}
