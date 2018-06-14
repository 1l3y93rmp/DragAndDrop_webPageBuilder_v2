/* import React from 'react'
 * import ReactDOM from 'react-dom'
 * import $ from 'jquery'
*/
// 因為 browserify打包模塊太慢了 開發不使用

class panelSetImg extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      url: '',
      alt: ''
    }

    this.handleChangeImgUrl = this.handleChangeImgUrl.bind(this)
    this.handleChangeImgAlt = this.handleChangeImgAlt.bind(this)
  }
  componentWillMount () {
    // 當父原件的 State(所有ㄉ 不管有沒有被匯進來喔) 被異動了 這裏也會跟著執行

    // 通常是 nowBranchData...

    // 這裏設計不佳! 造成不相干浮動面板也會隨之render
    // 需要設計阻擋器

    if (this.props.nowBranchData.cJ !== 'Img') return

    this.setState({
      url: this.props.nowBranchData.url,
      alt: this.props.nowBranchData.alt
    })
  }

  handleChangeImgUrl (e) {
    this.setState({
      url: e.target.value
    })
  }
  handleChangeImgAlt (e) {
    this.setState({
      alt: e.target.value
    })
  }

  render () {
    return (
      <div id='SetBox'>
        <h3>Edit Image</h3>
        <div>
          <label>
            <span>圖片路徑</span>
            <input
              name='ImgUrl'
              type='text'
              value={this.state.url}
              onChange={this.handleChangeImgUrl}
              />
          </label>
          <label>
            <span>圖片替代文字</span>
            <input
              name='ImgAlt'
              value={this.state.alt}
              onChange={this.handleChangeImgAlt}
              type='text' />

          </label>
        </div>
        <ul>
          <li><button onClick={this.props.save.bind(null, 'Img', this.state)}>Save</button></li>
          <li><button onClick={this.props.cancel}>Cancel</button></li>
        </ul>
      </div>
    )
  }
}

module.exports = panelSetImg
