<template>
  <div class="nfc">
    <h1>Web NFC</h1>
    <div>
      <button @click="readWriteNfc">NFC Read/Write</button>
      <br>
      <br>
      <button v-if="supported" @click="writeToTagOperator">Add Cachier for Webshop</button>
    </div>
    <pre>{{ log }}</pre>
  </div>
</template>

<script>
export default {
  name: "nfc",
  data: function() {
    return {
      log: "",
      supported: false
    };
  },
  methods: {
    writeToTagOperator: async function() {
      try {
        const data = {
          records: [
            {
              recordType: "json",
              mediaType: "application/json",
              data: {
                name: "Majid Hajian"
              }
            },
            {
              recordType: "json",
              mediaType: "application/json",
              data: {
                name: "VueDay Verona"
              }
            }
          ]
        };
        await navigator.nfc.push(data);
      } catch (e) {
        // console.log(e)
        this.log = "Something is wrong!";
      }
    },
    readWriteNfc: async function() {
      if ("nfc" in navigator) {
        this.supported = true;
        try {
          await navigator.nfc.watch(
            async message => {
              if (message.records[0].recordType === "empty") {
                this.log = `Tag is empty`;
                try {
                  await navigator.nfc.push({
                    records: [
                      {
                        recordType: "json",
                        mediaType: "application/json",
                        data: {
                          id: "12345678900987654321",
                          name: "Majid Hajian",
                          role: "Cachier"
                        }
                      }
                    ]
                  });
                } catch (e) {
                  console.log(e);
                  this.log = "Something is wrong!";
                }
              }
              message.records.forEach(record => {
                console.log(record);
                if (record.recordType == "text") {
                  this.log = "Data is string: " + record.data;
                } else if (record.recordType == "json") {
                  const obj = record.data;
                  this.log = `JSON data: ${obj.id.toString()}, ${obj.name.toString()}, ${obj.role.toString()}`;
                } else if (record.recordType == "url") {
                  this.log = "Data is URL: " + record.data;
                } else if (
                  record.recordType == "opaque" &&
                  record.mediaType == "image/png"
                ) {
                  this.log = "Known image/png data";
                  const img = document.createElement("img");
                  img.src = URL.createObjectURL(
                    new Blob(record.data, "image/png")
                  );
                  img.onload = function() {
                    window.URL.revokeObjectURL(this.src);
                  };
                }
              });
            },
            { mode: "any" }
          );
          this.log = "Added a watch.";
        } catch (err) {
          console.warn(err);
          this.log = "Adding watch failed: " + err.name;
        }
      } else {
        this.log = "NFC API not supported.";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
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
</style>
