import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'

$(function () {
  // console.log($)
  // console.log(React)

  class MenuAndOperatingArea extends React.Component {
    constructor () {
      super()
      // contentJson 縮寫成 cJ
      this.state = {
        // cJ: [{cJ: []}, {cJ: [{cJ: []}, {cJ: []}]}]
        cJ:
        [[{cJ: []}, {cJ: []}], [{cJ: []}]]
      }

      // 陣列 內如有陣列 必須與陣列並排 不然沒有意義
      this.dropped = this.dropped.bind(this)
      this.dragoverGoSlect = this.dragoverGoSlect.bind(this)
      this.climbingJsonTrees = this.climbingJsonTrees.bind(this)
      this.changeJsonTrees = this.changeJsonTrees.bind(this)
    }

    jsonIsWhichObj (obj) { // 用來判斷JSON最外層是什麼樣的Obj 如果是{} 回應True []回應False
      if (obj.constructor === Object) {
        return true
      } else if (obj.constructor === Array) {
        return false
      }
    }

    mapToCreatDiv (cJdata, previousKey) {
      return cJdata.map((node, index) => {
        var myKey = previousKey === undefined ? index : previousKey + '-' + index
        // 注意 : myKey 並不紀錄DOM巢狀，而是紀錄JSON資料的巢狀
        var ObjIsObject = this.jsonIsWhichObj(node)
        if (ObjIsObject) {
          // 代表 node 是 {}
          let divStyle = {'width': 100 / cJdata.length + '%'}
          if (node.cJ.length) {
            // 如果node的cJ 裡面還是有東西(而且node是{}) 靠遞迴自己叫自己
            return (
              <div
                id={myKey}
                key={index}
                style={divStyle}
                onDrop={this.dropped}
                onDragEnter={this.cancelDefault}
                onDragOver={this.dragoverGoSlect.bind(null, true, false, false)}
                onDragLeave={this.dragleaveGoBack}
              >
                {this.mapToCreatDiv(node.cJ, myKey)}
              </div>
            )
          } else {
            return (
              <div
                id={myKey}
                key={index}
                style={divStyle}
                onDrop={this.dropped}
                onDragEnter={this.cancelDefault}
                onDragOver={this.dragoverGoSlect.bind(null, false, false, false)}
                onDragLeave={this.dragleaveGoBack}
              />
            )
          }
        } else if (!ObjIsObject) {
          // 代表 node 是 []
          if (node.length === 1) {
            return (
              <div
                id={myKey + '-0'}
                key={index}
                data-row='true'
                onDrop={this.dropped}
                onDragEnter={this.cancelDefault}
                onDragOver={this.dragoverGoSlect.bind(null, false, true, false)}
                onDragLeave={this.dragleaveGoBack}
              >
                {this.mapToCreatDiv(node[0].cJ, myKey + '-0')}
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
                  key={index_}
                  style={divStyle}
                  onDrop={this.dropped}
                  onDragEnter={this.cancelDefault}
                  onDragOver={this.dragoverGoSlect.bind(null, node_.cJ.length, false, true)}
                  onDragLeave={this.dragleaveGoBack}
                  >
                  {this.mapToCreatDiv(node_.cJ, sideBySideKey)}
                </div>
              )
            })
            return (
              <div
                id={myKey}
                key={index}
                data-row='true'
                onDrop={this.dropped}
                onDragEnter={this.cancelDefault}
                onDragOver={this.dragoverGoSlect.bind(null, true, true, false)}
                onDragLeave={this.dragleaveGoBack}
                >
                {sideBySideDom}
              </div>
            )
          }
        }
      })
    }

    changeJsonTrees (json, level, JsonBranch, way) { // 改變樹枝
      // json 必須是完整的整棵樹
      // level 也必須是完整的層級資訊
      // newJsonBranch 則是未被異動的枝子 (會先經由climbingJsonTrees 得到的末端Json枝子)
      // Way是操縱的方法 (上下左右中)

      console.log(JsonBranch) // 這裡先反應還沒加過的JS
      /*
      var objectBlankDiv = {cJ: []}
      var arrayBlankDiv = [{cJ: []}]
      var JsonBranchAddtoArray = [JsonBranch]
      var ObjIsObject = this.jsonIsWhichObj(JsonBranch)
      // 先得知 JsonBranch是{} 或是 []
      if (!ObjIsObject) {
        if (/[R]/g.test(way)) {
          // 插入右方
          JsonBranch.push(objectBlankDiv)
        }
        if (/[L]/g.test(way)) {
          // 插入左方
          JsonBranch.unshift(objectBlankDiv)
        }
      } else if (ObjIsObject) {
        if (JsonBranch.cJ.length === 0) {
          // 如果當陣列為空 直接丟一個 {cJ: []} objectBlankDiv 進去 不用管上下左右中
          JsonBranch.cJ.push(objectBlankDiv)
        } else {
          // 如果陣列內有東西，就要注意插入位置，並且不允許 "插入中間"這種操作
          if (/[R]/g.test(way)) {
            // 插入右方
            JsonBranch.cJ.push(objectBlankDiv)
          } else if (/[L]/g.test(way)) {
            // 插入左方
            JsonBranch.cJ.unshift(objectBlankDiv)
          } else if (/[T]/g.test(way)) {
            // 如果是插入上方 需要將原本 JsonBranch.cJ 內的東西包起來 再加入一個 arrayBlankDiv
            JsonBranch.cJ = [arrayBlankDiv, JsonBranchAddtoArray]
          } else if (/[B]/g.test(way)) {
            // 插入下方 同插入上方 只是位置不同
            JsonBranch.cJ = [JsonBranchAddtoArray, arrayBlankDiv]
          }
        }
      }
      console.log(JsonBranch) // 這裡會被反應加過的JS
      */
    }

    climbingJsonTrees (json, level) {
      // 當收到操作時，爬Json樹
      if (!/\d/g.test(level[0])) return this.state
      // 如果是最外層 直接不要爬了 出去

      if (level.length === 0) return json// 已經爬完樹 出去

      var leftoverJson
      // 要先知道傳進來的這棵樹是{} 還是 [] 才知道要怎麼爬
      var ObjIsObject = this.jsonIsWhichObj(json)
      if (!ObjIsObject) {
        // 這代表Json 是 []
        leftoverJson = json[level[0]]
      } else if (ObjIsObject) {
        // 這代表Json 是 {}
        leftoverJson = json.cJ[level[0]]
      }

      level.shift()
      var leftoverLevel = level

      if (leftoverLevel.length === 0) {
        // 已經爬完樹 應該開始操作是否再生枝或是截枝
        return leftoverJson
      } else {
        return this.climbingJsonTrees(leftoverJson, leftoverLevel) // 繼續把沒爬完的枝爬完
      }
    }

    ondragstart (e) { // 被綁在被拖的東西的 (#menu內的)
      e.dataTransfer.setData('text/plain', e.target.id)
    }

    cancelDefault (e) { // 在防止預設行為的方法，被 dropped dragoverGoSlect 調用
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    mousePosition (isWrap, ctrlOutSiteTB, ctrlOutSiteLR, e) { // 得知游標的位置靠近哪裡給予相對應的CLASS名稱 內側/外側 / 上/下/左/右/中間 是否開啟某些特殊的感應區?
      var $target = $(e.currentTarget)

      let offset = $target.offset()
      let $bottom = offset.top + $target.innerHeight()
      let $right = offset.left + $target.innerWidth()
      let $top = offset.top
      let $left = offset.left

      let mouseLeft = e.clientX
      let mouseTop = e.clientY

      // 編輯內側 CLASS大寫
      // 編輯外側 CLASS小寫

      // 如果可控外部TB (必定是row)
      if ($top + 40 > mouseTop && $top < mouseTop && ctrlOutSiteTB) { return ('t') }
      if (mouseTop > $bottom - 40 && mouseTop < $bottom && ctrlOutSiteTB) { return ('b') }

      // 如果可控外部LR (必定是row下層)
      if ($left + 40 > mouseLeft && $left < mouseLeft && ctrlOutSiteLR) { return ('l') }
      if (mouseLeft > $right - 40 && mouseLeft < $right && ctrlOutSiteLR) { return ('r') }

      // 如果有包東西 可操作內側
      if ($left + 40 > mouseLeft && $left < mouseLeft && isWrap) { return ('L') }
      if (mouseLeft > $right - 40 && mouseLeft < $right && isWrap) { return ('R') }
      if ($top + 40 > mouseTop && $top < mouseTop && isWrap) { return ('T') }
      if (mouseTop > $bottom - 40 && mouseTop < $bottom && isWrap) { return ('B') }

      if (!isWrap) { return ('C') }
      return 'X' // 沒Class的意思
    }

    dragoverGoSlect (isWrap, ctrlOutSiteTB, ctrlOutSiteLR, e) { // 被拉到的時候 需要添加Class
      var $target = $(e.currentTarget)
      var nowClass = $target.attr('class')
      if (nowClass) {
        nowClass = nowClass.substr(nowClass.length - 1)
        // 我只要判斷最後一個字母
      }
      let addRule = this.mousePosition(isWrap, ctrlOutSiteTB, ctrlOutSiteLR, e)
      if (addRule === 'X') {
        $target.removeClass('Slect L R C T B l r b t X')
      } else {
        if (nowClass && nowClass.indexOf(addRule) === -1) {
          // 表示CLASS上下左右該換了
          var oldClass = nowClass.substring(nowClass.length - 1)
          $target.removeClass(oldClass)
        }
        $target.addClass('Slect ' + addRule)
      }
      this.cancelDefault(e)
    }

    dragleaveGoBack (e) { // leave的時候 變回白色
      $(e.currentTarget).removeClass('Slect L R C T B l r b t X')
    }

    dropped (e) { // 被綁在要被放東西進來的框框(#operatingArea) onDrop時調用這個方法
      var $target = $(e.currentTarget)
      var $targetClass = $target.attr('class')
      var operatingWay = $targetClass.substr($targetClass.length - 1)

      $target.removeClass('Slect L R C T B l r b t X')

      var newCj = this.state.cJ
      var level = $target.attr('id').split('-')

      this.changeJsonTrees(newCj, level, this.climbingJsonTrees(newCj, level), operatingWay)
       // 傳入被爬的對像與指定層級與操作方法

      // this.setState({cJ: newCj})
      this.cancelDefault(e)
    }

    render () {
      // render operatingArea 時 會參照 State 內的資料
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
            onDragOver={this.dragoverGoSlect.bind(null, this.state.cJ.length, false, false)}
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
