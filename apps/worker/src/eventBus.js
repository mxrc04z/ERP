export class EventBus {
  #handlers = new Map();

  subscribe(eventName, handler) {
    const handlers = this.#handlers.get(eventName) ?? new Set();
    handlers.add(handler);
    this.#handlers.set(eventName, handlers);
    return () => handlers.delete(handler);
  }

  async publish(event) {
    const handlers = this.#handlers.get(event.type) ?? [];
    await Promise.all([...handlers].map((handler) => handler(event)));
  }
}