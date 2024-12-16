import {
  createBoard,
  resetGameButton,
  makeModuleLoseInvisible,
  makeModuleWinInvisible,
} from "./script.js";

const x = 9;
const y = 9;
const bombs = 10;

createBoard(x, y, bombs);

resetGameButton(x, y, bombs);

makeModuleLoseInvisible(x, y, bombs);

makeModuleWinInvisible(x, y, bombs);
