// miniprogram/pages/addPic/addPage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    pic_name: "",
    fileID: "",
    fileUrl: "",
    picList: [],
  },

  getPicList: function () {
    wx.showLoading({
      title: '',
    })
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('focus-pic').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        this.setData({
          picList: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
        wx.hideLoading()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  changPicName: function (e) {
    this.setData({
      pic_name: e.detail.value
    })
  },

  // 上传图片
  doUpload: function () {
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
        const cloudPath ="picture/"+ Date.parse(new Date()) / 1000 + filePath.match(/\.[^.]+?$/)[0]

        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: (res) => {
            that.setData({
              fileID: res.fileID
            },()=>{
              that.onAdd()
            })
            wx.showToast({
              icon: 'none',
              duration: 1000,
              title: '上传成功',
            })
            console.log('[上传文件] 成功11：', res)
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            // wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },


  onAdd: function () {
    if (this.data.fileID == "") {
      wx.showToast({
        icon: "none",
        title: '请先上传图片',
      })
      return
    }
    const db = wx.cloud.database()
    wx.cloud.getTempFileURL({
      fileList: [{
        fileID: this.data.fileID,
        maxAge: 60 * 60, // one hour
      }]
    }).then(res => {
      db.collection('focus-pic').add({
        data: {
          pic_name: this.data.pic_name,
          pic_url: res.fileList[0].tempFileURL
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          wx.showToast({
            title: '新增图片成功',
          })
          this.getPicList()
          this.setData({
            fileID: "",
            pic_name:""
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增图片失败'
          })
          console.error('新增图片 失败：', err)
        }
      })
    }).catch(error => {
      // handle error
    })
  },

  onDel: function (e) {
    if (e.currentTarget.dataset.id) {
      const db = wx.cloud.database()
      db.collection('focus-pic').doc(e.currentTarget.dataset.id).remove({
        success: res => {
          wx.showToast({
            title: '删除成功',
          })
          this.getPicList()
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '删除失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })
    } else {
      wx.showToast({
        title: '无记录可删，请见创建一个记录',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    this.getPicList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
    this.getPicList()
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