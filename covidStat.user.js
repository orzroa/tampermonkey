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
      }, Math.floor(time))
    })
  }

  /**
   * 修改数据
   */
  function modify(){
    return new Promise(resolve => {
      sleep(1)
        .then( () => {
          var oldStatus = document.getElementsByClassName("formula-input")[0].innerText.trim()
          if (oldStatus == '') {
              document.getElementsByClassName("dui-select-text-container")[0].dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable:true, keyCode: 32}));
              document.getElementsByClassName("dui-menu-item dui-option select-cell-editor-option")[0].dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable:true, keyCode: 13}));
              document.getElementsByClassName("dui-menu-item dui-option select-cell-editor-option")[0].dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable:true, keyCode: 13}));
              console.info("[covid] old status is [" + oldStatus + "], changed");
          } else {
              console.info("[covid] old status is [" + oldStatus + "], no need");
          }
        })
        .then( () =>sleep(1) )
        .then( () => resolve())
    })
  }

  const maxLine = 220
  const idSet = new Set(['2678', '2717', '2908', '2978', '204614'])
  var rowNumber = 2
  var oldId = ''

  /**
   * 向右n列
   */
  function nextColumn(offset) {
    return new Promise(resolve => {
      for(var i = 0; i < offset; i++) {
        document.getElementsByClassName("cell-editor-stage")[0].dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable:true, keyCode: 39}));
      }
      resolve();
    })
  }

  /**
   * 检查行数据
   */
  function matchNumber(){
    return new Promise(resolve => {
      var id = document.getElementsByClassName("formula-input")[0].innerText.trim()
      if (id != oldId) {
        oldId = id
        if (idSet.has(id)) {
          console.info("[covid] " + rowNumber + "->" + id + ", matched");
          sleep(1)
            .then( () => nextColumn(10)) //到L列
            .then( () => sleep(1))
            .then( () => modify())
            .then( () => sleep(1))
            .then( () => nextColumn(1)) //到M列
            .then( () => sleep(1))
            .then( () => modify())
            .then( () => sleep(1))
            //到首列
            .then( () => document.getElementsByClassName("cell-editor-stage")[0].dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable:true, keyCode: 36})))
            .then( () => sleep(1))
            .then( () => resolve())
        } else {
          console.info("[covid] " + rowNumber + "->" + id + ", skip");
          resolve()
        }
      } else {
        resolve()
      }
    })
  }

  /**
   * 监测cell加载并定位
   * @returns {Promise<unknown>}
   */
  function nextLine() {
    return new Promise(resolve => {
      //obs page
      let page = setInterval(() => {
        var cells = document.getElementsByClassName("cell-editor-stage");
        if (cells != undefined && cells[0] != undefined) {
          clearInterval(page)
          //到指定行
          cells[0].dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable:true, keyCode: 40}));
          sleep(1)
            .then( () => matchNumber())
            .then( () => sleep(1))
            .then( () => {
              if (++rowNumber <= maxLine) {
                nextLine()
              }
            })
            .then( () => sleep(1))
            .then( () => resolve())
        } else {
          return
        }
      }, 100)
    })
  }

  /**
   * 到A1单元格
   * @returns {Promise<unknown>}
   */
  function gotoLeftTop() {
    return new Promise(resolve => {
      //obs page
      let page = setInterval(() => {
        var cells = document.getElementsByClassName("cell-editor-stage");
        if (cells != undefined && cells[0] != undefined) {
          clearInterval(page)
          //到第一行
          for(var i = 0; i < maxLine; i++) {
            cells[0].dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable:true, keyCode: 38}));
          }
          //到第一列
          cells[0].dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable:true, keyCode: 36}));
          console.info("[covid] cell A1 loaded");
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
  sleep(1000)
    .then(() => matchDocument()).then(() => sleep(1000))
    .then(() => gotoLeftTop()).then(() => sleep(1000))
    .then(() => nextLine())
})();
