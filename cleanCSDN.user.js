// ==UserScript==
// @name         clearCSDN
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://blog.csdn.net/*/article/details/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName("container clearfix").mainBox.children[0].style.display='none'
    document.getElementsByClassName("container clearfix").mainBox.children[1].style.width="1600px"
    document.getElementsByClassName("container clearfix").mainBox.children[2].style.display='none'
})();
