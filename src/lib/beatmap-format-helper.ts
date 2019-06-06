import { ISongInfo, ISongInfoV1_5, ISongInfoV2_0, IBeatMap } from "../model/common/index";
import { readFileAsJSON } from "../utils/read-file-as-json";
import { readFileAsBase64 } from "../utils/read-file-as-base64";

export function findInfoFile(files: File[]): File{
    let infoFile = files.find(file => /^info\./i.test(file.name));
    if(!infoFile) { throw new Error("can't find info.dat or info.json"); }
    return infoFile;
}

export async function getSongInfo(files: File[]): Promise<ISongInfo> {
    let infoFile = findInfoFile(files);
    let info = await readFileAsJSON(infoFile);
    if(!isValidSongInfo(info)) throw new Error("Song Info not valid");
    return info;
}

export function isValidSongInfo(info: any): info is ISongInfo {
    return typeof info == "object" && info.songName || info._songName;
}
export function isInfoVersion2_0(info: ISongInfo): info is ISongInfoV2_0 {
    return "_version" in info && info._version == "2.0.0";
}
export function isInfoVersion1_5(info: ISongInfo): info is ISongInfoV1_5 {
    return "songName" in info;
}

export async function findCoverFile(files: File[]): Promise<File | null>{
    let songInfo = await getSongInfo(files);
    let coverFilePath = "";
    if(isInfoVersion1_5(songInfo)){
        coverFilePath = songInfo.coverImagePath;
    } else { // isInfoVersion2_0
        coverFilePath = songInfo._coverImageFilename;
    }
    let coverFile = files.find(file => file.name == coverFilePath) || null;
    return coverFile;
}

export async function getSongCoverDataUrl(files: File[]): Promise<string | null>{
    let coverFile = await findCoverFile(files);
    if(!coverFile) return null;
    let dataUrl = await readFileAsBase64(coverFile);
    return dataUrl;
}

export async function getSongName(files: File[]): Promise<string>{
    let info = await getSongInfo(files);
    if(isInfoVersion1_5(info)){
        return info.songName;
    }else{
        return info._songName;
    }
}

export async function getVersion(files: File[]): Promise<string>{
    let info = await getSongInfo(files);
    let version = "";
    if(isInfoVersion1_5(info)){
        version = "1.5.0"
    } else {
        version = info._version;
    }
    return version;
}

export async function findBeatmapsFiles(files: File[]): Promise<File[]>{
    let songInfo = await getSongInfo(files);
    let beatmapFilePaths: string[] = [];
    if(isInfoVersion1_5(songInfo)){
        let levelInfoList = songInfo.difficultyLevels;
        beatmapFilePaths = levelInfoList.map(levelInfo => levelInfo.jsonPath);
    } else if(isInfoVersion2_0(songInfo)){
        let characteristics = songInfo._difficultyBeatmapSets;
        let beatmaps = characteristics.flatMap(characteristic => characteristic._difficultyBeatmaps);
        beatmapFilePaths = beatmaps.map(beatmap => beatmap._beatmapFilename);
    }
    let beatmapFiles = files.filter(file => beatmapFilePaths.includes(file.name));
    return beatmapFiles;
}
