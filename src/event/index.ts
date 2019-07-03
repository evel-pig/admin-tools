const handlers = {};

class AdminEventHandler {
  on(type, handler) {
    if (!handlers[type]) {
      handlers[type] = [];
    }
    handlers[type].push(handler);
    return () => {
      const index = handlers[type].indexOf(handler);
      handlers[type].splice(index, 1);
    };
  }

  send(e) {
    if (handlers[e.type]) {
      handlers[e.type].forEach(handler => {
        handler(e);
      });
    }
  }
}

const adminEvent = new AdminEventHandler();

export default adminEvent;
