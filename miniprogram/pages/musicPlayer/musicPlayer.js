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
    duration: "0:00",
    currentTime: "0:00",
    rotateDeg: 0,
    nowTime: 0,
    playMode: 0, //0:顺序播放,1:随机播放,2：单曲循环
  },

  changePlayMode: function () {
    let playMode = this.data.playMode
    switch (playMode) {
      case 0:
        playMode = 1;
        break;
      case 1:
        playMode = 2;
        break;
      case 2:
        playMode = 0;
        break;
    }
    this.setData({
      playMode
    })
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

  getTimeShow: function (time) {
    var sec = parseInt(time / 1000);
    var min = parseInt(sec / 60);
    sec = sec - min * 60;
    var ret = min + ":";
    if (sec < 10) {
      ret += "0";
    }
    ret += sec;
    return ret;
  },

  sliderChange: function (e) {
    console.log('slider1chang', e);
    myaudio.seek(e.detail.value)
    this.setData({
      nowTime: e.detail.value
    })
  },

  playByIndex: function name(e) {
    let currentIndex = e.currentTarget.dataset.index
    this.playMusic(currentIndex)
  },

  playMusic: function (currentIndex) {
    this.animation = wx.createAnimation({
      duration: 10
    })
    this.animation.rotate(0).step()
    this.setData({
      animation: this.animation.export(),
      showModal: false
    })
    setTimeout(() => {
      if (myaudio.src) {
        myaudio.stop()
      }
      let {
        musicList,
      } = this.data
      let currentMusic = musicList[currentIndex]
      myaudio.src = musicList[currentIndex].musicUrl
      this.animation = wx.createAnimation({
        duration: 300000
      })
      this.animation.rotate(2150).step()
      if (myaudio.src) {
        myaudio.play()
        this.setData({
          animation: this.animation.export(),
        })
      }
      this.setData({
        currentMusic,
        currentIndex,
        isPlay: true
      })
    }, 200)
  },

  prev: function (e) {
    this.playPrev(e.currentTarget.dataset.index)
  },

  playPrev: function (prevIndex) {
    this.animation = wx.createAnimation({
      duration: 10
    })
    this.animation.rotate(0).step()
    // this.data.animation = this.animation.export()
    this.setData({
      animation: this.animation.export(),
      duration: this.getTimeShow(myaudio.duration * 1000),
    })
    setTimeout(() => {
      if (myaudio.src) {
        myaudio.stop()
      }
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
        duration: 300000
      })
      this.animation.rotate(2150).step()
      if (myaudio.src) {
        myaudio.play()
        this.setData({
          animation: this.animation.export(),
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
        duration: 10
      })
      this.animation.rotate(0).step()
      this.setData({
        animation: this.animation.export(),
      })
    } else {
      myaudio.play();
      this.animation = wx.createAnimation({
        duration: 300000
      })
      this.animation.rotate(2150).step()
      this.setData({
        animation: this.animation.export()
      })
    }
    this.setData({
      isPlay: !this.data.isPlay,
      duration: this.getTimeShow(myaudio.duration * 1000),
    })
  },

  next: function (e) {
    this.playNext(e.currentTarget.dataset.index)
  },

  playNext: function (prevIndex) {
    this.animation = wx.createAnimation({
      duration: 10
    })
    this.animation.rotate(0).step()
    // this.data.animation = this.animation.export()
    this.setData({
      animation: this.animation.export(),
      duration: this.getTimeShow(myaudio.duration * 1000),
    })
    setTimeout(() => {
      if (myaudio.src) {
        myaudio.stop()
      }
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
        duration: 300000
      })
      this.animation.rotate(2150).step()
      if (myaudio.src) {
        myaudio.play()
        this.setData({
          animation: this.animation.export(),
        })
      }
      this.setData({
        currentMusic,
        currentIndex,
        isPlay: true
      })
    }, 200)

  },

  getSongList: function () {
    this.setData({
      showModal: true
    })
  },

  hideModal: function () {
    this.setData({
      showModal: false
    })
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
    //旋转动画
    that.animation = wx.createAnimation({
      duration: 300000,
    })

    myaudio.onCanplay(() => {
      // 必须。可以当做是初始化时长
      myaudio.duration;
      // 必须。不然也获取不到时长
      setTimeout(() => {
        console.log('myaudio.currentTime', myaudio.currentTime, myaudio.duration);
        that.setData({
          duration: this.getTimeShow(myaudio.duration * 1000 || 0),
          totalTime: myaudio.duration,
        })
      }, 1000)
    })

    // 播放更新
    myaudio.onTimeUpdate(() => {
      this.setData({
        currentTime: this.getTimeShow(myaudio.currentTime * 1000),
        nowTime: myaudio.currentTime
      })
    })

    //播放结束
    myaudio.onEnded(() => {
      // playMode:0,//0:顺序播放,1:随机播放,2：单曲循环
      let {
        currentIndex,
        musicList,
        playMode
      } = that.data
      
      that.setData({
        isPlay: false,
        nowTime:0
      },()=>{
        if (playMode == 0) {
          if (currentIndex == musicList.length - 1) {
            that.playMusic(0)
          } else {
            that.playNext(that.data.currentIndex)
          }
        } else if (playMode == 1) {
          let index = Math.floor(Math.random() * (musicList.length - 1))
          that.playMusic(index)
        } else {
          that.playMusic(currentIndex)
        }
      })
     
    })

    //进度条拖动结束
    myaudio.onSeeked(() => {
      myaudio.play();
      this.animation = wx.createAnimation({
        duration: 300000
      })
      this.animation.rotate(2150).step()
      this.setData({
        isPlay: true,
        animation: this.animation.export()
      })
    })

    myaudio.onPlay(() => {

    })

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