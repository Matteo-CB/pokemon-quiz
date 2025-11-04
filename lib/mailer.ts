import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // ou SMTP de ton provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Pokémon App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Réinitialisation de ton mot de passe",
    html: `
      <p>Tu as demandé à réinitialiser ton mot de passe.</p>
      <p><a href="${resetUrl}">Clique ici</a> pour définir un nouveau mot de passe.</p>
      <p>Ce lien expire dans 15 minutes.</p>
    `,
  });
}
