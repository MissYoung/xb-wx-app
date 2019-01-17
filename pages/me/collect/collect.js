
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    pageSum:1,
    skuType:1,
    categories:[],
    skuList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData()
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

  loadData: function() {

    var that = this
    wx.request({
      url: app.globalData.loadUrl + '/api/customer/myFavProductType',
      data: {
        custId: app.globalData.result.custId,
      },
      method: 'GET',
      success: res => {
        console.info(res.data)
        if(res.data.success == true){
          that.setData({
            categories:res.data.result,
            skuType:res.data.result[0].typeId
          })

          wx.request({
            url: app.globalData.loadUrl + '/api/customer/myFav',
            data: {
              custId: app.globalData.result.custId,
              typeId: res.data.result[0].typeId,
              pageSize: 10,
              currentPage: that.data.pageIndex
            },
            method: 'GET',
            success: ress => {
              console.info(ress.data)
              if (ress.data.success == true) {
                that.setData({
                  pageIndex: ress.data.result.totalPageCount,
                  skuList: ress.data.result.items
                })
              }
            }
          })
        }
      }
    })
  },

  favProductFunc:function(e){
    console.info(e.target.dataset.favid)
    wx.request({
      url: app.globalData.loadUrl + '/api/customer/delFav',
      data: {
        favId: e.target.dataset.favid
      },
      method: 'GET',
      success: ress => {
        console.info(ress.data)
      
      }
    })
  },

  typeSelected: function (e) {

  }


})