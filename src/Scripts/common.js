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
        ]
      }
      // 陣列 內的陣列必須與陣列並排 不然沒有意義
      this.dropped = this.dropped.bind(this)
      this.dragoverGoSlect = this.dragoverGoSlect.bind(this)
    }

    mapToCreatDiv (cJdata, previousKey) {
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
              <div class='frame' id={myKey} key={myKey}>{sideBySideDom}</div>
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

      if ($left + 20 > mouseLeft && $left < mouseLeft) { return ('L') }
      if (mouseLeft > $right - 20 && mouseLeft < $right) { return ('R') }
      if ($top + 20 > mouseTop && $top < mouseTop) { return ('T') }
      if (mouseTop > $bottom - 20 && mouseTop < $bottom) { return ('B') }
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
      // let newCj = this.state.cJ
      var $target = $(e.currentTarget)
      $target.removeClass('Slect')

      var targetInJsonIs = this.state.cJ

      var level = $target.attr('id').split('-')

      if (/\d/g.test(level[0])) {
        for (var i = 0; i < level.length; i++) {
          targetInJsonIs = targetInJsonIs[level[i]]
          try {
            if (targetInJsonIs.length === 1) {
              targetInJsonIs = targetInJsonIs[0]
            }
          } catch (err) {
            console.log('targetInJsonIs 不是陣列~')
          }
        }
      }

      console.log(targetInJsonIs)

      // this.setState({cJ: newCj})
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
