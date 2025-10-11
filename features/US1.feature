Feature: Agregar días y/o horas laborales a una fecha y hora dados

Background: Given Working Hours API está ejecutandose
              And Capta Holidays API está ejecutandose



Scenario Outline: Donald provee a la API <init-datetime> como fecha y hora iniciales y le suma <days> días
  When Donald provee una fecha y hora iniciales de <init-datetime>
    And Donald suma <days> número de días
  Then Donald recibe como respuesta <result-datetime> en UTC

Examples:
  | init-datetime             | days | result-datetime        |
  | 2025-10-07T09:00:00       | 1    | 2025-10-08T14:00:00Z   |
  | 2025-10-07T09:00:00       | 2    | 2025-10-09T14:00:00Z   |
  | 2025-10-07T09:00:00       | 7    | 2025-10-17T14:00:00Z   |
  | 2025-10-07T09:00:00       | 0    | 2025-10-07T14:00:00Z   |
  | 2025-10-10T09:00:00       | 1    | 2025-10-07T14:00:00Z   |
  | 2025-10-10T09:00:00       | 3    | 2025-10-16T14:00:00Z   |
  | 2025-10-10T09:00:00       | 7    | 2025-10-22T14:00:00Z   |


Scenario Outline: Donald provee a la API <init-datetime> como fecha y hora iniciales y le suma <hours> horas
  When Donald provee una fecha y hora iniciales de <init-datetime>
    And Donald suma <hours> número de horas
  Then Donald recibe como respuesta <result-datetime> en UTC

Examples:
  | init-datetime             | hours | result-datetime        |
  | 2025-10-07T09:00:00       | 1     | 2025-10-07T15:00:00Z   |
  | 2025-10-07T08:00:00       | 5     | 2025-10-07T19:00:00Z   |
  | 2025-10-07T16:00:00       | 1     | 2025-10-08T13:00:00Z   |
  | 2025-10-07T17:00:00       | 2     | 2025-10-08T14:00:00Z   |
  | 2025-10-07T16:00:00       | 6     | 2025-10-08T19:00:00Z   |
  | 2025-10-08T08:00:00       | 7     | 2025-10-08T21:00:00Z   |
  | 2025-10-09T08:00:00       | 8     | 2025-10-09T22:00:00Z   |
  | 2025-10-10T09:00:00       | 8     | 2025-10-14T14:00:00Z   |
