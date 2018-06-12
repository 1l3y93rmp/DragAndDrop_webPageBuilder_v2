/* import React from 'react'
 * import ReactDOM from 'react-dom'
*/
// 因為 browserify打包模塊太慢了 開發不使用

class TemplateImg extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <p
        id={this.props.id}
        key={this.props.index}
        draggable='true'
        onDragStart={this.props.onDragStartFunction}
        >
        {this.props.text}</p>
    )
  }
}

module.exports = TemplateImg