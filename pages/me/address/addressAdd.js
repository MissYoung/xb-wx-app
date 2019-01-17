
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    addressId: 0,
    city: '',
    contacts: '',
    mark: 0,
    phone: '',
    postcode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.item != null){
      var temp = JSON.parse(options.item)
      this.setData({
        address: temp.address,
        addressId: temp.addressId,
        city: temp.city,
        contacts: temp.contacts,
        mark: temp.mark,
        phone: temp.phone,
        postcode: temp.postcode
      })
    }
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

  /**
   * 地址存储接口
   */
  saveAddressFunc:function(e){
    var sUserName = e.detail.value.username
    var sPhoneNum = e.detail.value.phoneNum
    var sArea = e.detail.value.area
    var sDetailAddress = e.detail.value.detailAddress
    var sYZBM = e.detail.value.yzbm

    console.info(sUserName)
    if (sUserName.length < 1){
      wx.showToast({
        title: '联系人不能为空',
        icon:'none'
      })
      return
    }
    if (sPhoneNum.length != 11) {
      wx.showToast({
        title: '手机号输入不正确',
        icon: 'none'
      })
      return
    }
    if (sArea.length < 1) {
      wx.showToast({
        title: '地区不能为空',
        icon: 'none'
      })
      return
    }
    if (sDetailAddress.length < 1) {
      wx.showToast({
        title: '详细地址不能为空',
        icon: 'none'
      })
      return
    }
    if (sYZBM.length != 6) {
      wx.showToast({
        title: '邮政编码输入不正确',
        icon: 'none'
      })
      return
    }

    wx.request({
      url: app.globalData.loadUrl + '/api/customer/modifyAddress',
      data: {
        custId: app.globalData.result.custId,
        address:sDetailAddress,
        addressId: this.data.addressId,
        city: sArea,
        contacts: sUserName,
        mark: 0,
        phone: sPhoneNum,
        postcode: sYZBM
      },
      method: 'POST',
      success: res => {
        if (res.data.result != true){
          wx.showToast({
            title: res.data.message,
            icon:'none'
          })
        }else{
          console.info(res.data)
          wx.showToast({
            title: res.data.message
          })
          wx.navigateBack({
            delta:1
          })
          wx.setStorageSync('AddressNotification', true)
        }
      }
    })
  }
})