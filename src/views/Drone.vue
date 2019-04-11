<template>
  <div class="drone">
    <div class="rowrow" v-if="state !== 'CONNECTED'">
      <img style="width:200px" src="/img/drone.jpg">
    </div>
    <h1>Drone Controller</h1>
    <button v-if="state !== 'CONNECTED'" @click="connect" v-bind:class="classObject">Connect</button>
    <div v-if="state === 'CONNECTED'">
      <button @click="connect" v-bind:class="classObject">Connect</button>
      <button @click="takeOff">Take off</button>

      <div class="direction-pad">
        <div>
          <button @click="forward" class="up">⇧</button>
        </div>
        <div>
          <button @click="left" class="left">⇦</button>
          <button @click="hover" class="hover">Hover</button>
          <button @click="right" class="right">⇨</button>
        </div>
        <div>
          <button @click="backward" class="down">⇩</button>
        </div>
      </div>

      <button @click="flip">Flip</button>
      <button @click="land">Land</button>
      <button @click="emergency" class="emergency">Emergency Land</button>
    </div>
  </div>
</template>

<script>
import ParrotDrone from "../drone";

export default {
  name: "drone",
  data: function() {
    return {
      drone: ParrotDrone(),
      characteristic_command_instructions:
        "9a66fa0b-0800-9191-11e4-012d1540cb8e",
      characteristic_flight_params: "9a66fa0a-0800-9191-11e4-012d1540cb8e",
      characteristic_flightStatus: "9a66fb0e-0800-9191-11e4-012d1540cb8e",
      device: null,
      STATE_IDLE: "IDLE",
      STATE_CONNECTING: "CONNECTING",
      STATE_CONNECTED: "CONNECTED",
      STATE_DISCONNECTING: "DISCONNECTING",
      state: "IDLE",
      connectButton: "",
      classObject: ""
    };
  },
  methods: {
    connect: async function() {
      console.log("ask for request");
      if (this.state === this.STATE_IDLE) {
        try {
          // Connect...
          this.updateConnectionState(this.STATE_CONNECTING);
          await this.drone.connect(this.onDisconnectCallback);
          this.updateConnectionState(this.STATE_CONNECTED);
        } catch (e) {
          this.updateConnectionState(this.STATE_IDLE);
        }
      } else if (this.state === this.STATE_CONNECTED) {
        // Disconnect...
        this.updateConnectionState(this.STATE_DISCONNECTING);
        await this.drone.disconnect();
      }
    },
    updateConnectionState: function(newState) {
      this.state = newState;
      this.connectButton = this.getConnectButtonText(this.state);
      switch (this.state) {
        case this.STATE_CONNECTED:
          this.classObject = "connected";
          break;
        case this.STATE_CONNECTING:
        case this.STATE_DISCONNECTING:
          this.classObject = "pending";
          break;
        default:
          this.classObject = "";
      }
    },
    getConnectButtonText: function(state) {
      switch (state) {
        case this.STATE_CONNECTED:
          return "DISCONNECT";
        case this.STATE_CONNECTING:
          return "CONNECTING";
        case this.STATE_DISCONNECTING:
          return "DISCONNECTING";
        default:
          return "CONNECT";
      }
    },
    onDisconnectCallback: function() {
      this.updateConnectionState(this.STATE_IDLE);
    },
    takeOff: function() {
      this.drone.takeOff();
    },
    forward: function() {
      this.drone.moveForwards();
    },
    backward: function() {
      this.drone.moveBackwards();
    },
    left: function() {
      this.drone.moveLeft();
    },
    right: function() {
      this.drone.moveRight();
    },
    hover: function() {
      this.drone.hover();
    },
    flip: function() {
      this.drone.flip();
    },
    land: function() {
      this.drone.land();
    },
    emergency: function() {
      this.drone.emergencyCutOff();
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

button.emergency {
  width: 90%;
  width: -ms-calc(100% - 18px);
  width: calc(100% - 18px);
  background: #dd7052;
}

button.up,
button.left,
button.right,
button.down {
  background: #38545b;
  display: block;
  width: 31%;
  font-style: normal;
  font-size: 2em;
}

.direction-pad > div {
  text-align: center;
}

button.connected {
  background: #dd7052;
}

button.pending {
  background: #ddb752;
}

button.up {
  margin: 20px auto 0 auto;
}

button.down {
  margin: 0 auto 20px auto;
  clear: both;
}

button.left {
  float: left;
}

button.right {
  float: right;
}

button.hover {
  width: 26%;
  background: #38545b;
  font-style: normal;
  margin: 8px 0;
}

p {
  margin-top: 10px;
  text-align: center;
  color: #fff;
}

a {
  color: #fff;
}
</style>
