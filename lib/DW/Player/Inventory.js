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

DW.PlayerInventory = function(player) {

  this.player = player;
  this.content = [];
}

DW.PlayerInventory.prototype.constructor = DW.PlayerInventory;

DW.PlayerInventory.prototype.addContent = function(content) {
  this.content.push(content);
  this.content[this.content.length-1].active = false;
}

DW.PlayerInventory.prototype.removeContent = function(id) {
  this.content.splice(id, 1);
}

DW.PlayerInventory.prototype.useContent = function(id) {
  var isSpell = false;
  if (typeof this.content[id] != "undefined" && typeof this.content[id].effects == "object") {
    for (var property in this.content[id].effects) {
      if (property == "spellDamage") {
        isSpell = true;
        this.content[id].active = true;
      } else {
        this.player[property](this.content[id].effects[property]);
      }
    }
    if (isSpell) {
      for (var i = 0; i < this.content.length; i++) {
        if (i != id) this.content[i].active = false;
      }
    }
  }
  if (isSpell == false) this.removeContent(id);
  console.log(this.content);
}