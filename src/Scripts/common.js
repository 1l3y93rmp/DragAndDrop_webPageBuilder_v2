import React from 'react'
import ReactDOM from 'react-dom'
var $ = require('jquery')

$(function () {
  // console.log($)
  // console.log(React)

  class MenuAndOperatingArea extends React.Component {
    constructor () {
      super()
      // contentJson 縮寫成 cJ
      this.state = {
        cJ: [
          [
            {
              cJ: []
            },
            {
              cJ: []
            }
          ],
          [
            {
              cJ: [[{
                cJ: []
              }], [{
                cJ: []
              }]]
            },
            {
              cJ: [[{
                cJ: []
              }], [{
                cJ: []
              }]]
            }
          ]
        ]
      }
      this.dropped = this.dropped.bind(this)
      this.dragoverGoSlect = this.dragoverGoSlect.bind(this)
    }

    mapToCreatDiv (cJdata, previousKey) {
      console.log(cJdata)
      console.log(previousKey)
      return cJdata.map((node, index) => {
        var myKey = previousKey ? previousKey + '-' + index : index
        if (node.cJ) {
          // 代表 node 是 {}
          let divStyle = {'width': 100 / cJdata.length + '%'}
          if (node.cJ.length) {
            // 如果node的cJ 裡面還是有東西(而且node是{}) 靠遞迴自己叫自己
            return (
              <div
                id={myKey}
                key={myKey}
                style={divStyle}
                onDrop={this.dropped}
                onDragEnter={this.cancelDefault}
                onDragOver={this.dragoverGoSlect}
                onDragLeave={this.dragleaveGoBack}
              >
                {this.mapToCreatDiv(node.cJ, myKey)}
              </div>
            )
          } else {
            return (
              <div
                id={myKey}
                key={myKey}
                style={divStyle}
                onDrop={this.dropped}
                onDragEnter={this.cancelDefault}
                onDragOver={this.dragoverGoSlect}
                onDragLeave={this.dragleaveGoBack}
              />
            )
          }
        } else {
          // 代表 node 是 []
          if (node.length === 1) {
            return (
              <div
                id={myKey}
                key={myKey}
                onDrop={this.dropped}
                onDragEnter={this.cancelDefault}
                onDragOver={this.dragoverGoSlect}
                onDragLeave={this.dragleaveGoBack}
              >
                {this.mapToCreatDiv(node[0].cJ, myKey)}
              </div>
            )
          } else {
            // 並排兩個以上
            let divStyle = {'width': 100 / node.length + '%'}
            var sideBySideDom = node.map((node_, index_) => {
              var sideBySideKey = myKey + '-' + index_
              return (
                <div
                  id={sideBySideKey}
                  key={sideBySideKey}
                  style={divStyle}
                  onDrop={this.dropped}
                  onDragEnter={this.cancelDefault}
                  onDragOver={this.dragoverGoSlect}
                  onDragLeave={this.dragleaveGoBack}
                  >
                  {this.mapToCreatDiv(node_.cJ, sideBySideKey)}
                </div>
              )
            })
            return (
              <div id={myKey} key={myKey}>{sideBySideDom}</div>
            )
          }
        }
      })
    }

    ondragstart (e) { // 被綁在被拖的東西的 (#menu內的)
      e.dataTransfer.setData('text/plain', e.target.id)
    }

    cancelDefault (e) { // 在防止預設行為的方法，被 dropped dragoverGoSlect 調用
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    mousePosition (e) { // 需要得知游標的位置靠近哪裡? 上/下/左/右/中間
      var $target = $(e.currentTarget)
      let offset = $target.offset()
      let $bottom = offset.top + $target.innerHeight()
      let $right = offset.left + $target.innerWidth()
      let $top = offset.top
      let $left = offset.left

      let mouseLeft = e.clientX
      let mouseTop = e.clientY

      if ($left + 100 > mouseLeft && $left < mouseLeft) { return ('L') }
      if (mouseLeft > $right - 100 && mouseLeft < $right) { return ('R') }
      if ($top + 100 > mouseTop && $top < mouseTop) { return ('T') }
      if (mouseTop > $bottom - 100 && mouseTop < $bottom) { return ('B') }
      return ('C')
    }

    dragoverGoSlect (e) { // 被拉到的時候變成黃色
      var $target = $(e.currentTarget)
      var nowClass = $target.attr('class')
      let addRule = this.mousePosition(e)
      if (nowClass && nowClass.indexOf(addRule) === -1) {
        // 表示CLASS上下左右該換了
        var oldClass = nowClass.substring(nowClass.length - 1)
        $target.removeClass(oldClass)
      }
      $target.addClass('Slect ' + addRule)
      this.cancelDefault(e)
    }

    dragleaveGoBack (e) { // leave的時候 變回白色
      $(e.currentTarget).removeClass('Slect L R C T B')
    }

    dropped (e) { // 被綁在要被放東西進來的框框(#operatingArea) onDrop時調用這個方法
      $(e.currentTarget).removeClass('Slect')
      let divLevels = $(e.currentTarget).parents().length - 4// 得知該DIV往外有幾層
      // -4 是因為 Html Body #content #operatingArea 這4層不要
      let divIndex = $(e.currentTarget).prevAll().length // 得知該DIV再同輩順位幾
      let newCj = this.state.cJ
      let addRule = this.mousePosition(e)
      let divJson = {cJ: []}
      /* if (addRule === 'T' || addRule === 'B') {
        divJson = [{cJ: []}]
      } else {
        divJson = {cJ: []}
      } */

      if (divLevels < 0) {
        newCj.push(divJson)
      } else {
        let S = '' // 空字串

        for (var i = 0; i < divLevels; i++) {
          // 爸爸的順序是...?
          let papaLength = $(e.currentTarget).parents().eq(i).prevAll().length
          S = S + '[' + papaLength + '].cJ'
        }

        /* if (addRule === 'T' || addRule === 'B') {
          var AAA = eval('newCj' + S + '[' + divIndex + '].cJ')
          var BBB = [].push(AAA)

          eval('newCj' + S + '.splice(' + divIndex + ',1,' + BBB + ')')

          eval('newCj' + S + '[' + divIndex + '].cJ.push(divJson)')
        } else {

        } */
        eval('newCj' + S + '[' + divIndex + '].cJ.push(divJson)')
      }

      this.setState({cJ: newCj})
      this.cancelDefault(e)
    }

    render () {
      // render operatingArea 時 會參照 State 內的資料
      console.log(this.state.cJ)
      return (
        <React.Fragment>
          <div id='menu'>
            <div draggable='true'
              onDragStart={this.ondragstart}
            > 添加一個框框 </div>
          </div>
          <div id='operatingArea'
            data-role='drag-drop-container'
            onDrop={this.dropped}
            onDragEnter={this.cancelDefault}
            onDragOver={this.dragoverGoSlect}
            onDragLeave={this.dragleaveGoBack}
          >
            {this.mapToCreatDiv(this.state.cJ)}
          </div>
        </React.Fragment>
      )
    }
  }

  ReactDOM.render(
    <MenuAndOperatingArea />,
    document.getElementById('content')
  )
})
