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

// the DisplayWindow class works with html layers to display several types of windows

DW.DisplayWindow = function(game) {

  this.layerTitle = "Basic window content";
  this.game = game;
  this.visible = false;
}

DW.DisplayWindow.prototype.constructor = DW.DisplayWindow;

DW.DisplayWindow.prototype.show = function() {
  var y = Math.ceil(50 * dw.pixi.screen.ratio);
  var width = Math.ceil(dw.pixi.screen.width - (100 * dw.pixi.screen.ratio));
  var paddingLeft = Number($("body").css("padding-left").replace("px",""));
  var x = paddingLeft + Math.ceil(50 * dw.pixi.screen.ratio);
  $('body').append(
    '<div id="windowLayer" style="background-color: white; opacity: 0.7; position: fixed; top: '
    + (y + Math.ceil(1 * dw.pixi.screen.ratio)) + 'px; left: ' + (x + Math.ceil(dw.pixi.screen.ratio)) +
    'px; width: ' + width + 'px; color: black;">' +
    '<h2 style="font-size: ' + Math.ceil(25*dw.pixi.screen.ratio) + 'px; margin: '+
    Math.ceil(12*dw.pixi.screen.ratio) +'px ' + Math.ceil(12*dw.pixi.screen.ratio) + 'px">'
    + this.layerTitle + '</h2>MORE WINDOW CONTENT</div>'
  );
  this.visible = true;
}

DW.DisplayWindow.prototype.hide = function() {
  $('#windowLayer').remove();
  this.visible = false;
}