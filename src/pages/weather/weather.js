
//
//获取应用实例
const app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
    data: {
        province: '',
        city: '',
        latitude: '',
        longitude: '',
        adcode:''
    },
    onLoad: function () {
        qqmapsdk = new QQMapWX({
            key: 'OSLBZ-77HKS-EJYOT-6QNZU-PLYWV-NVBEC' //这里自己的key秘钥进行填充
        });
    },
    onShow: function () {
        let that = this;
        that.getUserLocation();
    },
    getUserLocation: function () {
        let that = this;
        wx.getSetting({
            success: (res) => {
                //res.authSetting['scope.userLocation'] == undefined   // 表示 初始化进入该页面
                //res.authSetting['scope.userLocation'] == false   // 表示 非初始化进入该页面,且未授权
                //res.authSetting['scope.userLocation'] == true   // 表示 地理位置授权
                if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
                    wx.showModal({
                        title: '请求授权当前位置',
                        content: '需要获取您的地理位置，请确认授权',
                        success: function (res) {
                            if (res.cancel) {
                                wx.showToast({
                                    title: '拒绝授权',
                                    icon: 'none',
                                    duration: 1000
                                })
                            } else if (res.confirm) {
                                wx.openSetting({
                                    success: function (dataAu) {
                                        if (dataAu.authSetting["scope.userLocation"] == true) {
                                            wx.showToast({
                                                title: '授权成功',
                                                icon: 'success',
                                                duration: 1000
                                            })
                                            //再次授权，调用wx.getLocation的API
                                            that.getLocation();
                                        } else {
                                            wx.showToast({
                                                title: '授权失败',
                                                icon: 'none',
                                                duration: 1000
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                } else if (res.authSetting['scope.userLocation'] == undefined) {
                    //调用wx.getLocation的API
                    that.getLocation();
                }
                else {
                    //调用wx.getLocation的API
                    that.getLocation();
                }
            }
        })
    },
    // 微信获得经纬度
    getLocation: function () {
        let that = this;
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                var latitude = res.latitude
                var longitude = res.longitude
                var speed = res.speed
                var accuracy = res.accuracy;
                that.getLocal(latitude, longitude)
            },
            fail: function (res) {
            }
        })
    },
    // 获取当前地理位置
    getLocal: function (latitude, longitude, event) {
        let that = this;
        qqmapsdk.reverseGeocoder({
            location: {
                latitude: latitude,
                longitude: longitude
            },
            success: function (res) {
                let nation = res.result.ad_info.nation
                let province = res.result.ad_info.province
                let city = res.result.ad_info.city
                let adcode = res.result.ad_info.adcode
                that.setData({
                    nation: nation,
                    province: province,
                    city: city,
                    latitude: latitude,
                    longitude: longitude,
                    adcode: adcode
                })
              that.weatherdata(adcode);
                return
            },
            fail: function (res) {},
            complete: function (res) {}
        });
        
  },
  weatherdata: function (adcode) {
    var zs = [
      "舒适度指数",
      "穿衣指数",
      "感冒指数",
      "运动指数",
      "旅游指数",
      "紫外线指数",
      "洗车指数",
      "空气污染扩散条件指数"]
    var that = this;
    var key = "f6a29ba3695e439f82644d232feeb0fd";
    var location = adcode;
    var url = "https://free-api.heweather.net/s6/weather/";
    wx.request({
      url: url + 'now?key=' + key + '&location=' + location,
      data: {},
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          fl: res.data.HeWeather6[0].now.fl,
          tmp: res.data.HeWeather6[0].now.tmp,
          cond_code: res.data.HeWeather6[0].now.cond_code,
          cond_txt: res.data.HeWeather6[0].now.cond_txt,
          wind_deg: res.data.HeWeather6[0].now.wind_deg,
          wind_dir: res.data.HeWeather6[0].now.wind_dir,
          wind_sc: res.data.HeWeather6[0].now.wind_sc,
          wind_spd: res.data.HeWeather6[0].now.wind_spd,
          hum: res.data.HeWeather6[0].now.hum,
          pcpn: res.data.HeWeather6[0].now.pcpn,
          pres: res.data.HeWeather6[0].now.pres,
          vis: res.data.HeWeather6[0].now.vis,
          cloud: res.data.HeWeather6[0].now.cloud,
        })
      }
    })
    wx.request({
      url: url + 'lifestyle?key=' + key + '&location=' + location,
      data: {},
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        for (var i = 0; i < res.data.HeWeather6[0].lifestyle.length; i++) {
          res.data.HeWeather6[0].lifestyle[i].align = zs[i];
        }
        that.setData({
          list: res.data.HeWeather6[0].lifestyle,
        })
      }
    })
  }
})