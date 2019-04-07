/** Calender name */
let CALENDER_KEY = "PRITTY_CALENDER_NAME";

/**
 * execution point
 */
function main() {
  const calander = getCalender(envProperty(CALENDER_KEY));
  const sheet = SpreadsheetApp.getActiveSheet();

  writeDate(calander, sheet);
}

/**
 * @param calender_name
 * @returns Calender, first matching by name
 */
function getCalender(calender_name: string) {
  return getSingleCalenderByName(calender_name);
}

/**
 * @param key
 * @returns PropertyString, if not find key then return ''
 */
function envProperty(key: string): string {
  return PropertiesService.getScriptProperties().getProperty(key);
}

/**
 * @param name
 * @returns Calender, first matching by name
 */
function getSingleCalenderByName(name: string) {
  return CalendarApp.getCalendarsByName(name)[0];
}

/**
 * @param calender
 * @param sheet
 * calender format
 * `TimeStamp, EventName, StartDateTime, EndDateTime, Description, WriterName, EventID`
 * if EventID not fill, script create Event and fill EventID
 * @returns Calender, first matching by name
 */
function writeDate(calender, sheet) {
  if (!sheet) {
    Logger.log("sheet is null, please check user Sheet");
    return;
  }

  const eventKeyMap: { [key: string]: number } = {
    TimeStamp: 0,
    EventName: 1,
    StartDateTime: 2,
    EndDateTime: 3,
    Description: 4,
    WriterName: 5,
    EventID: 6,
  };
  Logger.log(eventKeyMap.length);

  const createDescription = (
    description: string,
    writeName: string,
  ): string => {
    return `${description}\n${writeName}ちゃんが教えてくれたよ！ありがとう！`;
  };

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[eventKeyMap.EventID] === "") {
      const startDatetime = new Date(row[eventKeyMap.StartDateTime]);
      const endDateTime = new Date(row[eventKeyMap.EndDateTime]);

      const option = {
        description: createDescription(
          row[eventKeyMap.Description],
          row[eventKeyMap.WriterName],
        ),
      };
      const event = calender.createEvent(
        row[eventKeyMap.EventName],
        startDatetime,
        endDateTime,
        option,
      );
      data[i][eventKeyMap.EventID] = event.getId();
      Logger.log(`Write Event: ${row[eventKeyMap.EventName]}`);
    }
  }

  // show ref: https://developers.google.com/apps-script/reference/spreadsheet/sheet#getrangerow-column-numrows-numcolumns
  // FIXME: it's all update, so bat performance
  sheet.getRange(1, 1, data.length, Object.keys(eventKeyMap).length).setValues(data);
  Logger.log("Finish Write Events");
}
