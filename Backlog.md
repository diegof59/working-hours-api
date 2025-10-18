# Backlog: Working Hours API

## US1 - Agregar días y/o horas laborales a una fecha y hora dados

Como trabajador quiero sumar a una fecha y hora inicial, expresada en UTC, un número de días y/o horas, teniendo en cuenta horarios laborales y festivos en Colombia, con tal de saber la fecha y hora resultantes en periodo laboral, en UTC.

### Criterios de aceptación

Ver `US1.feature`

User : Trabajador <- Donald

Precondiciones:

  - Working Hours API está ejecutandose
  - Capta Holidays API está ejecutandose>

Rules:

  - Si la fecha y hora inicial no están dentro del horario laboral colombiano, la suma debe iniciar desde la última hora laboral válida
  - Los festivos obtenidos de la Capta Holidays API son días no laborales
  - response is a JSON with key date and value <result-datetime> 

Escenarios:

  1. Donald provee a la API <init-datetime> como fecha y hora inicial y le suma <days> días
    Donald recibe como respuesta <result-datetime> en UTC 
  2. Donald provee a la API <init-datetime> como fecha y hora inicial y le suma <hours> horas
    Donald recibe como respuesta <result-datetime> en UTC
  3. Donald provee a la API <init-datetime> como fecha y hora inicial y le suma <days> días y <hours> horas
    Donald recibe como respuesta <result-datetime> en UTC
  4. Donald provee a la API <init-datetime> como fecha y hora inicial pero no provee <days> días ni <hours> horas para sumar (Donald no provee argumentos al llamar la API) 
    Donald recibe como respuesta el error "InvalidParameters" con message "No se enviaron horas ni días a adicionar"

## US2 - Agregar días y/o horas laborales a la fecha y hora actual 

Como trabajador quiero sumar un número de días y/o horas a la fecha y hora actuales en Colombia, teniendo en cuenta horarios laborales y festivos en Colombia, con tal de saber la fecha y hora resultante en periodo laboral, en UTC.

### Criterios de aceptación

Ver `US2.feature`

User : Trabajador <- Dale

Precondiciones:
  - Working Hours API está ejecutandose
  - Capta Holidays API está ejecutandose>
  - Fecha y hora actual es simulada para control y es asignada <current-datetime>

Rules:

  - Si la fecha y hora inicial no están dentro del horario laboral colombiano, la suma debe iniciar desde la última hora laboral válida
  - Los festivos obtenidos de la Capta Holidays API son días no laborales
  - response is a JSON with key date and value <result-datetime> 

Escenarios:

  1. Dale provee a la API <days> días para sumar a la fecha y hora actual
    Dale recibe como respuesta <result-datetime> en UTC 
  2. Dale provee a la API <hours> horas para sumar a la fecha y hora actual
    Dale recibe como respuesta <result-datetime> en UTC 
  3. Dale provee a la API <days> y <hours> horas para sumar a la fecha y hora actual
    Dale recibe como respuesta <result-datetime> en UTC 
  4. Dale provee a la API <days> días y/o <hours> horas para sumar a la fecha y hora actual, pero no se puede obtener la fecha y hora actual
    Dale recibe como respuesta error "SystemError" y message "No se pudo obtener la fecha y hora actual"

