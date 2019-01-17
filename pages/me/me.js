//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    xianBeiSum:0,
    beiKeTicketsNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadTicket()
    this.setData({
      userInfo: app.getCache("userinfo"),
      hasUserInfo: true
    })

    wx.request({
      url: app.globalData.loadUrl + '/api/customer/xianbei',
      data:{
        custId: app.globalData.result.custId
      },
      method:'GET',
      success: res =>{
        if(res.data.success == true){
          this.setData({
            xianBeiSum:res.data.result.xuanBeiSum
          })
        }
      }
    })
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
    wx.showToast({
      title: '暂时无法分享',
      icon: '',
      image: '',
      duration: 2,
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  loadTicket: function () {
    wx.request({
      url: app.globalData.loadUrl + '/api/customer/myTicketInfo',
      data: {
        custId: app.globalData.result.custId
      },
      method: 'GET',
      success: res => {
        console.info(res.data)
        if (res.data.success == true) {
          this.setData({
            beiKeTicketsNum: res.data.result.unUsed
          })
        }
      }
    })
  },

  myxbTapedFunc: function () {
    wx.navigateTo({
      url: './myxb/myxb'
    })
  },
  xbqTapedFunc:function(){
    wx.navigateTo({
      url: './xbq/xbq',
    })
  },
  ordersTaped:function(event){
    console.log(event.currentTarget.dataset.clickType);
    wx.navigateTo({
      url: './orders/orders?viewType=' + event.currentTarget.dataset.clickType,
    })
  },
  collectTaped:function(){
    wx.navigateTo({
      url: './collect/collect',
    })
  },
  addressTaped:function(){
    wx.navigateTo({
      url: './address/address',
    })
  },
  recordsTaped:function(){
    wx.navigateTo({
      url: './records/records',
    })
  },
  friendTaped:function(){
    wx.navigateTo({
      url: './friend/friend',
    })
  }
})