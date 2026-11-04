export interface AudioPlayback {
  speaking: boolean;
  paused: boolean;
  finished: boolean;
  idx: number;
}

export const initialAudioPlayback: AudioPlayback = {
  speaking: false,
  paused: false,
  finished: false,
  idx: 0,
};

export type AudioAction =
  | { type: "play"; from?: number }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "stop" }
  | { type: "seek"; idx: number }
  | { type: "finish" }
  | { type: "reset" };

export function audioReducer(state: AudioPlayback, action: AudioAction): AudioPlayback {
  switch (action.type) {
    case "play":
      return {
        ...state,
        speaking: true,
        paused: false,
        finished: false,
        idx: typeof action.from === "number" ? action.from : state.idx,
      };
    case "pause":
      return { ...state, paused: true };
    case "resume":
      return { ...state, paused: false };
    case "stop":
      return { ...initialAudioPlayback };
    case "seek":
      return { ...state, idx: action.idx };
    case "finish":
      return { ...state, speaking: false, paused: false, finished: true };
    case "reset":
      return { ...initialAudioPlayback };
    default:
      return state;
  }
}
