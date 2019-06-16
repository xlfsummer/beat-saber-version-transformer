<template>
  <button class="beat-button" v-on="$listeners">
    <div class="beat-button-inner"><slot /></div>
  </button>
</template>

<script>
export default {};
</script>

<style scoped>
.beat-button {
  z-index: 0;
  font-size: 20px;
  text-transform: uppercase;
  height: 40px;
  line-height: 36px;
  padding: 0 30px;
  position: relative;
  border-radius: 60px;
  background: transparent;
  border: 2px solid #fff;
  color: #fff;
  cursor: pointer;
}

.beat-button::after {
  content: "";
  display: block;
  position: absolute;
  z-index: -1;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
}

.beat-button:hover::after {
  background: #fff;
  border-radius: 60px;
}

.beat-button:hover .beat-button-inner {
  z-index: 1;
  color: var(--dark-accent);
}

.beat-button:focus {
  outline: none;
}
</style>
