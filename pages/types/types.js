let app = getApp(); //引入app对象
let loadUrl = app.globalData.loadUrl;
Page({
  data: {
    types: []
  },
  onBanner() { //获取banner
  },
  onLoad(options) { //页面加载时运行
    this.loadTypes();
  },
  loadTypes() { //获取分类
    let obj = this;
    wx.request({
      url: loadUrl + '/api/classify/findClassifyParent', //仅为示例，并非真实的接口地址
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        obj.setData({
          types: res.data.data
        })
      }
    })
  }, // 跳转商品分类页
  goodsType: function (e) {
    console.log(e);
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/types/goodsType/index?id='+id,
    })
  },

})