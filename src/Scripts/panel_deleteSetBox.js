/* import React from 'react'
 * import ReactDOM from 'react-dom'
 * import $ from 'jquery'
*/
// 因為 browserify打包模塊太慢了 開發不使用

class deleteSetBox extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <div className='deleteSetBox'>
        <button onClick={this.props.deleteJsonTrees} >Delete this Box</button>
        <button onClick={this.props.showPanel.bind(null, [])}>set this Box</button>
      </div>
    )
  }
}

module.exports = deleteSetBox
