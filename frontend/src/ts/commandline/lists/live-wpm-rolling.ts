import * as UpdateConfig from "../../config";

const subgroup: MonkeyTypes.CommandsSubgroup = {
  title: "Current pace...",
  configKey: "showLiveWpmRolling",
  list: [
    {
      id: "setLiveWpmRollingOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setShowLiveWpmRolling(false);
      },
    },
    {
      id: "setLiveWpmRollingOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setShowLiveWpmRolling(true);
      },
    },
  ],
};

const commands: MonkeyTypes.Command[] = [
  {
    id: "changeLiveWpmRolling",
    display: "Current pace...",
    icon: "fa-stopwatch",
    subgroup,
  },
];

export default commands;
