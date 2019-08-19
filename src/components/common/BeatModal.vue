<template>
  <dialog ref="dialog" @cancel.prevent>
    <slot />
  </dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

/**
 * 不可关闭的模态框
 */
@Component({
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isShow(newVal, oldVal) {
      let dialog = this.$refs.dialog as HTMLDialogElement;

      if (typeof dialog.showModal != "function") {
        return; //浏览器不支持 dialog
      }

      if (newVal) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  }
})
export default class BeatModal extends Vue {
  isShow: boolean = false;
  constructor() {
    super();
  }
}
</script>

<style scoped>
@keyframes blink {
  from {
    text-shadow: 0 0 20px var(--accent);
  }
  to {
    text-shadow: 0 0 5px var(--accent);
  }
}
dialog::backdrop {
  background: #0008;
}
dialog {
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  animation: blink 1s alternate infinite;
}
</style>
