import Head from "next/head";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useLanguage } from "@/lib/language";

interface AuthResponse {
  mustChangePassword?: boolean;
  error?: string;
}

export default function ChangePasswordPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [mustChangePassword, setMustChangePassword] = useState<boolean | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    void fetch("/api/auth/me")
      .then(async (response) => {
        if (!response.ok) {
          await router.replace("/login");
          return;
        }
        const result = (await response.json()) as AuthResponse;
        if (active) setMustChangePassword(Boolean(result.mustChangePassword));
      })
      .catch(() => {
        if (active) setError("Impossibile verificare la sessione. Riprova.");
      });
    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (newPassword !== confirmation) {
      setError("Le nuove password non coincidono.");
      return;
    }
    if (!/^[\x21-\x7e]{1,128}$/.test(newPassword)) {
      setError("Usa da 1 a 128 caratteri ASCII stampabili.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(mustChangePassword ? {} : { currentPassword }),
          newPassword,
        }),
      });
      const result = (await response.json()) as AuthResponse;
      if (!response.ok) {
        setError(result.error ?? t("Impossibile aggiornare la password."));
        return;
      }
      await router.push("/");
    } catch {
      setError(t("Servizio non disponibile. Riprova tra poco."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Cambia password | Scuderia DIIEM</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="min-h-screen bg-primary px-6 py-20 text-white">
        <div className="mx-auto max-w-md">
          <Link href="/" className="text-sm text-secondary hover:text-orange-300">
            &larr; {t("Torna al sito")}
          </Link>
          <section className="mt-8 rounded-2xl border border-secondary/25 bg-primary-variant/70 p-8 shadow-2xl shadow-black/20">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
              {t("Sicurezza account")}
            </p>
            <h1 className="mt-3 text-3xl font-bold">{t("Cambia password")}</h1>
            {mustChangePassword && (
              <p className="mt-3 text-sm text-white/75">
                {t("Per proteggere il tuo account, scegli una nuova password prima di continuare.")}
              </p>
            )}
            {mustChangePassword !== null && (
              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                {!mustChangePassword && (
                  <div>
                    <label className="mb-2 block text-sm font-medium" htmlFor="current-password">
                      {t("Password attuale")}
                    </label>
                    <input
                      autoComplete="current-password"
                      className="w-full rounded-lg border border-white/20 bg-primary px-4 py-3 text-white outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/30"
                      id="current-password"
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      required
                      type="password"
                      value={currentPassword}
                    />
                  </div>
                )}
                <div>
                  <label className="mb-2 block text-sm font-medium" htmlFor="new-password">
                    {t("Nuova password")}
                  </label>
                  <input
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-white/20 bg-primary px-4 py-3 text-white outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/30"
                    id="new-password"
                    maxLength={128}
                    onChange={(event) => setNewPassword(event.target.value)}
                    required
                    type="password"
                    value={newPassword}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium" htmlFor="confirm-password">
                    {t("Conferma nuova password")}
                  </label>
                  <input
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-white/20 bg-primary px-4 py-3 text-white outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/30"
                    id="confirm-password"
                    maxLength={128}
                    onChange={(event) => setConfirmation(event.target.value)}
                    required
                    type="password"
                    value={confirmation}
                  />
                </div>
                {error && (
                  <p className="rounded-lg bg-red-950/70 px-4 py-3 text-sm text-red-200" role="alert">
                    {error}
                  </p>
                )}
                <button
                  className="w-full rounded-lg bg-secondary px-4 py-3 font-semibold text-white transition hover:bg-caramel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? t("Salvataggio...") : t("Aggiorna password")}
                </button>
              </form>
            )}
            {error && mustChangePassword === null && (
              <p className="mt-6 rounded-lg bg-red-950/70 px-4 py-3 text-sm text-red-200" role="alert">
                {error}
              </p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
