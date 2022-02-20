<template>
  <div class="alllook">
    <div class="dayStyle">
      <el-card class="left">
        <div class="top">
          <div class="top_l">
            <div class="block Left ">
              <div class="block_l">今日</div>
              <div class="block_r">
                <p>登山人数</p>
                <count-to
                  :start-val="stateValue"
                  :end-val="renshuobj.today.allDsCount"
                  :duration="4000"
                  :decimals="0"
                />
              </div>
              <div class="block_r">
                <p>团体登山</p>
                <count-to
                  :start-val="stateValue"
                  :end-val="renshuobj.today.teamCount"
                  :duration="4000"
                  :decimals="0"
                />
              </div>
              <div class="block_r">
                <p>个人登山</p>
                <count-to
                  :start-val="stateValue"
                  :end-val="renshuobj.today.unitCount"
                  :duration="4000"
                  :decimals="0"
                />
              </div>
            </div>
            <div class="block Left dag">
              <div class="block_l" style="background: #42b983">昨日</div>
              <div class="block_r">
                <p>登山人数</p>
                <count-to
                  :start-val="stateValue"
                  :end-val="renshuobj.yesterday.allDsCount"
                  :duration="4000"
                  :decimals="0"
                />
              </div>
              <div class="block_r">
                <p>团体登山</p>
                <count-to
                  :start-val="stateValue"
                  :end-val="renshuobj.yesterday.teamCount"
                  :duration="4000"
                  :decimals="0"
                />
              </div>
              <div class="block_r">
                <p>个人登山</p>
                <count-to
                  :start-val="stateValue"
                  :end-val="renshuobj.yesterday.unitCount"
                  :duration="4000"
                  :decimals="0"
                />
              </div>
            </div>
          </div>
          <div class="top_r">
            <h5 style="text-align: center; margin: 0; font-size: 20px">
              今日登山数据柱状图
            </h5>
            <div ref="createdJC" id="createdJC"></div>
          </div>
        </div>
        <div class="content">
          <div class="button_zxt">
            <el-button type="primary" @click="onLookZX">{{
              iscreatedJC ? "今日登山人数时段分布图" : "今日入口数据柱状图"
            }}</el-button>
          </div>
          <div class="tuStyle" v-if="iscreatedJC">
            <div id="shankou"></div>
          </div>
          <div class="tuStyle" v-if="!iscreatedJC">
            <div id="shankou"></div>
          </div>
          <!-- <div class="tuStyle" :hidden="iscreatedJC">
            <div id="shankou"></div>
          </div>
          <div class="tuStyle" :hidden="!iscreatedJC">
            <div id="createdZStyle"></div>
          </div> -->
          <!-- <div id="shankou" v-if="iscreatedJC"></div>
          <div id="createdZStyle" v-if="!iscreatedJC"></div> -->
        </div>
      </el-card>
      <el-card class="right">
        <h6>防火责任书签订人数</h6>
        <div class="right_c">
          <div class="block" v-for="(item, index) in rukoullist" :key="index">
            <p>{{ item.rukou }}</p>
            <count-to
              class="count-to"
              :start-val="stateValue"
              :end-val="item.count"
              :duration="4000"
              :decimals="0"
            />
          </div>
        </div>
      </el-card>
    </div>
    <el-card style="margin: 20px">
      <el-form ref="form" label-width="80px" inline>
        <el-form-item label="选择日期">
          <div class="pickerStyle">
            <el-date-picker
              v-model="month"
              format="MM 月"
              type="month"
              @change="monthchange"
              placeholder="选择月"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="down" type="primary" icon="el-icon-download"
            >导出xlsx数据</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        show-summary
        sum-text="本月汇总"
        :data="DayDsCount"
        border
        fit
        highlight-current-row
        style="width: 100%"
        id="Console"
      >
        <el-table-column
          label="日期"
          prop="count_date"
          align="center"
          min-width="80"
        >
          <template slot-scope="{ row }">
            <span>{{ row.count_date }}</span>
          </template>
        </el-table-column>

        <el-table-column label="总人数" prop="zong" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.zong }}</span>
          </template>
        </el-table-column>
        <el-table-column label="团队数量" prop="team_num" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.team_num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="个人数量" prop="unit_num" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.unit_num }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in rukounamelist"
          :label="item"
          :key="index"
          rukou
          :prop="item"
          align="center"
        ></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import countTo from "vue-count-to";
import * as echarts from "echarts";
import {
  getTodayDsCount,
  getDayDsCount,
  getDayDsZxCount,
  getTodayCount
} from "@/api/count.js";
import { parseTime } from "@/utils";
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    return {
      month: "",
      tableKey: "count",
      listLoading: false,
      iscreatedJC: true,
      stateValue: 0,
      daycount: 3000,
      renshuobj: {
        today: {
          allDsCount: 0
        },
        yesterday: {
          allDsCount: 0
        }
      },
      DayDsCount: [],
      rukoullist: [],
      rukoucountlist: [],
      rukounamelist: [],
      timelist: [],
      numList: [],
      chartDom: null,
      mycreatedJChart: null,
      myshankouChart: null,
      shankou: null
    };
  },
  components: {
    countTo
  },
  created() {},
  mounted() {
    this.getTodayCount();
    this.getTodayDsCount();
    this.chartDom = this.$refs["createdJC"];
    this.mycreatedJChart = echarts.init(this.chartDom);
    this.shankou = document.getElementById("shankou");
    this.getDayDsZxCount();
    this.getDayDsCount();
    console.log(this.$refs["createdJC"], 212);
  },
  methods: {
    // 获取数据
    async getTodayCount() {
      let res = await getTodayCount();
      this.rukoullist = res.data.rukou;
    },
    down(t) {
      var xlsxParam = { raw: true }; // 导出的内容只做解析，不进行格式转换
      var wb = XLSX.utils.table_to_book(
        document.querySelector("#Console"),
        xlsxParam
      );
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
        autoWidth: true //非必填
      });
      // var date = this.getTime();
      var date = "当月数据";
      try {
        FileSaver.saveAs(
          //Blob 对象表示一个不可变、原始数据的类文件对象。
          //Blob 表示的不一定是JavaScript原生格式的数据。
          //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: "application/octet-stream" }),
          //设置导出文件名称
          // "sheetjs.xlsx"
          `${date}.xlsx`
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    getDayDsCount(month = "") {
      // 今日数据统计、还差折线图没弄
      getDayDsCount({ month: month }).then(res => {
        this.DayDsCount = res.data.map(item => {
          let obj = { ...item };
          obj["zong"] = item.team_num + item.unit_num;
          item.rukou.forEach(item => {
            obj[item.rukou] = item.count;
          });
          return obj;
        });
      });
    },
    // 获取月份
    monthchange(e) {
      let time = parseTime(e, "{m}");
      this.getDayDsCount(time);
    },

    async getTodayDsCount() {
      let res = await getTodayDsCount();
      this.renshuobj = res.data.renshu;
      console.log(this.renshuobj, 4444);
      let rukoullist = res.data.rukou;
      let rukounamelist = [];
      let rukoucountlist = [];
      rukoullist.forEach(item => {
        rukounamelist.push(item.rukou);
        rukoucountlist.push(item.count);
      });
      this.rukounamelist = rukounamelist;
      this.rukoucountlist = rukoucountlist;
      this.createdJC();
      // this.createdrukou();
    },
    async getDayDsZxCount() {
      let res = await getDayDsZxCount();
      let time = [];
      let numList = [];
      res.data.forEach(item => {
        time.push(`${item.hour}时`);
        numList.push(item.num);
      });
      this.timelist = time;
      this.numList = numList;
      this.createdZ();
    },
    onLookZX() {
      if (this.iscreatedJC) {
        this.createdrukou();
        // this.getTodayDsCount();
      } else {
        // this.getDayDsZxCount();
        this.createdZ();
      }
      this.iscreatedJC = !this.iscreatedJC;
    },
    createdZ() {
      // var chartDom = document.getElementById("createdZStyle");
      // var myChart = echarts.init(chartDom);
      this.shankou = document.getElementById("shankou");
      this.myshankouChart = echarts.init(this.shankou);
      var option;
      option = {
        xAxis: {
          boundaryGap: false,
          type: "category",
          data: this.timelist,
          axisLabel: {
            rotate: 0,
            color: "#42b983",
            formatter: function(val) {
              if (val.length > 3) {
                return `${val.slice(0, 5)}...`;
              }
              return val;
            }
          }
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            label: {
              show: true
            },
            smooth: true,
            data: this.numList,
            type: "line",
            color: "#3A7BD7"
          }
        ]
      };

      option && this.myshankouChart.setOption(option);
    },
    createdJC() {
      var option;
      option = {
        xAxis: {
          type: "category",
          data: ["登山人数", "团体", "个人"],
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            label: {
              show: true
            },
            barMaxWidth: 60,
            data: [
              this.renshuobj.today.allDsCount,
              this.renshuobj.today.teamCount,
              this.renshuobj.today.unitCount
            ],
            type: "bar",
            color: "#3A7BD7"
          }
        ]
      };
      option && this.mycreatedJChart.setOption(option);
    },
    createdrukou() {
      this.shankou = document.getElementById("shankou");
      // var myChart = echarts.init(chartDom);
      this.myshankouChart = echarts.init(this.shankou);

      var option;
      option = {
        xAxis: {
          boundaryGap: true,
          type: "category",
          data: this.rukounamelist,
          axisLabel: {
            rotate: 25,
            color: "#42b983",
            formatter: function(val) {
              if (val.length > 3) {
                return `${val.slice(0, 5)}...`;
              }
              return val;
            }
          },
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            label: {
              show: true
            },
            barMaxWidth: 50,
            barMinHeight: 10,
            data: this.rukoucountlist,
            type: "bar",
            color: "#3A7BD7"
          }
        ]
      };

      option && this.myshankouChart.setOption(option);
    }
  }
};
</script>

<style lang="scss">
.dayStyle {
  margin: 20px;
  display: flex;
  .left {
    margin-right: 20px;
    flex: 1;

    .top {
      display: flex;
      .top_l {
        width: 50%;
        padding: 0 20px;
        .topFlex {
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
        .Left {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          .block_l {
            background: #3a7bd7;
            color: #fff;
            width: 19%;
            height: 100%;
            line-height: 150px;
            flex-shrink: 0;
          }
          .block_r {
            width: 70%;
            flex: 1;
          }
        }
        .Right {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          position: relative;
          .tag {
            position: absolute;
            top: 0;
            right: 0;
            font-size: 16px;
            padding: 5px 10px;
            border: 1px solid #ccc;
            border-radius: 0 10px 0 10px;
          }
        }

        .block {
          width: 100%;
          box-shadow: 0 0 5px #ccc;
          border-radius: 10px;
          text-align: center;
          height: 150px;
          overflow: hidden;
          font-size: 30px;
          p {
            font-size: 18px;
          }
        }
        .dag {
          margin-top: 10px;
        }
      }
      .top_r {
        width: 50%;
        flex: 1;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .LB {
          width: 100%;
          // height: 100%;
          flex: 1;
        }
        #createdJC {
          flex: 1;
          width: 100%;
          // height: 100%;
        }
      }
    }
    .content {
      height: 300px;
      box-sizing: border-box;
      padding-top: 10px;
      .button_zxt {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .tuStyle {
        width: 100%;
        height: 260px;
        position: relative;
        #shankou {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          // width: 100%;
          // height: 100%;
          // width: 100%;
          // min-width: 60vw;
          height: 260px;
        }
        #createdZStyle {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          // width: 100%;
          // min-width: 60vw;
          // height: 260px;
        }
      }
    }
  }
  .right {
    width: 30%;
    text-align: center;
    h6 {
      font-size: 20px;
      line-height: 1;
      margin: 0;
      padding: 10px 0;
    }
    .right_c {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;

      .block {
        width: 30%;
        height: 100px;
        margin-top: 10px;
        margin-left: 10px;
        text-align: center;
        padding: 0 10px;
        box-shadow: 0 0 5px #ccc;
        border-radius: 5px;
        p {
          font-size: 16px;

          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .count-to {
          font-weight: 600;
          font-size: 20px;
        }
      }
    }
  }
}
</style>
<style>
/*选择日期，年份的隐藏 */
.el-date-picker__header {
  display: none;
}
</style>
<style>
.el-table {
  display: flex;
  flex-direction: column;
}
.el-table__body-wrapper {
  order: 1;
}
</style>
