<template>
  <div class="adb">
    <h1>Android Debug Bridge WebApp</h1>
    <button v-if="!vm" v-on:click="connect">{{vm ? "DISCONNECT" : "CONNECT"}}</button>
    <div class="box" v-show="vm">
      <div class>
        <button @click="install">install</button>
        <div class="item">
          <input
            type="text"
            @keyUp.enter="install"
            v-model="url"
            placeholder="/sdcard/Download/test.apk"
            class="stdin"
          >
        </div>
      </div>
      <br>
      <br>
      <div class>
        <div class="label">
          <button @click="() => list()">List Camera</button>
          <button @click="() => shell(shellStr)">Shell</button>
        </div>
        <br>
        <div class="item">
          <input
            type="text"
            @keyUp.enter="() => shell(shellStr)"
            v-model="shellStr"
            placeholder="ls /sdcard"
            class="stdin"
          >
        </div>
      </div>
      <br>
      <br>
      <div class="doconnect box">
        <div class>
          <button @click="() => download()">Download</button>
        </div>
      </div>
      <pre class="stdout" v-html="stdout"></pre>
    </div>
    <div v-show="loading" class="loading"></div>
  </div>
</template>

<script>
import { Adb } from "../webadb";

export default {
  name: "adb",
  data: function() {
    return {
      stdout: "",
      loading: false,
      url: "",
      vm: null,
      shellStr: "",
      boot: null
    };
  },
  methods: {
    async connect() {
      if (this.vm) {
        this.vm.close();
        this.vm = null;
        this.stdout = "";
        this.shellStr = "ls /sdcard/";
        this.url = "";
        this.boot = null;
        await this.sync.quit();
        this.sync = null;
        return;
      }
      try {
        this.vm = await Adb.open("WebUSB");
        this.boot = await this.vm.connectAdb("host::");
        this.sync = await this.boot.sync();
      } catch (error) {
        this.vm = null;
        this.boot = null;
        this.sync = null;
      }
    },
    async install() {
      this.loading = true;

      try {
        let data = await fetch(this.url).then(res =>
          Promise.resolve(res.blob())
        );
        let file = new File([data], "test.apk");
        await this.sync.push(file, "/sdcard/Download/test.apk", "0644", e => {
          console.log(e);
        });

        await this.shell("ls /sdcard/Download/");
      } catch (e) {
        console.log(e);
      }
      this.loading = false;
    },
    async shell(str) {
      let shell = await this.boot.shell(str);
      let decoder = new TextDecoder();
      let html = "";
      let r = null;
      r = await shell.receive();
      while (r.cmd == "WRTE") {
        if (r.data != null) {
          html += decoder.decode(r.data);
        }
        shell.send("OKAY");
        r = await shell.receive();
      }
      this.stdout = html;
    },
    async doshell() {},
    async list() {
      let shell = await this.boot.shell("ls /sdcard/DCIM/Camera");
      let decoder = new TextDecoder();
      let html = "";
      let r = null;
      r = await shell.receive();
      while (r.cmd == "WRTE") {
        if (r.data != null) {
          html += decoder.decode(r.data);
        }
        shell.send("OKAY");
        r = await shell.receive();
      }
      this.stdout = html;
    },
    async download() {
      let conetnt = await this.sync.pull("/sdcard/Download/test_webadb.txt");
      let a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([conetnt]));
      a.download = "test_webadb.txt";
      a.click();
    }
  }
};
</script>
<style lang="scss" scoped>
input {
  border: 0;
  padding: 30px;
  box-shadow: 2px 4px 10px #ccc;
  width: 50%;
  font-size: 150%;
  margin-bottom: 15px;
}
button {
  box-sizing: border-box;
  width: 40%;
  width: -webkit-calc(50% - 19px);
  width: calc(50% - 19px);
  height: 55px;
  margin: 8px;
  padding: 5px 0;
  background: #15619b;
  color: #fff;
  border: 0;
  border-radius: 4px;
  font-size: 1.2em;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
}
.loading {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
}
.stdin {
  padding: 8px;
}
.stdout {
  padding: 12px 16px;
}
</style>
