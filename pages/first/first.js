//获取应用实例
const app = getApp()
var _core = app.requirejs("core")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAvarUrl: '/image/home/userHead.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
  loadUserInfo:function(e){ //获取授权按钮点击事件

    if (e.detail.errMsg =="getUserInfo:ok"){ // 授权
      app.getUserInfo(function (e) {
        wx.switchTab({ url: '../index/index' })
      }, function (e, t) {
        var t = t ? 1 : 0, e = e || "";
        t && wx.redirectTo({ url: '../first/first' })
      })

    }else{ // 拒绝
      _core.alert("客官大人，授权才能进入哦~")
    }

  }
})