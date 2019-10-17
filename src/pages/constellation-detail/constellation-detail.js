Page({
    data: {
        name: '',
        showapi_appid: '',
        showapi_sign: ''
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        var name = options.name;
        this.setData({ name: name });
        this.loadData(name, "today");
        this.loadData(name, "year");
    },
    loadData: function (name, type) {
        var that = this;
        var showapi_appid = "53565";
        var showapi_sign = "4aa1d2d5d5c1461b935e32424bb686ce";
        var url = "https://route.showapi.com/872-1";
        wx.request({
            url: url,
            header: {// 设置请求的 header
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                "showapi_appid": '53565',
                "showapi_sign": '4aa1d2d5d5c1461b935e32424bb686ce',
                "needTomorrow": "0",
                "needWeek": "0",
                "needMonth": "0",
                "needYear": "0",
                star: name
            },
            method: 'POST',
            success: function (res) {// success  
                that.setData({
                    name: res.data.showapi_res_body.star,
                    summary_star: res.data.showapi_res_body.day.summary_star,
                    love_star: res.data.showapi_res_body.day.love_star,
                    money_star: res.data.showapi_res_body.day.money_star,
                    work_star: res.data.showapi_res_body.day.work_star,
                    grxz: res.data.showapi_res_body.day.grxz,
                    lucky_num: res.data.showapi_res_body.day.lucky_num,
                    lucky_time: res.data.showapi_res_body.day.lucky_time,
                    lucky_direction: res.data.showapi_res_body.day.lucky_direction,
                    day_notice: res.data.showapi_res_body.day.day_notice,
                    general_txt: res.data.showapi_res_body.day.general_txt,
                    love_txt: res.data.showapi_res_body.day.love_txt,
                    work_txt: res.data.showapi_res_body.day.work_txt,
                    money_txt: res.data.showapi_res_body.day.money_txt,
                    time: res.data.showapi_res_body.day.time,
                    lucky_color: res.data.showapi_res_body.day.lucky_color,
                })
            },
            fail() {
                
            }
        })
    }
    // ,
    // goBack: function () {
    //     wx.navigateBack({
    //         delta: 1 // 回退前 delta(默认为1) 页面
    //     })
    // }
})