/**
 * Shared Electron IPC plumbing.
 *
 * Keep trust checks and mutation serialization in one place so new handlers
 * cannot accidentally skip the security boundary or write concurrently.
 */
function assertTrustedSender(event, sourceWindow) {
  if (!sourceWindow || sourceWindow.isDestroyed() || event.sender !== sourceWindow.webContents) {
    throw new Error('Permintaan IPC tidak dipercaya.');
  }
}

function createMutationSerializer() {
  let queue = Promise.resolve();
  return function serializeMutation(operation) {
    const result = queue.then(operation, operation);
    queue = result.catch(() => undefined);
    return result;
  };
}

module.exports = { assertTrustedSender, createMutationSerializer };
