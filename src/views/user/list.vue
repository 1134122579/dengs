<template>
  <div class="app-container">
    <!-- 搜索   -->
    <el-card>
      <el-form
        :inline="true"
        :model="listQuery"
        label-width="88px"
        class="demo-form-inline"
      >
        <el-form-item label="用户信息:">
          <el-input
            v-model="listQuery.userinfo"
            placeholder="请输入输入姓名、手机号"
            class="filter-item"
            size="mini"
            clearable
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="入驻时间:">
          <el-date-picker
            v-model="listQuery.querydate"
            clearable
            style="width: 250px"
            unlink-panels
            size="mini"
            value-format="yyyy-MM-dd"
            type="daterange"
            class="filter-item"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="认证状态:">
          <el-radio-group
            v-model="listQuery.is_auth"
            size="mini"
            @change="selectStatus"
          >
            <!-- 用户状态 1 启用 2 冻结 3 注销 -->
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="1">已认证</el-radio-button>
            <el-radio-button label="2">未认证</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否队长:">
          <el-radio-group
            v-model="listQuery.is_team_leader"
            size="mini"
            @change="selectStatus"
          >
            <!-- 用户状态 1 启用 2 冻结 3 注销 -->
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="1">是</el-radio-button>
            <el-radio-button label="2">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否管理员:">
          <el-radio-group
            v-model="listQuery.is_admin"
            size="mini"
            @change="selectStatus"
          >
            <!-- 用户状态 1 启用 2 冻结 3 注销 -->
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="1">是</el-radio-button>
            <el-radio-button label="2">否</el-radio-button>
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
        <el-table-column label="身份证" align="center" min-width="100">
          <template slot-scope="{ row }">
            <span>{{ row.idcard == "" ? "/" : row.idcard }}</span>
          </template>
        </el-table-column>
        <el-table-column label="紧急联系人" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.sos_name == "" ? "/" : row.sos_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="紧急联系方式" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.sos_mobile == "" ? "/" : row.sos_mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否队员" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.is_admin | adminFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否队长" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.is_team_leader | adminFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="认证状态" align="center">
          <template slot-scope="{ row }">
            <el-tag
              :type="row.is_auth | typeFilter"
              size="mini"
              effect="dark"
              >{{ row.is_auth | authFilter }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          label="注册时间"
          align="center"
          sortable
          prop="create_time"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <div class="we_flex we_column">
              <el-button
                type="primary"
                class="we_marginT we_marginL_"
                size="mini"
                @click="handleModify(row)"
                >编辑</el-button
              >
            </div>
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
    <el-dialog
      title="绑定队员"
      :visible.sync="dialogFormVisible"
      center
      top="5vh"
      width="30%"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="队员姓名:" prop="name" min-width="80">
          <span>{{ form.name }}</span>
        </el-form-item>
        <el-form-item label="联系方式:" prop="mobile">
          <span>{{ form.mobile }}</span>
        </el-form-item>
        <el-form-item label="是否队员:">
          <el-radio-group v-model="form.is_admin">
            <!-- 状态：1 出租，2 自用 -->
            <el-radio-button :label="1">是</el-radio-button>
            <el-radio-button :label="2">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否队长:">
          <el-radio-group v-model="form.is_team_leader">
            <!-- 状态：1 出租，2 自用 -->
            <el-radio-button :label="1">是</el-radio-button>
            <el-radio-button :label="2">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="绑定入口:">
          <el-select v-model="form.rukou_id" placeholder="请选择">
            <el-option
              v-for="item in rukouList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData()">立即提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { userList, setUser, getDsRk } from "@/api/user";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "UserList",
  components: {
    Pagination
  },
  directives: {
    waves
  },
  filters: {
    // 状态过滤   <!-- 用户状态 1 启用 2 冻结 3 注销 -->
    authFilter(status) {
      const statusMap = {
        1: "已认证",
        2: "未认证"
      };
      return statusMap[status];
    },
    // admin 1 是 2 不是
    adminFilter(status) {
      const statusMap = {
        1: "是",
        2: "否"
      };
      return statusMap[status];
    },
    // 状态类型过滤
    typeFilter(status) {
      const statusMap = {
        1: "success",
        2: "warning"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      form: {
        rukou_id: 1
      },
      total: 0,
      status: "全部",
      listLoading: true,
      disabled: "false",
      type: "",
      downloadLoading: false,
      filename: "",
      autoWidth: true,
      bookType: "xlsx",
      listQuery: {
        page: 1,
        pageSize: 10,
        is_auth: "",
        is_team_leader: "",
        is_admin: "",
        userinfo: "",
        querydate: ""
      },
      // 图片查看器变量
      showViewer: false,
      showReviewer: false,
      selectLoading: false,
      dialogFormVisible: false,
      rukouList: []
    };
  },
  created() {
    this.getList();
    this.getDsRk();
  },
  methods: {
    getDsRk() {
      getDsRk().then(res => {
        console.log(res);
        this.rukouList = res.data;
      });
    },
    // 清空
    handleNull() {
      (this.listQuery = {
        page: 1,
        pageSize: 10,
        userinfo: "",
        status: "",
        querydate: ""
      }),
        this.getList();
    },
    radioButtton(value, text) {
      this.getList();
    },
    onPreview: function() {
      this.showViewer = true;
    },
    // 提交信息
    submitData() {
      setUser(this.form).then(response => {
        this.dialogFormVisible = false;
        this.$notify({
          title: "Success",
          message: "添加成功",
          type: "success",
          duration: 2000
        });
        this.getList();
        return;
      });
    },

    // 获取列表
    getList() {
      this.listLoading = true;
      userList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.result;
        this.total = response.data.pageInfo.total;
      });
    },
    // 搜索
    handleFilter() {
      this.getList();
    },
    // 修改用户信息
    handleModify(row) {
      console.log(row);
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogFormVisible = true;
    },
    // 筛选认证状态
    selectStatus(status) {
      this.getList();
    }
  }
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
