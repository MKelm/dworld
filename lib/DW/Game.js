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
  this.map.load("greenland");

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
  //this.display.drawCreatures();

  this.lastUpdateTime = dw.util.time();
  this.run = true;
}

DW.Game.prototype.update = function(scope) {
  var timeDiff = dw.util.time() - scope.lastUpdateTime;
  scope.fps = 1000 / timeDiff;
  //scope.creatureHandler.update();
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
      scope.display.drawMapFields(); // update visible fields by view distance
      if (isLastField === true) {
        var fieldType = scope.map.getTypeByPosition(position.x, position.y);
        if (fieldType == 4 || fieldType == 5) {
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
      var playerDamage = scope.player.makeStrike();
      var creatureDamage = scope.windows.fight.currentCreature.makeStrike();
      scope.windows.fight.currentCreature.setStrike(playerDamage);
      scope.player.setStrike(creatureDamage);
      // update fight window or remove creature on fight win
      if (scope.windows.fight.currentCreature.health > 0) {
        scope.windows.fight.drawAttackStatus("player", playerDamage);
        scope.windows.fight.drawAttackStatus("creature", creatureDamage);
        scope.windows.fight.drawRoundHint();
      } else {
        scope.creatureHandler.removeCreature(this.windows.fight.currentCreature);
        scope.windows.fight.hide();
      }
      break;
    case "window-transition-click":
      // player clicked use transition button
      for (var property in scope.windows) {
        if (scope.windows.hasOwnProperty(property) && scope.windows[property].visible == true) {
          scope.windows[property].visible = false;
        }
      }
      scope.windows.transition.hide();
      scope.creatureHandler = new DW.CreatureHandler(scope);
      scope.chestHandler = new DW.ChestHandler();
      var lastMapHandle = scope.map.lastMapHandle;
      scope.map = new DW.Map(scope);
      scope.map.lastMapHandle = lastMapHandle;
      scope.map.load(event.content.transition.handle);
      scope.display.hide();
      scope.display = new DW.Display(scope);
      scope.display.initialize();
      scope.display.drawMapFields();
      scope.display.drawPlayerChar();
      scope.display.drawCreatures();
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