export interface IBeatMap {
  _version: string;
  _events: IBeatMapEvents[];
  _notes: IBeatMapNotes[];
  _obstacles: IBeatMapObstacles[];
}

interface IBeatMapEvents {
  _time: number;
  _type: number;
  _value: number;
}

interface IBeatMapNotes {
  _time: number;
  _lineIndex: number;
  _lineLayer: number;
  _type: number;
  _cutDirection: number;
}

interface IBeatMapObstacles {
  _time: number;
  _lineIndex: number;
  _type: number;
  _duration: number;
  _width: number;
}
