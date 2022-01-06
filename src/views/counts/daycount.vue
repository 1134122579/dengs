<template>
  <div class="alllook">
    <div class="dayStyle">
      <el-card class="left">
        <div class="top">
          <div class="top_l">
            <div class="block Left">
              <div class="block_l">今日</div>
              <div class="block_r">
                <p>登山人数</p>
                <count-to
                  :start-val="stateValue"
                  :end-val="renshuobj.allDsCount"
                  :duration="4000"
                  :decimals="0"
                />
              </div>
            </div>
            <div class="block Right">
              <span class="tag">今日</span>
              <p>个人登山</p>
              <count-to
                :start-val="stateValue"
                :end-val="renshuobj.unit_count"
                :duration="4000"
                :decimals="0"
              />
            </div>
            <div class="block Left">
              <div class="block_l" style="background: #42b983">昨日</div>
              <div class="block_r">
                <p>登山人数</p>
                <count-to
                  :start-val="stateValue"
                  :end-val="renshuobj.yesterdayCount"
                  :duration="4000"
                  :decimals="0"
                />
              </div>
            </div>
            <div class="block Right">
              <span class="tag">今日</span>
              <p>团体登山</p>
              <count-to
                :start-val="stateValue"
                :end-val="renshuobj.teamCount"
                :duration="4000"
                :decimals="0"
              />
            </div>
          </div>
          <div class="top_r">
            <div id="createdJC"></div>
          </div>
        </div>
        <div class="content">
          <div   style="margin:0 auto;">
            <el-button

              type="primary"
              @click="onLookZX"
              >{{
                iscreatedJC ? "今日入口数据柱状图" : "小时数据折线图"
              }}</el-button
            >
          </div>
          <div id="shankou" v-if="iscreatedJC"></div>
          <div id="createdZStyle" v-else></div>
        </div>
      </el-card>
      <el-card class="right">
        <h6>登山人员联系方式统计</h6>
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
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="DayDsCount"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="日期" align="center" min-width="80">
          <template slot-scope="{ row }">
            <span>{{ row.count_date }}</span>
          </template>
        </el-table-column>

        <el-table-column label="总人数" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.team_num + row.unit_num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="团队数量" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.team_num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="个人数量" align="center">
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
  getDayDsZxCount
} from "@/api/count.js";
export default {
  data() {
    return {
      tableKey: "count",
      listLoading: false,
      iscreatedJC: true,
      stateValue: 0,
      daycount: 3000,
      renshuobj: {},
      DayDsCount: [],
      rukoullist: [],
      rukoucountlist: [],
      rukounamelist: [],
      timelist: [],
      numList: []
    };
  },
  components: {
    countTo
  },
  mounted() {
    getTodayDsCount().then(res => {
      console.log(res);
      let renshuobj = res.data.renshu;
      let rukoullist = res.data.rukou;
      let rukounamelist = [];
      let rukoucountlist = [];
      rukoullist.forEach(item => {
        // item.rukou.rukou=item.rukou.rukou.slice(0,3)+'...'
        rukounamelist.push(item.rukou);
        rukoucountlist.push(item.count);
      });
      console.log(rukounamelist);
      this.rukoullist = rukoullist;
      this.rukounamelist = rukounamelist;
      this.rukoucountlist = rukoucountlist;
      this.renshuobj = renshuobj;
      this.createdrukou();
      this.createdJC();
    });
    // 今日数据统计、还差折线图没弄
    getDayDsCount().then(res => {
      this.DayDsCount = res.data.map(item => {
        let obj = { ...item };
        item.rukou.forEach(item => {
          obj[item.rukou] = item.count;
        });
        return obj;
      });
      console.log(this.DayDsCount, 12123);
    });
    getDayDsZxCount().then(res => {
      console.log(res);
      let time = [];
      let numList = [];
      res.data.forEach(item => {
        time.push(`${item.hour}时`);
        numList.push(item.num);
      });
      this.timelist = time;
      this.numList = numList;
      this.createdZ();
    });
  },
  methods: {
    onLookZX() {
      if (this.iscreatedJC) {
        this.createdrukou();
      } else {
        this.createdZ();
      }
      this.iscreatedJC = !this.iscreatedJC;
    },
    createdZ() {
      var chartDom = document.getElementById("createdZStyle");
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        xAxis: {
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
            data: this.numList,
            type: "line",
            color: "#3A7BD7"
          }
        ]
      };

      option && myChart.setOption(option);
    },
    createdJC() {
      var chartDom = document.getElementById("createdJC");
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        xAxis: {
          type: "category",
          data: ["登山人数", "团体", "个人"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            label: {
              show: true
            },
            data: [
              this.renshuobj.allDsCount,
              this.renshuobj.teamCount,
              this.renshuobj.unit_count
            ],
            type: "bar",
            color: "#3A7BD7"
          }
        ]
      };

      option && myChart.setOption(option);
    },
    createdrukou() {
      var chartDom = document.getElementById("shankou");
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        xAxis: {
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
            barMinHeight: 20,
            data: this.rukoucountlist,
            type: "bar",
            color: "#3A7BD7"
          }
        ]
      };

      option && myChart.setOption(option);
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
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        .Left {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          .block_l {
            background: #3a7bd7;
            color: #fff;
            width: 30%;
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
          width: 48%;
          box-shadow: 0 0 5px #ccc;
          border-radius: 10px;
          text-align: center;
          height: 150px;
          margin-top: 10px;
          overflow: hidden;
          font-size: 30px;
          p {
            font-size: 18px;
          }
        }
      }
      .top_r {
        width: 50%;
        flex: 1;
        .LB {
          width: 100%;
          height: 100%;
        }
        #createdJC {
          height: 100%;
        }
      }
    }
    .content {
      height: 300px;
      #shankou {
        width: 100%;
        height: 100%;
      }
      #createdZStyle {
        width: 100%;
        height: 100%;
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
