<template>
    <div class="container">
        <p>
        <input class="file-selector" type="file" webkitdirectory
            @input="handleChange"
            @change="handleChange" />
        </p>
        <img :src="songCover" :alt="songName" />
        <ul class="song-info" v-if="songName">
            <li>《{{songName}}》</li>
            <li>beatmap version: {{version}}</li>
        </ul>
        <p> <button v-if="version == '1.5.0'" @click="transform">Transform</button> </p>
        <github-button
            href="https://github.com/xlfsummer/beat-saber-version-transformer"
            data-size="large"
            data-show-count="true"
            aria-label="xlfsummer/beat-saber-version-transformer">Star</github-button>
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
    data(){
        return {
            files: null,
            songInfo: null,
            songName: "",
            version: ""
        }
    }
})
export default class MainView extends Vue {

    files: File[] | null = null;
    songInfo: ISongInfo | null = null;
    songName: string = "";
    songCover: string = "";
    version: string = "";

    constructor(){
        super()
        this.handleChange = this.handleChange.bind(this);
    }

    async handleChange(ev: Event){
        let input = ev.target as HTMLInputElement;
        if(!input.files || !input.files.length) return;

        let files = this.files = Array.from(input.files);
        
        [
            this.songName,
            this.songCover,
            this.version
        ] = await Promise.all([
            getSongName(files),
            getSongCoverDataUrl(files).then(data => data || ""),
            getVersion(files)
        ]);
    }


    async transform(){
        let distFiles = await transform(this.files!);
        let zip = new JSZip();
        distFiles.forEach(file => zip.file(file.name, file));
        let zipFile = new File([await zip.generateAsync({
            type: "blob"
        })], `${this.songName}.zip`);
        download(zipFile)
    }
}
</script>

<style scoped>
.container{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
.song-info{
    text-align: left;
}
.file-selector{
    margin: 20px auto;
}
</style>
