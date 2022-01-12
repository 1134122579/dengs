<template>
  <div class="app-container">
    <!-- 搜索   -->
    <el-card>
      <el-form
        :inline="true"
        :model="listQuery"
        label-width="100px"
        class="demo-form-inline"
      >
        <el-form-item label="用户信息:">
          <el-input
            v-model="listQuery.userinfo"
            placeholder="请输入输入姓名、手机号"
            class="filter-item"
            clearable
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="备案时间:">
          <el-date-picker
            v-model="listQuery.querydate"
            clearable
            style="width: 250px"
            unlink-panels
            value-format="yyyy-MM-dd"
            type="daterange"
            class="filter-item"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="备案状态:">
          <el-radio-group
            v-model="listQuery.status"
            size="mini"
            @change="selectStatus"
          >
            <!-- 1 已备案 2 已结束 3 在途中 4 已取消 -->
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button label="1">已备案</el-radio-button>
            <el-radio-button label="2">已结束</el-radio-button>
            <el-radio-button label="3">在途中</el-radio-button>
            <el-radio-button label="4">已取消</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="登山方式:">
          <el-radio-group
            v-model="listQuery.type"
            size="mini"
            @change="selectType"
          >
            <!-- 1 已备案 2 已结束 3 在途中 4 已取消 -->
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button label="1">个人</el-radio-button>
            <el-radio-button label="2">团队</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button
            v-waves
            size="mini"
            type="primary"
            class="starh_button"
            @click="handleFilter"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列    表 -->
    <el-card style="margin-top: 20px">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <!-- <el-table-column label="编号" prop="id" align="center" width="80">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="头像" align="center">
          <template slot-scope="{ row }">
            <el-avatar
              :src="row.headimgurl"
              shape="square"
              :size="40"
            ></el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.name == "" ? "" : row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" align="center" min-width="80">
          <template slot-scope="{ row }">
            <span>{{ row.mobile == "" ? "/" : row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="登山口" align="center" min-width="100">
          <template slot-scope="{ row }">
            <span>{{ row.rukou == "" ? "/" : row.rukou }}</span>
          </template>
        </el-table-column>
        <el-table-column label="登山原因" align="center" min-width="100">
          <template slot-scope="{ row }">
            <span>{{ row.reason == "" ? "/" : row.reason }}</span>
          </template>
        </el-table-column>
        <el-table-column label="登山方式" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="row.type | typeFilter" size="mini">{{
              row.type == 1 ? "个人" : "团队"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="登山人数" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.num == "" ? "/" : row.num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="row.status | typeFilter" size="mini" effect="dark">{{
              row.status | statusFilter
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          sortable
          prop="create_time"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { getBeianList } from "@/api/user";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "getBeianList",
  components: {
    Pagination,
  },
  directives: {
    waves,
  },
  filters: {
    // 状态过滤   <!-- 1 已备案 2 已结束 3 在途中 4 已取消 -->
    statusFilter(status) {
      const statusMap = {
        1: "已备案",
        2: "已结束",
        3: "在途中",
        4: "已取消",
      };
      return statusMap[status];
    },
    // admin 1 是 2 不是
    adminFilter(status) {
      const statusMap = {
        1: "是",
        2: "否",
      };
      return statusMap[status];
    },
    // 状态类型过滤
    typeFilter(status) {
      const statusMap = {
        1: "success",
        2: "warning",
        3: "success",
        4: "info",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      form: {},
      total: 0,
      status: "全部",
      listLoading: true,
      disabled: "false",
      type: "",
      downloadLoading: false,
      filename: "",
      autoWidth: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        status: "",
        type: "",
        userinfo: "",
        querydate: "",
      },
      // 图片查看器变量
      showViewer: false,
      showReviewer: false,
      selectLoading: false,
      dialogFormVisible: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 清空
    handleNull() {
      (this.listQuery = {
        page: 1,
        pageSize: 10,
        userinfo: "",
        status: "",
        querydate: "",
      }),
        this.getList();
    },
    onPreview: function () {
      this.showViewer = true;
    },
    // 提交信息
    submitData() {
      setUser(this.form).then((response) => {
        this.dialogFormVisible = false;
        this.$notify({
          title: "Success",
          message: "添加成功",
          type: "success",
          duration: 2000,
        });
        this.getList();
        return;
      });
    },

    // 获取列表
    getList() {
      this.listLoading = true;
      getBeianList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.result;
        this.total = response.data.pageInfo.total;
      });
    },
    // 搜索
    handleFilter() {
      this.getList();
    },
    // 筛选认证状态
    selectStatus() {
      this.getList();
    },
    // 筛选登山类型
    selectType() {
      this.getList();
    },
  },
};
</script>
<style scoped>
.row_flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.demonstration {
  display: inline-block;
  margin: 0 10px;
  font-size: 12px;
  font-weight: 600;
  color: #606266;
}
.search {
  margin-left: 30px;
}
.list_time {
  width: 88px;
}
.sarch {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.filter-item {
  width: 200px;
}
.starh_button {
  margin-left: 20px;
}
</style>
