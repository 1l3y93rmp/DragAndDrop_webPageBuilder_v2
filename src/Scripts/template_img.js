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
      <img
        id={this.props.id}
        key={this.props.index}
        draggable='true'
        onDragStart={this.props.onDragStartFunction}
        alt={this.props.alt}
        src={this.props.src} />
    )
  }
}

module.exports = TemplateImg
