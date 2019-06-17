<template>
  <footer>
    <p class="tip">
      Open an issue if you have any question or advice using this tool.
    </p>
    <github-button
      href="https://github.com/xlfsummer/beat-saber-version-transformer"
      data-size="large"
      data-show-count="true"
      aria-label="xlfsummer/beat-saber-version-transformer"
      >Star</github-button
    >
  </footer>
</template>

<script>
import GithubButton from "vue-github-button";

export default {
  components: {
    GithubButton
  }
};
</script>

<style scoped>
footer {
  height: 46px;
  margin: 10px 0;
}
.tip {
  color: #999;
  font-size: 12px;
}
</style>
