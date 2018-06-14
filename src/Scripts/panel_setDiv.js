/* import React from 'react'
 * import ReactDOM from 'react-dom'
 * import $ from 'jquery'
*/
// 因為 browserify打包模塊太慢了 開發不使用

class panelSetDiv extends React.Component {
  constructor (props) {
    super(props)
    /* this.state = {
      text: ''
    } */
  }
  componentWillMount () {
    if (this.props.nowBranchData.cJ !== []) return
  }

  render () {
    return (
      <div id='SetBox'>
        <h3>Edit Div</h3>
        <div>
          <label>
            <span>文字內容</span>
            <textarea
              rows='4' cols='50'
              type='textarea'
              />
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
