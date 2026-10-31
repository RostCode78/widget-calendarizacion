// Modo desarrollo: arranca Vite (recarga al editar) y abre Electron apuntando a él.
import { createServer } from 'vite';
import { spawn } from 'node:child_process';
import electron from 'electron';

const server = await createServer();
await server.listen();
const url = server.resolvedUrls.local[0];

const app = spawn(electron, ['.'], { stdio: 'inherit', env: { ...process.env, VITE_DEV_SERVER_URL: url } });
app.on('close', async () => {
  await server.close();
  process.exit();
});
