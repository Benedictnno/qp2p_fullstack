import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 characters
const IV_LENGTH = 16; // AES requires a 16-byte initialization vector

// Encrypt function
const encryptMnemonic = (mnemonic) => {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(mnemonic);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

// Decrypt function

const decryptMnemonic = (encryptedMnemonic) => {
  try {
    const [ivHex, encryptedHex] = encryptedMnemonic.split(":");
    if (!ivHex || !encryptedHex) {
      throw new Error("Invalid encrypted mnemonic format");
    }

    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");

    // Ensure ENCRYPTION_KEY is exactly 32 bytes
    if (
      !process.env.ENCRYPTION_KEY ||
      process.env.ENCRYPTION_KEY.length !== 32
    ) {
      throw new Error("Invalid or missing ENCRYPTION_KEY");
    }

    const decipher = createDecipheriv(
      "aes-256-cbc",
      Buffer.from(process.env.ENCRYPTION_KEY),
      iv
    );

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  } catch (error) {
    console.error("Error decrypting mnemonic:", error.message);
    throw error; // Rethrow error for further handling if needed
  }
};

export { encryptMnemonic, decryptMnemonic };
