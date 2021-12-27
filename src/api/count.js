import request from "@/utils/request";

// 获今日统计分析
export function getTodayDsCount(data) {
  return request({
    url: "getTodayDsCount",
    method: "get",
    data
  });
}
export function getDayDsCount(data) {
  return request({
    url: "getDayDsCount",
    method: "get",
    data
  });
}
export function getYearDsCount(data) {
  return request({
    url: "getYearDsCount",
    method: "get",
    data
  });
}
