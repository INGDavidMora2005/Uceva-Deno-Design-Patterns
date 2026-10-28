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

import { COLORS } from "../../../helpers/colors.ts";

// Es el contrato común que comparten el componente concreto y todos los
// decoradores; por eso el cliente puede usar cualquiera sin saber cuántas capas
// tiene debajo.
interface Notifier {
  // Devuelve el mensaje final que se envió, para poder ver en la demo qué
  // transformaciones se aplicaron.
  send(message: string): string;
}

// Es el componente concreto: el objeto base que sí envía el mensaje, sin
// ninguna capa extra; los decoradores lo envolverán.
class BasicNotifier implements Notifier {
  // Envía el mensaje tal cual y lo devuelve sin cambios, para que las capas que
  // lo envuelvan puedan seguir transformándolo.
  send(message: string): string {
    const text = `📨 Enviando: ${message}`;
    console.log(`%c${text}`, COLORS.blue);
    return message;
  }
}

// Es el decorador base: implementa la misma interfaz Notifier y guarda una
// referencia a otro Notifier al que le delega el trabajo. Es la pieza que
// permite apilar capas, porque lo envuelto puede ser un BasicNotifier u otro
// decorador.
abstract class NotifierDecorator implements Notifier {
  // Recibe cualquier Notifier (composición, no herencia), por eso las capas son
  // intercambiables y apilables en cualquier orden.
  constructor(protected wrapped: Notifier) {}

  // Por defecto solo delega; los decoradores concretos lo sobrescriben para
  // transformar el mensaje antes de delegar.
  send(message: string): string {
    return this.wrapped.send(message);
  }
}

// Agrega la hora de envío al mensaje, para que quede registrado cuándo salió.
class TimestampDecorator extends NotifierDecorator {
  // La capa transforma el mensaje ANTES de delegar, por eso el decorador más
  // externo es el primero en actuar.
  override send(message: string): string {
    const time = new Date().toLocaleTimeString("es-CO", { hour12: false });
    const stamped = `[${time}] ${message}`;
    return super.send(stamped);
  }
}

// Simula comprimir el mensaje: no hace compresión real, solo normaliza los
// espacios para que el ejemplo sea didáctico.
class CompressDecorator extends NotifierDecorator {
  // Transforma antes de delegar; el texto queda marcado como comprimido de
  // forma simulada (no se reduce el tamaño real).
  override send(message: string): string {
    const compact = message.replace(/\s+/g, " ").trim();
    const compressed = `[ZIP:${compact}]`;
    return super.send(compressed);
  }
}

// Simula cifrar el mensaje: es un cifrado César de +3, no un cifrado real y no
// sirve como seguridad.
class EncryptDecorator extends NotifierDecorator {
  // Transforma antes de delegar. Solo se desplazan las letras sin tilde, así
  // que números, espacios y símbolos permanecen intactos.
  override send(message: string): string {
    const shifted = message.replace(/[a-zA-Z]/g, (char) => {
      const code = char.charCodeAt(0);
      const base = code >= 97 ? 97 : 65;
      const shiftedCode = ((code - base + 3) % 26) + base;
      return String.fromCharCode(shiftedCode);
    });
    const encrypted = `[ENC:${shifted}]`;
    return super.send(encrypted);
  }
}

// Es el código cliente: recibe un Notifier sin saber si es básico o está
// decorado, y muestra el mensaje final que se envió; así se demuestra que el
// cliente solo depende de la interfaz.
function showResult(notifier: Notifier, message: string): void {
  const result = notifier.send(message);
  const text = `→ Mensaje final: ${result}`;
  console.log(`%c${text}`, COLORS.cyan);
}

// Código cliente: construye notificadores con distintas capas apiladas y
// demuestra que el orden de las capas cambia el resultado.
function main(): void {
  const message = "Hola   equipo,  pedido 123 enviado";
  const original = `Mensaje original: ${message}`;
  console.log(`%c${original}`, COLORS.yellow);

  console.log(
    "%c=== 1. Sin decoradores (solo BasicNotifier) ===",
    COLORS.green,
  );
  const basic = new BasicNotifier();
  showResult(basic, message);

  console.log("%c=== 2. Una capa: solo marca de tiempo ===", COLORS.green);
  const withTime = new TimestampDecorator(new BasicNotifier());
  showResult(withTime, message);

  const titleA = "=== 3. Pila A: Cifrar(Comprimir(Hora(Básico))) ===";
  console.log(`%c${titleA}`, COLORS.green);
  const stackA = new EncryptDecorator(
    new CompressDecorator(new TimestampDecorator(new BasicNotifier())),
  );
  showResult(stackA, message);
  console.log(
    "El decorador más externo actúa primero: cifra, luego comprime y al final agrega la hora, así la hora queda legible por fuera.",
  );

  const titleB =
    "=== 4. Pila B: Hora(Comprimir(Cifrar(Básico))) — mismas capas, otro orden ===";
  console.log(`%c${titleB}`, COLORS.green);
  const stackB = new TimestampDecorator(
    new CompressDecorator(new EncryptDecorator(new BasicNotifier())),
  );
  showResult(stackB, message);
  const explanationB =
    "Primero se agrega la hora, luego se comprime y al final se cifra todo: la etiqueta ZIP se transforma en CLS porque quedó dentro de la capa de cifrado. Los dígitos de la hora no cambian porque el cifrado simulado solo desplaza letras.";
  console.log(explanationB);

  console.log(
    "Mismas capas, distinto orden → distinto resultado, sin crear una sola subclase nueva.",
  );
}

main();
