// miniprogram/pages/addMusic/addMusic.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicUrl:"",
    imgUrl:"",
    musicName:"",
    singerName:"",
  },

  changMusicName: function (e) {
    this.setData({
      musicName: e.detail.value
    })
  },
  changSingerName: function (e) {
    this.setData({
      singerName: e.detail.value
    })
  },
  // 上传图片
  addMusic: function () {
    let that = this
    // 选择图片
    wx.chooseMessageFile({
      count: 1,
      type:"file",
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFiles[0].path
        // // 上传图片
        const cloudPath = "music/" + Date.parse(new Date()) / 1000 + filePath.match(/\.[^.]+?$/)[0]

        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: (res) => {
            wx.cloud.getTempFileURL({
              fileList: [{
                fileID: res.fileID,
                maxAge: 365 * 24 * 60 * 60, // one hour
              }]
            }).then(res1 => {
              that.setData({
                musicUrl: res1.fileList[0].tempFileURL
              })
            })
            wx.showToast({
              icon: 'none',
              duration: 1000,
              title: '上传成功',
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  addCoverImg: function () {
    let that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        // 上传图片
        const cloudPath = "coverImg/" + Date.parse(new Date()) / 1000 + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: (res) => {
            console.log('addCoverImg',res);
            
            wx.showToast({
              icon: 'none',
              duration: 1000,
              title: '上传成功',
            })
            wx.cloud.getTempFileURL({
              fileList: [{
                fileID: res.fileID,
                maxAge: 365 * 24 * 60 * 60, // one hour
              }]
            }).then(res1 => {
              that.setData({
                imgUrl: res1.fileList[0].tempFileURL
              })
            })
          },
          fail: e => {
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  // getTempFileURL:function(fileID){
  //   wx.cloud.getTempFileURL({
  //     fileList: [{
  //       fileID: fileID,
  //       maxAge: 365 * 24 * 60 * 60, // one hour
  //     }]
  //   }).then(res => {
  //     fileUrl=res.fileList[0].tempFileURL
  //   })
  //   if(fileUrl){
  //     return fileUrl
  //   }
  // },

  onSave: function () {
    let {imgUrl,musicUrl,musicName,singerName} = this.data
    if(!imgUrl||!musicUrl){
      wx.showToast({
        title: '封面图片或歌曲未上传',
        icon:"none",
      })
      return
    }
    const db = wx.cloud.database()
    db.collection('music').add({
      data: {
        imgUrl: imgUrl,
        musicUrl: musicUrl,
        musicName:musicName,
        singerName:singerName
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '歌曲添加成功',
        })
        this.setData({
          imgUrl:"",
          musicUrl: "",
          musicName:"",
          singerName:"",
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '歌曲添加失败'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})