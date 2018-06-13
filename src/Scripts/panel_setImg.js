/* import React from 'react'
 * import ReactDOM from 'react-dom'
 * import $ from 'jquery'
*/
// 因為 browserify打包模塊太慢了 開發不使用

class panelSetImg extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ImgUrl: '',
      ImgAlt: ''
    }

    this.handleChangeImgUrl = this.handleChangeImgUrl.bind(this)
  }
  componentWillMount () {
    // 當父原件的 State(所有ㄉ 不管有沒有被匯進來喔) 被異動了 這裏也會跟著執行

    // 通常是 nowBranchData...

    // 這裏設計不佳! 造成不相干浮動面板也會隨之render
    // 需要設計阻擋器

    if (this.props.nowBranchData.cJ !== 'Img') return

    this.setState({
      ImgUrl: this.props.nowBranchData.url,
      ImgAlt: this.props.nowBranchData.alt
    })
  }

  handleChangeImgUrl (e) {
    this.setState({
      ImgUrl: e.target.value
    })
  }

  handleSave () {
    this.props.save(null, 'img', this.state)
  }

  render () {
    return (
      <div id='SetBox'>
        <input name='111' type='text' />
        <h3>Edit Image</h3>
        <div>
          <label>
            <span>圖片路徑</span>
            <input
              name='ImgUrl'
              type='text'
              value={this.state.ImgUrl}
              onChange={this.handleChangeImgUrl}
              />
          </label>
          <label>
            <span>圖片替代文字</span>
            <input name='ImgAlt' type='text' />

          </label>
        </div>
        <ul>
          <li><button onClick={this.handleSave}>Save</button></li>
          <li><button>Cancel</button></li>
        </ul>
      </div>
    )
  }
}

module.exports = panelSetImg
