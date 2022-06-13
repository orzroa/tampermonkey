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

  const maxRow = 220
  const maxCol = 15
  const idSet = new Set(['2678', '2717', '2908', '2978', '204614'])
  var oldId = ''
  var allRowsScaned = false
  var allColsScaned = false
  var curRow
  var curCol
  var curCell
  var inputCols = []

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

  /**
   * 检查行数据
   */
  function handleRow(){
    return new Promise(resolve => {
      var id = document.getElementsByClassName("formula-input")[0].innerText.trim()
      if (id != oldId) {
        oldId = id
        if (idSet.has(id)) {
          console.info("[covid] " + curRow + "->" + id + ", matched");
          goto(curRow, inputCols[0])
            .then( () => sleep(1))
            .then( () => modify())
            .then( () => sleep(1))
            .then( () => goto(curRow, inputCols[1]))
            .then( () => sleep(1))
            .then( () => modify())
            .then( () => sleep(1))
            .then( () => resolve())
        } else {
          console.info("[covid] " + curRow + "->" + id + ", skip");
          resolve()
        }
      } else {
        allRowsScaned = true
        resolve()
      }
    })
  }

  /**
   * 监测列名
   * @returns {Promise<unknown>}
   */
  function scanTitles() {
    return new Promise(resolve => {
      if(curCol >= maxCol || allColsScaned) {
        resolve()
      } else {
        goto(1, curCol + 1)
          .then( () => sleep(1))
          .then( () => {
            var text = document.getElementsByClassName("formula-input")[0].innerText.trim()
            if (text.endsWith("（总部同事填写）")) {
              inputCols.push(curCol)
              console.info("[covid] title match: " + text)
            } else if (text.endsWith("身体情况报备")) {
              inputCols.push(curCol)
              console.info("[covid] title match: " + text)
              allColsScaned = true
            }
          })
          .then( () => sleep(1))
          .then( () => scanTitles())
          .then( () => sleep(100))
          .then( () => resolve())
      }
    })
  }

  /**
   * 监测cell加载并定位
   * @returns {Promise<unknown>}
   */
  function scanRows() {
    return new Promise(resolve => {
      if (allRowsScaned || curRow >= maxRow) {
        resolve()
      } else {
        goto(curRow + 1, 1)
          .then( () => sleep(1))
          .then( () => handleRow())
          .then( () => sleep(1))
          .then( () => scanRows())
          .then( () => sleep(1))
          .then( () => resolve())
      }
    })
  }

  /**
   * 到指定单元格
   */
  function goto(row, col) {
    return new Promise(resolve => {
      if(curRow == undefined || curCol == undefined) {
        //到第一行
        for(var i = 0; i < maxRow; i++) {
          curCell.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable:true, keyCode: 38}));
        }
        curRow = 1
        //到第一列
        curCell.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable:true, keyCode: 36}));
        curCol = 1
        console.info("[covid] cell A1 loaded");
      }
      if (row < curRow) {
        for(; curRow > row; curRow--) {
          curCell.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable:true, keyCode: 38})); //up
        }
      } else {
        for(; curRow < row; curRow++) {
          curCell.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable:true, keyCode: 40})); //down
        }
      }
      if (col < curCol) {
        for(; curCol > col; curCol--) {
          curCell.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable:true, keyCode: 37})); //left
        }
      } else {
        for(; curCol < col; curCol++) {
          curCell.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable:true, keyCode: 39})); //right
        }
      }
      resolve()
    })
  }

  /**
   * 到A1单元格
   * @returns {Promise<unknown>}
   */
  function loadCell() {
    return new Promise(resolve => {
      //obs page
      let page = setInterval(() => {
        var cells = document.getElementsByClassName("cell-editor-stage");
        if (cells != undefined && cells[0] != undefined) {
          console.info("[covid] cells loaded");
          clearInterval(page)
          curCell = cells[0]
          resolve()
        } else {
          console.info("[covid] cells empty");
          return
        }
      }, 100)
    })
  }

  /**
   * 监测title加载
   * @returns {Promise<unknown>}
   */
  function loadDocument() {
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
    .then(() => loadDocument())
    .then(() => loadCell()).then(() => sleep(1000))
    .then(() => goto(1, 1)).then(() => sleep(1))
    .then(() => scanTitles()).then(() => sleep(1))
    .then(() => scanRows())
})();
