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

DW.Game = function() {
  // use pixi event target to handle display object interaction events
  // see -> https://github.com/MKelm/pixi.js/blob/dev/src/pixi/utils/EventTarget.js
  PIXI.EventTarget.call(this);
  this.fps = -1;

  this.run = false;
  this.lastUpdateTime = null;

  this.player = new DW.Player();
  this.creatureHandler = new DW.CreatureHandler();

  this.map = new DW.Map(this);

  this.display = new DW.Display(this);
  this.display.initialize();

  // register interaction event listeners
  this.addEventListener('map-field-click', dw.util.getEventListener(this, "handleEvent"));
}

DW.Game.prototype.constructor = DW.Game;

DW.Game.prototype.start = function() {
  this.display.drawMapFields();
  this.display.drawPlayerChar();
  this.display.drawCreatures();

  this.displayWindow = new DW.DisplayWindow(this, 600, 400);
  this.displayWindow.initialize();
  this.displayWindow.drawContent();
  this.displayWindow.drawTitle("Test Window");

  this.lastUpdateTime = dw.util.time();
  this.run = true;
}

DW.Game.prototype.update = function(scope) {
  var timeDiff = dw.util.time() - scope.lastUpdateTime;
  scope.fps = 1000 / timeDiff;
  // update game items
  scope.lastUpdateTime = dw.util.time();
}

DW.Game.prototype.handleEvent = function(scope, event) {
  switch (event.type) {
    case "map-field-click":
      // set player to new location and perform animation
      scope.display.movePlayerChar(
        event.content.fieldPosition.x, event.content.fieldPosition.y
      );
      break;
  }
}