import {
  DifficultyModeEnum,
  CharacteristicNameEnum,
  EnvironmentEnum
} from "../common/enum";

export interface ISongInfo {
  /** @example "2.0.0" */
  _version: string;
  _songName: string;
  _songSubName: string;
  _songAuthorName: string;
  /** @example 166.0 */
  _beatsPerMinute: number;
  _songTimeOffset: number;
  _shuffle: number;
  _shufflePeriod: number;
  _previewStartTime: number;
  _previewDuration: number;
  /** @example "song.ogg" */
  _songFilename: string;
  _coverImageFilename: string;
  _environmentName: EnvironmentEnum;
  _difficultyBeatmapSets: ICharacteristicBeatmap[];
}

export interface ICharacteristicBeatmap {
  _beatmapCharacteristicName: CharacteristicNameEnum;
  _difficultyBeatmaps: IDifficultyBeatmap[];
}

export interface IDifficultyBeatmap {
  _difficulty: DifficultyModeEnum;
  _difficultyRank: number;
  /** @example "Easy.dat" */
  _beatmapFilename: string;
  _noteJumpMovementSpeed: number;
  _noteJumpStartBeatOffset: number;
}
