import Head from "next/head";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

interface ProfileUser {
  name: string;
  email: string;
}

interface ProfileResponse {
  user?: ProfileUser;
  mustChangePassword?: boolean;
  error?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let active = true;
    void fetch("/api/auth/me")
      .then(async (response) => {
        const result = (await response.json()) as ProfileResponse;
        if (response.status === 401) {
          await router.replace("/login?next=%2Fprofile");
          return;
        }
        if (!response.ok) {
          setError(result.error ?? "Non è stato possibile verificare la sessione.");
          return;
        }
        if (result.mustChangePassword) {
          await router.replace("/change-password");
          return;
        }
        if (active && result.user) {
          setName(result.user.name);
          setEmail(result.user.email);
        }
      })
      .catch(() => {
        if (active) setError("Servizio non disponibile. Riprova tra poco.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [router]);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");
    setIsSaving(true);
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const result = (await response.json()) as ProfileResponse;
      if (!response.ok || !result.user) {
        setError(result.error ?? "Non è stato possibile aggiornare il profilo.");
        return;
      }
      setName(result.user.name);
      setStatus("Profilo aggiornato.");
      window.dispatchEvent(new Event("scuderia:profile-updated"));
    } catch {
      setError("Servizio non disponibile. Riprova tra poco.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <Head>
        <title>Il mio profilo | Scuderia DIIEM</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen">
        <Header />
        <main className="bg-gradient-to-b from-white to-slate-50 px-4 pb-16 pt-32 sm:px-6">
          <section className="mx-auto max-w-2xl">
            <Link href="/" className="text-sm font-medium text-accent hover:underline">
              &larr; Torna al sito
            </Link>
            <header className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Area personale
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Il mio profilo</h1>
              <p className="mt-3 text-slate-600">
                Aggiorna il nome mostrato nel menu del tuo account.
              </p>
            </header>

            {isLoading ? (
              <p className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
                Caricamento profilo…
              </p>
            ) : (
              <form
                className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                onSubmit={saveProfile}
              >
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="profile-name">
                    Nome
                  </label>
                  <input
                    autoComplete="name"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    id="profile-name"
                    maxLength={100}
                    minLength={1}
                    onChange={(event) => setName(event.target.value)}
                    required
                    value={name}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="profile-email">
                    Email
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600"
                    id="profile-email"
                    readOnly
                    value={email}
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Per modificare l’indirizzo email, contatta un amministratore.
                  </p>
                </div>
                {error && (
                  <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                    {error}
                  </p>
                )}
                {status && (
                  <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
                    {status}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    className="rounded-lg bg-accent px-5 py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSaving}
                    type="submit"
                  >
                    {isSaving ? "Salvataggio…" : "Salva profilo"}
                  </button>
                  <Link
                    className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                    href="/change-password"
                  >
                    Cambia password
                  </Link>
                </div>
              </form>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
