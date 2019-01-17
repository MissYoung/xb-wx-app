//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    xbNum:0,
    xbTodayNum:0,
    isSigned:false,
    inviteId:0,
    pointPolicy:[
      '+1',
      '+2',
      '奖励5',
      '+3',
      '+3',
      '+3',
      '奖励17'
    ],
    currentSignDay:0,
    tasks:[
      {
        taskId:1,
        taskName:'每日签到',
        taskDetail:'仙贝',
        taskPoint:5,
        taskDetail2: '',
        taskPoint2: 0,
        taskState:'去签到',
        taskTotalNum: 1,
        taskCurrentNum: 0,
        taskFinish:'已完成'
      },
      {
        taskId: 2,
        taskName: '每日商品分享',
        taskDetail: '分享到朋友圈',
        taskPoint: 6,
        taskDetail2: '10阅读转换1仙贝',
        taskPoint2: 4,
        taskState: '去分享',
        taskTotalNum:3,
        taskCurrentNum: 0,
        taskFinish: '已完成'
      }, 
      {
        taskId: 3,
        taskName: '邀请好友赠送',
        taskDetail: '每位好友赠送3仙贝',
        taskPoint: 12,
        taskDetail2: '',
        taskPoint2: 0,
        taskState: '去邀请',
        taskTotalNum: 1,
        taskCurrentNum: 0,
        taskFinish: '已完成'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.shareTaskInfo()
    this.signInfo()
    this.setData({
      userInfo: app.globalData.userInfo
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
  onShareAppMessage: function (e) {
    var that = this
    if (e.target.dataset.id == 2){

    }else{
      return {
        title: '快来啊，我要赚积分',
        imageUrl: 'http://xxxx',//图片地址
        path: '/pages/index/index?sourceCustId='+app.globalData.result.custId+'&inviteId=' +that.data.inviteId,
        success: function (res) {
          wx.showToast({
            title: '邀请好友成功！',
          })
        },
        fail: function (res) {
          wx.showToast({
            title: '邀请好友失败！',
          })
        }
      }
    }
  },

  showDetailFunc:function () {
    //展示 明细
    wx.navigateTo({
      url: './xbDetail',
    })
  },

  signFunc: function () {
    if (this.data.isSigned == true){
      return;
    }
    //签到
    wx.request({
      url: app.globalData.loadUrl + '/api/customer/signIn',
      data: {
        custId: app.globalData.result.custId
      },
      method: 'GET',
      success: res => {
        console.info(res.data)
        wx.showToast({
          title: res.data.message,
          success:sel => {
            this.setData({
              isSigned: res.data.result
            })
            this.onLoad()
          }
        })
      }
    })
  },

  signInfo: function(){
    wx.request({
      url: app.globalData.loadUrl + '/api/customer/signInfo',
      data: {
        custId: app.globalData.result.custId
      },
      method: 'GET',
      success: res => {
        console.info(res.data)
        this.setData({
          currentSignDay: res.data.result.continuousTimes % 7 == 0 ?7 : res.data.result.continuousTimes%7,
          isSigned: res.data.result.signIn,
          'tasks[0].taskCurrentNum': (res.data.result.signIn == true ? 1:0),
          xbNum: res.data.result.totalXB,
          xbTodayNum: res.data.result.todayXB
        })
      }
    })
  },

  shareTaskInfo:function(){
    wx.request({
      url: app.globalData.loadUrl + '/api/share/shareProductTaskData', 
      data: {
        custId: app.globalData.result.custId
      },
      method: 'GET',
      success: res => {
        console.info(res.data)
        this.setData({
          'tasks[1].taskCurrentNum': res.data.result.alreadyShareTimes,
          'tasks[1].taskTotalNum': res.data.result.countTimes,
        })
      }
    })
  },

  doTaskFunc:function(e){
    if (this.data.tasks[e.target.dataset.id - 1].taskTotalNum == this.data.tasks[e.target.dataset.id - 1].taskCurrentNum){
      return
    }
    if (e.target.dataset.id == 1){
      this.signFunc()
    } 
  },

  requestInvited:function(){
    wx.request({
      url: app.globalData.loadUrl + '/api/invitation/ready',
      data: {
        custId: app.globalData.result.custId
      },
      method: 'GET',
      success: res => {
        if (res.data.success == true) {
          this.setData({
            inviteId: res.data.result.id
          })
        }
      }
    })
  }
})