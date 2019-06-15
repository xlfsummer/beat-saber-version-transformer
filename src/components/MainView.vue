<template>
  <div class="container">
    <h1>Beat Saber Map Transformer</h1>
    <p>Transform the map files from version 1.5 to 2.0.</p>
    <p>
      <label>Choose the song map <strong>folder</strong> (not zip file):</label>
    </p>
    <p>
      <input
        class="file-selector"
        type="file"
        webkitdirectory
        @input="handleChange"
        @change="handleChange"
      />
    </p>
    <img class="song-cover" :src="songCover" :alt="songName" />
    <ul class="song-info" v-if="songName">
      <li>《{{ songName }}》</li>
      <li>beatmap version: {{ version }}</li>
      <li><audio controls :src="songAudio" /></li>
    </ul>
    <p v-show="version == '2.0.0'">
      This is a version 2.0 map, you don't need to transform this map.
    </p>
    <p>
      <button v-if="files" :disabled="version != '1.5.0'" @click="transform">
        Transform &amp; Save
      </button>
    </p>
    <p v-if="transformed">
      Unzip the package to the beat saber custom levels folder. Then you should
      see it in game.<br />
      Folder path maybe
      <code
        >[path to steam]\Steam\steamapps\common\Beat Saber\Beat
        Saber_Data\CustomLevels\[song name]</code
      >
    </p>

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

import GithubButton from "vue-github-button";

@Component({
  components: {
    GithubButton
  },
  data() {
    return {
      files: null,
      songInfo: null,
      songName: "",
      version: "",
      transformed: false,
      songAudio: ""
    };
  }
})
export default class MainView extends Vue {
  files: File[] | null = null;
  songInfo: ISongInfo | null = null;
  songName: string = "";
  songCover: string = "";
  songAudio: string = "";
  version: string = "";
  transformed: boolean = false;

  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  async handleChange(ev: Event) {
    let input = ev.target as HTMLInputElement;
    if (!input.files || !input.files.length) return;

    let files = (this.files = Array.from(input.files));

    let songAudioFile = this.files.find(file => /\.ogg$/.test(file.name));
    debugger;
    songAudioFile && (this.songAudio = await readFileAsBase64(songAudioFile));
    [this.songName, this.songCover, this.version] = await Promise.all([
      getSongName(files),
      getSongCoverDataUrl(files).then(data => data || ""),
      getVersion(files)
    ]);
  }

  async transform() {
    let distFiles = await transform(this.files!);
    let zip = new JSZip();
    distFiles.forEach(file => zip.file(file.name, file));
    let zipFile = new File(
      [
        await zip.generateAsync({
          type: "blob"
        })
      ],
      `${this.songName}.zip`
    );
    download(zipFile);
    this.transformed = true;
  }
}
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.song-info {
  text-align: left;
}
.file-selector {
  margin: 20px auto;
}
.song-cover {
}

.tip {
  color: #999;
  font-size: 12px;
}
</style>
