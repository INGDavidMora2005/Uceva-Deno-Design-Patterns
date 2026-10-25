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
