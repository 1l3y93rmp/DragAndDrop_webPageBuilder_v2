/* import React from 'react'
 * import ReactDOM from 'react-dom'
*/
// 因為 browserify打包模塊太慢了 開發不使用

class TemplateImg extends React.Component {
  constructor (props) {
    super(props)
  }
  
  render () {
    
    // 要處裡CLASS的KEY的-問題
    var style = {color: '#96e7bc'}
    console.log(this.props.style)
    return (
      <p
        id={this.props.id}
        draggable='true'
        onDragStart={this.props.onDragStartFunction}
        onClick={this.props.showPanel.bind(null, 'Text')}
        style={this.props.style}
        >
        {this.props.text}</p>
    )
  }

  componentDidUpdate () {
    
  }
}

module.exports = TemplateImg
