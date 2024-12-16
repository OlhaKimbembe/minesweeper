import {
  createBoard,
  resetGameButton,
  makeModuleLoseInvisible,
  makeModuleWinInvisible,
} from "./script.js";

const x = 30;
const y = 16;
const bombs = 99;

createBoard(x, y, bombs);

resetGameButton(x, y, bombs);

makeModuleLoseInvisible(x, y, bombs);

makeModuleWinInvisible(x,y,bombs)
