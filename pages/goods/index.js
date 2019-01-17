let app = getApp(); //引入app对象
let loadUrl = app.globalData.loadUrl;

function countdown(that) {
  var EndTime = that.data.end_time || [];
  var NowTime = new Date().getTime();
  var total_micro_second = EndTime - NowTime || []; //单位毫秒
  if (total_micro_second < 0) {
    console.log('时间初始化小于0，活动已结束状态');
    //total_micro_second = 1; //单位毫秒 ------  WHY？
  }
  console.log('剩余时间：' + total_micro_second);
  // 渲染倒计时时钟
  that.setData({
    clock: dateformat(total_micro_second) //若已结束，此处输出‘0天0小时0分钟0秒‘
  });
  if (total_micro_second <= 0) {
    that.setData({
      clock: "已经截止"
    });
    return;
  }
  setTimeout(function () {
    total_micro_second -= 1000;
    if (!that.data.overTime) {
      countdown(that);
    }
  }, 1000)
}

// 时间格式化输出，如11天03小时25分钟19秒  每1s都会调用一次
function dateformat(micro_second) {
  // 总秒数
  var second = Math.floor(micro_second / 1000);
  // 天数
  var day = Math.floor(second / 3600 / 24);
  // 小时
  var hr = Math.floor(second / 3600 % 24);
  // 分钟
  var min = Math.floor(second / 60 % 60);
  // 秒
  var sec = Math.floor(second % 60);
  return ((day < 10) ? '0' + day : day) + " " + ((hr < 10) ? '0' + hr : hr) + ":" + ((min < 10) ? '0' + min : min) + ":" + ((sec < 10) ? '0' + sec : sec);
}

Page({
  data: {
    attentionAnim: 0,//动画参数
    parameter: {},
    overTime: false,
    Goods: {},
    // 闪拍信息
    auction: {},
    //团购信息
    groupBuy: {},
    //商品信息
    product: {},
    //统计信息
    task: {},
    clock: '',
    end_time: '',
    wallet: {},
    // 评论列表
    commentList: [],
    yaoQin: {
      friendNum: 0,
      sendConchNum: 0
    },
    goodsData: [],
    noGoodsTips: {},
    auctionsData: []
  },
  onLoad(options) { //页面加载时运行
    this.parameter = options;
    this.loadData(this.parameter)
  },
  loadData(options) {
    let custId = options.sourceCustId
    if (custId != null) {
      this.invitedFunc(custId)
    }
    this.loadGoods(options); //获取商品类型
  },
  // 邀请回调
  invitedFunc: function (custId) {
    wx.request({
      url: loadUrl + '/api/share/invitationAuctionConch',
      data: {
        targetCustId: app.globalData.result.custId,
        sendConchId: app.globalData.result.custId
      },
      method: 'POST',
      success(res) {
        this.loadYaoqin()
      }
    })
  },
  onUnload: function () { //如果页面被卸载时被执行
    this.setData({
      overTime: true,
    })
  },
  loadGoods: function (options) {
    console.log(options)
    let obj = this;
    let url = '';
    let datas = {
      custId: app.globalData.result.custId
    };
    //产品跳转
    if (options.id) {
      url = '/api/business/getActivityInfoByProductId'
      datas.productId = options.id;
    }
    //团购
    if (options.gbid) {
      url = '/api/business/getActivityInfoByGroupBuyId'
      datas.groupId = options.gbid;
    }
    //
    if (options.batchno) {
      url = '/api/business/getActivityInfoByBatchNo'
      datas.batchNo = options.batchno;
    }
    console.log(options)

    wx.request({
      url: loadUrl + url,
      data: datas,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        let datas = res.data.result;
        obj.setData({
          goodsData: datas,
          noGoodsTips: res.data.message
        })
        if (datas) {
          obj.setData({
            auction: datas.auction,
            groupBuy: datas.groupBuy,
            product: datas.product,
            task: datas.task,
            end_time: datas.auction.endDate,
            wallet: datas.wallet
            //end_time: '1543659001000'
          });
          // 反转数组
          if (datas.auction.details) {
            let auction = datas.auction.details.reverse();
            let details = [];
            for (let index in auction) {
              if (index < 3) {
                details.push(auction[index]);
              }
            }
            obj.setData({
              auctionsData: details
            });
          }
          
          countdown(obj);
          obj.loadComments();
          obj.loadYaoqin();
        }
      }
    })
  },
  // 收藏
  collection: function (e) {
    console.log(this.data.product.productId)
    wx.request({
      url: loadUrl + '/api/customer/addFav',
      data: {
        custId: app.globalData.result.custId,
        productId: this.data.product.productId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.showToast({
          title: '收藏成功！',
          icon: 'succes',
          duration: 3000,
          mask: true
        })
      }
    })
  },
  // 购买
  buy: function (e) {
    let obj = this;
    let query = e.currentTarget.dataset;
    // 团购购买
    if (query.type == "groupBuy" && !this.data.groupBuy.end) {
      wx.showModal({
        title: '提示',
        content: '是否团购此商品？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: loadUrl + '/api/business/addGroupBuy',
              data: {
                custId: app.globalData.result.custId,
                groupBuyId: obj.data.groupBuy.gbId
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
                if (res.data.result) {
                  wx.navigateTo({
                    url: '/pages/me/orders/payOrder/confirmOrder?orderid=' + res.data.result
                  })
                } else {
                  wx.showModal({
                    title: '提示',
                    content: '你没有设置地址或者默认地址,无法购买,是否转到添加地址？',
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '/pages/me/address/address'
                        })
                      } else {
                        console.log('用户点击取消')
                      }

                    }
                  })
                }
              }
            })
          } else {
            console.log('用户点击取消')
          }
        }
      })
    }
    // 闪拍购买
    if (query.type == "auction" && !this.data.auction.end) {
      wx.request({
        url: loadUrl + '/api/business/joinAuction',
        data: {
          custId: app.globalData.result.custId,
          auctionId: this.data.auction.auctionId
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          let item = res.data.result;

          if (!item.checkFlag && item.bindTicket) {
            // 跳转绑定卡券
            let auctionId = obj.data.auction.auctionId;
            wx.navigateTo({
              url: '/pages/me/xbq/xbq' + '?isSelected=true&auctionId=' + auctionId + '&id=' + obj.data.product.productId
            })
          } else if (!item.checkFlag && !item.bindTicket) { // 跳转分享
            wx.navigateTo({
              url: '/pages/me/myxb/myxb',
            })
          } else {
            obj.loadData(obj.parameter);
            wx.showToast({
              title: '仙拍成功！',
              icon: 'succes',
              duration: 3000,
              mask: true
            })
          }
        }
      })
    }
    console.log(query)
  },
  // 获取当前商品得邀请信息
  loadYaoqin() {
    if (this.data.auction.auctionId) {
      wx.request({
        url: loadUrl + '/api/share/invitationAuctionInfo',
        data: {
          auctionId: this.data.auction.auctionId,
          custId: 1,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {

          // obj.setData({
          //   commentList: datas,
          // })
        }
      })
    }
  },
  // 图片预览
  previewImg: function (e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var indexs = e.currentTarget.dataset.indexs;
    let imgArrs = this.data.commentList.items[index].commentImg
    var imgArr = new Array()
    imgArrs.find(item => {
      imgArr.push(item.fileUrl)
    })
    console.log(imgArr)
    wx.previewImage({
      current: imgArr[indexs], //当前图片地址
      urls: imgArr, //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 加载评论列表
  loadComments: function () {
    let obj = this;
    wx.request({
      url: loadUrl + '/api/order/getCommentList',
      data: {
        productId: this.data.product.productId,
        pageNum: 1,
        pageSize: 10
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        let datas = res.data.data
        for (let i = 0; i < datas.items.length; i++) {
          datas.items[i].createTimes = obj.toDate(datas.items[i].createTime)
        }
        obj.setData({
          commentList: datas,
        })
      }
    })
  },
  // 时间惙转换
  toDate(number) {
    var n = number;
    var date = new Date(n);
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)
  },
  onShareTuangou: function (ops) {
    let canshu = "?"
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    canshu += "&sourceCustId =" + app.globalData.result.custId;
    return {
      title: '朋友帮个忙我很喜欢这个，' + this.data.product.productName,
      imageUrl: this.data.product.mainUrl,//图片地址
      path: '/pages/goods/index' + canshu,// 用户点击首先进入的当前页面
      success: function (res) {
        wx.request({
          url: loadUrl + '/api/share/invitationAuctionConchBegin',
          data: {
            sourceCustId: app.globalData.result.custId,
            auctionId: this.data.auction.auctionId,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            let datas = res.data.data
            for (let i = 0; i < datas.items.length; i++) {
              datas.items[i].createTimes = obj.toDate(datas.items[i].createTime)
            }
            obj.setData({
              commentList: datas,
            })
          }
        })
        // 转发成功
        console.log("转发成功:", res);
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:", res);
      }
    }
  },
  //邀请给好友
  onShareAppMessage: function (ops) {
    let canshu = "?"
    //产品跳转
    if (this.data.parameter.id) {
      canshu += 'id=' + this.data.parameter.id
    }
    //团购
    if (this.data.parameter.gbid) {
      canshu += 'gbid=' + this.data.parameter.gbid
    }
    //
    if (this.data.parameter.batchno) {
      canshu += 'batchno=' + this.data.parameter.batchno
    }
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    canshu += "&sourceCustId =" + app.globalData.result.custId;
    return {
      title: '朋友帮个忙我很喜欢这个，' + this.data.product.productName,
      imageUrl: this.data.product.mainUrl,//图片地址
      path: '/pages/goods/index' + canshu,// 用户点击首先进入的当前页面
      success: function (res) {
        wx.request({
          url: loadUrl + '/api/share/invitationAuctionConchBegin',
          data: {
            sourceCustId: app.globalData.result.custId,
            auctionId: this.data.auction.auctionId,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            let datas = res.data.data
            for (let i = 0; i < datas.items.length; i++) {
              datas.items[i].createTimes = obj.toDate(datas.items[i].createTime)
            }
            obj.setData({
              commentList: datas,
            })
          }
        })
        // 转发成功
        console.log("转发成功:", res);
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:", res);
      }
    }
  },
  onReady: function () {
    var attentionAnim = wx.createAnimation({
      duration: 150,
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
    }.bind(this), 150)
  },
  backToIndex: function () {
    wx.navigateBack();
  }
})