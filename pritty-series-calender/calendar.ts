import { CalendarUtil, envProperty } from './util';

/** calendar name */
const CALENDAR_KEY = "PRITTY_calendar_NAME";

/**
 * execution point
 */
function main() {
  const calander: GoogleAppsScript.Calendar.Calendar = CalendarUtil.getCalendar(
    envProperty(CALENDAR_KEY)
  );
  const sheet: GoogleAppsScript.Spreadsheet.Sheet = SpreadsheetApp.getActiveSheet();

  writeDate(calander, sheet);
}

/**
 * @param calendar
 * @param sheet
 * calendar format
 * `TimeStamp, EventName, StartDateTime, EndDateTime, Description, WriterName, EventID`
 * if EventID not fill, script create Event and fill EventID
 * @returns calendar, first matching by name
 */
function writeDate(
  calendar: GoogleAppsScript.Calendar.Calendar,
  sheet: GoogleAppsScript.Spreadsheet.Sheet
): void {
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
    timestamp: string,
    description: string,
    writeName: string
  ): string => {
    const df: string = Utilities.formatDate(
      new Date(timestamp),
      "Asia/Tokyo",
      "yyyy年MM月dd日HH時mm分"
    );
    return `${description}\n\n${df}に${writeName}ちゃんが教えてくれたよ！ありがとう！`;
  };

  const data: Object[][] = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const row: Object[] = data[i];
    if (row[eventKeyMap.EventID] === "") {
      const startDatetime = new Date(row[eventKeyMap.StartDateTime] as string);
      let endDateTime;
      if (row[eventKeyMap.EndDateTime]) {
        endDateTime = new Date(row[eventKeyMap.EndDateTime] as string);
      } else {
        endDateTime = startDatetime;
        data[i][eventKeyMap.EndDateTime] = startDatetime;
      }

      const option = {
        description: createDescription(
          row[eventKeyMap.TimeStamp] as string,
          row[eventKeyMap.Description] as string,
          row[eventKeyMap.WriterName] as string
        ),
      };
      const event = calendar.createEvent(
        row[eventKeyMap.EventName] as string,
        startDatetime,
        endDateTime,
        option
      );
      data[i][eventKeyMap.EventID] = event.getId();
      Logger.log(`Write Event: ${row[eventKeyMap.EventName]}`);
    }
  }

  // show ref: https://developers.google.com/apps-script/reference/spreadsheet/sheet#getrangerow-column-numrows-numcolumns
  // FIXME: it's all update, so bat performance
  sheet
    .getRange(1, 1, data.length, Object.keys(eventKeyMap).length)
    .setValues(data);
  Logger.log("Finish Write Events");
}
