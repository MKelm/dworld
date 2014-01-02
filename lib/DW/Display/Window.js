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
  this.game = game;
  this.width = width;
  this.height = height;
  this.container = null;
  this.title = "Title";
  this.visible = false;
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
  this.drawTable(6, 10, 50, 50);
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
  var style = {font: 36 + "px " + "Arial", fill: "FFFFFF"};
  var tTitle = new PIXI.Text(this.title, style);
  tTitle.position = { x: this.width/2-tTitle.width/2, y: 10 };
  this.container.addChild(tTitle);
}

DW.DisplayWindow.prototype.drawTable = function(rows, cells, cellWidth, cellHeight) {
  var gfx = new PIXI.Graphics(), posX = null, posY = 60;
  var marginLeft = (this.width - (cells * cellWidth - 1)) / 2;
  gfx.lineStyle(1.5, 0xFFFFFF);
  for (var r = 0; r < rows; r++) {
    posX = marginLeft;
    for (var c = 0; c < cells; c++) {
      gfx.drawRect(posX, posY, cellWidth, cellHeight);
      posX += cellWidth;
    }
    posY += cellHeight;
  }
  this.container.addChild(gfx);
}