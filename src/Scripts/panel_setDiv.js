/* import React from 'react'
 * import ReactDOM from 'react-dom'
 * import $ from 'jquery'
*/
// 因為 browserify打包模塊太慢了 開發不使用
import changeStyle from './handle_changeStyle'

class panelSetDiv extends React.Component {
  constructor (props) {
    super(props)
    this.handleChangeStyle = this.handleChangeStyle.bind(this)
    this.state = {
      style: {}
    }
  }
  componentWillMount () {
    if (this.props.nowBranchData.cJ !== []) return
  }
  handleChangeStyle (cssKey, unit, e) {
    // unit指的是單位 看Style是否要加單位
    this.setState(changeStyle(this.state.style, cssKey, unit, e))
  }

  render () {
    return (
      <div id='SetBox'>
        <h3>Edit Div</h3>
        <div>
          <label>
            <span>背景圖片</span>
            <input
              name='DivBGimg'
              type='text'
            />
          </label>
          <label>
            <span>背景顏色</span>
            <input
              name='DivBGColor'
              type='text'
            />
          </label>
          <label>
            <span>內容排列方式</span>
            <select
              value={this.state.style.textAlign === undefined ? 'left' : this.state.style.textAlign}
              onChange={this.handleChangeStyle.bind(null, 'textAlign', '')}
            >
              <option value='left'>齊左</option>
              <option value='center'>齊中</option>
              <option value='right'>齊右</option>
            </select>
          </label>
        </div>
        <ul>
          <li><button onClick={this.props.cleanUpCjArray}>刪光這個Box內的東西</button></li>
          <li><button onClick={this.props.save.bind(null, [], this.state)}>Save</button></li>
          <li><button onClick={this.props.cancel}>Cancel</button></li>
        </ul>
      </div>
    )
  }
}

module.exports = panelSetDiv
