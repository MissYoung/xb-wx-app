
//获取应用实例
const app = getApp()
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedMenu: 0,
    
    sort: [],//幻灯片数据
  
    userNum:0,
    gainPriceSum:0,

    xpsbObj:{},

    articles:{},
    articleOne:{},
    articleTwo:{},

    hotProducts:[],

    indicatorDots: false,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,

    pageNum:1,
    pageSum:1,

    proClass:[],

    note: [
    ],

    cameraCommodities:[],
    commodities:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadArticle()
    this.commentListFunc()
    this.transListFunc()
    this.loadProductClass()
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

  loadArticle:function(){
    wx.request({
      url: app.globalData.loadUrl + '/api/article/findList',
      data: {
        pageNum: 1,
        pageSize: 1
      },
      method: 'GET',
      success: res => {
        for (var i = 0; i < res.data.data.items.length; i++){
          res.data.data.items[i]['createTime'] = util.formatTimeTwo(res.data.data.items[i]["createTime"], 'M月D日 h:m')
        }
console.info(res.data.data)
        this.setData({
          articles: res.data.data.items[0]
        })
      }
    })
  },

  loadArticleList: function () {
    wx.request({
      url: app.globalData.loadUrl + '/api/article/findList',
      data: {
        pageNum: 1,
        pageSize: 2
      },
      method: 'GET',
      success: res => {
        for (var i = 0; i < res.data.data.items.length; i++) {
          res.data.data.items[i]['createTime'] = util.formatTimeTwo(res.data.data.items[i]["createTime"], 'M月D日 h:m')
        }

        this.setData({
          articleOne: res.data.data.items[0],
          articleTwo: res.data.data.items[1]
        })
      }
    })
  },

  loadXPSB:function(){
    wx.request({
      url: app.globalData.loadUrl + '/api/business/xpShakeMap',
      method: 'GET',
      success: res => {
        this.setData({
          xpsbObj: res.data.result
        })
      }
    })
  },

  lookAround:function(){
    wx.request({
      url: app.globalData.loadUrl + '/api/business/lookAround',
      method: 'GET',
      success: res => {
        this.setData({
          cameraCommodities:res.data.result
        })
      }
    })
  },

  randomGroupBuyByList: function () {
    wx.request({
      url: app.globalData.loadUrl + '/api/business/randomGroupBuyByList',
      method: 'GET',
      success: res => {
        this.setData({
          commodities: res.data.result
        })
        console.info(res.data.result)
      }
    })
  },

  menuBtnTaped:function(e){
    console.log(e)
    console.log(this.data.articles)
    this.setData({
      selectedMenu: e.currentTarget.dataset.index
    })
    if (e.currentTarget.dataset.index == 0){

    } else if (e.currentTarget.dataset.index == 1){
      this.loadArticleList()
      this.loadXPSB()
      this.lookAround()
    }else{
      this.loadHotProducts()
      this.randomGroupBuyByList()
    }
  },

  commentListFunc:function(){
    wx.request({
      url: app.globalData.loadUrl + '/api/order/getCommentListByDate',
      data: {
        pageNum: this.data.pageNum,
        pageSize:10
      },
      method: 'GET',
      success: res => {
        for (var i = 0; i < res.data.data.items.length; i++) {
          res.data.data.items[i]["createTime"] = util.formatTimeTwo(res.data.data.items[i]["createTime"], 'Y-M-D')
        }
        this.setData({
          note: res.data.data.items,
          pageSum: res.data.data.totalPageCount
        })
      }
    })
  },

  transListFunc:function(){
    wx.request({
      url: app.globalData.loadUrl + '/api/order/getRankList',
      data: {
        pageNum: 1,
        pageSize: 10
      },
      method: 'GET',
      success: res => {
        console.info(res.data.data)
        this.setData({
          sort:res.data.data.topList,
          userNum: res.data.data.userNum,
          gainPriceSum: res.data.data.gainPriceSum
        })
      }
    })
  },

  loadProductClass:function(){
    wx.request({
      url: app.globalData.loadUrl + '/api/classify/findClassifyParent',
      method: 'GET',
      success: res => {
        console.info(res.data.data)
        this.setData({
          proClass: res.data.data
        })
      }
    })
  },

  loadHotProducts:function(){
    wx.request({
      url: app.globalData.loadUrl + '/api/business/getTodayHotGroupBuy',
      method: 'GET',
      success: res => {
        console.info(res.data.result)
        this.setData({
          hotProducts: res.data.result
        })
      }
    })
  },

  hotProductTapped:function(e){
    wx.navigateTo({
      url: '../goods/index?id=' + e.currentTarget.dataset.productid,
    })
  },

  productClassFunc:function(e){
    console.info(e)
  },

  showProductFunc:function(e){
    wx.navigateTo({
      url: '../goods/index?id=' + e.currentTarget.dataset.productid,
    })
  },

  sbggFunc:function(e){
    wx.navigateTo({
      url: '../goods/index?id=' + e.currentTarget.dataset.productid,
    })
  }
})