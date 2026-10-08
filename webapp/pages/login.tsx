import Head from "next/head";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";

interface LoginResponse {
  user?: { role: "admin" | "user" };
  mustChangePassword?: boolean;
  error?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const result = (await response.json()) as LoginResponse;

      if (!response.ok) {
        setError(result.error ?? "Accesso non riuscito.");
        return;
      }

      if (result.mustChangePassword) {
        await router.push("/change-password");
      } else if (
        typeof router.query.next === "string" &&
        router.query.next.startsWith("/") &&
        !router.query.next.startsWith("//")
      ) {
        await router.push(router.query.next);
      } else {
        await router.push("/");
      }
    } catch {
      setError("Servizio non disponibile. Riprova tra poco.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Accedi | Scuderia DIIEM</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="min-h-screen bg-primary px-6 py-20 text-white">
        <div className="mx-auto max-w-md">
          <Link href="/" className="text-sm text-secondary hover:text-orange-300">
            &larr; Torna al sito
          </Link>
          <section className="mt-8 rounded-2xl border border-secondary/25 bg-primary-variant/70 p-8 shadow-2xl shadow-black/20">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
              Area riservata
            </p>
            <h1 className="mt-3 text-3xl font-bold">Accedi</h1>
            <p className="mt-3 text-sm text-white/75">
              Gli account sono creati dall&apos;amministratore. Non è possibile registrarsi.
            </p>
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium" htmlFor="identifier">
                  Email o nome utente
                </label>
                <input
                  autoComplete="username"
                  className="w-full rounded-lg border border-white/20 bg-primary px-4 py-3 text-white outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/30"
                  id="identifier"
                  maxLength={254}
                  onChange={(event) => setIdentifier(event.target.value)}
                  required
                  type="text"
                  value={identifier}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <input
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-white/20 bg-primary px-4 py-3 text-white outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/30"
                  id="password"
                  maxLength={128}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  type="password"
                  value={password}
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
                {isSubmitting ? "Accesso in corso..." : "Accedi"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}
