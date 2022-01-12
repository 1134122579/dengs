import request from "@/utils/request";

// 获今日统计分析
export function getTodayDsCount(params) {
  return request({
    url: "getTodayDsCount",
    method: "get",
    params
  });
}
export function getDayDsCount(params) {
  return request({
    url: "getDayDsCount",
    method: "get",
    params
  });
}
export function getYearDsCount(params) {
  return request({
    url: "getYearDsCount",
    method: "get",
    params
  });
}
// 折线统计图
export function getDayDsZxCount(params) {
  return request({
    url: "getDayDsZxCount",
    method: "get",
    params
  });
}
