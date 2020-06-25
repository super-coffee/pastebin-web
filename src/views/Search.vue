<template>
  <div id="app" class="frame">
    <el-card class="box-card" shadow="hover" v-loading="isLoading">
      <div slot="header" class="clearfix">
        <span>Search Paste</span>
        <el-tooltip
          class="item"
          effect="dark"
          content="Click and go to the create page"
          placement="left"
          style="float: right; padding: 0px 0"
        >
          <el-button type="text" @click="goCreate()">
            or create one
            <i class="el-icon-edit"></i>
          </el-button>
        </el-tooltip>
      </div>
      <el-form ref="form" :model="form" @submit.native.prevent label-width="80px">
        <el-form-item label="Paste ID">
          <el-input v-model="form.pasteId" placeholder="enter the Paste ID here" clearable></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
var requiredWarningText = "Paste ID is required";
export default {
  name: "Search",
  data() {
    return {
      form: { pasteId: "" },
      pasteInfo: {},
      isLoading: false,
      rules: {
        pasteid: [
          { required: true, message: requiredWarningText, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    pasteid: function() {
      return this.form.pasteId;
    }
  },
  watch: {
    pasteid: function() {
      let pasteid = this.form.pasteId.trim().toLowerCase();
      if (pasteid.length == 24) {
        this.isLoading = true;
        this.$router.push({
          name: "Viewer",
          params: { pasteId: this.form.pasteId }
        });
      }
    }
  },
  methods: {
    goCreate: function() {
      this.$router.push({ name: "Post" });
    }
  },
  mounted: function() {
    this.$pastebin.setTitle("Search");
  }
};
</script>

<style>
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
