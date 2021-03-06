/*--------------------------------------------------
⭑ Description: This is a job that sends push
⭑ notifications to the secondbrain clients
----------------------------------------------------*/
const AWS = require("aws-sdk");
const requestpromise = require("request-promise");
const secondbrainApps = require("../../amplify/backend/function/sbapigetallitems/src/constants");

// NOTE: Change when required
const appKeyGlobal = secondbrainApps.appKeys.ted;

main();

async function main() {
  try {
    // 1. Get random item from airtable
    let items = await getEntriesFromAirtable();
    let item = items.currentItem;

    console.log(item);
    await _logRemotely(item);

    // 2. Read push key off dynamo db
    let pushTokens = await getPushTokens();

    // 3. Call expo push api
    let result = await sendPushNotifications(item, pushTokens);
    console.log(`result: ${result}`);
    console.log("----");
  } catch (error) {
    console.error(error);
  }
}

/*--------------------------------------------------
⭑ Component functions
----------------------------------------------------*/

// 1. Read random item off airtable
function getEntriesFromAirtable() {
  const requestOptions = {
    uri:
      "https://h9r2pkur9g.execute-api.us-east-1.amazonaws.com/Prod/items" +
      "?appKey=" +
      appKeyGlobal,
    method: "GET",
    json: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };

  return requestpromise(requestOptions);
}

// 2. Read push key off dynamo db
function getPushTokens() {
  const dynamodb = new AWS.DynamoDB.DocumentClient({
    region: "us-east-1" //process.env.TABLE_REGION
  });

  const params = { TableName: "users", Limit: 1000 };

  return new Promise((resolve, reject) => {
    dynamodb.scan(params, function(err, data) {
      err === null ? resolve(data) : reject(err);
    });
  });
}

// 3. Call expo push api
function sendPushNotifications(randomEntry, pushTokens) {
  let { title, body } = getPushTextForEntry(randomEntry);

  const pushTokensExcludingExpoClient = pushTokens.Items.filter(item => {
    return item.appType !== "expo" ? true : true; // NOTE: Don't send to non-expo clients since this is for testing...
  });

  const pushTokensFilteredByAppKey = pushTokensExcludingExpoClient.filter(
    item => {
      return item.appKey === appKeyGlobal ? true : false;
    }
  );

  const pushBodyForRecepients = pushTokensFilteredByAppKey.map(item => {
    return {
      to: item.token,
      title: title,
      body: body,
      data: { id: randomEntry.id }
    };
  });

  const requestOptions = {
    url: "https://exp.host/--/api/v2/push/send",
    method: "POST",
    json: true,
    body: pushBodyForRecepients,
    headers: {}
  };

  return requestpromise(requestOptions);
}

/*--------------------------------------------------
   ⭑ Helpers
----------------------------------------------------*/
function getPushTextForEntry(item) {
  let pushContent = { title: "", body: "" };

  pushContent.title =
    item.fields.title !== undefined && item.fields.title !== "-"
      ? item.fields.title
      : item.fields.author !== undefined && item.fields.author !== "-"
      ? item.fields.author
      : item.fields.type;

  pushContent.body =
    item.fields.extract !== undefined && item.fields.extract !== "-"
      ? item.fields.extract
      : "Tap for details";

  pushContent.title = convertToSentenceCase(pushContent.title);
  pushContent.body = convertToSentenceCase(pushContent.body);

  return pushContent;
}

function convertToSentenceCase(string) {
  const sanitizedString = sanitizeString(string);
  let markDownRegex = /([#*]{1,5}\s["“']*\w|[\.\!\?]\s*\w)/g;
  let plainTextRegex = /(^\s*\w|[\.\!\?]\s*\w)/g;

  const sentenceCaseString = isTextInMarkdown(sanitizedString)
    ? sanitizedString.toLowerCase().replace(markDownRegex, function(c) {
        return c.toUpperCase(); // Detect for markdown
      })
    : sanitizedString.toLowerCase().replace(plainTextRegex, function(c) {
        return c.toUpperCase(); // Detect for plain text
      });

  return sentenceCaseString;
}

function sanitizeString(string) {
  return string ? string : "";
}

function isTextInMarkdown(text) {
  const firstSentence = text.split("\n")[0];
  const firstChar = firstSentence.trim().charAt(0);

  let isTextInMarkdown = false;
  const regex = /[#,*]/;
  if (regex.test(firstChar)) {
    isTextInMarkdown = true;
  }

  return isTextInMarkdown;
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
