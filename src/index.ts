import receiveUserSelection from './services/menu/menu';
import log from './utils/log';

async function start() {
  try {
    // eslint-disable-next-line no-constant-condition
    while(true) {
      // eslint-disable-next-line no-await-in-loop
      await receiveUserSelection();
    }
  } catch(error) {
    log.debug(error);
  }
}

start();
