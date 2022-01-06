import request from "@/utils/request";

// 获今日统计分析
export function getTodayDsCount() {
    return request({
        url: "getTodayDsCount",
        method: "get",
    });
}
export function getDayDsCount() {
    return request({
        url: "getDayDsCount",
        method: "get",

    });
}
export function getYearDsCount() {
    return request({
        url: "getYearDsCount",
        method: "get",
    });
}
// 折线统计图
export function getDayDsZxCount() {
    return request({
        url: "getDayDsZxCount",
        method: "get",
    });
}