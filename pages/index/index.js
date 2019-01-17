let app = getApp(); //引入app对象
let loadUrl = app.globalData.loadUrl;
Page({
  data: {
    swiper: ['demo-text-1', 'demo-text-2', 'demo-text-3'], //幻灯片数据
    indicatorDots: false,
    vertical: false,
    autoplay: false,
    circular: false,
    current: 1,
    interval: 3000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    types: [], //分类
    banner: [],
    attentionAnim: 0,//动画参数
    integralNumber: 0, //仙贝数
    Hots: {}, //疯狂来袭
    dapai: {}, //周三大牌
    selected: [],//精选商品
    dayData: [],//每日仙拍
    dayTime: [],//每日仙拍当前时间
    currentDate: [],//当前时间
    currentMiao: "",// 当前时间戳
    selectDate: [],//当前选中时间
    ByOrder: [],//晒单
    findList: [],//仙贝说
    jxdapai: [],//精选大牌
    currentSlide: 1,
    currentDay: '',
    everyDayImgs: []
  },
  changeHandle (e) {
    let num = e.detail;
    this.setData({
      currentSlide: num.current
    });
  },
  onBanner() { //获取banner
    let obj = this;
    wx.request({
      url: loadUrl + '/api/business/getHomeAuctionList',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        let datas = [];
        for (let value in res.data.result) {
          datas.push(res.data.result[value])
        }
        obj.setData({
          swiper: datas
        })
      }
    })
  },
  //banner点击
  bannerClick(e) {
    let auctionId = e.currentTarget.dataset.auctionid;
    let objs = this;
    console.log(auctionId)
    wx.request({
      url: loadUrl + '/api/business/joinAuction',
      data: { auctionId: auctionId, custId: app.globalData.result.custId },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // let datas = [];
        // for (let value in res.data.result) {
        //   datas.push(res.data.result[value])
        // }
        objs.onBanner();
        let item = res.data.result;
        // 跳转绑定卡券

        objs.onShareAppMessage(e);
        if (!item.checkFlag && item.bindTicket) {

        } else if (!item.checkFlag && !item.bindTicket) { // 跳转分享
          wx.navigateTo({
            url: '/pages/me/myxb/myxb'
          })
        } else {

          wx.showToast({
            title: item.msg,
            icon: 'succes',
            duration: 3000,
            mask: true
          })
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    var that = this
    return {
      title: '快来啊，我要赚积分',
      imageUrl: 'http://xxxx',//图片地址
      path: '/pages/index/index?sourceCustId=' + app.globalData.result.custId + '&inviteId=' + that.data.inviteId,
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

  },
  onLoad(options) { //页面加载时运行
    let date = new Date();
    let currentDate = date.getHours();
    this.setData({
      currentDate: currentDate,
      currentMiao: Number(date)
    })
    this.loadTypes(); //获取商品类型
    this.onBanner(); //获取banner
    this.onLoadNumber(); //获取仙贝数
    this.onLoadHot(); //加载疯狂来袭和周三大牌
    this.onLoadDay();//每日仙拍
    this.onOrderDay();//加载晒单
    this.onLoadfindList();//加载仙贝说
    this.loadDapai();// 加载大牌
    let custId = options.sourceCustId
    let inviteId = options.inviteId
    if (custId != null) {
      this.invitedFunc([inviteId, custId])
    }
  },
  //加载疯狂来袭和周三大牌
  onLoadHot: function () {
    let obj = this;
    let date = new Date();
    let today = date.getDay();
    switch (today) {
      case 0:
        obj.setData({
          currentDay: '日'
        })
        break;
      case 1:
        obj.setData({
          currentDay: '一'
        })
        break;
      case 2:
        obj.setData({
          currentDay: '二'
        })
        break;
      case 3:
        obj.setData({
          currentDay: '三'
        })
        break;
      case 4:
        obj.setData({
          currentDay: '四'
        })
        break;
      case 5:
        obj.setData({
          currentDay: '五'
        })
        break;
      case 6:
        obj.setData({
          currentDay: '六'
        })
        break;
    }
    wx.request({
      url: loadUrl + '/api/business/getMaxGroupBuy',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // let datas = [];
        // for (let value in res.data.result) {
        //   datas.push(res.data.result[value])
        // }
        if (!res.data.status) {
          res.data.result.product.total = res.data.result.total;
          obj.setData({
            Hots: res.data.result
          })
        }
      }
    })
    wx.request({
      url: loadUrl + '/api/business/getTodayMaxGroupBuy',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (!res.data.status) {
          if (res.data.result.total) {
            res.data.result.product.total = res.data.result.total;
          }
          obj.setData({
            dapai: res.data.result
          })
        }
      }
    })
  },
  //加载先辈说
  onLoadfindList: function () {
    let obj = this;
    wx.request({
      url: loadUrl + '/api/article/findList',
      data: { pageNum: 1, pageSize: 10 },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.data.items)
        // let datas = [];
        // for (let value in res.data.result) {
        //   datas.push(res.data.result[value])
        // }
        obj.setData({
          findList: res.data.data.items
        })
      }
    })
  },
  onOrderDay: function () {
    let obj = this;
    wx.request({
      url: loadUrl + '/api/order/getCommentListByDate',
      data: { pageNum: 1, pageSize: 10 },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        // let datas = [];
        // for (let value in res.data.result) {
        //   datas.push(res.data.result[value])
        // }
        obj.setData({
          ByOrder: res.data.data.items
        })
      }
    })
  },
  //每日仙拍
  onClickDay: function (e) {
    console.log(e);
    let time = e.currentTarget.dataset.time;
    this.setData({
      selectDate: time
    });
    this.onLoadDayData();
  },
  onLoadDay: function () {
    let obj = this;
    wx.request({
      url: loadUrl + '/api/business/getTodayAucTimes',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        obj.setData({
          dayTime: res.data.result,
          selectDate: res.data.result[0]
        });
        obj.onLoadDayData();
      }
    })

  },
  onLoadDayData: function () {
    let obj = this;
    wx.request({
      url: loadUrl + '/api/business/getTodayListAucOnLine',
      data: { timeStr: obj.data.selectDate },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        let data = res.data.result;
        let imgs = data.map(item => {
          let detail = item.details;
          let len = detail.length;
          let lastThree = [];
          if (len > 3) {
            lastThree = detail.slice(len - 3);
          }
          item.imgDetails = lastThree;
        })
        obj.setData({
          dayData: data
        })
      }
    })
  },
  // 设置提醒
  noticeAuction: function (e) {
    let query = e.currentTarget.dataset;
    wx.request({
      url: loadUrl + '/api/notice/addNotice',
      data: { custId: app.globalData.result.custId, auctionId: query.auctionid },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.success) {
          wx.showToast({
            title: '设置成功',
            icon: 'succes',
            duration: 3000,
            mask: true
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else {
                console.log('用户点击取消')
              }

            }
          })
        }
      }
    })
  },
  //加载已有的鲜贝数
  onLoadNumber: function () {
    let obj = this;
    setTimeout(function () {
      wx.request({
        url: loadUrl + '/api/customer/xianbei',
        data: { custId: app.globalData.result.custId },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          obj.setData({
            integralNumber: res.data.result.xuanBeiSum
          })
        }
      })
    }, 3000);
  },
  // 跳转到所有分类
  allTypeFunc: function (e) {
    wx.navigateTo({
      url: '/pages/types/types',
    })
  },
  goodsType: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/types/goodsType/index?id=' + id,
    })
  },
  changeProperty: function (e) {
    var propertyName = e.currentTarget.dataset.propertyName
    var newData = {}
    newData[propertyName] = e.detail.value
    this.setData(newData)
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  loadTypes() { //获取分类
    let obj = this;
    wx.request({
      url: loadUrl + '/api/classify/findClassifyParent', //仅为示例，并非真实的接口地址
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        obj.setData({
          types: res.data.data
        })
      }
    })
  },
  // 加载大牌
  loadDapai: function () {
    let obj=this
    wx.request({
      url: loadUrl + '/api/classify/getFineAll',
      data: { pageNum: 1, pageSize: 20 },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        obj.setData({
          jxdapai: res.data.data.items
        })
      }
    })
  },
  // 跳转到我的仙贝
  myxbTapedFunc: function () {
    wx.navigateTo({
      url: '/pages/me/myxb/myxb'
    })
  },
  invitedFunc: function (es) {
    wx.request({
      url: loadUrl + '/api/invitation/give',
      data: {
        invitationId: es[0],
        sourceId: es[1],
        targetId: app.globalData.result.custId
      },
      method: 'POST',
      success(res) {
        console.log(res.data)
      }
    })
  },
  onReady: function () {
    var attentionAnim = wx.createAnimation({
      duration: 50,
      timingFunction: 'ease',
      delay: 0
    })
    let width = 0
    //设置循环动画
    this.attentionAnim = attentionAnim
    var next = true;
    setInterval(function () {
      width++
      this.attentionAnim.width(width + '%').step()
      if (width >= 100) {
        width = 0
      }
      this.setData({
        //导出动画到指定控件animation属性
        attentionAnim: attentionAnim.export()
      })
    }.bind(this), 50)
  },
  //跳转方法
  jump: function (e) {
    console.log(e)
    let objs = e.currentTarget.dataset;
    console.log(objs)
    let parameters = '';
    let url = ''
    for (let value in objs) {
      if (value != 'url') {
        if (parameters == '') {
          parameters += '?' + value + '=' + objs[value]
        } else {
          parameters += '&' + value + '=' + objs[value]
        }
      } else {
        url = objs[value]
      }
    }
    //let url = e.currentTarget.dataset.url;
    //let id = e.currentTarget.dataset.id;
    console.log(url + parameters)
    wx.navigateTo({
      url: url + parameters
    })
  }
})