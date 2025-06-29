<template>
  <ul class="song-list">
    <li class="song-list-placeholder" v-if="!songs.length">
      Nothing choosed
    </li>
    <song-list-item
      class="song-item"
      v-for="(song, index) in songs"
      :key="index"
      :song="song"
      @click="handleSelect(index)"
    />
    <BeatButton
      class="song-list-button"
      v-if="songs.length"
      @click="transformAll"
      >transform all</BeatButton
    >
    <BeatModal :isShow="isShowLoading">Proccessing...</BeatModal>
  </ul>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Song from "../lib/song";
import JSZip from "jszip";
import { download } from "../utils/download";
import SongListItem from "./SongListItem.vue";
import BeatButton from "./common/BeatButton.vue";
import BeatModal from "./common/BeatModal.vue";

@Component({
  components: {
    SongListItem,
    BeatButton,
    BeatModal
  },
  props: {
    songs: {
      type: Array,
      required: true
    }
  }
})
export default class SongListVue extends Vue {
  @Prop() readonly songs!: Song[];

  isShowLoading: boolean = false;

  handleSelect(index: number) {
    let song = this.songs[index];
    if (song) return this.$emit("select", song);

    throw new Error("Song of index not Exist.");
  }

  async transformAll() {
    this.isShowLoading = true;
    try {
      let zip = new JSZip();
      this.songs.forEach(song => {
        let wrapFolder = zip.folder(song.name);
        song.files.forEach(file => {
          if (!wrapFolder) {
            throw new Error("Wrap folder not exist.");
          }
          return wrapFolder.file(file.name, file);
        });
      });
      let zipFile = new File(
        [await zip.generateAsync({ type: "blob" })],
        `${this.songs[0].name} and other ${this.songs.length} songs.zip`
      );
      this.isShowLoading = false;
      download(zipFile);
    } finally {
      this.isShowLoading = false;
    }
  }
}
</script>

<style scoped>
.song-list {
  margin-top: 2px;
  height: 306px;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow-y: auto;
}
.song-item {
  flex: none;
}
.song-list-placeholder {
  display: flex;
  flex: 1;
  grid-area: all;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
}
.song-list-button {
  margin-top: 10px;
}
</style>
