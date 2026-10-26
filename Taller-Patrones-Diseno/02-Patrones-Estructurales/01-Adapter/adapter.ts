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
 * - ColdStorageMonitor: cliente; solo conoce TemperatureSensor.
 *
 * EJECUTAR: deno run Taller-Patrones-Diseno/02-Patrones-Estructurales/01-Adapter/adapter.ts
 */

import { COLORS } from "../../../helpers/colors.ts";

// Interfaz objetivo: es lo único que conoce el monitor de la bodega. Todo
// sensor, propio o de terceros, debe verse así para poder ser vigilado.
interface TemperatureSensor {
  name: string;
  // Temperatura actual siempre en grados Celsius.
  getCelsius(): number;
}

// Adaptado #1: sensor importado de EE. UU. Es código de un tercero y NO se
// puede modificar: no implementa TemperatureSensor, se identifica con
// "model" y reporta en °F con su propio método readFahrenheit().
class FahrenheitSensor {
  // La lectura llega fija por constructor para que la demo sea verificable.
  constructor(readonly model: string, private readonly fahrenheit: number) {}

  readFahrenheit(): number {
    return this.fahrenheit;
  }
}

// Adaptado #2: sensor de laboratorio, también de un tercero y sin poder
// modificarse. Su forma es otra: getReading() devuelve un objeto con el
// valor en Kelvin y su unidad, en vez de un número.
class KelvinSensor {
  constructor(readonly serial: string, private readonly kelvin: number) {}

  getReading(): { value: number; unit: "K" } {
    return { value: this.kelvin, unit: "K" };
  }
}

// Redondea a 1 decimal, que es la precisión que muestra el monitor.
const roundOneDecimal = (value: number) => Math.round(value * 10) / 10;

// Adaptador #1: cumple TemperatureSensor y ENVUELVE (composición) a un
// FahrenheitSensor. Traduce la interfaz (readFahrenheit -> getCelsius) y la
// unidad (°F -> °C) sin tocar el código del tercero.
class FahrenheitAdapter implements TemperatureSensor {
  name: string;

  constructor(private readonly sensor: FahrenheitSensor) {
    this.name = `Sensor EE. UU. ${sensor.model}`;
  }

  getCelsius(): number {
    const fahrenheit = this.sensor.readFahrenheit();
    return roundOneDecimal((fahrenheit - 32) * 5 / 9);
  }
}

// Adaptador #2: cumple TemperatureSensor y ENVUELVE a un KelvinSensor.
// Traduce la interfaz (getReading con objeto -> getCelsius con número) y la
// unidad (K -> °C) sin tocar el código del tercero.
class KelvinAdapter implements TemperatureSensor {
  name: string;

  constructor(private readonly sensor: KelvinSensor) {
    this.name = `Sensor laboratorio ${sensor.serial}`;
  }

  getCelsius(): number {
    const reading = this.sensor.getReading();
    return roundOneDecimal(reading.value - 273.15);
  }
}

// Cliente: el monitor de la bodega. Solo conoce TemperatureSensor, así que
// trata igual a todos los sensores y no tiene if/switch por tipo ni
// conversiones de unidades. Un sensor nuevo no obliga a modificarlo.
class ColdStorageMonitor {
  // Rango seguro para almacenar vacunas.
  private readonly MIN_CELSIUS = 2;
  private readonly MAX_CELSIUS = 8;

  constructor(private readonly sensors: TemperatureSensor[]) {}

  check(): void {
    const range = `${this.MIN_CELSIUS} °C a ${this.MAX_CELSIUS} °C`;
    console.log(
      `\n%cRevisión del monitor (rango seguro: ${range})`,
      COLORS.blue,
    );

    for (const sensor of this.sensors) {
      const celsius = sensor.getCelsius();
      const isSafe = celsius >= this.MIN_CELSIUS && celsius <= this.MAX_CELSIUS;
      const status = isSafe ? "OK" : "ALERTA";
      const color = isSafe ? COLORS.green : COLORS.red;
      console.log(`  ${sensor.name}: ${celsius} °C %c${status}`, color);
    }
  }
}

function main() {
  console.log("%c=== Bodega de cadena de frío con Adapter ===", COLORS.purple);

  // Sensores de terceros, con sus interfaces y unidades originales.
  const usaSensor = new FahrenheitSensor("TX-41", 41);
  const labSensor = new KelvinSensor("LAB-284", 284.15);

  console.log("\n%cLecturas originales (sin adaptar)", COLORS.blue);
  const fahrenheit = usaSensor.readFahrenheit();
  const reading = labSensor.getReading();
  console.log(`  ${usaSensor.model}: %c${fahrenheit} °F`, COLORS.yellow);
  console.log(
    `  ${labSensor.serial}: %c${reading.value} ${reading.unit}`,
    COLORS.yellow,
  );

  // Envueltos en adaptadores, ambos cumplen TemperatureSensor.
  const monitor = new ColdStorageMonitor([
    new FahrenheitAdapter(usaSensor),
    new KelvinAdapter(labSensor),
  ]);
  monitor.check();
}

main();
