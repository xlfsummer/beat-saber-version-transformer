import { getSongInfo, isInfoVersion1_5, getJsonByPath, isBeatmapVersion1_5 } from "./beatmap-format-helper";
import { ISongInfoV2_0, IBeatMap, IBeatMapV1_5, CharacteristicNameEnum, IBeatMapV2_0, ISongInfoV1_5, EnvironmentEnum } from "../model/common";
// import {  } from '../model/common/enum';
import { IDifficultyBeatmap } from '../model/v2.0/info';
import { readFileAsJSON } from '@/utils/read-file-as-json';

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
        if(!srcFiles) throw new Error("file not exist!");
        let info = await getSongInfo(srcFiles);
        if(!isInfoVersion1_5(info)) throw new Error("song version not 1.5.0");
        let firstLevelInfo = info.difficultyLevels[0];
        let firstBeatMap = await getJsonByPath(srcFiles, info.difficultyLevels[0].jsonPath) as IBeatMapV1_5;


        
        let distSongInfoData: ISongInfoV2_0 = {
            _songName: info.songName,
            _songSubName: info.songSubName,
            _songAuthorName: info.authorName,
            _coverImageFilename: info.coverImagePath,
            _songFilename: firstLevelInfo.audioPath,
            _beatsPerMinute: info.beatsPerMinute,
            _version: "2.0.0",
            _shuffle: 0,
            _shufflePeriod: firstBeatMap._shufflePeriod,
            _environmentName: info.environmentName || EnvironmentEnum.Default,
            _previewDuration: info.previewDuration,
            _difficultyBeatmapSets: [{
                _beatmapCharacteristicName: CharacteristicNameEnum.Standard,
                _difficultyBeatmaps: info.difficultyLevels.map<IDifficultyBeatmap>(srcLevelInfo => ({
                    _beatmapFilename: srcLevelInfo.jsonPath.replace(/\.json$/, ".dat"),
                    _difficulty: srcLevelInfo.difficulty,
                    _difficultyRank: srcLevelInfo.difficultyRank * 2 - 1,
                    _noteJumpMovementSpeed: firstBeatMap._noteJumpSpeed,
                    _noteJumpStartBeatOffset: 0, //srcLevelInfo.offset
                })).sort((lv1, lv2) => lv1._difficultyRank - lv2._difficultyRank)
            }],
            _previewStartTime: info.previewStartTime,
            _songTimeOffset: 0, // firstLevelInfo.offset
        };

        let distSongInfoFile = new File([JSON.stringify(distSongInfoData)], "Info.dat");

        let distBeatMapFiles = (
                await Promise.all(info.difficultyLevels.map(
                    async level => [
                        await getJsonByPath(this.originFiles!, level.jsonPath),
                        level.jsonPath
                    ] as [IBeatMapV1_5, string])
                )
            ).map<[IBeatMapV2_0, string]>(([srcBeatMapData, srcfileName]) => [
                {
                    _version: "2.0.0",
                    _events: srcBeatMapData._events,
                    _notes: srcBeatMapData._notes,
                    _obstacles: srcBeatMapData._obstacles
                },
                srcfileName.replace(/\.json$/, ".dat")
            ]).map(([distBeatMapData, distBeatMapFileName])=>
                new File([JSON.stringify(distBeatMapData)], distBeatMapFileName)
        );
        
        let songFile = this.originFiles!.find(file => file.name == firstLevelInfo.audioPath)!;

        let coverFile = (coverImagePath => this.originFiles!.find(file => coverImagePath))(info.coverImagePath)!;

        return [
            distSongInfoFile,
            songFile,
            coverFile,
            ...distBeatMapFiles
        ];
    }
}
