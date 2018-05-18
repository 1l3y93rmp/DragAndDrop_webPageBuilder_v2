import React from 'react'
import ReactDOM from 'react-dom'
var $ = require('jquery')

$(function () {
  // console.log($)
  // console.log(React)

  class DataInput extends React.Component {
    // 可供應放置資料的框
    render () {
      return (
        <div className={this.props.class} />
      )
    }
  }

  class MenuAndOperatingArea extends React.Component {
    constructor () {
      super()
      // contentJson 縮寫成 cJ
      this.state = {
        cJ: [{cJ: [{cJ: []}, {cJ: []}]}, {cJ: []}]
      }
      this.dropped = this.dropped.bind(this)
    }

    mapToCreatDiv (cJdata) {
      return cJdata.map((node, index) => {
        let divStyle = {'width': 100 / cJdata.length + '%'}
        if (node.cJ.length) { // 如果node的cJ 裡面還是有東西 靠遞迴自己叫自己
          return (
            <div key={index} style={divStyle}>
              {this.mapToCreatDiv(node.cJ)}
            </div>
          )
        } else {
          return (
            <div key={index} style={divStyle} />
          )
        }
      })
    }

    ondragstart (e) { // 被綁在被拖的東西的 (#menu內的)
      console.log('Yeeee')
      e.dataTransfer.setData('text/plain', e.target.id)
    }

    cancelDefault (e) { // 在防止預設行為的方法，被dropped調用
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    dropped (e) { // 被綁在要被放東西進來的框框(operatingArea) onDrop時調用這個方法
      console.log('進來惹')
      let newCj = this.state.cJ
      newCj.push({cJ: []})
      this.setState({cJ: newCj})
      this.cancelDefault(e)
    }

    render () {
      // render operatingArea 時 會參照 State 內的資料
      console.log(this.state.cJ)
      return (
        <React.Fragment>
          <div id='menu'>
            <div draggable='true' onDragStart={this.ondragstart}> 添加一個框框 </div>
          </div>
          <div id='operatingArea'
            onDrop={this.dropped}
            onDragEnter={this.cancelDefault}
            onDragOver={this.cancelDefault}
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
