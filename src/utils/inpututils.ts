import readline from 'readline';

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export async function exit() {
  rl.close();
  process.exit(0);
}
