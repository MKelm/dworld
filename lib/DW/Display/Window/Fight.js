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

  this.currentCreature = null;
  this.currentRound = -1;

  this.hitPointsTextGfx = { player: null, creature: null };
  this.attackTextGfx = { player: null, creature: null };
}

DW.DisplayWindowFight.prototype = Object.create(DW.DisplayWindow.prototype);
DW.DisplayWindowFight.prototype.constructor = DW.DisplayWindowFight;

DW.DisplayWindowFight.prototype.show = function() {
  DW.DisplayWindow.prototype.show.call(this);
  this.drawPlayer();
  this.drawPlayerHitPoints();
  this.drawCreature();
  this.drawCreatureHitPoints();
  this.drawFightButton();
  this.drawRoundHint();
}

DW.DisplayWindowFight.prototype.hide = function() {
  DW.DisplayWindow.prototype.hide.call(this);
  this.currentCreature = null;
  this.currentRound = -1;
  this.hitPointsTextGfx.player = null;
  this.hitPointsTextGfx.creature = null;
  this.attackTextGfx.player = null;
  this.attackTextGfx.creature = null;
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

DW.DisplayWindowFight.prototype.drawFightButton = function() {
  var posX = 250, posY = 180, marginWidth = 4, marginHeight = 3, scope = this;

  var style = {font: 26 + "px " + "Arial", fill: "FFFFFF"};
  var tAttack = new PIXI.Text("Attack!", style);
  tAttack.position = { x: posX, y: posY };
  this.container.addChild(tAttack);

  var gfx = new PIXI.Graphics();
  gfx.lineStyle(1.5, 0xFFFFFF);
  gfx.drawRect(
    posX - marginWidth, posY - marginHeight,
    tAttack.width + 2 * marginWidth, tAttack.height + 2 * marginHeight
  );
  this.container.addChild(gfx);

  var sprite = new PIXI.Sprite(PIXI.Texture.fromImage("data/gfx/blank.png"));
  sprite.position = { x: posX - marginWidth, y: posY - marginHeight };
  sprite.width = tAttack.width + 2 * marginWidth;
  sprite.height = tAttack.height + 2 * marginHeight;
  sprite.setInteractive(true);

  !function() {
    sprite.click = function(mouse) {
      scope.game.dispatchEvent({
        type: "window-fight-click", content: { mouse: mouse }
      });
    };
  }();
  this.container.addChild(sprite);
}

DW.DisplayWindowFight.prototype.drawAttackStatus = function(type, attackPoints) {
  var textAttack = "Attack with %d points", textAttackFailed = "Attack failed", text = null;
  var textDirLeft = "<< ", textDirRight = " >>";

  var posX = (type == "player") ? 220 : 140;
  var posY = (type == "player") ? 100 : 260;

  if (attackPoints == 0) {
    // draw attack failed status
    text = (type == "player") ? textAttackFailed + textDirRight : textDirLeft + textAttackFailed;
  } else {
    textAttack = textAttack.replace("%d", attackPoints);
    text = (type == "player") ? textAttack + textDirRight : textDirLeft + textAttack;
  }

  if (this.attackTextGfx[type] === null) {
    var style = {font: 26 + "px " + "Arial", fill: "FFFFFF"};
    var tAttackText = new PIXI.Text(text, style);
    tAttackText.position = { x: posX, y: posY };
    this.container.addChild(tAttackText);
    this.attackTextGfx[type] = tAttackText;
  } else {
    this.attackTextGfx[type].setText(text);
  }

  this.drawPlayerHitPoints();
  this.drawCreatureHitPoints();
}

DW.DisplayWindowFight.prototype.drawRoundHint = function() {
  this.currentRound++;
  this.hint = "Round " + this.currentRound;
  this.drawHint();
}