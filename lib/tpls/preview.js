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
$(document).ready(function() {
  var pixi = new DW.Pixi();
  $("body").css("font-size", (2 * pixi.screen.ratio) + "em");

  var prmstr = window.location.search.substr(1);
  if (prmstr.length > 0) {
    $("#tplPreviewInput").val(prmstr);
    $("#dwWindowLayer").load(prmstr + ".html");
  }
  $("#tplPreviewButton").click(function() {
    $("#dwWindowLayer").load($("#tplPreviewInput").val() + ".html");
  });
});