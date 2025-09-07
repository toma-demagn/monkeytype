import Config from "../config";
import * as TestState from "../test/test-state";
import * as ConfigEvent from "../observables/config-event";
import { get as getTypingSpeedUnit } from "../utils/typing-speed-units";
import * as TestInput from "./test-input";

const liveWpmElement = document.querySelector("#liveWpm") as Element;
const miniLiveWpmElement = document.querySelector(
  "#miniTimerAndLiveWpm .wpm"
) as Element;

function getRolling(): { wpm: number; raw: number } {
  const len = TestInput.wpmHistory.length;
  if (len === 0) return { wpm: 0, raw: 0 };
  const windowSec = Math.min(len, 3);
  const totalWpmNow = (TestInput.wpmHistory[len - 1] * len) / 12;
  const totalRawNow = (TestInput.rawHistory[len - 1] * len) / 12;
  let totalWpmPrev = 0;
  let totalRawPrev = 0;
  if (len > 3) {
    totalWpmPrev = (TestInput.wpmHistory[len - 4] * (len - 3)) / 12;
    totalRawPrev = (TestInput.rawHistory[len - 4] * (len - 3)) / 12;
  }
  return {
    wpm: ((totalWpmNow - totalWpmPrev) * 12) / windowSec,
    raw: ((totalRawNow - totalRawPrev) * 12) / windowSec,
  };
}

let last = { wpm: 0, raw: 0 };

export function update(wpm: number, raw: number): void {
  last = { wpm, raw };
  const rolling = getRolling();
  let number = wpm;
  let current = rolling.wpm;
  if (Config.blindMode) {
    number = raw;
    current = rolling.raw;
  }
  const typingSpeedUnit = getTypingSpeedUnit(Config.typingSpeedUnit);
  const cum = Math.round(typingSpeedUnit.fromWpm(number));
  const curr = Math.round(typingSpeedUnit.fromWpm(current));
  if (Config.showLiveWpmRolling) {
    miniLiveWpmElement.innerHTML = `${cum} (${curr})`;
    liveWpmElement.innerHTML = `${cum} (${curr})`;
  } else {
    miniLiveWpmElement.innerHTML = cum.toString();
    liveWpmElement.innerHTML = cum.toString();
  }
}

let state = false;

export function show(): void {
  if (!Config.showLiveWpm) return;
  if (!TestState.isActive) return;
  if (state) return;
  if (Config.timerStyle === "mini") {
    $(miniLiveWpmElement)
      .stop(true, false)
      .removeClass("hidden")
      .css("opacity", 0)
      .animate(
        {
          opacity: Config.timerOpacity,
        },
        125
      );
  } else {
    $(liveWpmElement)
      .stop(true, false)
      .removeClass("hidden")
      .css("opacity", 0)
      .animate(
        {
          opacity: Config.timerOpacity,
        },
        125
      );
  }
  state = true;
}

export function hide(): void {
  if (!state) return;
  $(liveWpmElement)
    .stop(true, false)
    .animate(
      {
        opacity: 0,
      },
      125,
      () => {
        liveWpmElement.classList.add("hidden");
      }
    );
  $(miniLiveWpmElement)
    .stop(true, false)
    .animate(
      {
        opacity: 0,
      },
      125,
      () => {
        miniLiveWpmElement.classList.add("hidden");
      }
    );
  state = false;
}

ConfigEvent.subscribe((eventKey, eventValue) => {
  if (eventKey === "showLiveWpm") eventValue ? show() : hide();
  if (eventKey === "showLiveWpmRolling") update(last.wpm, last.raw);
});
