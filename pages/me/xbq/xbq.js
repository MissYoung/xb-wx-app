const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    usedTickets:0,
    unUsedNumTickets:0,
    currentType:'false',
    pageIndex:1,
    pageSum:1,
    tickets:[],
    isSelected: 'false',
    hasSelected: false,
    auctionId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('xbq', options);
    if (options.isSelected == 'true') {
      this.setData({
        isSelected: 'true',
        auctionId: options.auctionId,
        productId: options.id
      });
    } else {
      this.setData({
        isSelected: 'false'
      });
    }
    this.loadTicket()
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

  loadTicket:function(){
    wx.request({
      url: app.globalData.loadUrl + '/api/customer/myTicketInfo',
      data: {
        custId: app.globalData.result.custId
      },
      method: 'GET',
      success: res => {
        console.info(res.data)
        if(res.data.success == true){
          this.setData({
            unUsedNumTickets: res.data.result.unUsed,
            usedTickets: res.data.result.used
          })
        }
      }
    })
  },

  menuClicked: function(e) {
    var type = this.data.currentType
    if(e != null){
      console.info(e)
      type = e.currentTarget.dataset.type;
      if (type === 'true') {
        this.setData({
          isSelected: 'false'
        })
      } else {
        this.setData({
          isSelected: 'true'
        })
      }
      this.setData({
        currentType: type
      })
      this.setData({
        hasSelected: false
      })
    }
    console.info(app.globalData.result.custId);
    wx.request({
      url: app.globalData.loadUrl + '/api/customer/myTicket',
      data: {
        custId: app.globalData.result.custId,
        status: type =='true'?true:false,
        pageSize:10,
        currentPage:this.data.pageIndex
      },
      method: 'GET',
      success: res => {
        for (var i = 0; i < res.data.result.items.length; i++){
          if (this.data.isSelected == 'true' && type == 'false') {
            res.data.result.items[i].isSelected = true;
          } else {
            res.data.result.items[i].isSelected = false;
          }
          res.data.result.items[i].showDetail = false;
        }
        if(res.data.success == true){
          this.setData({
            pageSum: res.data.result.totalPageCount,
            tickets: res.data.result.items
          })
        }
      }
    })
  },

  showDetailFunc:function(e){
    console.info(e.currentTarget.dataset.ticketid);
    for(var i = 0 ; i < this.data.tickets.length; i++){
      if (this.data.tickets[i].ticket.ticketId == e.currentTarget.dataset.ticketid){
        this.setData({
          'tickets[i].showDetail' : !tickets[i].showDetail
        })
      }
    }
  },

  bindTickets:function(e) {
    let obj = this.data;
    obj.tickets.forEach(item => {
      if (item.ticket.ticketId === e.currentTarget.dataset.ticketid) {
        item.selected = !item.selected;
      } else {
        item.selected = false;
      }
    });
    let hasTicket = [];
    for (let index of obj.tickets) {
      if (index.selected) {
        hasTicket.push(index);
      }
    }
    if (hasTicket && hasTicket.length > 0) {
      this.setData({
        hasSelected: true
      })
    } else {
      this.setData({
        hasSelected: false
      })
    }
    this.setData({
      tickets: obj.tickets
    });
  },
  useTicket: function () {
    let obj = this.data;
    let selectedTicket = [];
    for (let val of obj.tickets) {
      if (val.selected) {
        selectedTicket.push(val);
      }
    }
    wx.request({
      url: app.globalData.loadUrl + '/api/business/bindTicket',
      data: {
        cticketId: selectedTicket[0].customerTicketId,
        auctionId: obj.auctionId
      },
      method: 'GET',
      success: res => {
        wx.navigateTo({
          url: '/pages/goods/index' + '?id=' + obj.productId
        });
      }
    })
  }
})