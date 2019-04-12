<template>
  <div class="webshop">
    <div class="row">
      <h2 class="operator error" v-if="!isAuth">
        Please authenticate yourself first.
        <br>
        <span v-if="operatorNotAllow">{{operatorNotAllow}}</span>
      </h2>
      <h4 class="operator success" v-if="isAuth">
        Operator ID: {{ operator.name }} |
        Operator Name: {{ operator.id }} |
        Operator Role: {{ operator.role }}
      </h4>
      <button
        v-if="isAuth"
        @click="connect"
        v-bind:style="{background: connected ? '#ccc' : '#15619b'}"
      >{{!connected ? 'CONNECT PRINTER' : 'DISCONNECT PRINTER' }}</button>
    </div>
    <div class="row" v-if="isAuth">
      <div class="col">
        <h2>Items</h2>
        <button @click="addSample">Add</button>
        <br>
        <div class="row">
          <div class="items" v-html="rowItems"></div>
        </div>
      </div>
      <div class="col">
        <h2>Reciepts</h2>
        <div class="print-area" v-html="receipt"></div>
        <br>
        <br>
        <br>
        <button @click="print" v-if="printCharacteristic">print</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "webshop",
  computed: {
    connected: function() {
      return !!this.device;
    },
    rowItems: function() {
      return this.items.reduce(
        (acc, item, i) =>
          (acc += `${i} - ${item.id} - ${item.name} - $${item.price} <br>`),
        ""
      );
    },
    receiptPrint: function() {
      return `${this.rowItems}<br>
    <br>
            ------------------------------- <br>
<br>
                                Total: $${this.items.reduce(
                                  (acc, item) => (acc += item.price),
                                  0
                                )} <br>`;
    },
    receipt: function() {
      const r = `
                  Here is your items <br>
<br>
            ${this.rowItems}<br>
    <br>
            ------------------------------- <br>
<br>
                                Total: $${this.items.reduce(
                                  (acc, item) => (acc += item.price),
                                  0
                                )} <br>
<br>
                Please keep this receipt <br>
               if you would like to exchange <br>
              your items within next 30 days. <br><br><br>

                    have a great day!<br>

                 Awesome Web Tech Shop<br>
      `;
      return r;
    }
  },
  data: function() {
    return {
      isAuth: false,
      operatorNotAllow: "",
      device: null,
      message: "",
      ENDPOINT: 3,
      printCharacteristic: null,
      operator: {
        id: "",
        name: "",
        role: ""
      },
      items: []
    };
  },
  created() {
    this.listenForAuthentication();
  },
  methods: {
    listenForAuthentication: async function() {
      if ("nfc" in navigator) {
        try {
          await navigator.nfc.watch(async message => {
            if (message.records[0].recordType === "empty") {
              return;
            }
            message.records.forEach(record => {
              console.log(record);
              if (record.recordType == "json") {
                if (record.data.id === "12345678900987654321") {
                  this.operator = record.data;
                  this.isAuth = true;
                } else if (record.data.id !== "12345678900987654321") {
                  this.operatorNotAllow = `${
                    record.data.name
                  }, sorry you are not allowed`;
                } else {
                  // detect products
                  this.items.push({
                    id: record.data.id,
                    price: record.data.price,
                    name: record.data.name
                  });
                }
              }
            });
          });
        } catch (err) {
          console.log("Adding watch failed: " + err.name);
        }
      } else {
        console.log("NFC Not Supported");
      }
    },
    addSample: function() {
      this.items.push({
        id: new Date().getTime(),
        name: "Book name 3",
        price: 67
      });
    },
    connect: async function() {
      if (this.printCharacteristic === null) {
        navigator.bluetooth
          .requestDevice({
            filters: [
              {
                services: ["000018f0-0000-1000-8000-00805f9b34fb"]
              }
            ]
          })
          .then(device => {
            console.log("> Found " + device.name);
            console.log("Connecting to GATT Server...");
            return device.gatt.connect();
          })
          .then(server =>
            server.getPrimaryService("000018f0-0000-1000-8000-00805f9b34fb")
          )
          .then(service =>
            service.getCharacteristic("00002af1-0000-1000-8000-00805f9b34fb")
          )
          .then(characteristic => {
            // Cache the characteristic
            this.printCharacteristic = characteristic;
          })
          .catch(e => console.log(e));
      }
      return this.device;
    },
    print: function() {
      // Get the bytes for the text
      const encoder = new TextEncoder();
      // Add line feed + carriage return chars to text
      const data = encoder.encode(this.receiptPrint.toString());
      return this.printCharacteristic.writeValue(data).then(() => {
        console.log("Write done.");
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.webshop {
  border: 1px solid #ccc;
  .row {
    display: flex;
    padding: 10px;
    @media (max-width: 600px) {
      flex-direction: column;
    }
    .col {
      flex: 1;
    }
  }
  .operator {
    flex: 1;
    justify-content: center;
  }
  .error {
    background: red;
    border-radius: 15px;
    padding: 10px;
    color: #fff;
  }
  .success {
    border: 1px solid #77e10e;
    border-radius: 15px;
    padding: 10px;
  }
  .items {
    font-size: 25px;
    @media (max-width: 600px) {
      font-size: 15px;
    }
    font-weight: bold;
    text-align: left;
    line-height: 1.8;
  }
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
</style>
