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

DW.DisplayWindowFight = function(game) {
  DW.DisplayWindow.call(this, game, 600, 400);
  this.handle = "fight";
  this.title = "Fight";
  this.hint = "";
  this.currentCreature = null;

  this.hitPointsTextGfx = { player: null, creature: null };
}

DW.DisplayWindowFight.prototype = Object.create(DW.DisplayWindow.prototype);
DW.DisplayWindowFight.prototype.constructor = DW.DisplayWindowFight;

DW.DisplayWindowFight.prototype.show = function() {
  DW.DisplayWindow.prototype.show.call(this);
  this.drawPlayer();
  this.drawPlayerHitPoints();
  this.drawCreature();
  this.drawCreatureHitPoints();
}

DW.DisplayWindowFight.prototype.drawHitPoints = function(type, posX, posY) {
  var preText = "Hitpoints: ";
  var points = (type == "player") ? this.game.player.hitPoints : this.currentCreature.hitPoints;
  if (this.hitPointsTextGfx[type] === null) {
    var style = {font: 16 + "px " + "Arial", fill: "FFFFFF"};
    var tHPoints = new PIXI.Text(preText + points, style);
    tHPoints.position = { x: posX, y: posY };
    this.container.addChild(tHPoints);
    this.hitPointsTextGfx[type] = tHPoints;
  } else {
    this.hitPointsTextGfx[type].setText(preText + points);
  }
}

DW.DisplayWindowFight.prototype.drawPlayer = function() {
  var sprite = new PIXI.Sprite(PIXI.Texture.fromImage("data/gfx/player_char.png"));
  sprite.position = { x: 10, y: 120 };
  sprite.scale = { x: 3, y: 3 };
  this.container.addChild(sprite);
}

DW.DisplayWindowFight.prototype.drawPlayerHitPoints = function() {
  this.drawHitPoints("player", 35, 350);
}

DW.DisplayWindowFight.prototype.drawCreature = function() {
  var sprite = new PIXI.Sprite(
    PIXI.Texture.fromImage("data/gfx/creature_"+ this.currentCreature.handle +".png")
  );
  sprite.position = { x: this.width-200, y: 120 };
  sprite.scale = { x: 3, y: 3 };
  this.container.addChild(sprite);
}

DW.DisplayWindowFight.prototype.drawCreatureHitPoints = function() {
  this.drawHitPoints("creature", this.width-165, 350);
}