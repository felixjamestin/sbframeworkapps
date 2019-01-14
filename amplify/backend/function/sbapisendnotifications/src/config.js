const Constants = require("./constants");

// NOTE: Add key for new apps
const secondbrainApps = [
  {
    key: Constants.appKeys.sb, // SECONDBRAIN
    token: "key34bOupUaggtKkP",
    uri:
      "https://api.airtable.com/v0/appfE7KsVoV5uiRhK/personal?maxRecords=1000&view=Grid%20view",
    appUri: ""
  },
  {
    key: Constants.appKeys.rmed, // RAMANA_MAHARISHI_ENGLISH_DAILY
    token: "key34bOupUaggtKkP",
    uri:
      "https://api.airtable.com/v0/appfE7KsVoV5uiRhK/ramanamaharishidaily?maxRecords=1000&view=Grid%20view",
    appUri: "https://goo.gl/HpyVKC"
  },
  {
    key: Constants.appKeys.ted, // TAO_ENGLIGH_DAILY
    token: "key34bOupUaggtKkP",
    uri:
      "https://api.airtable.com/v0/appfE7KsVoV5uiRhK/taodaily?maxRecords=1000&view=Grid%20view",
    appUri: ""
  },
  {
    key: Constants.appKeys.red, // RUMI_ENGLIGH_DAILY
    token: "key34bOupUaggtKkP",
    uri:
      "https://api.airtable.com/v0/appfE7KsVoV5uiRhK/personal?maxRecords=1000&view=Grid%20view",
    appUri: ""
  }
];

module.exports = secondbrainApps;
