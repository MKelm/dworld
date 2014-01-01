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
  this.mapContainer = null
}

DW.Display.prototype.constructor = DW.Display;

DW.Display.prototype.initialize = function() {
  this.container = new PIXI.DisplayObjectContainer();
  this.container.position = {x: dw.pixi.screen.width/2, y: dw.pixi.screen.height/2 };
  this.container.scale = {x: dw.pixi.screen.ratio * 1.5, y: dw.pixi.screen.ratio * 1.5};
  dw.pixi.stage.addChild(this.container);

  this.mapContainer = new PIXI.DisplayObjectContainer();
  this.container.addChild(this.mapContainer);
}

DW.Display.prototype.drawPlayerChar = function(positionX, positionY) {
  var fWidth = this.game.map.fieldSize.width, fHeight = this.game.map.fieldSize.height;
  // next negative position for map container to get player in the middle of screen
  var nextPosX = -1 * this.game.player.position.x * fWidth - (fWidth / 2);
  var nextPosY = -1 * this.game.player.position.y * fHeight - (fHeight / 2);

  var sprite = new PIXI.Sprite(PIXI.Texture.fromImage("data/gfx/player_char.png"));
  sprite.width = fWidth;
  sprite.height = fHeight;
  this.container.addChild(sprite);
  this.game.player.gfx = sprite;

  // set player/map in middle of screen
  this.game.player.gfx.position = { x: -1 * fWidth/2, y: -1 * fHeight/2 };
  // set mapContainer to display player char in middle of screen
  this.mapContainer.position = { x: nextPosX, y: nextPosY };

}

DW.Display.prototype.movePlayerChar = function(positionX, positionY) {
  var fWidth = this.game.map.fieldSize.width, fHeight = this.game.map.fieldSize.height;
  this.game.player.position.x = positionX;
  this.game.player.position.y = positionY;

  // next negative position for map container to get player in the middle of screen
  var nextPosX = -1 * this.game.player.position.x * fWidth - (fWidth / 2);
  var nextPosY = -1 * this.game.player.position.y * fHeight - (fHeight / 2);
  // get correct animation time by distance and player speed
  var distance = Math.sqrt(
    Math.pow(this.mapContainer.position.x - nextPosX, 2) + Math.pow(this.mapContainer.position.y - nextPosY, 2)
  );
  // move mapContainer to display player char movment in middle of screen
  var scope = this;
  new TWEEN.Tween( { x: scope.mapContainer.position.x, y: scope.mapContainer.position.y  } )
  .to(
    { x: nextPosX, y: nextPosY }, 1000 * (distance / this.game.player.speed)
  )
  .onUpdate( function () {
    scope.mapContainer.position.x = this.x;
    scope.mapContainer.position.y = this.y;
  })
  .onComplete( function() { })
  .start();
}

DW.Display.prototype.drawMapFields = function() {
  var fWidth = 50, fHeight = 50, sprite = null, map = this.game.map;
  var textures = [];
  for (var ftId = 0; ftId < map.fieldTypes.length; ftId++) {
    textures[ftId] = PIXI.Texture.fromImage("data/gfx/field_" + map.fieldTypes[ftId].handle + ".png");
  }

  var fCoorY = 0, fCoorX = 0;
  for (var fY = 0; fY < map.loadedFields.length; fY++) {
    fCoorX = 0;
    for (var fX = 0; fX < map.loadedFields[fY].length; fX++) {

      sprite = new PIXI.Sprite(textures[map.loadedFields[fY][fX]]);
      sprite.width = fWidth;
      sprite.height = fHeight;
      sprite.position = { x: fCoorX, y: fCoorY };

      sprite.setInteractive(true);
      !function(ifX, ifY) {
        sprite.click = function(mouse) {
          dw.game.dispatchEvent({
            type: "map-field-click",
            content: { mouse: mouse, fieldPosition: { x: ifX, y: ifY } }
          });
        };
      }(fX, fY);

      this.mapContainer.addChild(sprite);
      fCoorX = fCoorX + 50;
    }
    fCoorY = fCoorY + 50;
  }
}