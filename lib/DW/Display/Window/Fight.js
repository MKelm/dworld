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

  this.playerHitPointsText = null;
  this.creatureHitPointsText = null;
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

DW.DisplayWindowFight.prototype.drawPlayer = function() {
  var sprite = new PIXI.Sprite(PIXI.Texture.fromImage("data/gfx/player_char.png"));
  sprite.position = { x: 10, y: 120 };
  sprite.scale = { x: 3, y: 3 };
  this.container.addChild(sprite);
}

DW.DisplayWindowFight.prototype.drawPlayerHitPoints = function() {
  var preText = "Hitpoints: ";
  if (this.playerHitPointsText === null) {
    var style = {font: 16 + "px " + "Arial", fill: "FFFFFF"};
    var tHPoints = new PIXI.Text(preText+this.game.player.hitPoints, style);
    tHPoints.position = { x: 35, y: 350 };
    this.container.addChild(tHPoints);
    this.playerHitPointsText = tHPoints;
  } else {
    this.playerHitPointsText.setText(preText+this.game.player.hitPoints);
  }
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
  var preText = "Hitpoints: ";
  if (this.creatureHitPointsText === null) {
    var style = {font: 16 + "px " + "Arial", fill: "FFFFFF"};
    var tHPoints = new PIXI.Text(preText+this.currentCreature.hitPoints, style);
    tHPoints.position = { x: this.width-165, y: 350 };
    this.container.addChild(tHPoints);
    this.creatureHitPointsText = tHPoints;
  } else {
    this.creatureHitPointsText.setText(preText+this.currentCreature.hitPoints);
  }
}