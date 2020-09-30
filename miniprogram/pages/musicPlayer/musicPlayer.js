// miniprogram/pages/musicPlayer/musicPlayer.js
const app = getApp()
const myaudio = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicList: [],
    currentMusic: {},
    currentIndex: 0,
    isPlay: false,
    duration: 0,
    currentTime: 0,
    rotateDeg: 0
  },

  getMusicList: function () {
    wx.showLoading({
      title: '',
    })
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('music').get({
      success: res => {
        this.setData({
          musicList: res.data,
          currentMusic: res.data[0],
          currentIndex: 0
        })
        myaudio.src = res.data[0].musicUrl
        if (myaudio.src) {
          this.setData({
            duration: myaudio.duration
          })
        }
        wx.hideLoading()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '获取失败'
        })
      }
    })
  },

  formatDuring: function (mss) {
    second = Math.ceil(mss);
    var minute = 0;
    var hour = 0;
    if (second > 0) {
      minute = parseInt(second / 60);
      second = parseInt(second % 60);
      if (minute > 60) {
        hour = parseInt(minute / 60);
        minute = parseInt(minute % 60);
      }
    }
    var time = '';
    if (minute == 0) {
      time += "00:" + parseInt(second);
    } else {
      time += parseInt(second);
    }
    if (minute != 0) {
      if (minute > 9) {
        if (time == 0) {
          time = parseInt(minute) + ":" + time + '0';
        } else {
          time = parseInt(minute) + ":" + time;
        }
      } else {
        time = "0" + parseInt(minute) + ":" + time;
      }
    }
    if (hour > 0) {
      time = parseInt(hour) + ":" + time;
    }
    return time;
  },

  playPrev: function (e) {
    this.animation = wx.createAnimation({
      duration: 100
    })
    this.animation.rotate(0).step()
    // this.data.animation = this.animation.export()
    this.setData({
      animation: this.animation.export()
    })
    setTimeout(() => {
      if (myaudio.src) {
        myaudio.stop()
      }
      let prevIndex = e.currentTarget.dataset.index
      let {
        musicList,
        currentIndex,
        currentMusic
      } = this.data
      if (prevIndex == 0) {
        this.setData({
          isPlay: false
        })
        wx.showToast({
          title: '这是第一首哦',
          icon: "none"
        })
        return
      }
      currentIndex -= 1
      currentMusic = musicList[currentIndex]
      myaudio.src = musicList[currentIndex].musicUrl
      this.animation = wx.createAnimation({
        duration: 50400
      })
      this.animation.rotate(360).step()
      if (myaudio.src) {
        myaudio.play()
        this.setData({
          animation: this.animation.export(),
          duration: myaudio.duration
        })
      }
      this.setData({
        currentMusic,
        currentIndex,
        isPlay: true
      })
    }, 200)
  },

  togglePlay: function () {

    if (this.data.isPlay) {
      myaudio.pause();
      this.animation = wx.createAnimation({
        duration: 1000
      })
      this.animation.rotate(0).step()
      this.setData({
        animation: this.animation.export()
      })
    } else {
      myaudio.play();
      this.animation = wx.createAnimation({
        duration: 50400
      })
      this.animation.rotate(360).step()
      this.setData({
        animation: this.animation.export()
      })
    }
    this.setData({
      isPlay: !this.data.isPlay
    })
  },

  playNext: function (e) {
    this.animation = wx.createAnimation({
      duration: 100
    })
    this.animation.rotate(0).step()
    // this.data.animation = this.animation.export()
    this.setData({
      animation: this.animation.export()
    })
    setTimeout(() => {
      if (myaudio.src) {
        myaudio.stop()
      }
      let prevIndex = e.currentTarget.dataset.index
      let {
        musicList,
        currentIndex,
        currentMusic
      } = this.data

      if (prevIndex == musicList.length - 1) {
        this.setData({
          isPlay: false
        })
        wx.showToast({
          title: '已经是最后一首啦',
          icon: "none"
        })
        return
      }
      currentIndex += 1
      currentMusic = musicList[currentIndex]
      myaudio.src = musicList[currentIndex].musicUrl
      this.animation = wx.createAnimation({
        duration: 50400
      })
      this.animation.rotate(360).step()
      if (myaudio.src) {
        myaudio.play()
        this.setData({
          animation: this.animation.export(),
          duration: myaudio.duration
        })
      }
      this.setData({
        currentMusic,
        currentIndex,
        isPlay: true
      })
    }, 200)

  },
  startAnimation:function(){
    console.log('startAnimation');
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMusicList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    myaudio.onCanplay(() => {
      // 必须。可以当做是初始化时长
      myaudio.duration;
      // 必须。不然也获取不到时长
      setTimeout(() => {
        console.log('myaudio.currentTime', myaudio.currentTime, myaudio.duration);
        that.setData({
          duration: myaudio.duration,
          currentTime: myaudio.currentTime
        })
      }, 1000)
    })

    // onStop
    that.animation = wx.createAnimation({ duration: 50400,})

    // let deg = 0
    // that.interval = setInterval(() => {
    //   deg = deg + 1
    // }, 139);
    
    // myaudio.onPlay(() => {
    //         if (deg == 360) {
    //     deg = 0
    //   }
    //   if (deg == 0) {
    //     that.interval()
    //     that.animation.rotate(360).step()
    //     that.setData({
    //       animation: that.animation.export(),
    //     })
    //   }
    // })

    // myaudio.onPause(() => {
    //   deg = 0
    //   console.log('myaudio.onPause');
    // })

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