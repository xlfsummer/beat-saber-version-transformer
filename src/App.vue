<template>
  <div id="app">
    <MainView />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MainView from "./components/MainView.vue";

@Component({
  components: {
    MainView
  }
})
export default class App extends Vue {}
</script>

<style>
@import "./style/normalize.css";
@import "./style/var.css";
#app {
  display: flex;
  flex-direction: column;
  font-family: "Agency FB";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  background: darkblue;
  min-height: 100vh;
  height: 660px;
  background: linear-gradient(to bottom, #002338, #003759);
}
</style>
