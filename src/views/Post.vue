<template>
  <div id="app" class="frame">
    <el-backtop></el-backtop>
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>New Paste</span>
        <el-tooltip
          class="item"
          effect="dark"
          content="Click and go to the search page"
          placement="left"
          style="float: right; padding: 0px 0"
        >
          <el-button type="text" @click="goSearch()">
            or search one
            <i class="el-icon-search"></i>
          </el-button>
        </el-tooltip>
      </div>
      <el-form
        ref="form"
        label-position="right"
        :model="form"
        @submit.native.prevent
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="Poster" prop="poster">
          <el-input
            v-model="form.poster"
            placeholder="your name (we will remeber this next time)"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="Language" prop="lang">
          <el-select
            v-model="form.lang"
            placeholder="select a language or create one"
            filterable
            allow-create
            style="width: 100%;"
          >
            <el-option
              v-for="(lang, index) in languages"
              v-bind:key="index"
              v-bind:label="lang.name"
              v-bind:value="lang.lang"
            >
              <span style="float: left">{{ lang.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">.{{ lang.lang }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Filename">
          <el-input v-model="form.filename" placeholder="(optional)" clearable></el-input>
        </el-form-item>
        <el-form-item label="Code" prop="code">
          <el-input
            type="textarea"
            v-model="form.code"
            placeholder="paste your code here"
            :autosize="{ minRows: 2 }"
          ></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="Expiration" prop="exp">
          <el-tooltip class="item" effect="dark" content="Recommend 1 hour" placement="right">
            <el-radio-group v-model="form.exp">
              <el-radio-button label="1 hour" value="1"></el-radio-button>
              <el-radio-button label="3 hours" value="3"></el-radio-button>
              <el-radio-button label="24 hours" value="24"></el-radio-button>
            </el-radio-group>
          </el-tooltip>
          <div style="float: right">
            <el-button
              type="danger"
              icon="el-icon-delete"
              plain
              v-if="form.code != ''"
              @click="form.code = ''"
            >Clear code</el-button>
            <el-button
              type="primary"
              icon="el-icon-upload2"
              :disabled="!isFromCompleted"
              :loading="isSubmitting"
              @click="onSubmit"
            >Submit</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- Dialog -->
    <el-dialog title="Paste Info" width="fit-content" :visible.sync="dialogVisible">
      <span>Paste ID:&nbsp;&nbsp;&nbsp;</span>
      <code>{{ pasteInfo._id }}</code>
      <br />
      <span>Link:&nbsp;&nbsp;&nbsp;</span>
      <el-link type="primary" :href="pasteInfo.viewLink">{{ pasteInfo.viewLink }}</el-link>
      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-view" @click="viewPaste">View</el-button>
        <el-button type="primary" icon="el-icon-copy-document" @click="copyId">Copy Link</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
var requiredWarningText = "Please fill in this item!";
export default {
  name: "Post",
  data() {
    return {
      form: {
        poster: localStorage.getItem("poster") || "",
        lang: "*",
        code: ""
      },
      pasteInfo: {},
      isSubmitting: false,
      dialogVisible: false,
      searchId: "",
      languages: [
        { name: "Plain Text", lang: "*" },
        { name: "Python", lang: "py" },
        { name: "Typescript", lang: "ts" },
        { name: "Javascript", lang: "js" },
        { name: "HTML", lang: "html" },
        { name: "CSS", lang: "css" },
        { name: "Vue", lang: "vue" }
      ],
      rules: {
        poster: [
          { required: true, message: requiredWarningText, trigger: "blur" }
        ],
        lang: [
          { required: true, message: requiredWarningText, trigger: "blur" }
        ],
        code: [
          { required: true, message: requiredWarningText, trigger: "blur" }
        ],
        exp: [{ required: true, message: requiredWarningText, trigger: "blur" }]
      }
    };
  },
  computed: {
    isFromCompleted: function() {
      return (
        ("poster" in this.form) &
        ("lang" in this.form) &
        ("code" in this.form) &
        ("exp" in this.form)
      );
    }
  },
  methods: {
    copyId: function() {
      this.$copyText(this.pasteInfo.viewLink).then(
        () => {
          this.dialogVisible = false;
          this.$message({
            message: "Copied",
            type: "success"
          });
        },
        () => {
          this.$message({
            message: "Can not copy",
            type: "error"
          });
        }
      );
    },
    viewPaste: function() {
      this.$router.push({
        name: "Viewer",
        params: { pasteId: this.pasteInfo._id }
      });
    },
    onSubmit: function() {
      this.isSubmitting = true;
      if (this.isFromCompleted) {
        this.$axios({
          method: "post",
          url: "/api/paste",
          data: this.form
        })
          .then(res => {
            switch (res.data["status"]) {
              case 200:
                this.$message({
                  message: "Submitted successfully",
                  type: "success"
                });
                this.pasteInfo = res.data["datas"];
                this.pasteInfo.viewLink = `${location.origin}${location.pathname}#${this.pasteInfo._id}`;
                this.dialogVisible = true;
                break;
              case 500:
                this.$message({
                  message: res.data["msg"],
                  type: "error"
                });
                break;
            }
          })
          .catch(err => {
            this.$message({
              message: `Failed, because ${err}`,
              type: "error"
            });
          });
        localStorage.setItem("poster", this.form.poster);
      } else {
        this.$message({
          message: "Incomplete form!",
          type: "error"
        });
      }
      this.isSubmitting = false;
      return false;
    },
    goSearch: function() {
      this.$router.push({ name: "Search" });
    }
  }
};
</script>

<style>
@import url(https://cdn.jsdelivr.net/gh/tonsky/FiraCode@4/distr/fira_code.css);
code {
  font-family: "Fira Code", monospace;
  font-size: 10px;
  color: #476582;
  padding: 0.25rem 0.5rem;
  background-color: rgba(27, 31, 35, 0.05);
}
.el-tooltip.item {
  margin-bottom: 0px;
}
.frame {
  width: 100%;
  margin-top: 0.32rem;
}
.el-card.box-card {
  width: 90%;
  margin: 10px 5%;
}
.text {
  font-size: 14px;
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
  width: 480px;
}
.el-textarea__inner {
  font-family: "Fira Code", monospace;
}
pre {
  display: block;
  font-family: monospace;
  white-space: pre;
  margin: -20px 0;
}
</style>
