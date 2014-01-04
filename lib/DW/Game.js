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
  this.creatureHandler = new DW.CreatureHandler(this);
  this.chestHandler = new DW.ChestHandler();

  this.map = new DW.Map(this);

  this.display = new DW.Display(this);
  this.display.initialize();

  this.windows = {
    chest: new DW.DisplayWindowChest(this),
    inventory: new DW.DisplayWindowInventory(this),
    fight: new DW.DisplayWindowFight(this),
    transition: new DW.DisplayWindowTransition(this)
  };

  // register interaction event listeners
  this.addEventListener('map-field-fight', dw.util.getEventListener(this, "handleEvent"));
  this.addEventListener('map-field-reached', dw.util.getEventListener(this, "handleEvent"));
  this.addEventListener('map-field-click', dw.util.getEventListener(this, "handleEvent"));
  this.addEventListener('window-close-click', dw.util.getEventListener(this, "handleEvent"));
  this.addEventListener('window-fight-click', dw.util.getEventListener(this, "handleEvent"));
  this.addEventListener('window-transition-click', dw.util.getEventListener(this, "handleEvent"));
  this.addEventListener('window-table-content-mouseover', dw.util.getEventListener(this, "handleEvent"));
  this.addEventListener('window-table-content-mouseout', dw.util.getEventListener(this, "handleEvent"));
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
  scope.creatureHandler.update(); // move creatures ...
  scope.lastUpdateTime = dw.util.time();
}

DW.Game.prototype.handleEvent = function(scope, event) {
  switch (event.type) {
    case "map-field-fight":
      if (scope.windows.fight.visible == false) {
        var currentCreature = event.content.creature;
        if (currentCreature !== null) {
          // stop on fields with a creature to show fight window
          scope.player.movement = false;
          currentCreature.movement.stop = true;
          scope.windows.fight.currentCreature = currentCreature;
          scope.windows.fight.show();
        }
      }
      break;
    case "map-field-reached":
      var position = event.content.position, isLastField = event.content.isLastField;
      if (isLastField === true) {
        if (scope.map.getTypeByPosition(position.x, position.y) == 4) {
          // show chest if last field
          scope.windows.chest.currentChest = scope.chestHandler.getChestByPosition(
            position.x, position.y
          );
          scope.windows.chest.tableContent = scope.windows.chest.currentChest.content;
          scope.windows.chest.show();
        } else {
          var transition = scope.map.getTransitionByPosition(position.x, position.y);
          if (typeof transition !="undefined") {
            // show window to ask for area transition
            console.log("show transition window");
            scope.windows.transition.currentTransition = transition;
            scope.windows.transition.show();
          }
        }
      }
      break;
    case "map-field-click":
      var perform = true;
      // detect visible window to disable event
      for (var property in scope.windows) {
        if (scope.windows.hasOwnProperty(property) && scope.windows[property].visible == true) {
          perform = false;
        }
      }
      if (perform === true) {
        // set player to new location and perform animation
        scope.display.movePlayerChar(
          event.content.fieldPosition.x, event.content.fieldPosition.y
        );
      }
      break;
    case "window-close-click":
      scope.windows[event.content.window].hide();
      break;
    case "window-fight-click":
      // attack / hit points calculation
      var playerDamage = this.player.makeStrike();
      var creatureDamage = this.windows.fight.currentCreature.makeStrike();
      this.windows.fight.currentCreature.setStrike(playerDamage);
      this.player.setStrike(creatureDamage);
      // update fight window or remove creature on fight win
      if (this.windows.fight.currentCreature.health > 0) {
        this.windows.fight.drawAttackStatus("player", playerDamage);
        this.windows.fight.drawAttackStatus("creature", creatureDamage);
        this.windows.fight.drawRoundHint();
      } else {
        this.creatureHandler.removeCreature(this.windows.fight.currentCreature);
        this.windows.fight.hide();
      }
      break;
    case "window-transition-click":
      // player clicked use transition button
      console.log("window trans click");
      break;
    case "window-table-content-mouseover":
      scope.windows[event.content.window].drawTempHint(
        scope.windows[event.content.window].tableContent[event.content.position].hint
      );
      break;
    case "window-table-content-mouseout":
      scope.windows[event.content.window].removeTempHint();
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
          } else {
            // use item from inventory
            scope.player.inventory.useContent(event.content.position);
            scope.windows.inventory.hide();
            scope.windows.inventory.show();
          }
          break;
      }

      break;
  }
}