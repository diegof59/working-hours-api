

interface QueryWorkingHours {
  date?: string;
  days?: string;
  hours?: string;
}

interface OkResponse {
  date: string; // ISO 8601 UTC DateTime
}

interface ErrorResponse {
  error: string;
  message: string;
}


interface WorkHours {
  // ToDo Date & Time ranges [en COL tz] to filter if DateTime is WH
}

interface CalcHours {
  // ToDo DateTime en COL timezone to work with
}

interface Holiday {
  // ToDo DateTimes COL Holidays gotten from Capta Holidays API
}
