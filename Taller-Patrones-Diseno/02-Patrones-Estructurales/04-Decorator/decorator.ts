/**
 * PATRÓN: Decorator (Estructural)
 * AUTOR: Juan Diego Rodriguez
 *
 * ¿QUÉ HACE EL PATRÓN?
 * Permite agregar responsabilidades a un objeto de forma dinámica envolviéndolo
 * en otros objetos "decoradores" que comparten su misma interfaz, sin modificar
 * su clase ni usar herencia para cada combinación.
 *
 * PROBLEMA QUE SE RESUELVE
 * Escenario: un sistema de mensajería que envía notificaciones y necesita capas
 * opcionales que se pueden combinar: agregar marca de tiempo, comprimir y
 * cifrar el mensaje. Sin el patrón, habría que crear una subclase por cada
 * combinación (TimestampNotifier, CompressedEncryptedNotifier, etc.), lo que
 * produce una explosión de clases, o meter banderas y condicionales dentro de
 * una sola clase gigante. Además el ORDEN de las capas importa y con herencia
 * no se puede cambiar en tiempo de ejecución. Sin el patrón, cada capa nueva
 * multiplicaría el número de clases a mantener y el orden de las capas quedaría
 * fijado en el código: cualquier cambio de orden obligaría a escribir otra
 * subclase y a repetir la lógica de envío en cada una.
 *
 * ¿POR QUÉ ES ADECUADO?
 * Cada capa es un decorador pequeño con una única responsabilidad; se apilan en
 * el orden que se necesite al construir el objeto; el código cliente sigue
 * usando solo la interfaz Notifier sin saber cuántas capas hay; agregar una capa
 * nueva no obliga a tocar las existentes.
 *
 * PARTICIPANTES
 * - Notifier (interfaz): declara send(message: string): string; devuelve el mensaje final que se envió.
 * - BasicNotifier (componente concreto): envía el mensaje tal cual (simulado con console.log).
 * - NotifierDecorator (decorador base): clase abstracta que implementa Notifier y envuelve a otro Notifier por composición, delegándole el envío.
 * - TimestampDecorator (decorador concreto): antepone la fecha y hora al mensaje.
 * - CompressDecorator (decorador concreto): simula comprimir el mensaje.
 * - EncryptDecorator (decorador concreto): simula cifrar el mensaje.
 *
 * EJECUTAR: deno run Taller-Patrones-Diseno/02-Patrones-Estructurales/04-Decorator/decorator.ts
 */
