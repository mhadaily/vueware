<template>
  <div class="home">
    <button v-if="!isConnected" v-on:click="request">{{isConnected ? "DISCONNECT" : "CONNECT"}}</button>
     <div class="rowrow" v-if="!isConnected">
      <img style="width:200px" src="/img/polar.jpg">
    </div>
    <h2>Heart Rate Zone tracker</h2>
    <p>
      We all have a personal resting heart rate, “a minimum heart rate” ,
      <br>and a maximum heart rate. And between these values
      <br>are different heart rate zones that correspond to training intensity and training benefit.
    </p>
    <br>
    <input v-model="age" placeholder="Enter your age">
    <br>
    <div class="rowrow" v-if="isConnected">
      <h2 v-if="body_location">
        <small>Located at:</small>
        {{ body_location }},
        <small>HR max:</small>
        {{targetHR}}
      </h2>
      <div class="heart" v-bind:class="`heart-${currentHearRateZone}`"></div>
      <h1 v-bind:class="currentHearRateZone">
        {{ heartRate }}
        <br>
        {{ currentHearRateZone }}
      </h1>
    </div>
    <h2 v-if="discountedMessage">{{ discountedMessage }}</h2>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  computed: {
    currentHearRateZone: function() {
      const current_target_hr_pct = (this.heartRate * 100) / this.targetHR;
      if (current_target_hr_pct > 90) {
        return "maximum";
      } else if (current_target_hr_pct > 80) {
        return "hard";
      } else if (current_target_hr_pct > 70) {
        return "moderate";
      } else if (current_target_hr_pct > 60) {
        return "light";
      } else {
        return "resting";
      }
    },
    targetHR: function() {
      return 220 - this.age;
    }
  },
  data: function() {
    return {
      discountedMessage: null,
      body_location: null,
      isConnected: false,
      age: 34,
      heartRate: 0
    };
  },
  components: {
    HelloWorld
  },
  methods: {
    onValueChange: function(event) {
      this.heartRate = this.$webBluetooth.parseValue(event).heartRate;
    },
    onDisconnected: function(event) {
      const device = event.target;
      this.discountedMessage = `Device ${
        device.name
      } is disconnected, please try again`;
    },
    onParseSensorLocation: function(sensorLocation) {
      switch (sensorLocation) {
        case 0:
          return "Other";
        case 1:
          return "Chest";
        case 2:
          return "Wrist";
        case 3:
          return "Finger";
        case 4:
          return "Hand";
        case 5:
          return "Ear Lobe";
        case 6:
          return "Foot";
        default:
          return "Unknown";
      }
    },
    request: async function() {
      try {
        this.discountedMessage = null;
        const { device, server } = await this.$webBluetooth.connect([
          "heart_rate"
        ]);

        device.addEventListener("gattserverdisconnected", this.onDisconnected);

        const {
          heart_rate_measurement,
          body_sensor_location
        } = await this.$webBluetooth.getCharacteristics(server, "heart_rate", [
          "heart_rate_measurement",
          "body_sensor_location"
        ]);

        const sensorLocation = await this.$webBluetooth.readValue(
          body_sensor_location
        );
        this.body_location = this.onParseSensorLocation(sensorLocation);

        this.isConnected = true;

        const _ = await heart_rate_measurement.startNotifications();
        heart_rate_measurement.addEventListener(
          "characteristicvaluechanged",
          this.onValueChange
        );
      } catch (e) {
        console.error(e);
      }
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
h1 {
  position: relative;
  color: rgba(1, 1, 1, 1);
  text-decoration: none;
  font-family: monospace;
  font-weight: 700;
  font-size: 3em;
  text-transform: capitalize;
  display: block;
  padding: 4px;
  border-radius: 8px;
  width: 410px;
  text-align: center;
  transition: all 0.1s ease;
  background-color: #f5f5f5;
  box-shadow: 0px 9px 0px #dedede, 0px 9px 25px rgba(0, 0, 0, 0.7);
  transition: background-color 0.5s ease;
}
h1:active {
  box-shadow: 0px 3px 0px rgba(245, 245, 245, 1), 0px 3px 6px rgba(0, 0, 0, 0.9);
  position: relative;
  top: 6px;
}
.maximum {
  color: rgba(255, 255, 255, 1);
  background-color: #cd2834;
  box-shadow: 0px 9px 0px #b52231, 0px 9px 25px rgba(0, 0, 0, 0.7);
  text-shadow: #b52231 1px, 1px, 2px;
}
.maximum:active {
  box-shadow: 0px 3px 0px rgba(219, 31, 5, 1), 0px 3px 6px rgba(0, 0, 0, 0.9);
}

.hard {
  color: rgba(255, 255, 255, 1);
  background-color: #ff8c00;
  box-shadow: 0px 9px 0px #e77f00, 0px 9px 25px rgba(0, 0, 0, 0.7);
  text-shadow: #e77f00 1px, 1px, 2px;
}
.hard:active {
  box-shadow: 0px 3px 0px rgba(255, 140, 0, 1), 0px 3px 6px rgba(0, 0, 0, 0.9);
}

.moderate {
  color: rgba(255, 255, 255, 1);
  background-color: #3cb371;
  box-shadow: 0px 9px 0px #36a266, 0px 9px 25px rgba(0, 0, 0, 0.7);
  text-shadow: #36a266 1px, 1px, 2px;
}
.moderate:active {
  box-shadow: 0px 3px 0px rgba(60, 179, 113, 1), 0px 3px 6px rgba(0, 0, 0, 0.9);
}

.light {
  color: rgba(255, 255, 255, 1);
  background-color: #1e90ff;
  box-shadow: 0px 9px 0px #1b82e7, 0px 9px 25px rgba(0, 0, 0, 0.7);
  text-shadow: #1b82e7 1px, 1px, 2px;
}
.light:active {
  box-shadow: 0px 3px 0px rgba(30, 144, 255, 1), 0px 3px 6px rgba(0, 0, 0, 0.9);
}

.resting {
  color: rgba(255, 255, 255, 1);
  background-color: #808080;
  box-shadow: 0px 9px 0px #747474, 0px 9px 25px rgba(0, 0, 0, 0.7);
  text-shadow: #747474 1px, 1px, 2px;
}
.resting:active {
  box-shadow: 0px 3px 0px rgba(128, 128, 128, 1), 0px 3px 6px rgba(0, 0, 0, 0.9);
}
.heart {
  position: relative;
  width: 100px;
  height: 90px;
  float: left;
  animation: one 1s infinite;
  animation-direction: alternate;
  &-light {
    animation: one 0.8s infinite;
  }
  &-moderate {
    animation: one 0.6s infinite;
  }
  &-hard {
    animation: one 0.4s infinite;
  }
  &-maximum {
    animation: one 0.2s infinite;
  }
}
.heart:before,
.heart:after {
  position: absolute;
  content: "";
  left: 50px;
  top: 0;
  width: 50px;
  height: 80px;
  background: #fc2e5a;
  border-radius: 50px 50px 0 0;
  transform: rotate(-45deg);
  transform-origin: 0 100%;
}
.heart:after {
  left: 0;
  transform: rotate(45deg);
  transform-origin: 100% 100%;
}
.rowrow {
  display: flex;
  flex-direction: column;
  align-items: center;
}
@keyframes one {
  0% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
}
</style>
