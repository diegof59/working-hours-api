# Working Hours API

A simple API with an endpoint that takes a date with or without time, a number of days and a number of hours and returns a date with time that is the given date added with the hours or days but considering the Colombian working days and hours, including holidays, and in UTC timezone. If no initial date is given, the system takes the current date and time in the America\Bogotá time zone (UTC -5). The initial date and time can be given with a timezone, according to the ISO 8601.

## Endpoints

`/api/v1/working-hours`


Query Params:

- DateTime: ISO 8601 string that is a date, datetime or datetime with timezone.
- Days: Non negative integer, number of work days to add to the DateTime.
- Hours: Non negative integer, number of work hours to add to the DateTime.

Response:

For a correct response, status 200. date is a string conforming to the ISO 8601 date in UTC timezone.

```JSON
  {
    "date": "2025-08-01T14:00:00Z"
  }
```

For a response with errors, status 400, 503, etc.

```JSON
  {
    "error": "InvalidParameters (Error type)",
    "message": "Detalle del error"
  }
```

## Tech Stack

Express JS with TypeScript.

