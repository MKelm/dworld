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
  this.chestHandler = new DW.ChestHandler();

  this.map = new DW.Map(this);

  this.display = new DW.Display(this);
  this.display.initialize();

  this.windows = {
    chest: new DW.DisplayWindowChest(this),
    inventory: new DW.DisplayWindowInventory(this),
    fight: null
  };

  // register interaction event listeners
  this.addEventListener('map-field-reached', dw.util.getEventListener(this, "handleEvent"));
  this.addEventListener('map-field-click', dw.util.getEventListener(this, "handleEvent"));
  this.addEventListener('window-close-click', dw.util.getEventListener(this, "handleEvent"));
  this.addEventListener('window-table-content-click', dw.util.getEventListener(this, "handleEvent"));
}

DW.Game.prototype.constructor = DW.Game;

DW.Game.prototype.start = function() {
  this.display.drawMapFields();
  this.display.drawPlayerChar();
  this.display.drawCreatures();

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
    case "map-field-reached":
      var position = event.content.position, isLastField = event.content.isLastField;
      // determine next action by field type
      switch (this.map.getTypeByPosition(position.x, position.y)) {
        case 4: // show chest if last field
          if (isLastField === true) {
            this.windows.chest.currentChest = this.chestHandler.getChestByPosition(
              position.x, position.y
            );
            this.windows.chest.tableContent = this.windows.chest.currentChest.content;
            this.windows.chest.show();
          }
          break;
      }
      // stop on fields with a creature
      if (this.creatureHandler.getCreatureByPosition(position.x, position.y) !== null) {
        this.display.movePlayer = false;
        console.log("creature reached");
        // todo: show fight window
      }
      break;
    case "map-field-click":
      // set player to new location and perform animation
      scope.display.movePlayerChar(
        event.content.fieldPosition.x, event.content.fieldPosition.y
      );
      break;
    case "window-close-click":
      scope.windows[event.content.window].hide();
      break;
    case "window-table-content-click":
      var mouseButton = window.event.button;
      switch (event.content.window) {
        case "chest":
          if (mouseButton === 0) {
            // move chest item to player inventar
            var content = scope.windows.chest.tableContent[event.content.position];
            scope.windows.chest.removeTableContent(event.content.position);
            scope.windows.chest.currentChest.removeContent(event.content.position);
            scope.player.inventory.addContent(content);
            scope.windows.chest.hide();
            scope.windows.chest.show();
          }
          break;
        case "inventory":
          if (mouseButton > 0) {
            // drop item from inventory
            scope.windows.inventory.removeTableContent(event.content.position);
            scope.player.inventory.removeContent(event.content.position);
            scope.windows.inventory.hide();
            scope.windows.inventory.show();
          }
          break;
      }

      break;
  }
}