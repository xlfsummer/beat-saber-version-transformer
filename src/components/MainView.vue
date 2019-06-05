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
        <p> <button @click="transform">Transform</button> </p>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { ISongInfo, ISongInfoV1_5, ISongInfoV2_0 } from "../model/common/index";
import { readFileAsJSON } from "../utils/read-file-as-json";
import { readFileAsBase64 } from "../utils/read-file-as-base64";

@Component({
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

    handleChange(ev: Event){
        let input = ev.target as HTMLInputElement;
        if(!input.files || !input.files.length) return;
        
        this.files = Array.from(input.files);
        let infoFile = this.findInfoFile(this.files);
        this.readInfo(infoFile);
    }

    async readInfo(infoFile: File){
        let info = await readFileAsJSON(infoFile);

        if(!this.isInfo(info)) return;

        if(this.isInfo1_5(info)){
            this.songName = info.songName;
            let coverFile: File | undefined = this.files!.find(file => file.name == (info as ISongInfoV1_5).coverImagePath);
            if(coverFile) this.songCover = await readFileAsBase64(coverFile)
            this.version = "1.5";
        } else if(this.isInfo2_0(info)){
            this.songName = info._songName;
            let coverFile: File | undefined = this.files!.find(file => file.name == (info as ISongInfoV2_0)._coverImageFilename);
            if(coverFile) this.songCover = await readFileAsBase64(coverFile)
            this.version = "2.0";
        }
    }

    isInfo(info: any): info is ISongInfo{
       return typeof info == "object" && info.songName || info._songName;
    }
    isInfo2_0(info: ISongInfo): info is ISongInfoV2_0{
        return "_version" in info && info._version == "2.0.0";
    }
    isInfo1_5(info: ISongInfo): info is ISongInfoV1_5{
        return "songName" in info;
    }

    findInfoFile(files: File[]){
        let infoFile = files.find(file => /^info\./i.test(file.name));
        if(!infoFile) { throw new Error("can't find info.dat/info.json"); }
        return infoFile;
    }

    transform(){

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
