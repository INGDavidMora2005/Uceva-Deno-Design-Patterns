/**
 * PATRÓN: Adapter (Estructural)
 * AUTOR: Juan Pablo Devia
 *
 * ¿QUÉ HACE EL PATRÓN?
 * Pone una clase intermedia (el adaptador) entre el código cliente y un objeto
 * con una interfaz incompatible. El adaptador cumple la interfaz que el
 * cliente espera y, por dentro, traduce cada llamada a la forma que entiende
 * el objeto envuelto. Así dos piezas que no encajan trabajan juntas sin
 * modificar ninguna de las dos.
 *
 * PROBLEMA QUE SE RESUELVE
 * Una bodega de cadena de frío (vacunas y alimentos) tiene un sistema de
 * monitoreo que trabaja en °C y espera que todo sensor cumpla la interfaz
 * TemperatureSensor (name y getCelsius()). La bodega compró dos sensores de
 * terceros cuyo código NO se puede modificar: uno importado de EE. UU. que
 * reporta en °F con readFahrenheit(), y uno de laboratorio que reporta en
 * Kelvin con getReading(), que devuelve un objeto { value, unit: "K" }. Sin
 * el patrón, habría que llenar el monitor de if/switch por tipo de sensor y
 * de conversiones de unidades, o modificar el código de terceros (imposible).
 * Además, cada sensor nuevo obligaría a tocar otra vez el monitor.
 *
 * ¿POR QUÉ ES ADECUADO?
 * Cada adaptador envuelve a un sensor incompatible, traduce su interfaz (el
 * método que tiene) y su unidad (°F o K) a getCelsius(), que es lo único que
 * el monitor sabe usar. El monitor trata a todos los sensores igual y no
 * cambia; los sensores de terceros tampoco. Un sensor nuevo solo requiere su
 * propio adaptador.
 *
 * PARTICIPANTES
 * - TemperatureSensor: interfaz objetivo que espera el monitor.
 * - FahrenheitSensor, KelvinSensor: adaptados; sensores de terceros con
 *   interfaces y unidades incompatibles.
 * - FahrenheitAdapter, KelvinAdapter: adaptadores; implementan
 *   TemperatureSensor y convierten la lectura de su sensor a °C.
 * - Monitor de la bodega: cliente; solo conoce TemperatureSensor.
 *
 * EJECUTAR: deno run Taller-Patrones-Diseno/02-Patrones-Estructurales/01-Adapter/adapter.ts
 */

// Interfaz objetivo: es lo único que conoce el monitor de la bodega. Todo
// sensor, propio o de terceros, debe verse así para poder ser vigilado.
interface TemperatureSensor {
  name: string;
  // Temperatura actual siempre en grados Celsius.
  getCelsius(): number;
}
