import * as helper from "./beatmap-format-helper";
import { ISongInfoV2_0, IBeatMapV2_0 } from "@/model/common";
import { findSongFilesInZip } from "./beatmap-file-helper";

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
    let files = await findSongFilesInZip(zip);
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
