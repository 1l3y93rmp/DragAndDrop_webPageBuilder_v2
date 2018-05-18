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

    render () {
      // render operatingArea 時 會參照 State 內的資料

      return (
        <React.Fragment>
          <div id='menu'>
            <div> 添加一個框框 </div>
          </div>
          <div id='operatingArea'>
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
