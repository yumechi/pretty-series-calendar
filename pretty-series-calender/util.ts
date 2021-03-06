/**
 * My Calendar Rapper
 */
export class CalendarUtil {
  /**
   * @param calendarName
   * @returns calendar, first matching by name
   */
  static getCalendar = (
    calendarName: string
  ): GoogleAppsScript.Calendar.Calendar => {
    return CalendarUtil.getSingleCalendarByName(calendarName);
  };

  /**
   * @param name
   * @returns calendar, first matching by name
   */
  private static getSingleCalendarByName = (
    name: string
  ): GoogleAppsScript.Calendar.Calendar => {
    return CalendarApp.getCalendarsByName(name)[0];
  };
}

/**
 * @param key
 * @returns PropertyString, if not find key then return ''
 */
export function envProperty(key: string): string {
  return PropertiesService.getScriptProperties().getProperty(key);
}
