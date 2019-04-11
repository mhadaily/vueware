<template>
  <div class="thermal">
    <div class="rowrow" v-if="!connected">
      <img style="width:200px" src="/img/printer.png">
    </div>
    <h1>Thermal printing</h1>
    <button
      @click="connect"
      v-bind:style="{background: connected ? '#ccc' : '#15619b'}"
    >{{!connected ? 'CONNECT' : 'DISCONNECT' }}</button>
    <div v-if="connected">
      <textarea v-model="message" placeholder="Add multiple lines"></textarea>
      <br>
      <button @click="print">Print</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "thermal",
  computed: {
    connected: function() {
      return !!this.device;
    }
  },
  data: function() {
    return {
      device: null,
      message: "",
      ENDPOINT: 3
    };
  },
  methods: {
    connect: async function() {
      if (this.device === null) {
        // get all connected usb devices
        const rawdevice = await navigator.usb.requestDevice({ filters: [] });
        // do the setup procedure on the connected device
        return this.setup(rawdevice);
      }
      return this.device;
    },
    print: async function() {
      // fetch value from input
      const string = this.message.trim();
      // use the built in TextEncoder to
      // convert a String to an Uint8Array containing utf-8 encoded text
      const encoder = new TextEncoder();
      const data = encoder.encode(string);
      // send the bytes to the printer
      await this.device.transferOut(this.ENDPOINT, data);
    },
    setup: async function(rawdevice) {
      // open the device (initiate communication)
      await rawdevice.open();
      // select the devices configuration descriptor
      await rawdevice.selectConfiguration(1);
      // claim the device interfaces
      rawdevice = await this.claimInterface(rawdevice);
      this.device = rawdevice;
      return rawdevice;
    },
    // walk over all interfaces of the device
    // check if they're claimed (and do claim them, if they're not yet)
    claimInterface: async function(d) {
      for (const config of d.configurations) {
        for (const iface of config.interfaces) {
          if (!iface.claimed) {
            await d.claimInterface(iface.interfaceNumber);
            return d;
          }
        }
      }
      return d;
    }
  }
};
</script>
<style lang="scss" scoped>
textarea {
  border: 0;
  padding: 30px;
  box-shadow: 2px 4px 10px #ccc;
  width: 40%;
  font-size: 150%;
  margin: 15px 0;
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
