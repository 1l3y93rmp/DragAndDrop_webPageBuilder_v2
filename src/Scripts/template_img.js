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
        draggable='true'
        alt={this.props.alt}
        src={this.props.src}
        onDragStart={this.props.onDragStartFunction}
        onClick={this.props.onClickFunction.bind(null, 'Img')} />
    )
  }
}

module.exports = TemplateImg
