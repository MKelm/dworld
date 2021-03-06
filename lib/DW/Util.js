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

DW.Util = function() { }

DW.Util.prototype.constructor = DW.Util;

DW.Util.prototype.getEventListener = function(obj, func) {
  return function(event) { obj[func](obj, event); };
}

DW.Util.prototype.quit = function(delay) {
  if (typeof delay == "undefined") {
    delay = 0;
  }
  global.setTimeout(function() {
    require('nw.gui').App.closeAllWindows();
  }, delay);
}

DW.Util.prototype.loadJSON = function(json, forceLoad) {
  var result = {};
  try {
    result = JSON.parse(require('fs').readFileSync(json, { encoding : "utf8" }));
  } catch (err) { }
  return result;
};

DW.Util.prototype.objectLength = function(object) {
  var size = 0, key;
  for (key in object) {
    if (object.hasOwnProperty(key)) size++;
  }
  return size;
};

DW.Util.prototype.time = function(type, delay) {
  var div = 1;
  if (type == "unix") {
    div = 1000;
  }
  if (!delay > 0) {
    delay = 0;
  }
  var t = new Date().getTime() / div;
  if (type != "formated") {
    return Math.round(t + delay);
  } else {
    var date = new Date(t);
    return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
  }
}

DW.Util.prototype.isChance = function(p, max) {
  if (typeof max == "undefined") max = 32767;
  // calculates if a chance exists to do something
  var r = Math.random() * max;
  return r < (max * p)
}