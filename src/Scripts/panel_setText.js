/* import React from 'react'
 * import ReactDOM from 'react-dom'
 * import $ from 'jquery'
*/
// 因為 browserify打包模塊太慢了 開發不使用

class panelSetText extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: ''
    }

    this.handleChangeTextContend = this.handleChangeTextContend.bind(this)
  }
  componentWillMount () {
    if (this.props.nowBranchData.cJ !== 'Text') return

    this.setState({
      text: this.props.nowBranchData.text
    })
  }

  handleChangeTextContend (e) {
    this.setState({
      text: e.target.value
    })
  }

  render () {
    return (
      <div id='SetBox'>
        <h3>Edit Image</h3>
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
