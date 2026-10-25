/**
 * PATRÓN: Singleton (Creacional)
 * AUTOR: David Mora Duque
 *
 * ¿QUÉ HACE EL PATRÓN?
 * Garantiza que una clase tenga una única instancia y ofrece un punto
 * de acceso global a ella. Así, todas las partes del programa que la
 * usan comparten exactamente el mismo objeto y su mismo estado.
 *
 * PROBLEMA QUE SE RESUELVE
 * Varias partes de la aplicación necesitan escribir en el mismo
 * registro de mensajes. Si cada una crea su propio logger, los
 * mensajes quedan dispersos, sin un orden común ni un contador
 * compartido que refleje la actividad real del sistema.
 *
 * ¿POR QUÉ ES ADECUADO?
 * El Singleton asegura que todos usen el mismo Logger mediante un
 * constructor privado que impide crear instancias desde fuera, una
 * instancia estática y un getInstance() que siempre entrega la misma.
 *
 * PARTICIPANTES
 * - Logger: clase Singleton con constructor privado, instancia
 *   estática, getInstance() y métodos de registro por nivel (info,
 *   warn, error).
 *
 * Más información: https://refactoring.guru/es/design-patterns/singleton
 * EJECUTAR: deno run Taller-Patrones-Diseno/01-Patrones-Creacionales/06-Singleton/singleton.ts
 */

import { COLORS } from "../../../helpers/colors.ts";

/**
 * SINGLETON del patrón: una única instancia compartida con acceso
 * global. Toda la aplicación usa el mismo Logger y su mismo estado.
 */
class Logger {
  // Instancia estática y perezosa: se crea en getInstance() la
  // primera vez que se necesita y luego se reutiliza.
  private static instance: Logger | null = null;

  // Historial privado y compartido por formar parte de la instancia
  // única. Solo se expone mediante una vista de solo lectura.
  private entries: string[] = [];

  // Constructor privado: impide crear instancias con new Logger()
  // desde fuera, así nadie puede crear una segunda instancia.
  private constructor() {}

  static getInstance(): Logger {
    if (Logger.instance === null) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Devuelve el historial como vista de solo lectura para proteger
  // el estado compartido frente a modificaciones externas.
  getEntries(): readonly string[] {
    return this.entries;
  }

  getCount(): number {
    return this.entries.length;
  }

  private log(level: string, message: string, color: string): void {
    // El número consecutivo demuestra que el contador es común a toda
    // la aplicación.
    const position: number = this.entries.length + 1;
    const entry: string = `#${position} [${level.toUpperCase()}] ${message}`;

    this.entries.push(entry);
    console.log("%c" + entry, color);
  }

  // Métodos de registro (comportamiento de negocio): todos escriben en
  // el MISMO historial porque la instancia de Logger es única.
  info(message: string): void {
    this.log("info", message, COLORS.blue);
  }

  warn(message: string): void {
    this.log("warn", message, COLORS.orange);
  }

  error(message: string): void {
    this.log("error", message, COLORS.red);
  }
}

function authModule(): void {
  const logger: Logger = Logger.getInstance();
  logger.info("Usuario autenticado");
  logger.warn("Intento de acceso con contraseña antigua");
}

function paymentModule(): void {
  const logger: Logger = Logger.getInstance();
  logger.info("Pago iniciado");
  logger.error("Pago rechazado: fondos insuficientes");
}

function main(): void {
  console.log("%c=== 1. Una única instancia ===", COLORS.blue);

  // Ambas referencias apuntan al mismo objeto porque getInstance()
  // crea la instancia solo la primera vez.
  const loggerA: Logger = Logger.getInstance();
  const loggerB: Logger = Logger.getInstance();

  const sameInstance: boolean = loggerA === loggerB;
  console.log("¿loggerA y loggerB son la misma instancia?", sameInstance);

  console.log("%c=== 2. Módulos distintos, mismo logger ===", COLORS.green);

  // Aunque cada módulo pide su logger, todos comparten el historial
  // y por eso la numeración continúa de forma consecutiva.
  authModule();
  paymentModule();

  console.log("%c=== 3. Historial compartido ===", COLORS.purple);

  // loggerB ve las entradas creadas por authModule y paymentModule:
  // el estado pertenece a la instancia única, no a cada referencia.
  const entries: readonly string[] = loggerB.getEntries();
  const count: number = loggerB.getCount();

  console.log("Cantidad de mensajes registrados:", count);
  for (const entry of entries) {
    console.log(entry);
  }

  // Escribir `new Logger()` desde fuera no compila porque el
  // constructor es privado; esta es la garantía del Singleton.
}

main();
