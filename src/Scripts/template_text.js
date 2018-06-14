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
        draggable='true'
        onDragStart={this.props.onDragStartFunction}
        onClick={this.props.showPanel.bind(null, 'Text')}
        >
        {this.props.text}</p>
    )
  }
}

module.exports = TemplateImg
