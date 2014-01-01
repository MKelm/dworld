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

DW.Display.prototype.drawPlayerChar = function(nextPosX, nextPosY) {
  var fWidth = 50, fHeight = 50;

  if (this.game.player.gfx === null) {
    var sprite = new PIXI.Sprite(PIXI.Texture.fromImage("data/gfx/player_char.png"));
    sprite.width = fWidth;
    sprite.height = fHeight;
    this.container.addChild(sprite);
    this.game.player.gfx = sprite;

    // next negative position for map container to get player in the middle of screen
    nextPosX = -1 * this.game.player.position.x * fWidth - (fWidth / 2);
    nextPosY = -1 * this.game.player.position.y * fHeight - (fHeight / 2);

    // set player/map in middle of screen
    this.game.player.gfx.position = { x: -1 * fWidth/2, y: -1 * fHeight/2 };
    this.mapContainer.position = { x: nextPosX, y: nextPosY };

  } else {
    // move mapContainer to move player char in middle of screen
    nextPosX = this.mapContainer.position.x - nextPosX;
    nextPosY = this.mapContainer.position.y - nextPosY;
    this.mapContainer.position = { x: nextPosX, y: nextPosY };
  }
}

DW.Display.prototype.drawMapAreas = function() {
  var fWidth = 50, fHeight = 50, sprite = null, map = this.game.map;
  var textures = [];
  for (var ftId = 0; ftId < map.fieldTypes.length; ftId++) {
    textures[ftId] = PIXI.Texture.fromImage("data/gfx/field_" + map.fieldTypes[ftId].handle + ".png");
  }

  for (var aY = 0; aY < map.loadedAreas.length; aY++) {
    for (var aX = 0; aX < map.loadedAreas[aY].length; aX++) {

      // use a container to handle areas later by this gfx object
      var areaContainer = new PIXI.DisplayObjectContainer();
      var loadedArea = map.loadedAreas[aY][aX];
      if (loadedArea.visible == false) {
        var startCoorX = aX * 500, startCoorY = aY * 500, fCoorX = null, fCoorY = null;

        fCoorY = startCoorY;
        for (var fY = 0; fY < loadedArea.fields.length; fY++) {
          fCoorX = startCoorX;
          for (var fX = 0; fX < loadedArea.fields[fY].length; fX++) {

            sprite = new PIXI.Sprite(textures[loadedArea.fields[fY][fX]]);
            sprite.width = fWidth;
            sprite.height = fHeight;
            sprite.position = { x: fCoorX, y: fCoorY };
            areaContainer.addChild(sprite);

            fCoorX += fWidth;
          }
          fCoorY += fHeight;
        }

        // set interaction layer
        sprite = new PIXI.Sprite(PIXI.Texture.fromImage("data/gfx/blank.png"));
        sprite.width = 500;
        sprite.height = 500;
        sprite.position = { x: startCoorX, y: startCoorY };
        sprite.setInteractive(true);
        eventContent = {};
        callback = function(mouse) {
          $.extend(eventContent, { mouse: mouse });
          dw.game.dispatchEvent({ type: "map-area-click", content: eventContent });
        };
        sprite.click = callback;
        areaContainer.addChild(sprite);

        loadedArea.visible = true;
        loadedArea.gfx = areaContainer;
        this.mapContainer.addChild(areaContainer);
      }
    }
  }
}