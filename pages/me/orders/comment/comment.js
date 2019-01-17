
const app = getApp();
var util = require("../../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {},
    commentContent:"",
    imgs:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadOrderDetail(options.orderid)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  loadOrderDetail: function (e) {
    wx.request({
      url: app.globalData.loadUrl + '/api/order/findOrderOne',
      data: {
        orderId: e
      },
      method: 'GET',
      success: res => {
        console.info(res.data.data)
        console.info(res.data.data + "     " + res.data.data.createTime)
        res.data.data.createTime = util.formatTimeTwo(res.data.data.createTime, 'Y-M-D')
        console.info(res.data.data.createTime)
        this.setData({
          orderInfo: res.data.data
        })
      }
    })
  },

  addNewImgaeFunc:function(){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        this.setData({
          imgs: this.data.imgs.concat(tempFilePaths)
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  commentChangedFunc:function(e){
    this.setData({
      commentContent:e.detail.value
    })
  },

  submitCommentBtnClicked:function(e){
    if (this.data.commentContent.length < 1){
      wx.showToast({
        title: '请输入有效的评价内容',
      })
      return;
    }
    console.info(e.currentTarget.dataset.orderid)
    wx.request({
      url: app.globalData.loadUrl + '/api/order/comment',
      data: {
        orderId: e.currentTarget.dataset.orderid,
        createUsr: app.globalData.result.custId,
        // commentImg:'',
        comment:this.data.commentContent
      },
      method: 'POST',
      success: res => {
        console.info(res.data.data.ticket)
        wx.navigateTo({
          url: 'commentSuccess?ticket=' + JSON.stringify(res.data.data.ticket),
        })
      }
    })
  }
})