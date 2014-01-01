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

DW.Display = function() {

  this.container = null;
}

DW.Display.prototype.constructor = DW.Display;

DW.Display.prototype.initialize = function() {
  this.container = new PIXI.DisplayObjectContainer();
  this.container.position = {x: 0, y: 0 };
  this.container.scale = {x: dw.pixi.screen.ratio, y: dw.pixi.screen.ratio};
  dw.pixi.stage.addChild(this.container);
}

DW.Display.prototype.addObject = function(object) {
  this.container.addChild(object);
}

DW.Display.prototype.removeObject = function(object) {
  this.container.removeChild(object);
}