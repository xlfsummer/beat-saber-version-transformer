import { DifficultyModeEnum } from "../common/enum";

export interface ISongInfo {
    songName: string
    songSubName: string
    authorName: string
    beatsPerMinute: number
    previewStartTime: number
    previewDuration: number
    /** @example "cover.jpg" */
    coverImagePath: string
    oneSaber: boolean
    difficultyLevels: ILevelInfo[]
}

export interface ILevelInfo {
    difficulty: DifficultyModeEnum
    difficultyRank: number
    /** @example "song.ogg" */
    audioPath: string
    /** @example "Expert.json" */
    jsonPath: string
    /** @example -10 */
    offset: number
    /** @example -10 */
    oldOffset: number
    chromaToggle: "Off"
}
