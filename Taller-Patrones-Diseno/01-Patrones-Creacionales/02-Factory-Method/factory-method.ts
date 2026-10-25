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
