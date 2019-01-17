
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewType:0,
    pageIndex:1,
    pageSum:1,
    myOrders:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ viewType: options.viewType})
    this.loadOrders()
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
    var type = e.currentTarget.dataset.type
    if (type == 'perpay'){
      this.setData({
        viewType: 0,
        pageIndex:1
      })
      console.info('perpay')
    } else if (type == 'peSendSku'){
      this.setData({
        viewType: 1,
        pageIndex: 1
      })
    } else if (type == 'preGetSku') {
      this.setData({
        viewType: 2,
        pageIndex: 1
      })
    } else if (type == 'completed') {
      this.setData({
        viewType: 3,
        pageIndex: 1
      })
    }
    this.loadOrders()
  },

  loadOrders:function(){
    var that = this;
    wx.request({
      url: app.globalData.loadUrl + '/api/order/findByUserId',
      data: {
        userId: app.globalData.result.custId,
        playMark: that.data.viewType,
        pageNum: that.data.pageIndex,
        pageSize:10
      },
      method: 'GET',
      success: res => {
        that.setData({
          myOrders: res.data.data.items,
          pageSum: res.data.data.totalPageCount
        })
      }
    })
  },

  toCommentFunc:function(e){
    console.info(e.currentTarget.dataset.orderid)
    wx.navigateTo({
      url: '../orders/comment/comment?orderid=' + e.currentTarget.dataset.orderid,
    })
  },

  toCommentListFunc: function (e) {
    console.info(e.currentTarget.dataset.orderid)
    wx.navigateTo({
      url: '../orders/comment/commentList?orderid=' + e.currentTarget.dataset.orderid,
    })
  },

  orderDetailFunc:function(e){
    console.info(e.currentTarget.dataset.orderid)
    wx.navigateTo({
      url: '../orders/detail/orderDetail?orderid=' + e.currentTarget.dataset.orderid
    })
  },

  payForOrderFunc:function(e){
    wx.navigateTo({
      url: '../orders/payOrder/confirmOrder?orderid=' + e.currentTarget.dataset.orderid
    })
  },


  confirmReceiveOrderFunc:function(e){
    console.info(e.currentTarget.dataset)
    wx.request({
      url: app.globalData.loadUrl + '/api/order/findExpress',
      data: {
        orderId: e.currentTarget.dataset.orderid
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        // var arr = []
        // for (var i = 0; i < this.data.myOrders.count;i++){
        //     var item = this.data.myOrders[i];
        //   if (item.userOrderId != e.currentTarget.dataset.orderid){
        //     arr += item;
        //   }
        // }
        // this.setData({
        //   myOrders:arr
        // })
        this.loadOrders()
      }
    })

  }



})