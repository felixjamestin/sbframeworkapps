/*--------------------------------------------------
⭑ Description: This is a job that sends push
⭑ notifications to the secondbrain clients
----------------------------------------------------*/
const AWS = require("aws-sdk");
const requestpromise = require("request-promise");
const secondbrainApps = require("../../amplify/backend/function/sbapigetallitems/src/config");

// NOTE: Change when required
// const appKeyGlobal = "SECONDBRAIN";
const appKeyGlobal = "RAMANA_MAHARISHI_ENGLISH_DAILY";
// const appKeyGlobal = "TAO_ENGLISH_DAILY";

main();

async function main() {
  try {
    let initialItems = await getEntriesFromAirtable(appKeyGlobal);
    let allItems = await getAllEntriesIncludingOffsets(initialItems);
    let currentItem = _getRandomItem(allItems.records);

    console.log(allItems.records.length);
    console.log(currentItem);
  } catch (error) {
    console.error(error);
  }
}

async function getAllEntriesIncludingOffsets(items) {
  let offset = _getOffset(items);
  let offsetExists = _doesOffsetExist(offset);
  let nextItemPage;
  while (offsetExists === true) {
    nextItemPage = await getEntriesFromAirtable(appKeyGlobal, offset);
    items.records = items.records.concat(nextItemPage.records);
    // Update offset
    offset = _getOffset(nextItemPage);
    offsetExists = _doesOffsetExist(offset);
  }
  return items;
}

/*--------------------------------------------------
⭑ Component functions
----------------------------------------------------*/
function getEntriesFromAirtable(appKey, offset = "") {
  const appDetails = _getDetailsForAppKey(appKey, offset);
  console.log(appDetails);

  const requestOptions = {
    uri: appDetails.uri,
    method: "GET",
    json: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + appDetails.token
    }
  };

  return requestpromise(requestOptions);
}

function _getDetailsForAppKey(appKey, offset) {
  let appDetails = secondbrainApps.find(element => {
    return element.key === appKey;
  });

  let appURI = appDetails.uri;
  appURI = _addOffsetToURI(appURI, offset);

  return {
    key: appDetails.key,
    token: appDetails.token,
    uri: appURI,
    appUri: appDetails.appUri
  };
}

function _getOffset(items) {
  return items.offset;
}

function _doesOffsetExist(offset) {
  return offset !== "" && offset !== undefined && offset !== null
    ? true
    : false;
}

function _addOffsetToURI(uri, offset) {
  if (offset === "") return uri;
  uri = uri + "&offset=" + offset;
  return uri;
}

async function _logRemotely(value) {
  let timestamp = new Date();
  let body = {
    lines: [
      {
        app: timestamp,
        timestamp: timestamp,
        line: JSON.stringify(value)
      }
    ]
  };

  return requestpromise({
    url: "https://logs.logdna.com/logs/ingest?hostname=secondbrain",
    method: "POST",
    json: true,
    body: body,
    headers: {
      Authorization: "Basic NDc3Mjg3OWU2NmE5Y2U1Njg4Y2VkMzQxMjdhNTAwZWQ6",
      "Content-Type": "application/json"
    }
  });
}

function _getRandomItem(items) {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}
