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

DW.DisplayWindowTransition = function(game) {
  DW.DisplayWindow.call(this, game, 500, 120);
  this.handle = "transition";
  this.title = "";
  this.hint = "";
  this.currentTransition = null;
}

DW.DisplayWindowTransition.prototype = Object.create(DW.DisplayWindow.prototype);
DW.DisplayWindowTransition.prototype.constructor = DW.DisplayWindowTransition;

DW.DisplayWindowTransition.prototype.show = function() {
  this.title = this.currentTransition != null ? this.currentTransition.title : "Transition to test";
  DW.DisplayWindow.prototype.show.call(this);
  this.drawUseTransitionButton();
  this.drawCloseButton();
}

DW.DisplayWindowTransition.prototype.hide = function() {
  this.title = "";
  this.currentTransition = null;
  DW.DisplayWindow.prototype.hide.call(this);
}

DW.DisplayWindow.prototype.drawUseTransitionButton = function() {
  var posY = 70, marginWidth = 4, marginHeight = 3, scope = this;

  var style = {font: 26 + "px " + "Arial", fill: "FFFFFF"};
  var tUse = new PIXI.Text("Use transition", style);
  tUse.position = { x: this.width/2-tUse.width/2, y: posY };
  this.container.addChild(tUse);

  var gfx = new PIXI.Graphics();
  gfx.lineStyle(1.5, 0xFFFFFF);
  gfx.drawRect(
    this.width/2-tUse.width/2-marginWidth, posY - marginHeight,
    tUse.width + 2 * marginWidth, tUse.height + 2 * marginHeight
  );
  this.container.addChild(gfx);

  var sprite = new PIXI.Sprite(PIXI.Texture.fromImage("data/gfx/blank.png"));
  sprite.position = { x: this.width/2-tUse.width/2 - marginWidth, y: posY - marginHeight };
  sprite.width = tUse.width + 2 * marginWidth;
  sprite.height = tUse.height + 2 * marginHeight;
  sprite.setInteractive(true);

  !function() {
    sprite.click = function(mouse) {
      scope.game.dispatchEvent({
        type: "window-transition-click", content: { mouse: mouse, transition: scope.currentTransition }
      });
    };
  }();
  this.container.addChild(sprite);
}