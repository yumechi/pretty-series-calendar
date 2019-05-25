import { envProperty } from "./util";

/** TOKEN KEY */
const AUTH_TOKEN_KEY = "AUTH_TOKEN";

function createHeader() {
  const authToken: string = envProperty(AUTH_TOKEN_KEY);
  const header = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${authToken}`,
  };
  return header;
}

// ref: https://qiita.com/n0bisuke/items/a31a99232e50461eb00f
// ref: https://qiita.com/nkgr/items/610c9e09dca06338c5f1
export class RequestHttp {
  public static get = (url: string) => {
    return RequestHttp.request(url, "get", {});
  }

  public static post = (url: string, data: {}) => {
    return RequestHttp.request(url, "post", data);
  }

  public static put = (url: string, data: {}) => {
    return RequestHttp.request(url, "put", data);
  }

  public static delete = (url: string) => {
    return RequestHttp.request(url, "delete", {});
  }

  private static request = (url: string, method: string, stringdata: {}) => {
    const options: {} = {
      method: method.toLowerCase(),
      headers: createHeader(),
      payload: stringdata,
      muteHttpExceptions: true,
    };
    Logger.log(url);
    const req: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(
      url,
      options,
    );
    if (req.getResponseCode() >= 300) {
      Logger.log(
        `Error: status=${req.getResponseCode()} body=${req.getContentText()}`,
      );
    }
    return req;
  }
}
