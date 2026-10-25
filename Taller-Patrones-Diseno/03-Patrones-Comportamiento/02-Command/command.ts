/**
 * PATRÓN: Command (Comportamiento)
 * AUTOR: Juan Pablo Devia
 *
 * ¿QUÉ HACE EL PATRÓN?
 * Convierte cada acción en un objeto (un "comando") que sabe ejecutarse y
 * también deshacerse. Quien dispara la acción ya no llama directamente al
 * objeto que hace el trabajo: le entrega el comando a un invocador, que lo
 * ejecuta y puede guardarlo para revertirlo o repetirlo después.
 *
 * PROBLEMA QUE SE RESUELVE
 * Una app de lista de tareas permite agregar tareas y marcarlas como
 * completadas, y el usuario necesita deshacer y rehacer lo que hizo. Sin el
 * patrón, la interfaz llamaría directo a la lista y no habría una forma limpia
 * de recordar qué se hizo ni de revertirlo: el código de deshacer tendría que
 * adivinar cada acción con if/switch, y cada acción nueva lo complicaría más.
 *
 * ¿POR QUÉ ES ADECUADO?
 * Cada acción es un comando que guarda lo necesario para revertirse y expone
 * execute() y undo(). El historial solo apila comandos y llama a esos dos
 * métodos, sin saber qué hace cada uno. Deshacer y rehacer funcionan igual
 * para cualquier acción, y agregar una acción nueva es crear otro comando,
 * sin tocar el historial ni la lista.
 *
 * PARTICIPANTES
 * - Command: interfaz común con execute() y undo().
 * - TodoList: receptor; sabe hacer el trabajo real sobre las tareas.
 * - AddTaskCommand, CompleteTaskCommand: comandos concretos; cada uno guarda
 *   lo necesario para ejecutarse y revertirse.
 * - History: invocador; ejecuta los comandos y mantiene las pilas de
 *   deshacer (undo) y rehacer (redo).
 *
 * EJECUTAR: deno run Taller-Patrones-Diseno/03-Patrones-Comportamiento/02-Command/command.ts
 */

// Interfaz Command: todo comando sabe ejecutarse y revertirse. Es lo único
// que conoce el invocador (History), así puede deshacer cualquier acción sin
// saber qué hace cada una.
interface Command {
  // Nombre legible de la acción, para mostrarlo en la demo.
  description: string;
  execute(): void;
  undo(): void;
}

// Receptor: la lista de tareas sabe hacer el trabajo real. No sabe nada de
// comandos ni de historial; los comandos la usan para cumplir cada acción.
class TodoList {
  private tasks = new Map<number, { title: string; done: boolean }>();
  private nextId = 1;

  addTask(title: string): number {
    const id = this.nextId++;
    this.tasks.set(id, { title, done: false });
    return id;
  }

  removeTask(id: number): void {
    this.tasks.delete(id);
  }

  complete(id: number): void {
    const task = this.tasks.get(id);
    if (task) task.done = true;
  }

  uncomplete(id: number): void {
    const task = this.tasks.get(id);
    if (task) task.done = false;
  }

  // Estado de la lista como texto: "[x] tarea" o "[ ] tarea".
  toText(): string {
    if (this.tasks.size === 0) return "  (lista vacía)";
    const lines = [...this.tasks.values()].map((task) => {
      const mark = task.done ? "[x]" : "[ ]";
      return `  ${mark} ${task.title}`;
    });
    return lines.join("\n");
  }
}
