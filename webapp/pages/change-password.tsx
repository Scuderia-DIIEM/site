import Head from "next/head";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";

interface AuthResponse {
  mustChangePassword?: boolean;
  error?: string;
}

export default function ChangePasswordPage() {
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
    if (!/^[\x21-\x7e]{12,128}$/.test(newPassword)) {
      setError("Usa da 12 a 128 caratteri ASCII stampabili.");
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
        setError(result.error ?? "Impossibile aggiornare la password.");
        return;
      }
      await router.push("/");
    } catch {
      setError("Servizio non disponibile. Riprova tra poco.");
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
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-md">
          <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">
            &larr; Torna al sito
          </Link>
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Sicurezza account
            </p>
            <h1 className="mt-3 text-3xl font-bold">Cambia password</h1>
            {mustChangePassword && (
              <p className="mt-3 text-sm text-slate-300">
                Per proteggere il tuo account, scegli una nuova password prima di continuare.
              </p>
            )}
            {mustChangePassword !== null && (
              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                {!mustChangePassword && (
                  <div>
                    <label className="mb-2 block text-sm font-medium" htmlFor="current-password">
                      Password attuale
                    </label>
                    <input
                      autoComplete="current-password"
                      className="w-full rounded-lg border border-white/15 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
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
                    Nuova password
                  </label>
                  <input
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-white/15 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                    id="new-password"
                    minLength={12}
                    maxLength={128}
                    onChange={(event) => setNewPassword(event.target.value)}
                    required
                    type="password"
                    value={newPassword}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium" htmlFor="confirm-password">
                    Conferma nuova password
                  </label>
                  <input
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-white/15 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                    id="confirm-password"
                    minLength={12}
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
                  className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Salvataggio..." : "Aggiorna password"}
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
