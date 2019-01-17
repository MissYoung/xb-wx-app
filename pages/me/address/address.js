
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadAddressList()
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
    let refreshFlag = wx.getStorageSync('AddressNotification')
    if(refreshFlag == true){
      this.loadAddressList()
    }
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
   * 添加地址信息
   */
  addressAddFunc:function(){
    wx.navigateTo({
      url: './addressAdd',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  delAddressFunc:function(e){
    var that = this;
    wx.showModal({
      title: '删除提示',
      content: '您确定要删除该地址吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: app.globalData.loadUrl + '/api/customer/delAddress',
            data: {
              addressId: e.currentTarget.dataset.id
            },
            method: 'GET',
            success: res => {
              if (res.data.success == true) {
                for (var i = 0; i < that.data.addressList.length; i++) {
                  if (that.data.addressList[i].addressId == e.currentTarget.dataset.id) {
                    that.data.addressList.splice(i, 1)
                    that.setData({
                      addressList: that.data.addressList
                    })
                    break;
                  }
                }
              } else {
                wx.showToast({
                  title: res.data.message,
                })
              }
            }
          })
        }
      }
    })
  },
  loadAddressList:function(){
    wx.setStorageSync('AddressNotification', false)
    wx.request({
      url: app.globalData.loadUrl + '/api/customer/addressList',
      data: {
        custId: app.globalData.result.custId
      },
      method: 'GET',
      success: res => {
        this.setData({
          addressList: res.data.result
        })
      }
    })
  },
  radioChange:function(e){
    for (var i = 0; i < this.data.addressList.length; i++) {
      if (this.data.addressList[i].addressId == e.detail.value) {
        let tempAddress = this.data.addressList[i]
        wx.request({
          url: app.globalData.loadUrl + '/api/customer/modifyAddress',
          data: {
            custId: app.globalData.result.custId,
            address: tempAddress.address,
            addressId: tempAddress.addressId,
            city: tempAddress.city,
            contacts: tempAddress.contacts,
            mark: 1,
            phone: tempAddress.phone,
            postcode: tempAddress.postcode
          },
          method: 'POST',
          success: res => {
            if (res.data.result != true) {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
            } else {
              console.info(res.data)
              wx.showToast({
                title: res.data.message
              })
              this.loadAddressList()
            }
          }
        })      

        break;
      }
    }  
  },
  itemClicked:function(e){
    console.info(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: './addressAdd?item=' + JSON.stringify(e.currentTarget.dataset.item),
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})