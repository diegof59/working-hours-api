

export interface QueryWorkingHours {
  date?: string;
  days?: string;
  hours?: string;
}

export interface OkResponse {
  date: string; // ISO 8601 UTC DateTime
}

export interface ErrorResponse {
  error: string;
  message: string;
}


export interface WorkHours {
  // ToDo Date & Time ranges [en COL tz] to filter if DateTime is WH
}

export interface CalcHours {
  // ToDo DateTime en COL timezone to work with
}

export interface Holiday {
  // ToDo DateTimes COL Holidays gotten from Capta Holidays API
}
