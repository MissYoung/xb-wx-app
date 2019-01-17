const app = getApp()
var util = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum:1,
    pageIndex:1,
    requestType:1,
    xbLogs:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.menuClicked()
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

  menuClicked:function(e){
    if(e != null){
      console.info(e.currentTarget.dataset.type)
      this.setData({
        requestType: e.currentTarget.dataset.type,
        pageIndex: 1
      })
    }
  
    //签到
    wx.request({
      url: app.globalData.loadUrl + '/api/customer/xianbeiLog',
      data: {
        custId: app.globalData.result.custId,
        type: this.data.requestType,
        pageSize:10,
        currentPage: this.data.pageIndex
      },
      method: 'GET',
      success: res => {
        console.info(res.data)
        if(res.data.success == true){
          for (var i = 0; i < res.data.result.items.length; i++) {
            res.data.result.items[i]["createTime"] = util.formatTimeTwo(res.data.result.items[i]["createTime"],'Y-M-D h:m')
          }
          this.setData({
            pageNum: res.data.result.totalPageCount,
            pageIndex: res.data.result.currentPage + 1,
            xbLogs: res.data.result.items
          })
        }
      }
    })
  }
})