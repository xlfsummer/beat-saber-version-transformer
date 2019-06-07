import { getSongInfo, isInfoVersion1_5, getJsonByPath } from "./beatmap-format-helper";
import { ISongInfoV2_0, IBeatMap, IBeatMapV1_5 } from '@/model/common';

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
        let firstLevelInfo = info.difficultyLevels[0];
        let firstBeatMap = await getJsonByPath(srcFiles, info.difficultyLevels[0].jsonPath) as IBeatMapV1_5;

        let distSongInfo: ISongInfoV2_0 = {
            _songName: info.songName,
            _songSubName: info.songSubName,
            _songAuthorName: info.authorName,
            _coverImageFilename: info.coverImagePath,
            _songFilename: firstLevelInfo.audioPath,
            _beatsPerMinute: info.beatsPerMinute,
            _version: "2.0.0",
            _shuffle: 0,
            _shufflePeriod: firstBeatMap._shufflePeriod,
            _environmentName: "DefaultEnvironment",
            _previewDuration: info.previewDuration,
            _difficultyBeatmapSets: [],
            _previewStartTime: info.previewStartTime,
            _songTimeOffset: firstLevelInfo.offset
        };

        let distSongInfoBlob = new Blob([JSON.stringify(distSongInfo)]);
        
        return this.outputFiles!;
    }
}
