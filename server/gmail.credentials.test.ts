import { describe, expect, it } from "vitest";
import net from "node:net";
import tls from "node:tls";

const SMTP_HOST = "smtp.gmail.com";
const SMTP_PORT = 587;
const SMTP_USER = "shanti.sdyoga@gmail.com";

function readResponse(socket: NodeJS.ReadableStream, timeoutMs = 15000) {
  return new Promise<string>((resolve, reject) => {
    let buffer = "";
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Délai dépassé lors de la connexion SMTP Gmail."));
    }, timeoutMs);

    const onData = (chunk: Buffer | string) => {
      buffer += chunk.toString();
      const lines = buffer.split(/\r?\n/);
      const lastComplete = lines[lines.length - 2] ?? "";
      if (/^\d{3} /.test(lastComplete)) {
        cleanup();
        resolve(buffer);
      }
    };
    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };
    const cleanup = () => {
      clearTimeout(timer);
      socket.off("data", onData);
      socket.off("error", onError);
    };

    socket.on("data", onData);
    socket.on("error", onError);
  });
}

async function verifyGmailSmtpCredentials(password: string) {
  const connection = net.createConnection({ host: SMTP_HOST, port: SMTP_PORT });
  await readResponse(connection);
  connection.write(`EHLO sdyoga.fr\r\n`);
  await readResponse(connection);
  connection.write("STARTTLS\r\n");
  await readResponse(connection);

  const secureConnection = tls.connect({ socket: connection, servername: SMTP_HOST });
  await new Promise<void>((resolve, reject) => {
    secureConnection.once("secureConnect", resolve);
    secureConnection.once("error", reject);
  });

  secureConnection.write(`EHLO sdyoga.fr\r\n`);
  await readResponse(secureConnection);
  const auth = Buffer.from(`\0${SMTP_USER}\0${password.replace(/\s/g, "")}`).toString("base64");
  secureConnection.write(`AUTH PLAIN ${auth}\r\n`);
  const response = await readResponse(secureConnection);
  secureConnection.write("QUIT\r\n");
  secureConnection.end();

  return response;
}

describe("Gmail SMTP configuration", () => {
  it("authenticates with the configured application password without sending an email", async () => {
    const password = process.env.GMAIL_APP_PASSWORD?.trim();
    expect(password, "GMAIL_APP_PASSWORD doit être renseigné").toBeTruthy();

    const response = await verifyGmailSmtpCredentials(password!);
    expect(response).toMatch(/^235 /m);
  }, 30000);
});
