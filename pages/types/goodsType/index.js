let app = getApp(); //引入app对象
let loadUrl = app.globalData.loadUrl;
Page({
  data: {
    types: [],
    id: "",
    activeId: "",
    goods: [], //商品列表
  },
  onBanner() { //获取banner
  },
  onLoad(options) { //页面加载时运行
    console.log(options);
    this.id = options.id;
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
        let datas = res.data.data;
        for (let i = 0; i < datas.length; i++) {
          if (obj.id == datas[i].classifyId) {
            console.log(datas[i].classify);
            wx.setNavigationBarTitle({
              title: datas[i].classifyName,
            })
            //如果数据存在则加载数据
            if (datas[i].classify[0]) {
              obj.loadGoods(datas[i].classify[0].pid);
            }
            obj.setData({
              types: datas[i].classify
            })
          }
        }
      }
    })
  },
  //分类点击事件
  clickLoadGoods(e) {
    this.loadGoods(e.currentTarget.dataset.id);
  },
  // 加载商品
  loadGoods: function (id) {
    console.log(id);
    let obj = this;
    wx.request({
      url: loadUrl + '/api/classify/findProductList',
      data: { classifyId: id, pageNum: 1, pageSize: 10 },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        obj.setData({
          goods: res.data.data.items
        })
      }
    })
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