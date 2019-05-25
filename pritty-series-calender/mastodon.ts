import { RequestHttp } from "./request";
import { envProperty } from "./util";

/** URL KEY */
const URL_KEY = "MASTODON_URL";

function request(resource: string, body: {}) {
  const _url = envProperty(URL_KEY) + resource;
  return RequestHttp.post(_url, JSON.stringify(body));
}

function createStatus(content: string) {
  return request("statuses", {
    visibility: "public",
    status: content,
  });
}

function testStatus(): void {
  const curerent_datetime = Utilities.formatDate(
    new Date(),
    "JST",
    "yyyy/MM/dd HH:mm:ss",
  );
  createStatus(`てすとだよー [GASから ${curerent_datetime}]`);
}

function testGetStatus(): void {
  const _url = envProperty(URL_KEY) + "statuses/102156254163117961";
  RequestHttp.get(_url);
}
