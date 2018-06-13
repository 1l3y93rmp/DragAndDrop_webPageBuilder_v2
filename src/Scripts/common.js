/* import React from 'react'
 * import ReactDOM from 'react-dom'
 * import $ from 'jquery'
*/
// 因為 browserify打包外部模塊太慢了 開發不使用

import DeleteSetBox from './panel_deleteSetBox'
import PanelSetImg from './panel_setImg'
import TemplateImg from './template_img'
import TemplateText from './template_text'

$(function () {
  class MenuAndOperatingArea extends React.Component {
    constructor () {
      super()
      // contentJson 縮寫成 cJ
      this.state = {
        cJ: [],
        editBranch: {},
        nowEditType: ''
      }

      this.altCopymode = false // 當前到底有沒有在按alt
      this.UndoIndex = 0 // 當前復原Z的次數
      this.editLevel = [] // 當前 panel浮動面板所編集的對象之層級

      // 分享this給大家
      this.dropped = this.dropped.bind(this)
      this.dragoverGoSlect = this.dragoverGoSlect.bind(this)
      this.climbingJsonTrees = this.climbingJsonTrees.bind(this)
      this.ondragstart = this.ondragstart.bind(this)
      this.addJsonTrees = this.addJsonTrees.bind(this)
      this.deleteJsonTrees = this.deleteJsonTrees.bind(this)
      this.findJsonTree = this.findJsonTree.bind(this)
      this.saveStateinLocalStorage = this.saveStateinLocalStorage.bind(this)
      this.recoveryState = this.recoveryState.bind(this)
      this.changeAndSaveDomAttribute = this.changeAndSaveDomAttribute.bind(this)
      this.showPanel = this.showPanel.bind(this)
    }

    jsonIsWhichObj (obj) { // 用來判斷JSON最外層是什麼樣的Obj 如果是{} 回應True []回應False
      if (obj.constructor === Object) {
        return true
      } else if (obj.constructor === Array) {
        return false
      }
      return 'else' // 如果是字串...數字 什麼的 回應字串的'else'
    }

    saveStateinLocalStorage () { // 儲存State在Cookie (在動作操做完之後) 使復原指令可以使用
      var undoRecords = window.localStorage.getItem('Undo')
      if (undoRecords === null) {
        // 從來沒存過LocalStorage的情形
        window.localStorage.setItem('Undo', JSON.stringify([this.state.cJ]))
      }
      var oldUndoLocalStorage = JSON.parse(undoRecords)
      if (this.UndoIndex === 0) {
        // 這表示 是沒有用過任何復原重做的情形，可以安心添加LocalStorage
        if (oldUndoLocalStorage.length > 20) {
          oldUndoLocalStorage.pop() // 紀錄超過20次 就從屁股刪掉一筆
        }
        oldUndoLocalStorage.unshift(this.state.cJ) // 就用unshift塞進去 (較新 在前面)
      } else {
        // 這表示剛才有使用過復原 然後又開始了新的操作
        oldUndoLocalStorage.splice(0, this.UndoIndex) // 於是把前面的紀錄丟掉，再加上
        oldUndoLocalStorage.unshift(this.state.cJ)
        this.UndoIndex = 0
      }
      window.localStorage.setItem('Undo', JSON.stringify(oldUndoLocalStorage))
    }

    recoveryState (brin) {
      var undoRecords = window.localStorage.getItem('Undo')
      var nowUndoLocalStorage = JSON.parse(undoRecords)
      if (nowUndoLocalStorage.length) {
        if (brin) {
          // console.log('重做')
          // 表示重做
          if (this.UndoIndex !== 0) {
            this.UndoIndex = this.UndoIndex - 1
          }

          this.setState({
            cJ: JSON.parse(undoRecords)[this.UndoIndex]
          })
        } else {
          // 表示復原
          // console.log('復原')
          if (nowUndoLocalStorage.length > this.UndoIndex + 1) {
            this.UndoIndex = this.UndoIndex + 1
          }
          this.setState({
            cJ: JSON.parse(undoRecords)[this.UndoIndex]
          })
        }
      } else {
        console.log('沒有儲存任何操作，無法復原或重做')
      }
    }

    addJsonTrees (plusObj, level, JsonBranch, way) { // +樹枝
      // plusObj 就是要加入的東西是啥，有可能會傳來空 {cJ: []} 或是其他更複雜的物件
      // level 也必須是完整的層級資訊
      // JsonBranch 則是未被異動的枝子 (會先經由climbingJsonTrees 得到的末端Json枝子) 注意 它是傳址!直接改它可以指回到 State
      // Way是操縱的方法 (上下左右中)

      // console.log(JsonBranch) // 這裡先反應還沒加過的JS
      var newJsonBranch = JsonBranch // 由於這樣是傳址 所以newJsonBranch也可以指回到 State
      var copyJsonBranch = JSON.parse(JSON.stringify(JsonBranch))
      // Deep Copy，使傳址的Obj 能夠複製一個跟原本不關聯的變數

      var arrayPackagePlusObj = [plusObj] // 把要加的東西在+上包裹

      var nowIndex
      var InSiteIsWhichObj

      var ObjIsObject = this.jsonIsWhichObj(JsonBranch)
      // 先得知 JsonBranch是{} 或是 []， 丟進去
      if (!ObjIsObject) {
        // 如果是[]
        console.log('編輯對象是[]，直接操作[]')
        InSiteIsWhichObj = newJsonBranch.length ? this.jsonIsWhichObj(newJsonBranch[0]) : false
      } else if (ObjIsObject) {
        // 如果是{}
        // console.log('編輯對象是{}，操作{}裡面的cJ特性~')
        InSiteIsWhichObj = newJsonBranch.cJ.length ? this.jsonIsWhichObj(newJsonBranch.cJ[0]) : false

        if (way === 'C') { // 內側中間
          newJsonBranch.cJ.push(plusObj)
        }
        if (way === 'L') { // 內側左邊
          if (InSiteIsWhichObj) {
            // newJsonBranch.cJ 內容物是{}
            newJsonBranch.cJ.unshift(plusObj)
          } else {
            // newJsonBranch.cJ 內容物是[]
            newJsonBranch.cJ.splice(0, newJsonBranch.cJ.length)
            newJsonBranch.cJ.push(plusObj, copyJsonBranch)
          }
        }

        if (way === 'R') { // 內側右邊
          if (InSiteIsWhichObj) {
            // newJsonBranch.cJ 內容物是{}
            newJsonBranch.cJ.push(plusObj)
          } else {
            // newJsonBranch.cJ 內容物是[]
            newJsonBranch.cJ.splice(0, newJsonBranch.cJ.length)
            newJsonBranch.cJ.push(copyJsonBranch, plusObj) // OK
          }
        }

        if (way === 'T') { // 內側上方
          if (InSiteIsWhichObj) {
            // newJsonBranch.cJ 內容物是{}
            newJsonBranch.cJ.splice(0, newJsonBranch.cJ.length)
            newJsonBranch.cJ.push(arrayPackagePlusObj, copyJsonBranch.cJ) // OK
          } else {
            // newJsonBranch.cJ 內容物是[]
            newJsonBranch.cJ.unshift(arrayPackagePlusObj) // OK
          }
        }

        if (way === 'B') { // 內側下方
          if (InSiteIsWhichObj) {
            // newJsonBranch.cJ 內容物是{}
            newJsonBranch.cJ.splice(0, newJsonBranch.cJ.length)
            newJsonBranch.cJ.push(copyJsonBranch.cJ, arrayPackagePlusObj) // OK
          } else {
            // newJsonBranch.cJ 內容物是[]
            newJsonBranch.cJ.push(arrayPackagePlusObj) // OK
          }
        }

        if (way === 'l') { // 外側左邊
          nowIndex = level[level.length - 1]
          if (InSiteIsWhichObj) {
            // newJsonBranch.cJ 內容物是{}
            newJsonBranch.cJ.splice(nowIndex, 0, plusObj)
          } else {
            // newJsonBranch.cJ 內容物是[]
          }
        }

        if (way === 't') { // 外側上方
          nowIndex = level[level.length - 1]
          if (this.jsonIsWhichObj(newJsonBranch.cJ[0])) {
            newJsonBranch.cJ.splice(nowIndex, 0, plusObj)
          } else {
            newJsonBranch.cJ.splice(nowIndex, 0, arrayPackagePlusObj)
          }
        }
      }

      // console.log(newJsonBranch) // 這裡會被反應加過的JS
    }

    deleteJsonTrees (e) { // 刪除樹枝
      var $target = $(e.currentTarget).parent().parent() // 醜
      console.log('刪除模式' + $target.attr('id'))
      var level = $target.attr('id').split('-')
      var isRow = $target.attr('data-row') // 得知這個要被刪的東西是否為 data-row
      var index = level[level.length - 1]
      level.pop()
      var newCj = this.state.cJ

      if (isRow) {
        level.pop()
      }

      var deleteBranchUpper = this.climbingJsonTrees(newCj, level)
      // 得到要被砍的枝子的上層
      if (this.jsonIsWhichObj(deleteBranchUpper)) {
        // 如果是Object
        deleteBranchUpper.cJ.splice(index, 1)
      } else {
        // 如果是Array
        deleteBranchUpper.splice(index, 1)
      }

      this.setState({cJ: newCj})
      this.saveStateinLocalStorage() // 改完了 存個檔
      this.cancelDefault(e)
    }

    climbingJsonTrees (json, level) { // 用層級爬Json樹 回應枝子
      // json 完整的樹
      // level 層級(array型態)
      // addCharacteristic 是如果有傳入字串 會再調用添加標記的方法(通常只有刪除的時候 會傳入刪除參數)
      if (!/\d/g.test(level[0])) return this.state
      // 如果是最外層 直接不要爬了 出去
      // console.log(addCharacteristic)

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
        // 已經爬完樹  出去 下一步應該開始操作是否再生枝 (addJsonTrees) 或是截枝
        return leftoverJson
      } else {
        return this.climbingJsonTrees(leftoverJson, leftoverLevel) // 繼續遞迴把沒爬完的枝爬完
      }
    }

    findJsonTree (json, keyWord) { // 用特殊屬性爬Json樹
      // 如果內容物有keyWord 做為特性(不論幾層)，會回應 True
      // 反之 回應 undefind
      // 要先知道傳進來的這棵樹是{} 還是 [] 才知道要怎麼爬

      var jsonString
      var ObjIsObject = this.jsonIsWhichObj(json)
      if (ObjIsObject) {
        // {}
        if (json.hasOwnProperty(keyWord)) {
          return 'goDeepLayer'
        } else {
          // 要往更深層去找
          return this.findJsonTree(json.cJ, keyWord)
        }
      } else {
        // []
        for (var i = 0; i < json.length; i++) {
          jsonString = JSON.stringify(json[i])
          var regex = new RegExp('"' + keyWord + '":', 'g')
          if (regex.test(jsonString.substr(jsonString.length - 15))) {
            if (keyWord === 'delete') json.splice(i, 1) // 如果是刪除的動作，在這邊會刪掉
            return true
            // break
          } else {
            // 有可能是真的沒有 也有可能是在更深層
            if (regex.test(jsonString)) {
              // 在深層 要繼續往下
              if (this.findJsonTree(json[i], keyWord) === 'goDeepLayer') {
                // 如果回應了True，表示他是 {} 刪不掉自己，得要靠這裡刪
                if (keyWord === 'delete') json.splice(i, 1) // 如果是刪除的動作，在這邊會刪掉
                return true
              }
            }
          }
        }
      }
    }

    ondragstart (e) { // 被綁在被拖的東西的 (#menu內的)
      e.dataTransfer.setData('draggedId', e.target.id)
      // dataTransfer 可以把一些資料傳給 dropped (也就是被拖來放的那個物件上 onDrop 事件的方法) 這個方法
      if (e.target.tagName === 'DIV') {
        // 得知被拖的 是啥HTML TAG， 如果不是DIV只能被拖動到DIV內 (嚴禁與DIV並排)
        // 多傳一個值給 dragoverGoSlect 使該方法控制被拖DIV 添加方式之限制
        e.dataTransfer.setData('canIAbreast', true)
      }

      // altCopymode指的是是否有按住ALT 按住的話會變成複製模式
      if (!this.altCopymode && /[-]|\d{1}$/g.test(e.target.id)) { // 移動已經產出的HTML TAG模式
        this.climbingJsonTrees(this.state.cJ, e.target.id.split('-')).delete = true
      }
    }

    dragleaveGoBack (e) { // leave的時候 變回白色
      $(e.currentTarget).removeClass('Slect L R C T B l r b t X')
    }

    cancelDefault (e) { // 在防止預設行為的方法，被 dropped dragoverGoSlect 調用
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    mousePosition (isWrap, ctrlOutSiteTB, ctrlOutSiteLR, e) { // 得知游標的位置靠近哪裡給予相對應的CLASS名稱 內側/外側 / 上/下/左/右/中間 是否開啟某些特殊的感應區?
      let $target = $(e.currentTarget)

      // 判斷DIV的順序 或是它是否為data-row來決定他是否能夠出現哪些被拖曳時的Class
      let targetIndex = $target.attr('id').split('-')

      // 該DIV本身是不是 Row ?
      let isRow = $target.attr('data-row')
      targetIndex = isRow ? targetIndex[targetIndex.length - 2] : targetIndex[targetIndex.length - 1]

      // 是否控制外部LR? 如果自己是Row 禁止操控外部LR，接下來就看是否有同輩
      ctrlOutSiteLR = isRow ? false : $target.siblings().length

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

      if ($top + 40 > mouseTop && $top < mouseTop && ctrlOutSiteTB && targetIndex !== '0') { return ('t') }
      // if (mouseTop > $bottom - 40 && mouseTop < $bottom && ctrlOutSiteTB) { return ('b') }

      // 如果可控外部LR

      // console.log(ctrlOutSiteLR, targetIndex)
      if ($left + 5 > mouseLeft && $left < mouseLeft && ctrlOutSiteLR && targetIndex !== '0') { return ('l') }
      // if (mouseLeft > $right - 40 && mouseLeft < $right && ctrlOutSiteLR) { return ('r') }

      // 如果有包東西 可操作內側
      if ($left + 40 > mouseLeft + 5 && $left < mouseLeft && isWrap) { return ('L') }
      if (mouseLeft > $right - 40 && mouseLeft < $right && isWrap) { return ('R') }

      if ($top + 40 > mouseTop && $top < mouseTop && isWrap && !isRow) { return ('T') }
      if (mouseTop > $bottom - 40 && mouseTop < $bottom && isWrap && !isRow) { return ('B') }

      if (!isWrap) { return ('C') }
      return 'X' // 沒Class的意思
    }

    dragoverGoSlect (isWrap, ctrlOutSiteTB, ctrlOutSiteLR, e) { // 被拖著旋停時 下面的物件 需要添加Class
      // 這個涵式只要旋停時就會不斷的觸發

      let $target = $(e.currentTarget) // 這是被拖到者的target

      // e.dataTransfer.getData('canIAbreast') 空字串
      let dataTransferAlltypes = e.dataTransfer.types
      let caniabreast = false
      for (let i = 0; i < dataTransferAlltypes.length; i++) {
        if (dataTransferAlltypes[i] === 'caniabreast') {
          caniabreast = true // 先得知該被拖者是否帶著 該物件無法並排的資訊
          break
        }
      }

      let copyJson = JSON.parse(JSON.stringify(this.state.cJ))
      let branch = this.climbingJsonTrees(copyJson, e.currentTarget.id.split('-'))

      if (!caniabreast && branch.cJ.length) {
        console.log('你拖動的是一個必須獨立存在DIV的物件，這裡已經被霸占')
        this.cancelDefault(e)
        return
      }

      let sideBySide = true
      for (let i = 0; i < branch.cJ.length; i++) {
        if (typeof (branch.cJ[i].cJ) === 'string') {
          sideBySide = false
          break
        }
      }

      if (!sideBySide) { // 若有找到 請勿並排
        console.log('含有不能並排的內容物')
        this.cancelDefault(e)
        return
      }

      let nowClass = $target.attr('class')
      if (nowClass) {
        nowClass = nowClass.substr(nowClass.length - 1)
        // 只要判斷最後一個字母
      }
      let addRule = caniabreast ? this.mousePosition(isWrap, ctrlOutSiteTB, ctrlOutSiteLR, e) : 'C'
      // 如果 不允許並排，那麼只有一個選擇就是 C (放中間)
      if (addRule === 'X') {
        $target.removeClass('Slect L R C T B l r b t X')
      } else {
        if (nowClass && nowClass.indexOf(addRule) === -1) {
          // 表示CLASS該換了
          let oldClass = nowClass.substring(nowClass.length - 1)
          $target.removeClass(oldClass)
        }
        $target.addClass('Slect ' + addRule)
      }
      this.cancelDefault(e)
    }

    dropped (e) { // 被綁在可被拖來放的框框 onDrop時調用這個方法
      let beingDraggedID = e.dataTransfer.getData('draggedId') // 從 ondragstart 方法傳來的拖者ID (字串)
      let $target = $(e.currentTarget)
      let $targetClass = $target.attr('class')
      $target.removeClass('Slect L R C T B l r b t X')

      let isRow = $target.attr('data-row') // 得知是否為 data-row (字串/ㄤㄉfine)
      let beingDraggedIDlevel = beingDraggedID.split('-') // 得知 被拖的 ID帶的層級數字 (陣列)
      let level = $target.attr('id') === 'operatingArea' ? [] : $target.attr('id').split('-') // 得知ID (被放的)帶的層級數字 (陣列)

      let operatingWay = $targetClass.substr($targetClass.length - 1) // 得知操作方法 (字串)
      let isLowerCase = /[a-z]/g.test(operatingWay) // 得知方法是否小寫 (布林)

      // console.log('被拖者的ID:' + beingDraggedID)
      // console.log('被放者的ID:' + $target.attr('id'))

      let newCj = this.state.cJ

      let copylevel, copyJson, copyBranch
      let sideBySide = true
      copylevel = JSON.parse(JSON.stringify(level))
      copyJson = JSON.parse(JSON.stringify(newCj))
      copyBranch = this.climbingJsonTrees(copyJson, e.currentTarget.id.split('-'))
      // 防止干擾 若純用於搜尋的話必須用複製的， 如果真的要異動依賴傳址的方式異動 newCj

      if (!e.dataTransfer.getData('canIAbreast')) { // ondragstart 是否有傳來 canIAbreast (可併排)的值? 不可的話要檢查放置處必須是空的
        if (copyBranch.cJ.length) {
          console.log('你拖動的是一個必須獨立存在DIV的物件，這裡已經被霸占，勿放')
          this.cancelDefault(e)
          return
        }
      }

      for (let i = 0; i < copyBranch.cJ.length; i++) {
        if (typeof (copyBranch.cJ[i].cJ) === 'string') {
          sideBySide = false
          break
        }
      }

      if (!sideBySide) { // 若有找到 請勿並排
        console.log('含有不能並排的內容物，停止dropped以下任何操作')
        this.cancelDefault(e)
        return
      }

      if (isLowerCase) {
        // 這裡是指level 往上爬一層，當控制 Class 為小寫表是控制外部，climbingJsonTrees方法要往上爬一層
        copylevel.pop()
        if (isRow) {
          // 如果當操作的 Dom 是 data-row， climbingJsonTrees addJsonTrees的對像都要往上爬一層
          level.pop()
          copylevel.pop()
        }
      }

      if (beingDraggedID === 'emptyBox') { // 被拖的東西ID 如果是空Box
        console.log('添加模式(空盒)')
        this.addJsonTrees({cJ: []}, level, this.climbingJsonTrees(newCj, copylevel), operatingWay)
        // 傳入被爬的對像與指定層級與操作方法給改變JsonTrees的方法
        // 其中得到枝子的方法是通由爬樹方法( climbingJsonTrees )找到的
      }

      if (beingDraggedID === 'imgTag') { // 被拖動的東西ID是 圖片
        console.log('添加模式(圖片)')
        this.addJsonTrees({cJ: 'Img', url: 'img/k.jpg', alt: '圖片說明'}, level, this.climbingJsonTrees(newCj, copylevel), operatingWay)
      }

      if (beingDraggedID === 'TextTag') { // 被拖動的東西ID是 圖片
        console.log('添加模式(文字)')
        this.addJsonTrees({cJ: 'Text', text: '請輸入文字'}, level, this.climbingJsonTrees(newCj, copylevel), operatingWay)
      }

      if (/[-]/g.test(beingDraggedID) || /\d{1}/g.test(beingDraggedID)) { // 被拖的東西ID 是一個複雜的DIV 且用爬樹把她找出來
        var copyJsonBranch = JSON.parse(JSON.stringify(this.climbingJsonTrees(newCj, beingDraggedIDlevel)))
          // 深層複製 打斷魂結 使不連動

        if (this.altCopymode) { // 複製模式
          console.log('複製模式')
          this.addJsonTrees(copyJsonBranch, level, this.climbingJsonTrees(newCj, copylevel), operatingWay)
          // 這邊出了一個問題 再複製的時候只能拉動可視的 data-row 但是其實這會讓它多複製一層
        } else { // 如果不是複製模式，需要刪除舊的DOM
          console.log('移動模式')
          delete copyJsonBranch.delete // 複製出來新的不需要有delete屬性
          this.addJsonTrees(copyJsonBranch, level, this.climbingJsonTrees(newCj, copylevel), operatingWay)

          this.findJsonTree(newCj, 'delete')
        }
      }

      // (就算沒有下面的setState也會變，但是只是不會渲染)
      this.setState({cJ: newCj})
      this.saveStateinLocalStorage() // 改完了 存個檔
      this.cancelDefault(e)
    }

    componentDidMount () {
      window.localStorage.setItem('Undo', JSON.stringify([[]]))
      document.addEventListener('keydown', (e) => {
        if (e.keyCode === 18) {
          this.altCopymode = true
          // console.log('按下' + this.altCopymode)
        }

        if (e.keyCode === 90 && e.ctrlKey) {
          this.recoveryState(false)
        }

        if (e.keyCode === 89 && e.ctrlKey) {
          this.recoveryState(true)
        }

        e.preventDefault() // 為什麼要寫這個 我也不懂 沒寫的話keyup後要再點擊一次畫面這個事件才能再次有效
      })

      document.addEventListener('keyup', (e) => {
        if (e.keyCode === 18) {
          this.altCopymode = false
          // console.log('放開' + this.altCopymode)
        }
      })
    }

    mapToCreatDiv (cJdata, previousKey) {
      return cJdata.map((node, index) => {
        var myKey = previousKey === undefined ? index : previousKey + '-' + index
        // 注意 : myKey 並不紀錄DOM巢狀，而是紀錄JSON資料的巢狀
        var ObjIsObject = this.jsonIsWhichObj(node)
        if (ObjIsObject) {
          // 代表 node 是 {}
          let divStyle = {'width': 100 / cJdata.length + '%'}
          if (typeof (this.jsonIsWhichObj(node.cJ)) === 'boolean') {
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
                  draggable='true'
                  onDragStart={this.ondragstart}
                >
                  {this.mapToCreatDiv(node.cJ, myKey)}
                  <DeleteSetBox deleteJsonTrees={this.deleteJsonTrees} />
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
                  draggable='true'
                  onDragStart={this.ondragstart}
                >
                  <DeleteSetBox deleteJsonTrees={this.deleteJsonTrees} />
                </div>
              )
            }
          } else if (this.jsonIsWhichObj(node.cJ) === 'else') {
            // 判斷為 'else' 字串者，表示可能是圖片、文字、影片等等等不同 HTML TAG，會依 node.cJ實際字串內容來決定
            if (node.cJ === 'Img') {
              return (
                <TemplateImg
                  id={myKey}
                  key={index}
                  alt={node.alt}
                  src={node.url}
                  onDragStartFunction={this.ondragstart}
                  onClickFunction={this.showPanel}
                />)
            } else if (node.cJ === 'Text') {
              return (
                <TemplateText
                  id={myKey}
                  index={index}
                  text={node.text}
                  onDragStartFunction={this.ondragstart}
                />)
            }
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
                onDragOver={this.dragoverGoSlect.bind(null, node[0].cJ.length, true, false)}
                onDragLeave={this.dragleaveGoBack}
                draggable='true'
                onDragStart={this.ondragstart}
              >
                {this.mapToCreatDiv(node[0].cJ, myKey + '-0')}
                <DeleteSetBox deleteJsonTrees={this.deleteJsonTrees} />
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
                  draggable='true'
                  onDragStart={this.ondragstart}
                  >
                  {this.mapToCreatDiv(node_.cJ, sideBySideKey)}
                  <DeleteSetBox deleteJsonTrees={this.deleteJsonTrees} />
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
                draggable='true'
                onDragStart={this.ondragstart}
                >
                {sideBySideDom}
                <DeleteSetBox deleteJsonTrees={this.deleteJsonTrees} />
              </div>
            )
          }
        }
      })
    }
    render () {
      // render operatingArea 時 會參照 State 內的資料
      return (
        <div>
          <div id='menu'>
            <div
              id='emptyBox'
              draggable='true'
              onDragStart={this.ondragstart}
            > 添加一個框框 </div>
            <img
              id='imgTag'
              draggable='true'
              onDragStart={this.ondragstart}
              src='img/k.jpg'
            />
            <p
              id='TextTag'
              draggable='true'
              onDragStart={this.ondragstart}
            >添加一段文字</p>
          </div>
          <div className='panelBox'> {/* 浮動操作面板放置區 */}
            {this.state.nowEditType === 'Img' &&
              <PanelSetImg
                save={this.changeAndSaveDomAttribute}
                nowBranchData={this.state.editBranch}
              />
            }
          </div>
          <div>
            <div id='operatingArea'
              data-role='drag-drop-container'
              onDrop={this.dropped}
              onDragEnter={this.cancelDefault}
              onDragOver={this.dragoverGoSlect.bind(null, this.state.cJ.length, false, false)}
              onDragLeave={this.dragleaveGoBack}
            >
              {this.mapToCreatDiv(this.state.cJ)}
            </div>
          </div>
        </div>
      )
    }

    componentDidUpdate () {
      // 每當化面更新 重綁所有的 hover
      $('#operatingArea div').off('mouseenter mouseleave')

      $('#operatingArea div').not('.deleteSetBox').hover(function (e) {
        var $this = $(this)
        $this.parents().mouseleave() // 把自己的爸爸關掉
        var findLength = $this.find('.deleteSetBox').length - 1
        $this.find('.deleteSetBox').eq(findLength).show()
        e.stopPropagation()
      }, function (e) {
        var $this = $(this)
        $('.deleteSetBox').hide() // 全關了
        $this.parent().mouseenter() // 順便把自己爸爸打開一下
        e.stopPropagation()
      })
      // 注意冒泡以及重疊問題
    }

    showPanel (type, e) { // 將浮動面板打開，並且傳入相關 level 資訊
      $('.panelBox').show()
      let domID = e.target.id.split('-') // 取得level
      this.setState({
        editBranch: this.climbingJsonTrees(this.state.cJ, domID),
        nowEditType: type
      })
    }

    changeAndSaveDomAttribute (type, newData) { // 專門處裏由 panel 浮動面板傳來異動this.state.cJ的處理
      let newCj = this.state.cJ
      let branch = this.climbingJsonTrees(newCj, this.editLevel) // 找到當前要編集的小樹枝
      if (branch.cJ === type) {
        for (let v in newData) {
          branch[v] = newData[v] // 取代掉裏面的特性
        }

        this.setState({cJ: newCj})
        this.saveStateinLocalStorage() // 改完了 存個檔
      } else {
        console.log('DOM型態不符合喔...')
      }
    }
  }

  ReactDOM.render(
    <MenuAndOperatingArea />,
    document.getElementById('content')
  )
})
