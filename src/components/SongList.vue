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
  </ul>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Song from "../lib/song";
import SongListItem from "./SongListItem.vue";

@Component({
  components: {
    SongListItem
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

  handleSelect(index: number) {
    let song = this.songs[index];
    if (song) return this.$emit("select", song);

    throw new Error("Song of index not Exist.");
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
</style>
