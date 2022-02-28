<template>
  <div>
    <el-card style="margin: 20px auto; width: 30%">
      <div class="fromstyle">
        <h4>登山公告</h4>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="公告标题:" prop="msg">
            <el-input v-model="form.msg" :rows="5" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="公告介绍:" prop="img_url">
            <el-upload
              class="avatar-uploader"
              :action="action"
              :show-file-list="false"
              :headers="dataObj"
              name="file"
              accept="image/*"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="form.img_url" :src="form.img_url" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button @click="getNotice">取消</el-button>
            <el-button type="primary" @click="onSubmit">修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getNotice, editNotice } from "@/api/seting";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      dataObj: { token: getToken() },
      action: process.env.VUE_APP_BASE_API + "/upImage",
      rules: {
        msg: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        img_url: [{ required: true, message: "请上传图片", trigger: "blur" }],
      },
      form: {
        msg: "",
      },
    };
  },
  created() {
    this.getNotice();
    console.log(getToken());
    this.dataObj.token = getToken();
  },
  methods: {
    getNotice() {
      getNotice().then((res) => {
        console.log(res.data);
        this.form = res.data;
      });
    },
    handleAvatarSuccess(response, file) {
      console.log(response, file);
      this.form.img_url = response.data.imgUrl;
    },
    onSubmit() {
      console.log("submit!");
      this.$refs["form"].validate((valid) => {
        if (valid) {
          editNotice(this.form).then((res) => {
            this.$notify({
              title: "成功",
              message: "公告修改成功",
              type: "success",
            });
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.fromstyle {
  text-align: center;
  h4 {
    font-size: 28px;
  }
}
</style>
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
