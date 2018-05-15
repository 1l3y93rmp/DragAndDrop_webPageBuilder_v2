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

  class BlockH2 extends React.Component {
    // h2代表 水平 兩塊Div
    render () {
      return (
        <div>
          <DataInput class={'Horizontal'} />
          <DataInput class={'Horizontal'} />
        </div>
      )
    }
  }
  class BlockV2 extends React.Component {
    // h2代表 水平 兩塊Div
    render () {
      return (
        <div>
          <DataInput class={'vertical'} />
          <DataInput class={'vertical'} />
        </div>
      )
    }
  }

  class MenuAndOperatingArea extends React.Component {
    render () {
      return (
        <React.Fragment>
          <div id='menu'>
            <div id='menuBlock'>
              <BlockH2 />
              <BlockV2 />
            </div>
            <div id='menuData' />
          </div>
          <div id='operatingArea' />
        </React.Fragment>
      )
    }
  }

  ReactDOM.render(
    <MenuAndOperatingArea />,
    document.getElementById('content')
  )
})
