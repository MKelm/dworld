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

// global object initialization
var dw = dw || {};

$(document).ready(function() {
  global.setTimeout(function() {
    //try {
      dw.util = new DW.Util();

      dw.version = new DW.Version();
      dw.version.updateHashesFile(); // for maintainer

      dw.userConfig = dw.util.loadJSON('./user/data/config.json');
      dw.intervals = {};
      dw.pixi = new DW.Pixi();

      dw.game = new DW.Game();

      // add/start the pixi renderer
      document.body.appendChild(dw.pixi.renderer.view);
      requestAnimFrame(dw.pixi.animate.curry(dw.pixi));

      dw.pixi.loadAssets(function() { dw.game.start(); });

    //} catch (err) {
      //console.log(err);
    //}
  }, 0.00000001); // use timeout to detect fullscreen size correctly
});
