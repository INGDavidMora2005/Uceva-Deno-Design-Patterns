/**
 * PATRÓN: Factory Method (Creacional)
 * AUTOR: Juan Pablo Devia
 *
 * ¿QUÉ HACE EL PATRÓN?
 * Define en una clase base un método para crear objetos (el "método
 * fábrica"), pero deja que cada subclase decida qué clase concreta crear.
 * Así el código que usa el objeto trabaja con una interfaz común y no
 * depende de las clases concretas.
 *
 * PROBLEMA QUE SE RESUELVE
 * Una empresa de logística colombiana hace envíos nacionales por carretera
 * (por ejemplo, de Cali a Bogotá en camión) e internacionales por mar (desde
 * el puerto de Buenaventura en barco). Planear la entrega (planDelivery) es
 * el mismo proceso en ambos casos; solo cambia el transporte. Sin el patrón,
 * planDelivery tendría un "new Truck()" fijo o un if/switch por tipo de
 * envío, y agregar un transporte nuevo (por ejemplo, avión) obligaría a
 * modificar esa lógica que ya funciona.
 *
 * ¿POR QUÉ ES ADECUADO?
 * La clase base Logistics define una sola vez el proceso de planDelivery y
 * delega en sus subclases la decisión de QUÉ transporte crear mediante
 * createTransport. El proceso solo conoce la interfaz Transport, así que
 * agregar un tipo de envío nuevo es crear un producto y un creador nuevos,
 * sin tocar el proceso existente.
 *
 * PARTICIPANTES
 * - Transport: producto; interfaz común de todos los transportes.
 * - Truck, Ship: productos concretos (camión y barco).
 * - Logistics: creador abstracto; declara createTransport (método fábrica)
 *   y define planDelivery, que usa el transporte creado.
 * - RoadLogistics, SeaLogistics: creadores concretos; cada uno sobrescribe
 *   createTransport para devolver su propio transporte.
 *
 * EJECUTAR: deno run Taller-Patrones-Diseno/01-Patrones-Creacionales/02-Factory-Method/factory-method.ts
 */

// Producto: lo único que conoce planDelivery. Gracias a esta interfaz,
// Logistics no depende de camiones ni barcos concretos.
interface Transport {
  name: string;
  // Devuelve un mensaje que describe cómo se hace la entrega.
  deliver(origin: string, destination: string, cargoKg: number): string;
}

// Producto concreto: entrega por carretera en contenedor terrestre.
class Truck implements Transport {
  name = "Camión";

  deliver(origin: string, destination: string, cargoKg: number): string {
    return `${this.name}: ${cargoKg} kg por carretera de ${origin} a ${destination} en contenedor terrestre`;
  }
}

// Producto concreto: entrega por mar en contenedor marítimo.
class Ship implements Transport {
  name = "Barco";

  deliver(origin: string, destination: string, cargoKg: number): string {
    return `${this.name}: ${cargoKg} kg por mar de ${origin} a ${destination} en contenedor marítimo`;
  }
}

// Creador: define el proceso común de la entrega. Es abstracta porque por sí
// sola no sabe qué transporte usar; esa decisión es de cada subclase.
abstract class Logistics {
  // Método fábrica: cada subclase decide qué transporte crear.
  protected abstract createTransport(): Transport;

  // Lógica de negocio común: NO cambia cuando se agrega un nuevo tipo de
  // logística, porque solo usa la interfaz Transport.
  planDelivery(origin: string, destination: string, cargoKg: number): string {
    const transport = this.createTransport();
    const result = transport.deliver(origin, destination, cargoKg);
    return `Transporte asignado: ${transport.name}\n  ${result}`;
  }
}

// Creador concreto: envíos nacionales por carretera. Es el ÚNICO lugar donde
// se decide crear un camión; agregar AirLogistics + Plane no tocaría
// planDelivery.
class RoadLogistics extends Logistics {
  protected override createTransport(): Transport {
    return new Truck();
  }
}

// Creador concreto: envíos internacionales por mar. Es el ÚNICO lugar donde
// se decide crear un barco.
class SeaLogistics extends Logistics {
  protected override createTransport(): Transport {
    return new Ship();
  }
}
