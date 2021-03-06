<template>
  <div id="app" class="frame">
    <el-backtop></el-backtop>
    <el-card class="box-card" shadow="hover" v-loading="isLoading">
      <div slot="header" class="clearfix">
        <span>Paste - {{ this.$route.params['pasteId'] }}</span>
        <div style="float: right">
          <el-button type="text" @click="doCopyText(pasteInfo.viewLink)" style="padding: 0px 0">
            copy link
            <i class="el-icon-share"></i>
          </el-button>
          <el-divider direction="vertical" style="padding: 0px 0"></el-divider>
          <el-button type="text" @click="goCreate()" style="padding: 0px 0">
            or create one
            <i class="el-icon-edit"></i>
          </el-button>
        </div>
      </div>
      <el-form ref="form" :model="pasteInfo" @submit.native.prevent label-width="120px">
        <el-form-item label="Poster">
          <el-input v-model="pasteInfo.poster" placeholder="poster name" readonly></el-input>
        </el-form-item>
        <el-form-item label="Language">
          <el-input v-model="pasteInfo.lang" placeholder="language" readonly></el-input>
        </el-form-item>
        <el-form-item label="Filename" v-if="pasteInfo.filename">
          <el-input v-model="pasteInfo.filename" placeholder="filename" readonly></el-input>
        </el-form-item>
        <el-form-item label="Created Time">
          <el-input v-model="pasteInfo.createdTime" placeholder="created time" readonly></el-input>
        </el-form-item>
        <el-form-item label="Expiration">
          <el-input v-model="pasteInfo.exp" placeholder="expiration" readonly></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" v-if="pasteInfo.code">
      <div slot="header" class="clearfix">
        <span>{{ pasteInfo.filename || 'Code' }}</span>
        <el-button
          type="text"
          v-if="pasteInfo.filename"
          @click="doCopyText(pasteInfo.filename)"
          style="margin: 0px 6px; padding: 0px 0px;"
        >
          <i class="el-icon-copy-document"></i>
        </el-button>
        <el-tooltip
          class="item"
          effect="dark"
          content="Copy the follow content"
          placement="left"
          style="float: right; padding: 0px 0"
        >
          <el-button type="text" @click="doCopyText(pasteInfo.code)">
            copy code
            <i class="el-icon-document-copy"></i>
          </el-button>
        </el-tooltip>
      </div>
      <div v-highlight>
        <pre>
            <code>{{ pasteInfo.code }}</code>
          </pre>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Viewer",
  data() {
    return {
      isLoading: true,
      pasteInfo: {}
    };
  },
  methods: {
    goCreate: function() {
      this.$router.push({ name: "Post" });
    },
    doCopyText: function(text) {
      this.$copyText(text).then(
        () => {
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
    }
  },
  mounted() {
    let pasteId = this.$route.params["pasteId"];
    this.$pastebin.setTitle(pasteId);
    this.$axios({
      method: "get",
      url: "/api/paste",
      params: {
        pasteId: pasteId
      }
    })
      .then(res => {
        switch (res.data["status"]) {
          case 200:
            this.$message({
              message: "Loaded Paste",
              type: "success"
            });
            this.pasteInfo = res.data["datas"];
            this.pasteInfo.viewLink = `${location.origin}${location.pathname}#${this.pasteInfo._id}`;
            this.isLoading = false;
            break;
          case 404:
            this.$message({
              duration: 0,
              message: "Paste not found",
              type: "error"
            });
            break;
          case 500:
            this.$message({
              duration: 0,
              message: "Server Error!",
              type: "error"
            });
            break;
        }
      })
      .catch(err => {
        this.$message({
          duration: 0,
          message: err,
          type: "error"
        });
      });
  }
};
</script>

<style>
@import url(https://cdn.jsdelivr.net/gh/tonsky/FiraCode@4/distr/fira_code.css);
code {
  font-family: "Fira Code", monospace;
  font-size: 10px;
}
.el-row {
  position: absolute;
}
.el-tooltip.item {
  margin-bottom: 0px;
}
pre {
  margin: 0em 0px;
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
</style>
