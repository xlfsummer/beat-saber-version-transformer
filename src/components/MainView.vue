<template>
  <div class="container">
    <app-header class="header" />
    <main class="body">
      <div class="list">
        <song-chooser @change="handleChange" />
        <song-list :songs="songs" @select="viewDetail" />
      </div>
      <song-detail-view class="detail" :song="detailSong" />
    </main>

    <footer class="footer">
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
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import { readFileAsJSON } from "../utils/read-file-as-json";
import { readFileAsBase64 } from "../utils/read-file-as-base64";
import {
  findInfoFile,
  isValidSongInfo,
  isInfoVersion1_5,
  isInfoVersion2_0,
  getSongCoverDataUrl,
  getSongName,
  getVersion
} from "../lib/beatmap-format-helper";
import { ISongInfo, ISongInfoV1_5, ISongInfoV2_0 } from "../model/common/index";
import transform from "../lib/transform1_5to2_0";
import JSZip from "jszip";
import { download } from "../utils/download";
import Song from "../lib/Song";

import AppHeader from "./AppHeader.vue";
import SongChooser from "./SongChooser.vue";
import SongList from "./SongList.vue";
import SongDetailView from "./SongDetailView.vue";
import GithubButton from "vue-github-button";

@Component({
  components: {
    AppHeader,
    SongChooser,
    SongList,
    SongDetailView,
    GithubButton
  },
  data() {
    return {
      files: null,
      songs: [],
      detailSong: null
    };
  }
})
export default class MainView extends Vue {
  files: File[] | null = null;
  songs: Song[] = [];
  detailSong: Song | null = null;

  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  async handleChange(ev: Event) {
    let input = ev.target as HTMLInputElement;
    if (!input.files || !input.files.length) return;
    let files = (this.files = Array.from(input.files));
    files.map(file =>
      Song.createFromZip(file).then(song => this.songs.push(song))
    );
  }

  viewDetail(song: Song) {
    this.detailSong = song;
  }
}
</script>

<style scoped>
.container {
  display: grid;
  height: 100%;

  grid:
    "header" auto
    "body  " auto
    "footer" auto
    / auto;
  align-items: center;
  place-content: center;
}

.header {
  grid-area: header;
}
.body {
  grid-area: body;
  display: grid;
  padding: 40px;
  box-sizing: border-box;
  grid:
    " list  detail" 1fr
    / 400px 510px;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
  background: var(--shadow-backgorund);
  border-radius: 20px;
  grid-column-gap: 40px;
}
.footer {
  margin-top: 20px;
  grid-area: footer;
}

.list {
  grid-area: list;
}
.detail {
  grid-area: detail;
}

.tip {
  color: #999;
  font-size: 12px;
}
</style>
