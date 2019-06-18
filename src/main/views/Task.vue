<template>
  <div
    style="border:1px;width:100%;height:100%;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"
  >
    <el-container>
      <el-header
        style="display: flex;justify-content: space-between;align-items: center;"
      >
        <el-button
          type="primary"
          @click="dialogFormVisible = true"
          v-if="isAdmin"
          size="mini"
          icon="el-icon-plus"
          >添加任务</el-button
        >
        <div>
       <!--   <strong>注意：所有任务过期自动结束，过期任务无法编辑或回复</strong>-->
        </div>
      </el-header>
      <el-main>
        <el-table
          :data="tasks"
          style="width: 100%"
          title="任务列表"
          size="mini"
        >
          <el-table-column prop="id" label="ID" width="120"></el-table-column>
          <el-table-column
            prop="name"
            label="任务名称"
            width="200"
          ></el-table-column>
          <el-table-column
            prop="detail"
            label="详细内容"
            width="300"
          ></el-table-column>
          <el-table-column
            prop="deadLineTime"
            label="截止时间"
            sortable
            width="200"
          ></el-table-column>
          <!-- <el-table-column prop="status" label="状态" width="180"></el-table-column> -->
          <el-table-column label="操作" width="400">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="waring"
                v-if="isAdmin"
                @click="editTask(scope.row)"
                >编辑</el-button
              >
              <el-button
                      size="mini"
                      type="success"
                      v-if="!isAdmin"
                      @click="openSend(scope.row)"
              >回复</el-button>
              <el-button
                      size="mini"
                      type="success"
                      @click="lookcomplete(scope.row)"
              >查看完成情况</el-button>
              <el-button size="mini" type="info" @click="checkDetail(scope.row)" :disabled="isDisabled"
               v-if="isAdmin" >一键终止</el-button>
              <el-button
                      size="mini"
                      type="success"
                      v-if="isAdmin"
                      @click="lookrecall(scope.row)"
              >查看回复</el-button>

            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
<!--
    &lt;!&ndash;回复详情对话框&ndash;&gt;
    <el-dialog :visible.sync="detailVisible">
      <el-card class="box-card" shadow="never">
        回复详情:
        <br />
        <ul>
          <li v-for="(r, index) in replys" :key="index">
            {{ r.name }} : {{ r.comment }}
          </li>
        </ul>
      </el-card>
    </el-dialog>-->

    <!-- 添加任务对话框-->
    <el-dialog title="增加任务" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="任务名称" :label-width="formLabelWidth">
          <el-input v-model="task.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="详细内容" :label-width="formLabelWidth">
          <el-input v-model="task.detail" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="截止时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="task.dead_line_time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="任务状态" :label-width="formLabelWidth">
          <el-select v-model="task.status" placeholder="请选择任务状态">
            <el-option label="未关闭" value="1"></el-option>
            <el-option label="关闭" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTask">确 定</el-button>
      </div>
    </el-dialog>
    <!--查看任务详情对话框-->
    <el-dialog
            title="任务回复"
            :visible.sync="recalldialogVisible"
            width="50%"
            :before-close="handleClose">
      <ul v-for="recall in recalls" :key="recall.name">
        <li>用户【{{recall.name}}】回复内容如下：【{{recall.comment}}】  时间 【{{recall.completeTime}}】</li>
      </ul>
      <span slot="footer" class="dialog-footer">
    <el-button @click="recalldialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="recalldialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>

    <!--回复任务对话框-->
    <el-dialog
      title="回复任务"
      :visible.sync="dialogReplyVisible"
      :before-close="clear"
    >
      <div v-if="alertVis">
        <el-tag type="warning" effect="dark"
          >该任务已过期或被手动关闭，仍可回复，但显示未完成</el-tag
        >
      </div>
      <el-form :model="reply" :rules="rules" ref="reply">
        <el-form-item label="请输入回复内容" prop="comment">
          <el-input v-model="reply.comment"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="send('reply')">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑任务对话框-->
    <el-dialog :visible.sync="editVis" title="编辑任务" :before-close="clear">
      <div v-if="disabled" slot="title">
        <strong>该任务已经结束，无法编辑</strong>
      </div>
      <el-form>
        <el-form-item></el-form-item>
        <el-form-item label="任务名称" :label-width="formLabelWidth">
          <el-input
            v-model="task.name"
            auto-complete="off"
            :disabled="disabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="详细内容" :label-width="formLabelWidth">
          <el-input
            v-model="task.detail"
            auto-complete="off"
            :disabled="disabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="截止时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="task.dead_line_time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm"
            :disabled="disabled"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="任务状态" :label-width="formLabelWidth">
          <el-select
            v-model="task.status"
            placeholder="请选择任务状态"
            :disabled="disabled"
          >
            <el-option label="未关闭" value="1"></el-option>
            <el-option label="关闭" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVis = false">取 消</el-button>
        <el-button type="primary" :disabled="disabled" @click="submitEditTask"
          >确 定</el-button
        >
        <!--<el-button type="warning" :disabled="disabled" @click="closeTask"
          >关闭任务</el-button
        >-->
      </div>
    </el-dialog>
    <el-dialog
            title="任务完成情况"
            :visible.sync="completedialogVisible"
            width="50%"
            :before-close="handleClose">
     <ul>
       <ol>【没有回复的人员】</ol>
       <br>
       <ol v-for="nc in completetask.noComp" :key="nc">【{{nc}}】</ol>
       <br>
      <ol>
        【完成但没有按时完成人员】
      </ol>
       <br>
       <ol v-for="nt in completetask.noTime" :key="nt">【{{nt}}】</ol>
       <br>
       <ol>【完成】</ol>
       <br>
       <ol v-for="tm in completetask.time" :key="tm">【{{tm}}】</ol>
     </ul>
      <span slot="footer" class="dialog-footer">
    <el-button @click="completedialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="completedialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import bus from "@/util/Bus";
import axios from "@/util/MyAxios";
import { Message } from "element-ui";
import { getTasks } from "@/main/api/Main";
import { setTimeout } from "timers";
export default {
  data: () => ({
      isDisabled:false,
      tasks: [],
      recalls:[],
    task: {
      id: "",
      name: "",
      detail: "",
      dead_line_time: "",
      status: ""
    },
    completedialogVisible:false,
    recalldialogVisible:false,
    dialogFormVisible: false,
    formLabelWidth: "120px",
    detailVisible: false,
    dialogReplyVisible: false,
    editVis: false,
    replys: [],
      completetask:{},
    isAdmin: false,
    alertVis: false,
    reply: {
      id: "",
      uid:"",
      comment: "",
      status: "1",
      completetime:"",
    },
    disabled: false,
    rules: {
      comment: [
        { required: true, message: "请输入回复内容", trigger: "blur" },
      ]
    }
  }),

  created() {
    getTasks();
    bus.$on(bus.tasks, data => {
      this.tasks = data;
      console.log(this.tasks);
      for(var i=0;i<this.tasks.length;i++){
          console.log(this.tasks[i].status);
         /* if(this.tasks[i].status!=0){
         this.isDisabled=true;
         console.log(this.isDisabled);
          }*/
        }

    });

    let role = sessionStorage.getItem("role");
    if (role =="SUPERADMIN"||role =="ADMIN") {
      this.isAdmin = true;
    }
  },

  methods: {
    closeTask() {
      this.$confirm("确认关闭任务吗？关闭后无法修改！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        axios
          .post("/admin/task/close", this.task)
          .then(resp => {
            if (resp.status == 200) {
              Message.success("关闭成功!");
            }
          })
          .catch(() => {
            Message.warning("未知错误，请稍后再试");
          });
      });
    },
    submitEditTask() {
axios.post("/task/modifyTask", {id:this.task.id,name:this.task.name,dead_line_time: this.task.dead_line_time,status:this.task.status ,Authorization:sessionStorage.getItem("Authorization")}).then(resp => {
       if (resp.status == 200) {
          Message.success("更新成功!");
          getTasks();
          bus.$on(bus.tasks, data => {
            this.tasks = data;
          });
        }
      });
    },
    editTask(row) {
      Date.prototype.format = function(fmt) {
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          S: this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        }
        for (var k in o) {
          if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length)
            );
          }
        }
        return fmt;
      };
      this.editVis = true;
      this.task = row;
      let flag = row.deadLineTime < new Date().format("yyyy-MM-dd HH:mm");
      if (row.status == "结束" || flag) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    },
    clear(done) {
      this.alertVis = false;
      done();
    },
    addTask() {
      this.$confirm("确认添加?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios.post("/task/addTask", {name:this.task.title,detail: this.task.detail,deadLineTime:this.task.dead_line_time,status:this.task.status}).then(resp => {
              //console.log(resp);
            setTimeout(() => {
                console.log(resp);
              bus.$emit(bus.tasks, resp.data.tasks);
              getTasks();
            }, 500);
          });
          this.$message({
            type: "success",
            message: "添加成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消"
          });
        });
      this.dialogFormVisible = false;
    },
    checkDetail(row) {

      //console.log(row);
      axios.post("/task/modifyTaskStatus",{id:row.id,status:1}).then(resp => {
        console.log(resp);
      });
    },
    openSend(row) {
        Date.prototype.format = function(fmt) {
          var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            S: this.getMilliseconds() //毫秒
          };
          if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(
              RegExp.$1,
              (this.getFullYear() + "").substr(4 - RegExp.$1.length)
            );
          }
          for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
              fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1
                  ? o[k]
                  : ("00" + o[k]).substr(("" + o[k]).length)
              );
            }
          }
          return fmt;
        };
        this.dialogReplyVisible = true;
        this.reply.id = row.id;
        this.reply.uid=sessionStorage.getItem("id");
        var date = new Date().format("yyyy-MM-dd hh:mm");
        this.reply.completetime=date;
        console.log(date);
        if (date > row.deadLineTime || row.status == "结束") {
          this.alertVis = true;
          this.reply.status = "0";
        } else {
          this.reply.status = "1";
        }
        console.log(this.reply.status);
   //console.log(row);
    },
    lookcomplete(row) {

         console.log(row);

        axios
            .get(`/task/comment/crew/${row.id}`)
            .then(resp => {
                this.completetask=resp.data.teacher;
                console.log(this.completetask);
                this.completedialogVisible=true;
            });
      },
    lookrecall(row){
        console.log(row);
      this.recalldialogVisible=true;
        axios
            .get(`/task/comment/${row.id}`)
            .then(resp => {
              this.recalls=resp["data"].task;
              console.log(this.recalls);
            });

},
      handleClose(done) {
          this.$confirm('确认关闭？')
              .then(_ => {
                  done();
              })
              .catch(_ => {
              });
      },
    send(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.reply);
          axios
            .post("/task/comment/add", {comment:this.reply.comment,task:this.reply.id,account:this.reply.uid,
                completeTime:this.reply.completetime })
            .then(resp => {
              if (resp.status == 200) {
                  console.log(resp.data.alert);
                Message.success(resp.data.alert);
                this.reply = { id: null, conmment: null };
                this.dialogReplyVisible = false;
              } else {
                Message.warning("未知错误");
              }
            });
        } else {
          console.log("false");
        }
      });
    }
  },
  rules: {
    deadLineTime: [
      {
        type: "date",
        required: true,
        message: "请选择时间",
        trigger: "change"
      }
    ]
  }
};
</script>
<style>
.text {
  font-size: 16px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
}
</style>
