// miniprogram/pages/photography/photography.js
const app = getApp()
const QQMapWX = require('../../utils/qqmap-wx-jssdk.js')
// const CameraContext = wx.createCameraContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      },
      fail: (res) => {

      },
      complete: (res) => {

      },
    })
  },
  // startTakePhoto:function name(params) {
  //   this.CameraFrameListener.start()
  // },
  // stopTakePhoto:function name(params) {
  //   this.CameraFrameListener.stop()
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  getAddress(latitude, longitude) {
    // 生成 QQMapWX 实例
    let qqmapsdk = new QQMapWX({
      key: 'NM2BZ-Z2D3V-YADPC-UV4VF-XSOEZ-C3FB4'
    })
console.log('getAddress',latitude, longitude);

    // reverseGeocoder 为 QQMapWX 解析 经纬度的方法
    qqmapsdk.reverseGeocoder({
      location: {
        latitude,
        longitude
      },
      success(res) {
        console.log('success', res)
        // this.setData({
        //   // ad_info: res.result.ad_info
        //   // city： res.result.ad_info
        // })
      },
      fail:(res)=>{
        console.log('res',res);
        
      }
    })
  },
  onReady: function () {
    wx.getLocation({
      isHighAccuracy: "true",
      success: (res) => {
        console.log('getLocation', res);
        this.getAddress(res.latitude, res.longitude)

      }
    })
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

  }
})