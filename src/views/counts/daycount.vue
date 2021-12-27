<template>
  <div class="alllook">
    <div class="dayStyle">
      <el-card class="left">
        <div class="top">
          <div class="top_l">
            <div class="block Left">
              <div class="block_l">
                今日
              </div>
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
              <p>个人登山</p>
              <count-to
                :start-val="stateValue"
                :end-val="renshuobj.unit_count"
                :duration="4000"
                :decimals="0"
              />
            </div>
            <div class="block Left">
              <div class="block_l" style="background:#42B983;">
                昨日
              </div>
              <div class="block_r ">
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
          <div id="shankou"></div>
        </div>
      </el-card>
      <el-card class="right">
        <h6>今日登山面板数据</h6>
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
        <el-table-column label="编号" prop="id" align="center" width="80">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日期" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.count_date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="今日数量" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.count_mon }}</span>
          </template>
        </el-table-column>
        <el-table-column label="昨日数量" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.count_year }}</span>
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
        >
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import countTo from "vue-count-to";
import * as echarts from "echarts";
import { getTodayDsCount, getDayDsCount } from "@/api/count.js";
export default {
  data() {
    return {
      stateValue: 0,
      daycount: 3000,
      renshuobj: {},
      DayDsCount: [],
      rukoullist: [],
      rukoucountlist: [],
      rukounamelist: []
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
  },
  methods: {
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
            data: [120, 200, 150],
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
    }
  }
  .right {
    width: 30%;
    text-align: center;
    h6 {
      font-size: 20px;
      line-height: 1;
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
        padding: 0 20px;
        box-shadow: 0 0 5px #ccc;
        .count-to {
          font-weight: 600;
          font-size: 20px;
        }
      }
    }
  }
}
</style>
