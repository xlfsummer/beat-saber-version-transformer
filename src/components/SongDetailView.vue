<template>
  <div class="song-detail-view">
    <template v-if="song">
      <div class="song-info">
        <img class="song-cover" :src="song.cover" alt="" />
        <h3 class="song-name">{{ song.name }}</h3>
        <p class="song-author">{{ song.author }}</p>
        <p class="song-attr-list">
          <span class="song-attr-item">Time: {{ song.time }}</span>
          <span class="song-attr-item">BPM: {{ song.bpm }}</span>
        </p>
        <audio controls class="song-audio" :src="song.audio" />
        <!-- <BeatButton>play</BeatButton> -->
      </div>
      <BeatButton class="action-btns" @click="transform"
        >transform song</BeatButton
      >
      <div class="level-info"></div>
    </template>
    <div v-else class="detail-placeholder">
      Nothing select
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Song from "../lib/Song";
import JSZip from "jszip";
import { download } from "../utils/download";

import BeatButton from "../components/common/BeatButton.vue";

@Component({
  components: {
    BeatButton
  },
  props: {
    song: {
      required: true
    }
  }
})
export default class SongDetailView extends Vue {
  @Prop(Song) readonly song!: Song;

  async transform() {
    let zip = new JSZip();
    let wrapFolder = zip.folder(this.song.name);
    this.song.files.forEach(file => wrapFolder.file(file.name, file));
    let zipFile = new File(
      [
        await zip.generateAsync({
          type: "blob"
        })
      ],
      `${this.song.name}.zip`
    );
    download(zipFile);
  }
}
</script>

<style scoped>
.song-detail-view {
  display: grid;
  grid:
    "song-info" auto
    "level-info" auto
    / 1fr;
}
.song-info {
  display: grid;
  height: 140px;
  grid:
    "song-cover song-name  " auto
    "song-cover song-author" auto
    "song-cover song-attrs " 1fr
    "song-cover song-audio " auto
    / auto 1fr;
  justify-content: start;
}

.song-cover {
  width: 140px;
  height: 140px;
  margin-right: 20px;
  grid-area: song-cover;
}
.song-name {
  margin: 0 0 10px;
  grid-area: song-name;
}
.song-author {
  grid-area: song-author;
  margin-bottom: 15px;
}
.song-attr-list {
  grid-area: song-attrs;
  /* display: flex; */
}
.song-attr-item {
  margin: 0 5px;
}
.action-audio {
  grid-area: song-audio;
}

.detail-placeholder {
  text-transform: uppercase;
  grid-area: 1 / 1 / -1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
