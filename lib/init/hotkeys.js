/*
 * This file is part of DWorld.
 * Copyright 2014 by Martin Kelm - All rights reserved.
 * Project page @ https://github.com/mkelm/dworld
 *
 * DWorld is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * DWorld is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DWorld. If not, see <http://www.gnu.org/licenses/>.
 */

// some hotkey functions

$("html").keyup(function(e){
  if (e.which == 27) { // ESC
    dw.util.quit();
  } else if (e.which == 112) { // F1
    dw.pixi.setFpsCounter(true, dw.pixi);

  } else if (e.which == 113) { // F2 inventory window
    // todo ...
    if (dw.game.windows["inventory"].visible === true) {
      dw.game.windows["inventory"].hide();
    } else {
      dw.game.windows["inventory"].show();
    }
  } else if (e.which == 114) { // F2 test window
    if (dw.game.windows["transition"].visible === true) {
      dw.game.windows["transition"].hide();
    } else {
      dw.game.windows["transition"].show();
    }
  }
});
