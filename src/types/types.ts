

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

export interface TimeDelta {
  days?: number;
  hours?: number
}

export interface Holiday {
  date: `${number}-${number}-${number}`; // Enforces ISO date format yyyy-MM-dd
}
