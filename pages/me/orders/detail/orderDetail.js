
const app = getApp();
var util = require("../../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo:{}
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

  copyOrderId:function(e){
    console.info(e.currentTarget.dataset.orderid)
  },

  loadOrderDetail:function(e){
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
          orderInfo:res.data.data
        })
      }
    })
  }
})