<template>
  <div class="yearsStyle">
    <el-card>
      <h4>年度数据</h4>
      <div class="list" style="display:flex">
        <div class="count">
          <div id="main"></div>
        </div>
        <div class="yearsAllow">
          <h5>
            年度登山总人数
          </h5>
          <div class="loocyearsAllwNum">
            <count-to
              :start-val="startVal"
              :end-val="endVal"
              :duration="4000"
              :decimals="0"
            />
          </div>
        </div>
      </div>
    </el-card>

    <el-card>
      <p>
        <el-button @click="down" type="primary" icon="el-icon-download"
          >导出xlsx数据</el-button
        >
        <el-button @click="down('csv')" type="success" icon="el-icon-download"
          >导出csv数据</el-button
        >
      </p>

      <el-table
        :data="tableData"
        show-summary
        border
        content
        style="width: 100%"
      >
        <el-table-column prop="name" label="分类" width="180">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in timelist"
          :prop="'T' + index"
          sortable
          :label="item"
        >
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { getYearDsCount } from "@/api/count.js";
import countTo from "vue-count-to";

export default {
  data() {
    return {
      tableData: [],
      startVal: 0,
      endVal: 5000,
      timelist: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月"
      ],
      geren: [220, 182, 191, 234, 290, 330, 310],
      tuanCount: [120, 132, 101, 134, 90, 230, 210]
    };
  },
  components: {
    countTo
  },
  mounted() {
    getYearDsCount().then(res => {
      console.log(res);
      let list = res.data.result;
      let geren = [];
      let tuanCount = [];
      let gerenObj = { name: "个人" };
      let tuanCountObj = { name: "团队" };
      let tableData = [];
      list.forEach((item, index) => {
        gerenObj[`T${index}`] = item.team_num_all;
        tuanCountObj[`T${index}`] = item.unit_num_all;
        geren.push(item.team_num_all);
        tuanCount.push(item.unit_num_all);
      });
      this.tableData = [gerenObj, tuanCountObj];
      console.log(this.tableData);
      this.endVal = res.data.allCount;
      this.geren = geren;
      this.tuanCount = tuanCount;
      this.createdCount();
    });
  },
  methods: {
    down(t) {
      let zong = ["总计"];
      this.geren.forEach((item, index) => {
        zong.push(item + this.tuanCount[index]);
      });
      let header = ["分类", ...this.timelist];
      let data = [["个人", ...this.geren], ["团体", ...this.tuanCount], zong];
      import("@/vendor/Export2Excel").then(excel => {
        excel.export_json_to_excel({
          header, //表头 必填
          data, //具体数据 必填
          filename: "年度数据", //非必填
          autoWidth: true, //非必填
          bookType: t == "csv" ? "csv" : "xlsx" //非必填
        });
      });
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 === 0) {
        if (columnIndex === 0) {
          return [1, 2];
        } else if (columnIndex === 1) {
          return [0, 0];
        }
      }
    },
    createdCount() {
      var chartDom = document.getElementById("main");
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {},
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.timelist
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "个人",
            type: "bar",
            color: "#397CD7",
            stack: "Ad",
            emphasis: {
              focus: "series"
            },
            data: this.geren
          },
          {
            name: "团体",
            type: "bar",
            stack: "Ad",
            color: "#FFBF00",
            emphasis: {
              focus: "series"
            },
            data: this.tuanCount
          }
        ]
      };

      option && myChart.setOption(option);
    }
  }
};
</script>

<style lang="scss">
.yearsStyle {
  padding: 20px;
  box-sizing: border-box;
  h4 {
    text-align: center;
    padding: 30px;

    width: 100%;
  }
  .count {
    height: 300px;
    padding: 20px;
    box-sizing: border-box;
    border: 1px solid #88a4c3;
    border-radius: 20px;
    flex: 1;

    #main {
      height: 100%;
    }
  }
  .yearsAllow {
    background: #397cd7;
    color: #fff;
    width: 180px;
    height: 250px;
    margin: 20px;
    text-align: center;
    border-radius: 20px;
    h5 {
      font-size: 20px;
      line-height: 1;
    }
    .loocyearsAllwNum {
      background: #fff;
      color: #397cd7;
      font-size: 30px;
      margin: 2px;
      height: 162px;
      line-height: 162px;
      font-weight: 800;
      border-radius: 0 0 20px 20px;
    }
  }
}
</style>
