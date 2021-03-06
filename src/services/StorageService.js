import { AsyncStorage } from "react-native";
import { CustomizationHelper } from "../helpers/Index";

class StorageService {
  static async fetchData(appKey, entryID) {
    const localItems = await this._fetchLocalData(appKey, entryID);
    const isSyncRequired = await this._isSyncRequired(appKey);
    const syncedItems = isSyncRequired
      ? this._fetchSyncedData(appKey, entryID)
      : localItems;

    return syncedItems;
  }

  static async fetchConfigData(appKey) {
    let localDataKey = appKey + "userConfig";
    let userConfig = await this._getFromLocalStorage(localDataKey);

    if (this._checkIfValid(userConfig) === false) {
      userConfig = {
        ratingCompleted: false,
        ratingShownCount: 0,
        welcomeShown: false,
        appFirstOpened: Date.now()
      };
      this._setLocalStorage(localDataKey, userConfig);
    }

    return userConfig;
  }

  static async storeConfigData(appKey, userConfig) {
    let localDataKey = appKey + "userConfig";
    this._setLocalStorage(localDataKey, userConfig);
  }

  /*--------------------------------------------------
    ⭑ Private methods
  ----------------------------------------------------*/
  static async _fetchLocalData(appKey, entryID) {
    let localDataKey = appKey + "items";
    let items = await this._getFromLocalStorage(localDataKey);

    if (this._checkIfItemsAreValid(items) === true) {
      items.currentItem = this._getCurrentItem(items.allItems, entryID);
      return items;
    }
  }

  static async _isSyncRequired(appKey) {
    const lastSyncedAtKey = appKey + "lastSyncedAt";
    const lastSyncedAt = await this._getFromLocalStorage(lastSyncedAtKey);
    const cache_timeout_secs =
      CustomizationHelper.getConfig(appKey).cacheTimeout * 24 * 60 * 60 * 1000;

    let isSyncRequired =
      lastSyncedAt === null || lastSyncedAt + cache_timeout_secs < Date.now()
        ? true
        : false;

    return isSyncRequired;
  }

  static async _fetchSyncedData(appKey, entryID) {
    var items;
    try {
      // Fetch from Airtable
      const itemsFromCloud = await this._fetchDataFromAirtable(appKey, entryID);

      if (this._checkIfItemsAreValid(itemsFromCloud) === true) {
        await this._storeLocalData(appKey, itemsFromCloud); // Store into local data
        items = itemsFromCloud;
      } else {
        throw new Error("Items fetched from the cloud are invalid");
      }
    } catch (error) {
      // Timeout/invalid items? Fallback to locally stored data
      const localItems = await this._fetchLocalData(appKey, entryID);
      items = localItems;
    }

    return items;
  }

  static async _fetchDataFromAirtable(appKey, entryID) {
    const params = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };

    let url = this._getFetchURL(appKey, entryID);
    let response = await fetch(url, params);

    let responseJson = response.json();
    return responseJson;
  }

  static async _storeLocalData(appKey, items) {
    let localDataKey = appKey + "items";
    let lastSyncedAtKey = appKey + "lastSyncedAt";

    this._setLocalStorage(localDataKey, items);
    this._setLocalStorage(lastSyncedAtKey, Date.now());
  }

  static _getFetchURL(appKey, entryID) {
    const urlBase =
      "https://h9r2pkur9g.execute-api.us-east-1.amazonaws.com/Prod/items" +
      "?appKey=" +
      appKey;

    const fullUrl = entryID ? urlBase + "?entryID=" + entryID : urlBase;

    return fullUrl;
  }

  static async _getFromLocalStorage(key) {
    const result = await AsyncStorage.getItem(key);
    return JSON.parse(result);
  }

  static async _setLocalStorage(key, items) {
    AsyncStorage.setItem(key, JSON.stringify(items));
  }

  static _checkIfItemsAreValid(items) {
    let isValid =
      items !== null && items !== undefined
        ? items.allItems !== undefined
          ? true
          : false
        : false;

    return isValid;
  }

  static _checkIfValid(datum) {
    return datum !== null && datum !== undefined ? true : false;
  }

  static _getCurrentItem(items, entryID) {
    let item;

    switch (entryID) {
      case "":
        // Return random item if no specific entryID is requested
        item = this._getRandomItem(items);
        break;

      default:
        item = items.find(item => {
          return item.id === entryID;
        });

        if (item === undefined) {
          item = this._getRandomItem(items);
        }

        break;
    }

    return item;
  }

  static _getRandomItem(items) {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  }
}

export { StorageService };
