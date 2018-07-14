/* import React from 'react'
 * import ReactDOM from 'react-dom'
 * import $ from 'jquery'
*/
// 因為 browserify打包模塊太慢了 開發不使用

import changeStyle from './handle_changeStyle'

class panelSetText extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      style: {}
    }

    this.handleChangeTextContend = this.handleChangeTextContend.bind(this)
    this.handleChangeStyle = this.handleChangeStyle.bind(this)
  }
  componentWillMount () {
    if (this.props.nowBranchData.cJ !== 'Text') return

    this.setState({
      text: this.props.nowBranchData.text,
      style: this.props.nowBranchData.style ? this.props.nowBranchData.style : {}
    })
  }

  handleChangeTextContend (e) {
    this.setState({
      text: e.target.value
    })
  }
  handleChangeStyle (cssKey, unit, e) {
    // unit指的是單位 看Style是否要加單位
    this.setState(changeStyle(this.state.style, cssKey, unit, e))
  }

  render () {
    return (
      <div id='SetBox'>
        <h3>Edit Text</h3>
        <div>
          <label>
            <span>文字內容</span>
            <textarea
              rows='4' cols='50'
              type='textarea'
              value={this.state.text}
              onChange={this.handleChangeTextContend}
              />
          </label>
          <label>
            <span>文字大小</span>
            <input
              type='number'
              value={this.state.style.fontSize === undefined ? 12 : parseInt(this.state.style.fontSize)}
              onChange={this.handleChangeStyle.bind(null, 'fontSize', 'px')}
              />
          </label>
          <label>
            <span>文字顏色</span>
            <input type='color'
              value={this.state.style.color === undefined ? '#000000' : this.state.style.color}
              onChange={this.handleChangeStyle.bind(null, 'color', '')}     
              />
          </label>
        </div>
        <ul>
          <li><button onClick={this.props.save.bind(null, 'Text', this.state)}>Save</button></li>
          <li><button onClick={this.props.cancel}>Cancel</button></li>
        </ul>
      </div>
    )
  }
}

module.exports = panelSetText
