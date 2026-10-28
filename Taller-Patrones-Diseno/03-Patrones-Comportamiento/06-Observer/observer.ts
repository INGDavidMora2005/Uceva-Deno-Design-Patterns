/**
 * PATRÓN: Observer (Comportamiento)
 * AUTOR: Juan Diego Rodriguez
 *
 * ¿QUÉ HACE EL PATRÓN?
 * Define una dependencia uno-a-muchos: cuando un objeto, el sujeto, cambia de
 * estado, avisa automáticamente a todos los observadores suscritos, sin
 * acoplarse a sus clases concretas.
 *
 * PROBLEMA QUE SE RESUELVE
 * Escenario: una tienda en línea cuyo producto cambia de precio o de stock y
 * varios clientes quieren enterarse por canales distintos (correo y app).
 * Si no existiera el patrón, la tienda tendría que conocer cada canal y
 * llamarlo a mano, o los clientes tendrían que consultar la tienda
 * constantemente (polling). Cada nuevo canal obligaría a modificar la clase de
 * la tienda, lo que genera alto acoplamiento, código repetido y riesgo de
 * romper lo que ya funcionaba; además, el polling desperdicia recursos y
 * retrasa el aviso.
 *
 * ¿POR QUÉ ES ADECUADO?
 * La tienda solo conoce la interfaz Observer, no las clases concretas de los
 * canales. Así se pueden agregar o quitar suscriptores en tiempo de ejecución
 * sin tocar la tienda, manteniendo bajo acoplamiento y facilitando extender el
 * sistema con nuevos canales de notificación.
 *
 * PARTICIPANTES
 * - Subject (interfaz): declara subscribe, unsubscribe y notify.
 * - Observer (interfaz): declara update(change: StoreChange).
 * - StoreChange: datos del cambio { product, type: "price" | "stock", oldValue, newValue }.
 * - Store: sujeto concreto; guarda un producto con precio y stock; al cambiarlos notifica a los suscriptores.
 * - EmailSubscriber: observador concreto que "envía un correo" (simulado con console.log).
 * - AppSubscriber: observador concreto que "envía una notificación push" (simulado con console.log).
 *
 * EJECUTAR: deno run Taller-Patrones-Diseno/03-Patrones-Comportamiento/06-Observer/observer.ts
 */

import { COLORS } from "../../../helpers/colors.ts";

// Es el mensaje que viaja del sujeto a los observadores; así cada observador
// sabe qué cambió sin tener que consultar a la tienda.
interface StoreChange {
  product: string;
  type: "price" | "stock";
  oldValue: number;
  newValue: number;
}

// La tienda solo conoce esta interfaz, nunca las clases concretas de los
// suscriptores (bajo acoplamiento).
interface Observer {
  update(change: StoreChange): void;
}

// Define cómo se agregan, se quitan y se avisa a los observadores en tiempo de
// ejecución.
interface Subject {
  subscribe(observer: Observer): void;
  unsubscribe(observer: Observer): void;
  notify(change: StoreChange): void;
}

// Es el sujeto observado: guarda el estado (precio y stock de un producto) y
// avisa a los observadores cuando cambia, sin conocer sus clases concretas.
class Store implements Subject {
  // Lista privada de observadores suscritos; es privada para que nadie fuera de
  // la tienda altere la suscripción a mano.
  private observers: Observer[] = [];

  constructor(
    private product: string,
    private price: number,
    private stock: number,
  ) {}

  // Evita duplicados: suscribirse dos veces haría que el mismo observador
  // recibiera la notificación repetida.
  subscribe(observer: Observer): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  // Quita por referencia para que un suscriptor pueda darse de baja sin afectar
  // a los demás.
  unsubscribe(observer: Observer): void {
    this.observers = this.observers.filter((item) => item !== observer);
  }

  // Recorre la interfaz Observer, por eso la tienda no depende de ningún
  // suscriptor concreto.
  notify(change: StoreChange): void {
    for (const observer of this.observers) {
      observer.update(change);
    }
  }

  // Es el punto donde cambia el estado, por eso dispara la notificación con el
  // valor anterior y el nuevo.
  setPrice(newPrice: number): void {
    const oldValue = this.price;
    this.price = newPrice;
    this.notify({
      product: this.product,
      type: "price",
      oldValue,
      newValue: newPrice,
    });
  }

  // Igual que setPrice: todo cambio de stock debe avisar a los suscriptores.
  setStock(newStock: number): void {
    const oldValue = this.stock;
    this.stock = newStock;
    this.notify({
      product: this.product,
      type: "stock",
      oldValue,
      newValue: newStock,
    });
  }
}

// Es un observador concreto: reacciona al cambio a su manera (simulando un
// correo) y la tienda no sabe que existe, solo lo trata como un Observer.
class EmailSubscriber implements Observer {
  constructor(private email: string) {}

  // Traduce el cambio a un mensaje de correo legible según el tipo recibido.
  update(change: StoreChange): void {
    const label = change.type === "price" ? "precio" : "stock";
    const unit = change.type === "stock" ? " unidades" : "";
    const values = `${change.oldValue} → ${change.newValue}${unit}`;
    const message =
      `✉️ Correo a ${this.email} | ${change.product} | ${label}: ${values}`;
    console.log(`%c${message}`, COLORS.blue);
  }
}

// Es otro observador concreto: usa un canal y un color distintos para que se
// distinga del correo, sin que la tienda necesite saberlo.
class AppSubscriber implements Observer {
  constructor(private user: string) {}

  // Mismo criterio que el correo, pero con el formato de una notificación push.
  update(change: StoreChange): void {
    const label = change.type === "price" ? "precio" : "stock";
    const unit = change.type === "stock" ? " unidades" : "";
    const values = `${change.oldValue} → ${change.newValue}${unit}`;
    const message =
      `🔔 Push a ${this.user} | ${change.product} | ${label}: ${values}`;
    console.log(`%c${message}`, COLORS.purple);
  }
}
