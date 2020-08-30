//是否手机
export function isPhone(phone) {
    let myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
    if (!myreg.test(phone)) {
        return false;
    } else {
        return true;
    }
}

// 32位随机数
export function getuuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 32; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    // s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

// 获取日期格式XXXX-XX-XX 00:00:00
export function formatTime(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return (
        [year, month, day].map(formatNumber).join("-") +
        " " +
        [hour, minute, second].map(formatNumber).join(":")
    );
}

export function formatVersion(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return (
        [year, month, day].map(formatNumber).join("") +
        "" +
        [hour, minute, second].map(formatNumber).join("")
    );
}
// 获取年月201811+
export function formatYM(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return [year, month].map(formatNumber).join("") + " "
}

// 获取年月201811
export function formatYMNormal(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return year.toString() + month.toString()
}

// 获取年月当前年月 YYYY-MM
export function formatYMAddNow(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return year.toString() + '-' + month.toString()
}

/*
* 格式化YYYYMM转化为 YYYY-MM
* date： YYYYMM
* */
export function formatYMAdd(date) {
    return date.substr(0, 4) + '-' + date.substr(4)
}

/*
* 取2018-11-30T03:43:54.192Z的年和月
* */
export function formatYYMM(date) {
    return date.substr(0, 7)
}

//日期月和日补0
export function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : "0" + n;
}

export function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}


export function extendCover(small, big) { //单纯big 覆盖small
    var obj = JSON.stringify(small);
    obj = JSON.parse(obj)
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            big[p] ? obj[p] = big[p] : obj[p] = "";
        }
    }
    return obj
}

export function existCover(small, exist) { //如果后面传的变量，他的属性存在，赋值
    var obj = JSON.stringify(small);
    obj = JSON.parse(obj)
    for (var p in exist) {
        if (obj.hasOwnProperty(p) && exist.hasOwnProperty(p))
            obj[p] = exist[p];
    }
    return obj
}

export function extendInit(small) {
    var obj = {};
    for (var p in small) {
        obj[p] = "";
    }
    ;
    return obj
}

export function contrastObj(small, big) { //true代表完全一致
    var bool = true;
    for (var p in small) {
        if (small.hasOwnProperty(p)) {
            if (small[p] != big[p]) {
                bool = false;
                return bool;
            }
        }
    }
    return bool
}

/*
*  弹窗消息提示
*  type : 提示类型alert, success, error, warning, information, confirm， text ：文本
* */
export function DTMessage(type, text) {
    DingTalkPC.device.notification.toast({
        type: type, //toast的类型 alert, success, error, warning, information, confirm
        text: text, //提示信息
        duration: 2, //显示持续时间，单位秒，最短2秒，最长5秒
        delay: 0 //延迟显示，单位秒，默认0, 最大限制为10
    })
}
/*
* 消息提醒
* type: success/warning/info/error text: String
* */
export function EMessage (type, text) {
    this.$message({
        message: text,
        showClose: true,
        type: type,
        center: true,
        duration: 1000
    });
}
/*
*  再次确认弹窗（钉钉）
*  message: 消息说明  title: 标题
* */
export function DTConfirm(message, callBack) {
    DingTalkPC.device.notification.confirm({
        message: message,
        title: '提示',
        buttonLabels: ['确定', '取消'],
        onSuccess: function (result) {
            // result.buttonIndex 为按钮的索引
            callBack(result.buttonIndex)
        },
        onFail: function (err) {
        }
    })
}
/*
*  确认弹窗（element）
*  message: 确认消息， affirmCallBack： 确定回调，cancelCallBack： 取消回调
* */
export function EConfirm (message, affirmCallBack, cancelCallBack) {
    this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        affirmCallBack()
    }).catch(() => {
        // cancelCallBack()
    });
}
/*
* 函数防抖
* */
export function debounce(fn, interval = 300) {
    let timeout = null
    return function () {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            fn.apply(this, arguments)
        }, interval)
    };
}
export function throttle(fn, interval = 1000) {
    let canRun = true;
    return function () {
        if (!canRun) return;
        canRun = false;
        setTimeout(() => {
            fn.apply(this, arguments);
            canRun = true;
        }, interval);
    };
}
/*
* 判断表单是否相等
* */
export function isEquality (oldData, newData) {
    if (oldData == JSON.stringify(newData)) {
        return false
    } else {
        return true
    }

}

/**
 * js浮点数计算
 * */
// 加法运算
export function floatingAdd (numA, numB) {
    let r1 = 0
    let r2 = 0
    let m = 0
    try {
        r1 = numA.toString().split('.')[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = numB.toString().split('.')[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    return m === 0 ? 0 : (numA * m + numB * m) / m
}

export function animate() {
    var isPlus = false, downLinePersent = 1 - 0.1, standPersent = 50, upLinePersent = 1 - 0.2, standardScord = 10;
    //if (isPlus === false) standPersent = 0 - standPersent;
    var upScore = standPersent * upLinePersent, downScore = standPersent * downLinePersent;
    var realScore = 34;
    //if (isPlus === false) realScore = 0 - realScore;
    var result = calcScore1(isPlus, false, 2, standPersent, downScore, upScore, realScore);
    var finalScore = result * standardScord;
    alert(finalScore);
}
                        //相关性    是否业绩  得分系数     基础目标      底线       挑战      实际
export function calcScore1(isPlus, isYeji, scoreType, standPersent, downScore, upScore, realScore) {
    var result = 0;
    //正相关
    if (isPlus) {
        //实际<目标
        if (realScore < standPersent) {
            result = (realScore - downScore) / (standPersent - downScore);
        }
        else if(realScore == standPersent){
            result = 1;
        }
        else if (realScore > standPersent) {
            result = (realScore - standPersent) / (upScore - standPersent);
            if(result > 1 ) result = 1
            result = calcScore2(result, scoreType);
        }
    }
    else {
        //实际<目标
        if (realScore < standPersent) {
            result = (realScore - standPersent) / (upScore - standPersent);
            if(result > 1 ) result = 1
            result = calcScore2(result, scoreType);
        }
        else if (realScore > standPersent) {
            result = (realScore - downScore) / (standPersent - downScore);
        }
        else {
            result = 1;
        }
    }
    result = result < 0 ? 0 : result;
    return result;
}

export function calcScore2(score, scoreType) {
    var result = 0;
    switch (scoreType) {
        case 0:
            result= 1+score
            break;
        case 1:
            result= 1+score*0.5
            break;
        case 2:
            result= 1+score*0.2
            break;
    }
    return result;
}
