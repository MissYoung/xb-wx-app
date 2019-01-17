
const app = getApp();
var util = require("../../../../utils/util.js");
var md5_util = require("../../../../utils/md5.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadOrderDetail(options.orderid)
    console.info(options.orderid)
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

  copyOrderId: function (e) {
    console.info(e.currentTarget.dataset.orderid)
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

  weChatPayFunc:function(e){
    wx.request({
      url: app.globalData.loadUrl + '/api/order/payment',
      method: 'POST',
      data: {
        orderId: JSON.stringify(e.currentTarget.dataset.orderid),
        openid: app.globalData.result.wxOpenId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        var timeStamp = parseInt(new Date().getTime() / 1000) + ''
        console.info(res.data.data)
        var nonceStr = Math.random().toString(36).substr(2)
        var baseStr = "appid" + res.data.data.appid + "&nonceStr" + nonceStr + "&package=prepay_id=" + res.data.data.prepay_id + "signType=MD5&timeStamp=" + timeStamp +"&key="

        wx.requestPayment({
          appid: res.data.data.appid,
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonce_str,
          package: res.data.data.package,
          signType: 'MD5',
          paySign: res.data.data.sign,   //(md5_util.hex_md5(baseStr)).toUpperCase(),
          success:res =>{
          console.info("success"+res.result)
            wx.navigateTo({
              url: 'paySuccess?orderId=' + e.currentTarget.dataset.orderid + '&id=' + this.data.orderInfo.product.productId,
            })
          },
          fail: res =>{
            console.info("failed:"+res)
            console.info(res.data)
          } 
        })
      }
    })
  }

})