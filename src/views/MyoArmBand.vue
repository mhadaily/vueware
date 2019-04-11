<template>
  <div class="myo">
    <div class="rowrow" v-if="!connected">
      <img
        style="width:200px"
        src="/img/myo/myo.jpg"
      >
    </div>
    <button @click="connect" v-bind:style="{background: connected ? '#ccc' : '#15619b'}">{{!connected ? 'CONNECT' : 'DISCONNECT' }}</button>
    <div class="row" v-if="connected">
      <h3 v-if="batteryLevel"><small>Battery Level</small> {{batteryLevel}}</h3>
      <div class="arm">
        <div class="col">
          <h3>Arm Type (Left, Right)</h3>
          <h1>{{armType}}</h1>
          <h3>Arm Direction(wrist, Elbow)</h3>
          <h1>{{myoDirection}}</h1>
        </div>
        <div class="col">
          <h3>Arm position</h3>
          <img v-if="poseImage" v-bind:src="poseImage">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MyoWebBluetooth } from "@/myo-arm-band";
export default {
  name: "myo",
  data: function() {
    return {
      connected: false,
      poseImage: "",
      armType: "Empty",
      myoDirection: "Empty",
      batteryLevel: ""
    };
  },
  methods: {
    connect() {
      console.log("Connecting...");
      const myoController = new MyoWebBluetooth("Myo");
      myoController.connect();

      myoController.onStateChange(state => {
        this.connected = true;
        console.log({ state });
        this.batteryLevel = state.batteryLevel + "%";
        // const accelerometerData = state.accelerometer;
        // const gyroscopeData = state.gyroscope;
        const poseData = state.pose;
        // const emgData = state.emgData;
        // const orientationData = state.orientation;
        this.armType = state.armType;
        // const armSynced = state.armSynced;
        this.myoDirection = state.myoDirection;
        // const myoLocked = state.myoLocked;

        if (poseData) {
          switch (poseData) {
            case "fist":
              this.poseImage = "/img/myo/fist.jpg";
              break;
            case "wave out":
              this.poseImage = "/img/myo/wave-out.jpg";
              break;
            case "wave in":
              this.poseImage = "/img/myo/wave-in.jpg";
              break;
            case "double tap":
              this.poseImage = "/img/myo/double-tap.jpg";
              break;
            case "fingers spread":
              this.poseImage = "/img/myo/fingers-spread.jpg";
              break;
          }
        } else {
          this.poseImage = "/img/myo/sorry.jpeg";
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.rowrow {
  display: flex;
  align-items: center;
  justify-content: center;
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
.arm {
  display: flex;
  .col {
    flex: 1;
    img {
      width: 500px;
    }
  }
}
</style>
