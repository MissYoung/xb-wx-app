
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex:1,
    pageSum:1,
    categories: [],
    selectedCategory:0,
    skuList: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadRecords()
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

  loadRecords:function(){
    var that = this
    wx.request({
      url: app.globalData.loadUrl + '/api/order/myHistoryProductType',
      data: {
        custId: app.globalData.result.custId
      },
      method: 'GET',
      success: res => {
        console.info(res.data)
        that.setData({
          categories:res.data.data,
          selectedCategory:res.data.data[0].typeId
        })
        wx.request({
          url: app.globalData.loadUrl + '/api/order/findHistoryByUserId',
          data: {
            userId: app.globalData.result.custId,
            pageNum: that.data.pageIndex,
            pageSize: 10,
            typeId: res.data.data[0].typeId
          },
          method: 'GET',
          success: ress => {
            console.info(ress.data.data.items)
            that.setData({
              skuList: ress.data.data.items,
              pageIndex: ress.data.data.totalPageCount
            })
          }
        })
      }
    })
  },

  typeSelected:function(e){

  }
})