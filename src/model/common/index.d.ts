import { ISongInfo as ISongInfoV1_5 } from "../v1.5/info";
import { ISongInfo as ISongInfoV2_0 } from "../v2.0/info";
import { IBeatMap as IBeatMapV1_5 } from "../v1.5/beatmap";
import { IBeatMap as IBeatMapV2_0 } from "../v2.0/beatmap";

export type ISongInfo = ISongInfoV1_5 | ISongInfoV2_0;
export type IBeatMap = IBeatMapV1_5 | IBeatMapV2_0;

export {
    ISongInfoV1_5,
    ISongInfoV2_0,
    IBeatMapV1_5,
    IBeatMapV2_0
}
