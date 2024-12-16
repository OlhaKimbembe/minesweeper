import {
  createBoard,
  resetGameButton,
  makeModuleLoseInvisible,
  makeModuleWinInvisible,
} from "./script.js";

const x = 16;
const y = 16;
const bombs = 40;

createBoard(x, y, bombs);

resetGameButton(x, y, bombs);

makeModuleLoseInvisible(x, y, bombs);

makeModuleWinInvisible(x, y, bombs);
