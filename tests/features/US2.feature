Feature: US2 - Agregar días y/o horas laborales a la fecha y hora actual

Background: Given Working Hours API está ejecutandose
              And Capta Holidays API está ejecutandose
              And Fecha y hora actual es simulada para control y es asignada <current-datetime>

# User : Trabajador <- Dale

Rule: Si la fecha y hora inicial no están dentro del horario laboral colombiano, la suma debe iniciar desde la última hora laboral válida

Rule: Los festivos obtenidos de la Capta Holidays API son días no laborales

Rule: response is a JSON with key date and value <result-datetime>

Scenario Outline: Dale provee a la API <days> días para sumar a la fecha y hora actual
  When Dale suma <days> número de día a la fecha y hora actual
  Then Dale recibe como respuesta <result-datetime> en UTC

Examples:
  | current-datetime          | days | result-datetime        |
  | 2025-10-07T14:00:00Z      | 1    | 2025-10-08T14:00:00Z   |
  | 2025-10-07T14:00:00Z      | 2    | 2025-10-09T14:00:00Z   |
  | 2025-10-07T14:00:00Z      | 7    | 2025-10-17T14:00:00Z   |
  | 2025-10-10T14:00:00Z      | 1    | 2025-10-14T14:00:00Z   |
  | 2025-10-10T14:00:00Z      | 3    | 2025-10-16T14:00:00Z   |
  | 2025-10-10T14:00:00Z      | 7    | 2025-10-22T14:00:00Z   |


Scenario Outline: Dale provee a la API <hours> horas para sumar a la fecha y hora actual
  When Dale suma <hours> número de horas a la fecha y hora actual
  Then Dale recibe como respuesta <result-datetime> en UTC

Examples:
  | current-datetime          | hours | result-datetime        |
  | 2025-10-07T14:00:00Z      | 1     | 2025-10-07T15:00:00Z   |
  | 2025-10-07T13:00:00Z      | 5     | 2025-10-07T19:00:00Z   |
  | 2025-10-07T21:00:00Z      | 1     | 2025-10-07T22:00:00Z   |
  | 2025-10-07T22:00:00Z      | 2     | 2025-10-08T15:00:00Z   |
  | 2025-10-07T21:00:00Z      | 6     | 2025-10-08T19:00:00Z   |
  | 2025-10-08T13:00:00Z      | 7     | 2025-10-08T21:00:00Z   |
  | 2025-10-09T13:00:00Z      | 8     | 2025-10-09T22:00:00Z   |
  | 2025-10-09T13:00:00Z      | 9     | 2025-10-10T14:00:00Z   |
  | 2025-10-11T19:00:00Z      | 1     | 2025-10-14T14:00:00Z   |
  | 2025-10-13T14:00:00Z      | 2     | 2025-10-14T15:00:00Z   |
  | 2025-10-12T15:00:00Z      | 3     | 2025-10-14T16:00:00Z   |
  | 2025-10-15T13:30:00Z      | 3     | 2025-10-15T16:30:00Z   |
  | 2025-10-06T17:45:00Z      | 2     | 2025-10-06T19:00:00Z   |


Scenario Outline: Dale provee a la API <days> y <hours> horas para sumar a la fecha y hora actual
  When Dale suma <days> número de días a la fecha y hora actual
    And Dale suma <hours> número de horas a la fecha y hora actual
  Then Dale recibe como respuesta <result-datetime> en UTC

Examples:
  | current-datetime          | days  | hours | result-datetime        |
  | 2025-10-07T14:00:00Z      | 1     | 1     | 2025-10-08T15:00:00Z   |
  | 2025-10-07T13:00:00Z      | 2     | 5     | 2025-10-09T19:00:00Z   |
  | 2025-10-07T21:00:00Z      | 7     | 1     | 2025-10-17T22:00:00Z   |
  | 2025-10-07T22:00:00Z      | 1     | 1     | 2025-10-09T14:00:00Z   |
  | 2025-10-07T21:00:00Z      | 3     | 6     | 2025-10-14T19:00:00Z   |
  | 2025-10-08T13:00:00Z      | 7     | 7     | 2025-10-20T21:00:00Z   |
  | 2025-10-09T13:00:00Z      | 8     | 8     | 2025-10-22T22:00:00Z   |
  | 2025-10-09T13:00:00Z      | 9     | 9     | 2025-10-24T14:00:00Z   |
  | 2025-10-11T17:00:00Z      | 1     | 1     | 2025-10-15T14:00:00Z   |
  | 2025-10-13T14:00:00Z      | 2     | 2     | 2025-10-16T15:00:00Z   |
  | 2025-10-12T10:00:00Z      | 3     | 3     | 2025-10-17T16:00:00Z   |
  | 2025-10-15T13:30:00Z      | 3     | 3     | 2025-10-20T16:30:00Z   |
  | 2025-10-06T17:45:00Z      | 2     | 2     | 2025-10-08T19:00:00Z   |

Scenario Outline: Dale no provee a la API ni <days> días ni <hours> horas para sumar a la fecha y hora actual
  When Dale no provee <days> días ni <hours> horas para sumar a la fecha y hora actual
  Then Dale recibe como respuesta el error "InvalidParameters" con message "No se enviaron horas ni días a adicionar"

Examples:
  | current-datetime     | days | hours | error               | message                           |
  | 2025-10-07T13:00:00Z |      |       | "InvalidParameters" | "No se enviaron horas ni días a adicionar" |
  | 2025-10-10T13:00:00Z |      |       | "InvalidParameters" | "No se enviaron horas ni días a adicionar" |

Scenario Outline: Dale provee a la API <days> días y/o <hours> horas para sumar a la fecha y hora actual, pero no se puede obtener la fecha y hora actual
  When Dale provee <days> días para sumar a la fecha y hora actual
     And Dale provee <hours> horas para sumar a la fecha y hora actual
     But No se puede obtener la fecha y hora actual <current-datetime>
  Then Dale recibe como respuesta error "SystemError" y message "No se pudo obtener la fecha y hora actual"

Examples:
  | current-datetime | days | hours | error         | message                                     |
  | <no-disponible>  |  1   |       | "SystemError" | "No se pudo obtener la fecha y hora actual" |
  | <no-disponible>  |      |   3   | "SystemError" | "No se pudo obtener la fecha y hora actual" |
  | <no-disponible>  |  2   |   5   | "SystemError" | "No se pudo obtener la fecha y hora actual" |

