const board = document.querySelector(".board");

const statuses = {
  HIDDEN: "hidden",
  MARKED: "marked",
  MINE: "mine",
  NUMBER: "number",
  EMPTY: "empty",
};

let sec = 0;
let intervalId = null;
let gameTime = document.querySelector(".game_time");
let tiles = [];
const minesLeft = document.querySelector(".bombs");
let minesLeftCount = 0;

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

createBoard(6, 4, 4)

// export function createBoard(x, y, bombs) {
//   board.style.setProperty("--size-columns", x);
//   board.style.setProperty("--size-rows", y);

//   const random = minesRandom(x, y, bombs);
//   let id = createIndex();

//   for (let xDir = 0; xDir < x; xDir++) {
//     const rows = [];
//     for (let yDir = 0; yDir < y; yDir++) {
//       let idGen = id.next().value;
//       let tile = {};
//       if (random.includes(idGen)) {
//         tile = {
//           xDir,
//           yDir,
//           mines: true,
//           status: "hidden",
//           index: idGen,
//           number: 0,
//           get tileStatus() {
//             return this.status;
//           },
//         };
//         console.log("hi");
//       } else {
//         tile = {
//           xDir,
//           yDir,
//           mines: false,
//           status: "hidden",
//           index: idGen,
//           number: 0,
//           get tileStatus() {
//             return this.status;
//           },
//         };
//       }

//       rows.push(tile);
//     }
//     tiles.push(rows);
//   }
//   console.log(tiles);
//   createNumbers(tiles);
//   tiles.forEach((rows) => {
//     rows.forEach((tile) => {
//       createElement(tile);
//     });
//   });
//   minesLeftCount = bombs;
//   minesLeft.innerText = minesLeftCount;
// }

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
  const tile = e.target;
  if (gameTime.innerHTML == false) {
    countTime();
  }
  tiles.forEach((rows) => {
    rows.forEach((tileObj) => {
      if (tileObj.index == tile.dataset.id) {
        if (tileObj.mines) {
          tileObj.status = statuses.MINE;
          tile.dataset.status = tileObj.status;

          // overlay.classList.remove("hidden");
          endCountTime();
          // if (!overlay.classList.contains("hidden")) {
          //   overlay.addEventListener("click", () => {
          //     window.location.reload();
          //   });
          // }
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
          // getNeighbors(tileObj);
        }
      }
    });
    // console.log(tileObj.tileStatus);
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
      // console.log(neighbor);
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

  const tile = e.target;
  if (gameTime.innerHTML == false) {
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

function countTime() {
  const startDate = new Date();
  intervalId = setInterval(() => {
    sec = Math.floor((new Date() - startDate) / 1000);
    gameTime.innerHTML = sec;
  }, 1000);
}

function endCountTime() {
  clearInterval(intervalId);

  // const finalTime = document.querySelector(".final_time");
  // finalTime.innerHTML = sec;
}

export function resetGame() {
  while (board.firstChild) board.removeChild(board.firstChild);
  clearInterval(intervalId);
  sec = 0;
  gameTime.innerHTML = "";
  tiles = [];
}
