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

DW.Chest = function(x, y) {
  this.position = { x: x, y: y };

  this.content = [];
  this.loadContent();
}

DW.Chest.prototype.constructor = DW.Chest;

DW.Chest.prototype.loadContent = function() {
  var data = dw.util.loadJSON('./lib/data/chest/content.json');
  // todo: randomized item selection ...
  for (var i = 0; i < data.items.length; i++) {
    this.content.push(
      { handle: "item_" + data.items[i].handle }
    );
  }
}

DW.Chest.prototype.removeContent = function(id) {
  this.content.splice(id, 1);
}