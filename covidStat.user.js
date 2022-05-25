// ==UserScript==
// @name         maxus-covid
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://docs.qq.com/sheet/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

  /**
   * 休眠
   * @param time    休眠时间，单位秒
   * @param desc
   * @returns {Promise<unknown>}
   */
  function sleep(time, desc = 'sleep') {
    return new Promise(resolve => {
      //sleep
      setTimeout(() => {
        console.log(desc, time, 's')
        resolve(time)
      }, Math.floor(time * 1000))
    })
  }

  /**
   * 修改数据
   */
  function modify(){
    return new Promise(resolve => {
      var oldStatus = document.getElementsByClassName("formula-input")[0].innerText.trim()
      if (oldStatus == '') {
        document.getElementsByClassName("dui-select-text-container")[0].dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable:true, keyCode: 32}));
        document.getElementsByClassName("dui-menu-item dui-option select-cell-editor-option")[0].dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable:true, keyCode: 13}));
        document.getElementsByClassName("dui-menu-item dui-option select-cell-editor-option")[0].dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable:true, keyCode: 13}));
        console.info("[covid] old status is [" + oldStatus + "], status changed");
      } else {
        console.info("[covid] old status is [" + oldStatus + "], no changes needed");
      }
      resolve();
    })
  }

  /**
   * 检查行数据
   */
  function matchNumber(number){
    return new Promise(resolve => {
      var no = document.getElementsByClassName("formula-input")[0].innerText.trim()
      if (no == number) {
        //到L列
        for(var i = 0; i < 10; i++) {
          document.getElementsByClassName("cell-editor-stage")[0].dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable:true, keyCode: 39}));
        }
        console.info("[covid] number is [" + no + "], matched");
      } else {
        console.info("[covid] number is [" + no + "], no changes allowed");
        throw new Error("[covid] number is [" + no + "], no changes allowed");
      }
      resolve();
    })
  }

  /**
   * 监测cell加载并定位
   * @returns {Promise<unknown>}
   */
  function locate(pos) {
    return new Promise(resolve => {
      //obs page
      let page = setInterval(() => {
        var cells = document.getElementsByClassName("cell-editor-stage");
        if (cells != undefined && cells[0] != undefined) {
          clearInterval(page)
          console.info("[covid] line " + pos + " loaded");
          //到第一行
          for(var i = 0; i < 250; i++) {
            cells[0].dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable:true, keyCode: 38}));
          }
          //到指定行
          for(i = 1; i < pos; i++) {
            cells[0].dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable:true, keyCode: 40}));
          }
          //到第一列
          cells[0].dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable:true, keyCode: 36}));
          resolve()
        } else {
          return
        }
      }, 100)
    })
  }

  /**
   * 监测title加载
   * @returns {Promise<unknown>}
   */
  function matchDocument() {
    return new Promise(resolve => {
      //obs page
      let page = setInterval(() => {
        if (document.getElementsByClassName("fake-title") != undefined && document.getElementsByClassName("fake-title")[0] != undefined) {
          clearInterval(page)
          console.info("[covid] title loaded");
          if (document.getElementsByClassName("fake-title")[0].textContent.endsWith('疫情期间办公统计')) {
            console.info("[covid] title matched")
            resolve()
          } else {
            console.info("[covid] title mismatched, exit")
            throw new Error("[covid] title mismatched, exit")
          }
        } else {
          return
        }
      }, 100)
    })
  }


  //休眠
  sleep(1)
    .then(() => matchDocument()).then(() => sleep(1))
    .then(() => locate(86)).then(() => sleep(1)).then(() => matchNumber(2908)).then(() => sleep(1)).then(() => modify())
    .then(() => locate(90)).then(() => sleep(1)).then(() => matchNumber(2978)).then(() => sleep(1)).then(() => modify())
    .then(() => locate(124)).then(() => sleep(1)).then(() => matchNumber(204614)).then(() => sleep(1)).then(() => modify())
    .then(() => locate(157)).then(() => sleep(1)).then(() => matchNumber(2678)).then(() => sleep(1)).then(() => modify())
    .then(() => locate(187).then(() => sleep(1)).then(() => matchNumber(2717)).then(() => sleep(1)).then(() => modify()))
})();
