<template>
  <div
    style="border:1px;width:100%;height:100%;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"
  >
    <el-container>
      <el-header
        style="display: flex;justify-content: space-between;align-items: center;"
      >
        <el-button size="mini" icon="el-icon-plus" type="primary" @click="add"
          >添加监考</el-button
        >
        <span style="font-size: 14px;margin-left: 10px;color: darkgreen">tips：若该监考状态为-1,即未分配状态点击分配即可进行监考分配；
若该监考状态为0 即已分配但未完成状态 点击分配,即可重新进行监考分配；
若该监考状态为1，即已完成状态，不可对其进行分配；
</span>
      </el-header>
      <el-main>
        <el-table size="mini" :data="exams">
          <el-table-column label="ID" prop="id" v-if="false"></el-table-column>
          <el-table-column label="开始时间" prop="start"></el-table-column>
          <el-table-column label="结束时间" prop="end"></el-table-column>
          <el-table-column
            label="考试科目"
            prop="course"
          ></el-table-column>
          <el-table-column label="地点" prop="location"></el-table-column>
          <el-table-column
            label="所需人数"
            prop="number"
          ></el-table-column>
          <el-table-column
                  label="是否分配完成"
                  prop="state"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="selectDetile(scope.row)">详情</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="addExamTeacher(scope.row)"
                V-if="!isAdmin"
                >分配</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>

    <!--添加监考 表单对话框-->
    <el-dialog :visible.sync="dialogFormVisible">
      <el-form
        :rules="rules"
        ref="exam"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="考试课程">
          <el-input v-model="exam.course" placeholder="请输入内容"  style="width: 35%"></el-input>
        </el-form-item>
        <el-form-item label="考场安排">
          <el-input v-model="exam.place" placeholder="请输入内容"  style="width: 35%"></el-input>
        </el-form-item>
        <el-form-item label="所需人数">
          <el-input-number
            size="mini"
            :min="1"
            :max="4"
            v-model="exam.numOfPerson"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="exam.startTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="exam.deadTime"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="备注" prop="desc">
          <el-input type="textarea" v-model="exam.desc"></el-input>
        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="submitForm">立即创建</el-button>
          <el-button @click="resetForm('exam')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--分配老师监考对话框-->
    <el-dialog :visible.sync="addFormVisible" title="添加监考教师">
      <el-form>
        <span>
          本场监考需要
          <strong>{{ num }}</strong
          >名教师，请选择
        </span>
    <!--    <el-form-item label="监考老师">
          <el-select
            v-model="teachers"
            multiple
            placeholder="请选择"
            multiple-limit="2"
          >
            <el-option
              v-for="item in recommendteachers"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-table
                ref="multipleTable"
                :data="recommendteachers"
                style="width: 100%"
                @selection-change="selectTeacher">
          <el-table-column
                  prop="account"
                  label="学工号"
                  width="180">
          </el-table-column>
          <el-table-column
                  prop="name"
                  label="姓名"
                  width="100">
          </el-table-column>
          <el-table-column
                  prop="counts"
                  width="100"
                  label="待监考数">
          </el-table-column>
          <el-table-column
                  label="发消息"
                  width="100">
            <template slot-scope="scope">
              <el-button @click="sendmessage(scope.row)" type="text" size="small" v-if="isshowSend">发送消息</el-button>
            </template>
          </el-table-column>
          <el-table-column
                  type="selection"
                  width="100">
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sumbmitExamTeacher">确 定</el-button>
      </div>
    </el-dialog>

    <!--查看监考教师对话框-->
    <el-dialog :visible.sync="selectdetile" title="分配教师详细信息">
      <ul v-for="td in examDetail" :key="td">
        <li style="font-size: 16px;">【{{td}}】</li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button @click="selectdetile = false">取 消</el-button>
        <el-button type="primary" @click="selectdetile=false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import axios from "@/util/MyAxios";
import { Message } from "element-ui";
import { getAllLesions } from "@/main/api/Main";
import { getExams } from "@/main/api/Main";
import bus from "@/util/Bus";
export default {
  data() {
    return {
        closeIsDisabled:false,
          multipleSelection: [],
        isshowSend:true,
        examDetail:{},
      exams: [],
      exam: {
        id: "",
        course:"",
        numOfPerson: 0,
        place: "",
        startTime: "",
        deadTime: "",
        status: "-1"
      },
      courses: '',
      teachers: [],
      recommendteachers: [],
      dialogFormVisible: false,
        selectdetile:false,
      addFormVisible: false,
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        place: [{ required: true, message: "请选择教室", trigger: "change" }],
        date1: [
          {
            type: "datetime",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "datetime",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ]
      },
      num: 0,
      examing: {
        tids: [],
        exam: null
      }
    };
  },
  created() {
    getAllLesions();
    bus.$on(bus.lessions, data => {
        this.courses = data;
    });
    getExams();
    bus.$on(bus.exams, data => {
      this.exams = data;
      console.log(this.exams);
   for (var i=0;i<this.exams.length;i++){
         if(parseInt(this.exams[i].state)==0||parseInt(this.exams[i].state)==1){
             console.log(parseInt(this.exams[i].state));
             //this.closeIsDisabled=true;

         }
         if (this.exams[i].state==-1) {
             //this.closeIsDisabled=false;
         }
     }
    });
  },
  methods: {
    addExamTeacher(row) {
        console.log(row);
        axios.get("/CountEveryUserExams").then(response => {
          this.recommendteachers = response["data"].data;
          console.log(this.recommendteachers);
        });
        console.log(row.numOfPerson);
        this.num = row.number;
        this.examing.exam = row;
        this.addFormVisible = true;
    },
      selectTeacher (val) {
          this.multipleSelection = val // 返回的是选中的列的数组集合
      },
      selectDetile(row){
        //console.log(row);
          this.selectdetile=true;
          axios.get(`/ListExamDetail/${row.id}`).then(response => {
              this.examDetail = response.data.teachers;
              console.log(this.examDetail);
          });
      },
      sumbmitExamTeacher() {
        console.log(this.examing.exam.state);
        console.log("监考id为"+this.examing.exam.id);
        if(this.examing.exam.state==-1||this.examing.exam.state==1){
            axios
                .post(`setUserExam/${this.examing.exam.id}`,this.multipleSelection)
                .then(resp => {
                    console.log(resp["data"].message);
                    alert(resp["data"].message);
                });
            this.addFormVisible=false;
            getExams();
        }else {
            axios
                .post(`updateExam/${this.examing.exam.id}`,this.multipleSelection)
                .then(resp => {
                    console.log(resp["data"].message);
                    alert(resp["data"].message)
                });
            this.addFormVisible=false;
            getExams();
        }

          for(var i=0;i<this.multipleSelection.length;i++){
              this.isshowSend=true;
          }
          //this.examing.tids = this.teachers;
          /*  axios
              .post("/exam/update/add/teacher", this.examing)
              .then(() => {
                Message.success("添加成功！");
              })
              .catch(() => {
                Message.warning("冲突警告：该监考老师在该时段已经有监考");
              });*/
      },
      sendmessage(row){
        console.log(row);

          axios
              .post(`/sendMessage/${row.account}/${this.examing.exam.id}`)
              .then(resp => {
                  console.log(resp["data"].message);
                  alert(resp["data"].message)
              });
      },
    add() {
      this.dialogFormVisible = true;
    },
    submitForm() {

      axios
        .post("/addExam", {course:this.exam.course,start:this.exam.startTime,end:this.exam.deadTime,number:this.exam.numOfPerson,
        location:this.exam.place,state:-1})
        .then(resp => {
            console.log(resp);
          if (resp && resp.status == 200) {
            Message.success("创建成功");
            this.dialogFormVisible = false;
            getExams();
          }
        })
        .catch(() => {
          Message.warning("检测到考场时间冲突，请重新选择教室或时间");
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

  }
};
</script>
