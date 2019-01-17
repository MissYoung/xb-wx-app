const app = getApp();
var util = require("../../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList:[],
    pageNum:1,
    pageIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadComments(options.orderid)
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
    this.setData({
      pageIndex:0
    })
    this.loadComments(options.orderid)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      pageIndex: this.data.pageIndex+1
    })
    this.loadComments(options.orderid)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  loadComments:function(e){
    if(this.data.pageIndex >= this.data.pageNum){
      wx.showToast({
        title: '没有更多的数据了',
      })
      return;
    }
    wx.request({
      url: app.globalData.loadUrl + '/api/order/getCommentList',
      data: {
        productId: e,
        pageNum:this.data.pageIndex+1,
        pageSize:10
      },
      method: 'GET',
      success: res => {
        for (var i = 0; i < res.data.data.items.length; i++) {
          res.data.data.items[i]["createTime"] = util.formatTimeTwo(res.data.data.items[i]["createTime"], 'Y-M-D')
        }

        this.setData({
          commentList:res.data.data.items,
          pageNum:res.data.data.totalPageCount,
          pageIndex:res.data.data.curentPage,
        }) 
        console.info(res.data.data)
        console.info(res.data.data + "     " + res.data.data.createTime)
        // res.data.data.createTime = util.formatTimeTwo(res.data.data.createTime, 'Y-M-D')
        // console.info(res.data.data.createTime)
        // this.setData({
        //   orderInfo: res.data.data
        // })
      }
    })
  }
})