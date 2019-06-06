import { getSongInfo, isInfoVersion1_5 } from "./beatmap-format-helper";
import { ISongInfoV2_0 } from '@/model/common';

export default async function transform(files: File[]): Promise<File[]> {
    let t: Transformer = new Transformer(files);
    return t.transformTo2_0();
}

class Transformer {

    originFiles: File[] | null = null;
    outputFiles: File[] | null = null;

    constructor(files: File[]) {
        this.originFiles = files;
    }

    async transformTo2_0(): Promise<File[]> {
        let srcFiles = this.originFiles;
        if(!srcFiles) throw new Error("no file exist!");
        let info = await getSongInfo(srcFiles);
        if(!isInfoVersion1_5(info)) throw new Error("song version not 1.5.0");

        let distSongInfo: ISongInfoV2_0 = {
            _songName: "",
            _songSubName: "",
            _songAuthorName: "",
            _coverImageFilename: "",
            _songFilename: "",
            _beatsPerMinute: 0,
            _version: "2.0.0",
            _shuffle: 0,
            _shufflePeriod: 0,
            _environmentName: "DefaultEnvironment",
            _previewDuration: 0,
            _difficultyBeatmapSets: [],
            _previewStartTime: 0,
            _songTimeOffset: 0
        }
        return this.outputFiles!;
    }
}
