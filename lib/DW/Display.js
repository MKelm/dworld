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

DW.Display = function(game) {

  this.game = game;
  this.container = null;
  this.mapContainer = null;
  this.mapSprites = [];
  this.creaturesContainer = null;
}

DW.Display.prototype.constructor = DW.Display;

DW.Display.prototype.initialize = function() {
  this.container = new PIXI.DisplayObjectContainer();
  this.container.position = {x: dw.pixi.screen.width/2, y: dw.pixi.screen.height/2 };
  this.container.scale = {x: dw.pixi.screen.ratio * 1.5, y: dw.pixi.screen.ratio * 1.5};
  dw.pixi.stage.addChild(this.container);

  this.mapContainer = new PIXI.DisplayObjectContainer();
  this.container.addChild(this.mapContainer);

  this.creaturesContainer = new PIXI.DisplayObjectContainer();
  this.container.addChild(this.creaturesContainer);

  var mapMask = new PIXI.Graphics();
  mapMask.beginFill();
  mapMask.drawRect(
    -1 * 4.5 * 50, -1 * 4.5 * 50, 9 * 50, 9 * 50
  );
  mapMask.endFill();
  this.container.addChild(mapMask);

  this.mapContainer.mask = mapMask;
  this.creaturesContainer.mask = mapMask;

  var scope = this;
  dw.pixi.resizeCallback = function() { scope.handleResize(); };
}

DW.Display.prototype.handleResize = function() {
  this.container.scale = {x: dw.pixi.screen.ratio * 1.5, y: dw.pixi.screen.ratio * 1.5};
  this.container.position = {x: dw.pixi.screen.width/2, y: dw.pixi.screen.height/2 };
}

DW.Display.prototype.hide = function() {
  this.game.player.gfx = null;
  dw.pixi.stage.removeChild(this.container);
}

DW.Display.prototype.drawPlayerChar = function(positionX, positionY) {
  var fWidth = this.game.map.fieldSize.width, fHeight = this.game.map.fieldSize.height;
  // next negative position for map container to get player in the middle of screen
  var nextPosX = -1 * this.game.player.position.x * fWidth - (fWidth / 2);
  var nextPosY = -1 * this.game.player.position.y * fHeight - (fHeight / 2);

  if (this.game.player.gfx === null) {
    var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame("player_char"));
    sprite.width = fWidth;
    sprite.height = fHeight;
    this.container.addChild(sprite);
    this.game.player.gfx = sprite;

    // set player/map in middle of screen
    this.game.player.gfx.position = { x: -1 * fWidth/2, y: -1 * fHeight/2 };
  }

  // set other containers position and still display player char in middle of screen
  this.mapContainer.position = { x: nextPosX, y: nextPosY };
  this.creaturesContainer.position = { x: nextPosX, y: nextPosY };
}

DW.Display.prototype.movePlayerChar = function(positionX, positionY) {
  var fWidth = this.game.map.fieldSize.width, fHeight = this.game.map.fieldSize.height;
  // find path to go
  var path = this.game.map.calculatePath(this.game.player.position, {x: positionX, y: positionY });

  var tweens = [], lastX = this.mapContainer.position.x, lastY = this.mapContainer.position.y;
  for (var i = 0; i < path.length; i++) {
    positionX = path[i].x;
    positionY = path[i].y;

    // next negative position for map container to get player in the middle of screen
    var nextPosX = -1 * positionX * fWidth - (fWidth / 2);
    var nextPosY = -1 * positionY * fHeight - (fHeight / 2);

    // move mapContainer to display player char movment in middle of screen
    var scope = this;
    tweens[i] = function(ii, sourceX, sourceY, targetX, targetY, iFieldX, iFieldY, isLastField) {
      return new TWEEN.Tween( { x: sourceX, y: sourceY } )
        .to(
          { x: targetX, y: targetY }, 1000 * (50 / scope.game.player.speed)
        )
        .onUpdate( function () {
          if (scope.game.player.movement == false) {
            tweens[ii].stop();
          }
          scope.mapContainer.position.x = this.x;
          scope.mapContainer.position.y = this.y;
          scope.creaturesContainer.position.x = this.x;
          scope.creaturesContainer.position.y = this.y;
        })
        .onComplete( function () {
          if (scope.game.player.movement == false) {
            tweens[ii].stop();
          }
          scope.game.player.position.x = iFieldX;
          scope.game.player.position.y = iFieldY;
          scope.game.player.movement = !isLastField;
          scope.game.dispatchEvent({
            type: "map-field-reached",
            content: { position: { x: iFieldX, y: iFieldY }, isLastField: isLastField }
          });
        });
    }(
      i, lastX, lastY, nextPosX, nextPosY, positionX, positionY, (i == path.length - 1) ? true : false
    );
    if (i > 0) {
      tweens[i-1].chain(tweens[i]);
    }
    lastX = nextPosX;
    lastY = nextPosY;
  }
  if (path.length > 0) {
    this.game.player.movement = true;
    tweens[0].start();
  } else {
    this.game.player.movement = false;
  }
}

DW.Display.prototype.moveCreature = function(creature) {
  var fWidth = this.game.map.fieldSize.width, fHeight = this.game.map.fieldSize.height;

  var tweens = [], lastX = creature.sprite.position.x, lastY = creature.sprite.position.y;
  for (var i = 0; i < creature.movement.path.length; i++) {
    positionX = creature.movement.path[i].x;
    positionY = creature.movement.path[i].y;

    nextPosX = positionX * fWidth;
    nextPosY = positionY * fHeight;

    // move mapContainer to display player char movment in middle of screen
    var scope = this;
    var animationTime = 1000 * (50 / creature.speed);
    tweens[i] = function(
                  ii, sourceX, sourceY, targetX, targetY, iFieldX, iFieldY, isLastField, iAnimTime
                ) {
      return new TWEEN.Tween( { x: sourceX, y: sourceY } )
        .to(
          { x: targetX, y: targetY }, iAnimTime
        )
        .onUpdate( function () {
          if (creature.sprite !== null) {
            creature.sprite.position.x = this.x;
            creature.sprite.position.y = this.y;
            if (creature.movement.stop == true) {
              tweens[ii].stop();

            } else if (scope.game.windows.fight.visible == false) {
              // detect player / creature collision to fight, if no fight is in progress
              var x1 = creature.sprite.position.x, y1 = creature.sprite.position.y;
              var x2 = -1 * scope.mapContainer.position.x - 25, y2 = -1 * scope.mapContainer.position.y - 25;
              var xl = x1, yt = y1, xr = x2 + 50, yb = y2 + 50;
              if (x2 < x1) xl = x2;
              if (y2 < y1) yt = y2;
              if (x1 + 50 > x2 + 50) xr = x1 + 50;
              if (y1 + 50 > y2 + 50) yb = y1 + 50;
              if (50 + 50 > xr - xl && 50 + 50 > yb - yt) {
                tweens[ii].stop();
                scope.game.player.movement = false;
                scope.game.dispatchEvent({
                  type: "map-field-fight", content: { creature: creature }
                });
              }
            }
          } else {
            tweens[ii].stop();
            creature.resetMovement();
          }
        })
        .onComplete( function () {
          scope.game.creatureHandler.updatePosition(
            creature.position.x, creature.position.y, creature.position.index, iFieldX, iFieldY
          );
          creature.movement.lastUpdate = dw.util.time();
          if (isLastField == true) {
            creature.resetMovement();
          }
        });
    }(
      i, lastX, lastY, nextPosX, nextPosY, positionX, positionY,
      (i == creature.movement.path.length - 1) ? true : false, animationTime
    );
    if (i > 0) {
      tweens[i-1].chain(tweens[i]);
    }
    lastX = nextPosX;
    lastY = nextPosY;
  }
  if (creature.movement.path.length > 0) {
    creature.movement.lastUpdate = dw.util.time();
    tweens[0].start();
  } else {
    creature.resetMovement();
  }
}

DW.Display.prototype.drawMapFields = function() {
  var fWidth = 50, fHeight = 50, sprite = null, map = this.game.map, scope = this;
  var textures = [];
  for (var ftId = 0; ftId < map.fieldTypes.length; ftId++) {
    textures[ftId] = PIXI.Texture.fromFrame("field_" + map.fieldTypes[ftId].handle);
  }
  var minMaxField = this.game.map.getMinMaxField(this.game.player.position);

  // remove invisible fields
  for (var i = 0; i < this.mapSprites.length; i++) {
    if (this.mapSprites[i].position.x < minMaxField.min.x || this.mapSprites[i].position.y < minMaxField.min.y ||
        this.mapSprites[i].position.x > minMaxField.max.x || this.mapSprites[i].position.y > minMaxField.max.y) {
      map.loadedFields[this.mapSprites[i].position.y][this.mapSprites[i].position.x].visible = false;
      if (this.mapContainer.children.indexOf(this.mapSprites[i].sprite) !== -1) {
        this.mapContainer.removeChild(this.mapSprites[i].sprite);
        this.removeCreatures(this.mapSprites[i].position.x, this.mapSprites[i].position.y);
      }
    }
  }

  // add visible fields
  var fCoorY = minMaxField.min.y * 50, fCoorX = 0;
  for (var fY = minMaxField.min.y; fY <= minMaxField.max.y; fY++) {
    fCoorX = minMaxField.min.x * 50;
    for (var fX = minMaxField.min.x; fX <= minMaxField.max.x; fX++) {

      if (typeof map.loadedFields[fY][fX] != "undefined" &&
          map.loadedFields[fY][fX].visible == false) {
        sprite = new PIXI.Sprite(textures[map.loadedFields[fY][fX].type]);
        sprite.width = fWidth;
        sprite.height = fHeight;
        sprite.position = { x: fCoorX, y: fCoorY };

        sprite.setInteractive(true);
        !function(ifX, ifY) {
          sprite.click = function(mouse) {
            scope.game.dispatchEvent({
              type: "map-field-click",
              content: { mouse: mouse, fieldPosition: { x: ifX, y: ifY } }
            });
          };
        }(fX, fY);

        this.mapContainer.addChild(sprite);
        map.loadedFields[fY][fX].visible == true;
        this.mapSprites.push({
          position: { x: fX, y: fY },
          sprite: sprite
        });

        this.drawCreatures(fX, fY);
      }
      fCoorX = fCoorX + 50;
    }
    fCoorY = fCoorY + 50;
  }
}

DW.Display.prototype.drawCreatures = function(fX, fY) {
  var creatures = this.game.creatureHandler.getCreaturesByPosition(fX, fY);
  if (creatures.length > 0) {
    for (var i = 0; i < creatures.length; i++) {
      if (creatures[i].sprite === null) {
        sprite = new PIXI.Sprite(
          PIXI.Texture.fromFrame("creature_" + creatures[i].handle)
        );
        sprite.position = { x: fX * 50, y: fY * 50 };

        this.creaturesContainer.addChild(sprite);
        creatures[i].sprite = sprite;
      }
    }
  }
}

DW.Display.prototype.removeCreatures = function(fX, fY) {
  var creatures = this.game.creatureHandler.getCreaturesByPosition(fX, fY);
  if (creatures.length > 0) {
    for (var i = 0; i < creatures.length; i++) {
      if (creatures[i].sprite !== null) {
        this.creaturesContainer.removeChild(creatures[i].sprite);
        creatures[i].sprite = null;
      }
    }
  }
}