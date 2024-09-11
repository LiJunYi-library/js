declare class DATE extends Date {
  setEndMilliseconds(): DATE;
  setEndSeconds(): DATE;
  setEndMinutes(): DATE;
  setEndHours(): DATE;
  setEndDay(): DATE;
  setEndMonth(): DATE;
  setEnd(parms?: string): DATE;
  setStartMilliseconds(): DATE;
  setStartSeconds(): DATE;
  setStartMinutes(): DATE;
  setStartHours(): DATE;
  setStartDay(): DATE;
  setStartMonth(): DATE;
  setStart(parms?: string): DATE;
  setAgo(parms?: DateOptions): DATE;
  fomatter(parms?: string): string;
  formatter(parms?: string): string;
  getChineseDay(): number;
  setWeek(week?: number): DATE;
  getWeek(): number;
  static surplusTime(endTime?: number): string;
  static cruateDate(stringTime?: string, format?: string): DATE;
  static formatterDate(stringTime?: string, format?: string): DATE;
  static fomatterDate(stringTime?: string, format?: string): DATE;
}

declare type DateOptions = {
  FullYear?: number;
  Month?: number;
  Date?: number;
  Hours?: number;
  Minutes?: number;
  Seconds?: number;
  Time?: number;
  Milliseconds?: number;
  Day?: number;
};

export { DATE, DateOptions };
