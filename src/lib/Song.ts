import JSZip from "jszip";
import * as helper from "./beatmap-format-helper";
import { ISongInfoV2_0, IBeatMapV2_0 } from "@/model/common";
import { getType } from "mime";

export default class Song {
  cover: string;
  version: string;
  audio: string;
  info: ISongInfoV2_0;
  levels: {
    noteCount: number;
    obstacleCount: number;
  }[];
  files: File[];

  name: string;
  author: string;
  bpm: number;
  time: string;

  constructor(option: {
    cover: string;
    version: string;
    audio: string;
    time: string;
    info: ISongInfoV2_0;
    levels: IBeatMapV2_0[];
    files: File[];
  }) {
    this.cover = option.cover;
    this.version = option.version;
    this.audio = option.audio;
    this.info = option.info;
    this.time = option.time;
    this.files = option.files;

    this.levels = option.levels.map(level => ({
      noteCount: level._notes.length,
      obstacleCount: level._obstacles.length
    }));

    this.name = this.info._songName;
    this.author = this.info._songAuthorName;
    this.bpm = this.info._beatsPerMinute;

    // let audio = new Audio(this.audio);
    // audio.onload = () duration
  }

  static async createFromZip(zip: File) {
    let jsZip = await JSZip.loadAsync(zip);

    let findDirResult = Object.entries(jsZip.files).find(
      ([key, zipFile]) => zipFile.dir
    );
    if (!findDirResult) throw new Error("Zip file should contain a folder!");

    let dir = findDirResult[1];
    const DIRECT_FILE_IN_FOLDER_REG = new RegExp("^" + dir.name + "[^/]+$");

    let zipFiles = Object.entries(jsZip.files)
      .filter(
        ([filePath, zipFile]) =>
          DIRECT_FILE_IN_FOLDER_REG.test(filePath) && !zipFile.dir
      )
      .map(([_, zipFile]) => zipFile);

    let files = await Promise.all(
      zipFiles.map(async zipFile => {
        let fileName = zipFile.name.split("/").pop()!;
        let mime = getType(fileName);
        if (mime == null) throw new Error("Unkown mime type");
        let blob = await zipFile.async("blob");
        return new File([blob], fileName, {
          type: mime
        });
      })
    );

    return await this.createFromFolder(files);
  }
  static async createFromFolder(files: File[]) {
    let version = await helper.getVersion(files);

    files = await helper.adaptSongFiles(files);

    let songCover = await helper.getSongCoverDataUrl(files);
    let songAudio = await helper.getAudioDataUrl(files);
    let songInfo = (await helper.getSongInfo(files)) as ISongInfoV2_0;
    let beatmap = (await helper.getBeatmaps(files)) as IBeatMapV2_0[];
    let time = await helper.getAudioTime(files);

    return new Song({
      cover: songCover,
      version: version,
      audio: songAudio,
      info: songInfo,
      levels: beatmap,
      time: time,
      files: files
    });
  }
}
