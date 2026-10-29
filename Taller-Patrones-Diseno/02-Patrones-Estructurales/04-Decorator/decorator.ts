/**
 * PATRÓN: Decorator (Estructural)
 * AUTOR: David Mora Duque (versión inicial: Juan Diego Rodriguez)
 *
 * ¿QUÉ HACE EL PATRÓN?
 * Permite agregar responsabilidades a un objeto envolviéndolo en otros
 * objetos decoradores que comparten su misma interfaz, sin modificar
 * su clase ni crear una subclase por cada combinación posible.
 *
 * PROBLEMA QUE SE RESUELVE
 * Una reserva parte de una habitación con tarifa base y el cliente
 * puede sumar desayuno, parqueadero o spa en cualquier combinación.
 * Sin el patrón habría una subclase por combinación o una clase
 * gigante con condicionales, y cada servicio multiplicaría las clases.
 *
 * ¿POR QUÉ ES ADECUADO?
 * Cada servicio es un decorador pequeño con una sola responsabilidad
 * que suma su costo y descripción al de la reserva que envuelve. Se
 * apilan en cualquier orden, el cliente solo conoce Booking y agregar
 * un servicio no obliga a tocar lo existente.
 *
 * PARTICIPANTES
 * - Booking: interfaz común con cost() y description().
 * - BasicRoom: componente concreto, la habitación con la tarifa base.
 * - BookingDecorator: decorador base abstracto que envuelve a otra
 *   Booking por composición y delega en ella.
 * - BreakfastDecorator, ParkingDecorator y SpaDecorator: decoradores
 *   concretos que agregan un servicio.
 *
 * Más información: https://refactoring.guru/es/design-patterns/decorator
 * EJECUTAR: deno run Taller-Patrones-Diseno/02-Patrones-Estructurales/04-Decorator/decorator.ts
 */

/**
 * INTERFAZ COMÚN (componente) del patrón: el componente concreto y
 * todos los decoradores la implementan. Por eso el cliente puede
 * tratar una habitación simple o una reserva con muchos servicios
 * exactamente igual.
 */
interface Booking {
  cost(): number;
  description(): string;
}

/**
 * COMPONENTE CONCRETO: el objeto base con la tarifa, que los
 * decoradores van a envolver sin modificarlo.
 *
 * Los valores están en pesos colombianos (COP).
 */
class BasicRoom implements Booking {
  private readonly baseRate: number = 180000;

  cost(): number {
    return this.baseRate;
  }

  description(): string {
    return "Habitación estándar";
  }
}

/**
 * DECORADOR BASE del patrón: implementa la misma interfaz Booking que
 * el componente y guarda una referencia a otra Booking (composición),
 * a la que delega todo por defecto.
 *
 * Es abstracta porque no se usa sola: solo tiene sentido como base de
 * los decoradores concretos.
 *
 * La propiedad es protected para que los decoradores concretos que la
 * extiendan puedan usarla.
 *
 * Usar composición en vez de herencia por cada combinación es la clave
 * del patrón: cualquier Booking, sea una habitación simple u otro
 * decorador, puede envolverse.
 */
abstract class BookingDecorator implements Booking {
  protected readonly wrapped: Booking;

  constructor(wrapped: Booking) {
    this.wrapped = wrapped;
  }

  cost(): number {
    return this.wrapped.cost();
  }

  description(): string {
    return this.wrapped.description();
  }
}

/**
 * DECORADORES CONCRETOS: cada uno agrega UNA sola responsabilidad (un
 * servicio) sumando su costo y descripción a los de la reserva que
 * envuelve.
 *
 * Usan super.cost() y super.description() para obtener lo que ya tenía
 * la reserva envuelta y luego añaden lo suyo.
 *
 * Como todos implementan Booking, se pueden apilar en cualquier orden y
 * combinación sin crear una subclase por cada una.
 */
class BreakfastDecorator extends BookingDecorator {
  private readonly price: number = 25000;

  override cost(): number {
    return super.cost() + this.price;
  }

  override description(): string {
    return super.description() + " + Desayuno";
  }
}

class ParkingDecorator extends BookingDecorator {
  private readonly price: number = 15000;

  override cost(): number {
    return super.cost() + this.price;
  }

  override description(): string {
    return super.description() + " + Parqueadero";
  }
}

class SpaDecorator extends BookingDecorator {
  private readonly price: number = 80000;

  override cost(): number {
    return super.cost() + this.price;
  }

  override description(): string {
    return super.description() + " + Spa";
  }
}
