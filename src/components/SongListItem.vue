<template>
  <li class="song-item" @click="$emit('click')">
    <img class="song-cover" :src="song.cover" :alt="song.name" />
    <h2 class="song-name">{{ song.name }}</h2>
    <p class="song-author">{{ song.author }}</p>
    <div class="song-version">{{ song.version }}</div>
  </li>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Song from "../lib/Song";

@Component
export default class SongListItem extends Vue {
  @Prop(Song) readonly song!: Song;
}
</script>

<style scoped>
.song-item {
  display: grid;
  height: 60px;
  margin-top: 2px;
  background: var(--shadow-backgorund);
  align-items: center;
  justify-items: start;
  grid:
    "songCover  .           .            ." 10px
    "songCover  songName    songVersion  ." 1fr
    "songCover  songAuthor  songVersion  ." 1fr
    "songCover  .           .            ." 10px
    / auto 1fr auto 0;
  grid-column-gap: 10px;
  cursor: pointer;
}

.song-item:hover {
  background: #fff;
  color: var(--dark-accent);
}

.song-cover {
  grid-area: songCover;
  width: 60px;
  height: 60px;
}
.song-name {
  grid-area: songName;
  font-size: 20px;
  font-weight: normal;
  margin: 0;
}
.song-author {
  grid-area: songAuthor;
  font-size: 14px;
}
.song-version {
  grid-area: songVersion;
  place-self: start end;
}
</style>
