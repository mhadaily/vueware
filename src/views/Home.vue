<template>
  <div class="home">
    <HelloWorld msg="Welcome to VueWare App"/>
    <div class="container">
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
    </div>
    <h6>
      Brought to you with Love by
      <a href="https://www.majidhajian.com">Majid Hajian</a>
    </h6>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  components: {
    HelloWorld
  }
};
</script>
<style lang="scss" scoped>
.container {
  position: absolute;
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: 10s rotate-container infinite ease-in-out alternate;
}

.box {
  position: absolute;
  border: 1px solid #8c9eff;
  width: 200px;
  height: 200px;
  animation: 10s rotate-square ease-in infinite alternate;
}
.box:nth-child(1) {
  --current: 9deg;
  transform: rotate(var(--current));
}
@keyframes rotate-square {
  0%,
  20% {
    transform: none;
  }
  70% {
    transform: rotate(var(--current));
  }
}
.box:nth-child(2) {
  --current: 18deg;
  transform: rotate(var(--current));
}
@keyframes rotate-square {
  0%,
  20% {
    transform: none;
  }
  70% {
    transform: rotate(var(--current));
  }
}
.box:nth-child(3) {
  --current: 27deg;
  transform: rotate(var(--current));
}
@keyframes rotate-square {
  0%,
  20% {
    transform: none;
  }
  70% {
    transform: rotate(var(--current));
  }
}
.box:nth-child(4) {
  --current: 36deg;
  transform: rotate(var(--current));
}
@keyframes rotate-square {
  0%,
  20% {
    transform: none;
  }
  70% {
    transform: rotate(var(--current));
  }
}
.box:nth-child(5) {
  --current: 45deg;
  transform: rotate(var(--current));
}
@keyframes rotate-square {
  0%,
  20% {
    transform: none;
  }
  70% {
    transform: rotate(var(--current));
  }
}
.box:nth-child(6) {
  --current: 54deg;
  transform: rotate(var(--current));
}
@keyframes rotate-square {
  0%,
  20% {
    transform: none;
  }
  70% {
    transform: rotate(var(--current));
  }
}
.box:nth-child(7) {
  --current: 63deg;
  transform: rotate(var(--current));
}
@keyframes rotate-square {
  0%,
  20% {
    transform: none;
  }
  70% {
    transform: rotate(var(--current));
  }
}
.box:nth-child(8) {
  --current: 72deg;
  transform: rotate(var(--current));
}
@keyframes rotate-square {
  0%,
  20% {
    transform: none;
  }
  70% {
    transform: rotate(var(--current));
  }
}
.box:nth-child(9) {
  --current: 81deg;
  transform: rotate(var(--current));
}
@keyframes rotate-square {
  0%,
  20% {
    transform: none;
  }
  70% {
    transform: rotate(var(--current));
  }
}
.box:nth-child(10) {
  --current: 90deg;
  transform: rotate(var(--current));
}
@keyframes rotate-square {
  0%,
  20% {
    transform: none;
  }
  70% {
    transform: rotate(var(--current));
  }
}

@keyframes rotate-container {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(720deg);
  }
}
</style>
