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

DW.DisplayWindow = function(game, width, height) {
  this.handle = "default";
  this.game = game;
  this.width = width;
  this.height = height;
  this.container = null;
  this.title = "";
  this.hint = "";
  this.hintGfx = null;
  this.tmpHintGfx = null;
  this.visible = false;
  this.tableContent = [];
}

DW.DisplayWindow.prototype.constructor = DW.DisplayWindow;

DW.DisplayWindow.prototype.initialize = function() {
  this.container = new PIXI.DisplayObjectContainer();
  this.container.position = {x: -1 * this.width/2, y: -1 * this.height/2 };
  this.game.display.container.addChild(this.container);
}

DW.DisplayWindow.prototype.show = function() {
  this.visible = true;
  this.initialize();
  this.drawContent();
  this.drawTitle();
  this.drawHint();
}

DW.DisplayWindow.prototype.hide = function() {
  this.visible = false;
  this.game.display.container.removeChild(this.container);
}

DW.DisplayWindow.prototype.drawContent = function() {
  var gfx = new PIXI.Graphics();
  gfx.beginFill(0x4B4B4B);
  gfx.alpha = 0.7;
  gfx.drawRect(0, 0, this.width, this.height);
  this.container.addChild(gfx);

  var gfx = new PIXI.Graphics();
  gfx.lineStyle(1.5, 0xFFFFFF);
  gfx.drawRect(0, 0, this.width, this.height);
  this.container.addChild(gfx);
}

DW.DisplayWindow.prototype.drawTitle = function() {
  if (this.title.length > 0) {
    var style = {font: 36 + "px " + "Arial", fill: "FFFFFF"};
    var tTitle = new PIXI.Text(this.title, style);
    tTitle.position = { x: this.width/2-tTitle.width/2, y: 10 };
    this.container.addChild(tTitle);
  }
}

DW.DisplayWindow.prototype.drawCloseButton = function() {
  var style = {font: 20 + "px " + "Arial", fill: "FFFFFF"}, sprite = null, scope = this;
  var tClose = new PIXI.Text("X", style);
  tClose.position = { x: this.width-tClose.width-10, y: 10 };
  this.container.addChild(tClose);

  sprite = new PIXI.Sprite(
    PIXI.Texture.fromImage("data/gfx/blank.png")
  );
  sprite.width = tClose.width;
  sprite.height = tClose.height;
  sprite.position = { x: this.width-tClose.width-10, y: 10 };
  sprite.setInteractive(true);
  !function() {
    sprite.click = function(mouse) {
      scope.game.dispatchEvent({
        type: "window-close-click", content: { window: scope.handle }
      });
    };
  }();
  this.container.addChild(sprite);
}

DW.DisplayWindow.prototype.drawTable = function(rows, cells, cellWidth, cellHeight) {
  var gfx = new PIXI.Graphics(), posX = null, posY = 60, absPos = 0, scope = this;
  var marginLeft = (this.width - (cells * cellWidth - 1)) / 2, sprite = null;
  gfx.lineStyle(1.5, 0xFFFFFF);
  for (var r = 0; r < rows; r++) {
    posX = marginLeft;
    for (var c = 0; c < cells; c++) {
      // content interaction sprite
      if (typeof this.tableContent[absPos] != "undefined" && this.tableContent[absPos] !== null) {
        sprite = new PIXI.Sprite(
          PIXI.Texture.fromImage("data/gfx/"+this.tableContent[absPos].handle+".png")
        );
        sprite.width = cellWidth;
        sprite.height = cellHeight;
        sprite.position = { x: posX, y: posY };
        sprite.setInteractive(true);
        !function(iAbsPos) {
          sprite.click = function(mouse) {
            scope.game.dispatchEvent({
              type: "window-table-content-click",
              content: { mouse: mouse, window: scope.handle, position: iAbsPos }
            });
          };
          sprite.mouseover = function(mouse) {
            scope.game.dispatchEvent({
              type: "window-table-content-mouseover",
              content: { mouse: mouse, window: scope.handle, position: iAbsPos }
            });
          };
          sprite.mouseout = function(mouse) {
            scope.game.dispatchEvent({
              type: "window-table-content-mouseout",
              content: { mouse: mouse, window: scope.handle, position: iAbsPos }
            });
          };
        }(absPos);
        this.container.addChild(sprite);
        this.tableContent[absPos].gfx = sprite;
      }
      // cell border
      gfx.drawRect(posX, posY, cellWidth, cellHeight);
      posX += cellWidth;
      absPos++;
    }
    posY += cellHeight;
  }
  this.container.addChild(gfx);
}

DW.DisplayWindow.prototype.drawHint = function() {
  if (this.hint.length > 0) {
    var style = {font: 16 + "px " + "Arial", fill: "FFFFFF"};
    var tHint = new PIXI.Text(this.hint, style);
    tHint.position = { x: this.width/2-tHint.width/2, y: this.height-26 };
    this.container.addChild(tHint);
    this.hintGfx = tHint;
  }
}

DW.DisplayWindow.prototype.drawTempHint = function(hint) {
  if (this.tmpHintGfx == null && hint.length > 0) {
    this.hintGfx.visible = false;

    var style = {font: 16 + "px " + "Arial", fill: "FFFFFF"};
    var tTmpHint = new PIXI.Text("Hint: " + hint, style);
    tTmpHint.position = { x: this.width/2-tTmpHint.width/2, y: this.height-26 };
    this.container.addChild(tTmpHint);
    this.tmpHintGfx = tTmpHint;
  }
}

DW.DisplayWindow.prototype.removeTempHint = function() {
  if (this.tmpHintGfx !== null) {
    this.container.removeChild(this.tmpHintGfx);
    this.tmpHintGfx = null;
    if (this.hintGfx !== null) {
      this.hintGfx.visible = true;
    }
  }
}

DW.DisplayWindow.prototype.removeTableContent = function(id) {
  this.tableContent[id] = null;
}