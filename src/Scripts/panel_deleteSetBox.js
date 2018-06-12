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
        <a onClick={this.props.deleteJsonTrees} href='javascripts:void(0)'>Delete</a>
        <a>set this Box</a>
      </div>
    )
  }
}

module.exports = deleteSetBox
