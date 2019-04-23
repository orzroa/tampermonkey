// ==UserScript==
// @name         cleanCSDN
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://blog.csdn.net/*/article/details/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var mainBox = document.getElementById("mainBox")
    var windowWidth = window.innerWidth
    mainBox.style.width=windowWidth-10+"px"
    mainBox.children[0].style.display='none'
    mainBox.children[1].style.width=windowWidth-10+"px"
    mainBox.children[2].style.display='none'
    document.getElementsByClassName("pulllog-box")[0].style.display='none'
    document.getElementsByClassName("meau-gotop-box")[0].style.display='none'
})();
