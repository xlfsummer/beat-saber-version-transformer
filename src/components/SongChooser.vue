<template>
  <div class="song-chooser">
    📁choose songs
    <input
      multiple
      class="file-selector"
      type="file"
      @change="handleChange"
      accept=".zip"
    />
  </div>
</template>

<script>
export default {
  methods: {
    handleChange(event) {
      this.$emit("change", event);
    }
  }
};
</script>

<style>
.song-chooser {
  width: 400px;
  height: 60px;
  background: rgba(0, 0, 0, 0.2);
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  position: relative;
}

.song-chooser:hover {
  background: #fff;
  color: var(--dark-accent);
}

.song-chooser .file-selector {
  opacity: 0;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
