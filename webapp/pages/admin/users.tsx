import Head from "next/head";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  mustChangePassword: boolean;
  temporaryPasswordExpiresAt: string | null;
  createdAt: string;
}

interface UsersResponse {
  users?: AdminUser[];
  user?: AdminUser;
  temporaryPassword?: string;
  error?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingUserId, setEditingUserId] = useState("");
  const [editingName, setEditingName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      const [sessionResponse, usersResponse] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/admin/users"),
      ]);
      if (sessionResponse.status === 401 || usersResponse.status === 401) {
        await router.replace("/login");
        return;
      }
      if (usersResponse.status === 403) {
        setError("Questa pagina è riservata agli amministratori.");
        return;
      }
      const result = (await usersResponse.json()) as UsersResponse;
      if (!usersResponse.ok) throw new Error(result.error ?? "Impossibile caricare gli utenti.");
      setUsers(result.users ?? []);
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Errore durante il caricamento.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");
    setTemporaryPassword("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const result = (await response.json()) as UsersResponse;
      if (!response.ok) {
        setError(result.error ?? "Impossibile creare l'utente.");
        return;
      }
      setName("");
      setEmail("");
      setTemporaryPassword(result.temporaryPassword ?? "");
      setStatus("Account creato. Copia la password temporanea e consegnala all'utente.");
      await loadUsers();
    } catch {
      setError("Servizio non disponibile. Riprova tra poco.");
    } finally {
      setSubmitting(false);
    }
  }

  async function saveName(user: AdminUser) {
    setError("");
    setStatus("");
    setSavingName(true);
    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(user.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName }),
      });
      const result = (await response.json()) as UsersResponse;
      if (!response.ok) {
        setError(result.error ?? "Impossibile aggiornare il nome.");
        return;
      }
      setEditingUserId("");
      setEditingName("");
      setStatus(`Nome aggiornato per ${user.email}.`);
      await loadUsers();
    } catch {
      setError("Servizio non disponibile. Riprova tra poco.");
    } finally {
      setSavingName(false);
    }
  }

  async function resetPassword(user: AdminUser) {
    setError("");
    setStatus("");
    setTemporaryPassword("");
    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(user.id)}/temporary-password`, {
        method: "POST",
      });
      const result = (await response.json()) as UsersResponse;
      if (!response.ok) {
        setError(result.error ?? "Impossibile generare una nuova password.");
        return;
      }
      setTemporaryPassword(result.temporaryPassword ?? "");
      setStatus(`Nuova password temporanea generata per ${user.email}.`);
      await loadUsers();
    } catch {
      setError("Servizio non disponibile. Riprova tra poco.");
    }
  }

  async function deleteUser(user: AdminUser) {
    const confirmed = window.confirm(
      `Eliminare l'account di ${user.name} (${user.email})? Gli articoli creati da questo account resteranno e verranno assegnati a te.`,
    );
    if (!confirmed) return;

    setError("");
    setStatus("");
    setDeletingUserId(user.id);
    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(user.id)}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const result = (await response.json()) as UsersResponse;
        setError(result.error ?? "Impossibile eliminare l'account.");
        return;
      }
      setStatus(`Account di ${user.email} eliminato. Gli articoli sono stati assegnati al tuo account.`);
      await loadUsers();
    } catch {
      setError("Servizio non disponibile. Riprova tra poco.");
    } finally {
      setDeletingUserId("");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await router.push("/login");
  }

  return (
    <>
      <Head>
        <title>Gestione utenti | Scuderia DIIEM</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="min-h-screen bg-primary px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="text-sm text-secondary hover:text-orange-300">
              &larr; Torna al sito
            </Link>
            <button
              className="rounded-lg border border-white/30 px-4 py-2 text-sm hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              onClick={() => void logout()}
              type="button"
            >
              Esci
            </button>
          </div>
          <header className="mt-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
              Area amministrazione
            </p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Gestione utenti</h1>
            <p className="mt-3 text-white/75">
              Crea account senza registrazione pubblica e genera password temporanee monouso.
            </p>
          </header>

          <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Crea un account</h2>
            <form className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]" onSubmit={handleCreate}>
              <label className="sr-only" htmlFor="new-user-name">
                Nome della persona
              </label>
              <input
                autoComplete="off"
                className="min-w-0 rounded-lg border border-white/20 bg-primary-variant px-4 py-3 text-white outline-none placeholder:text-white/50 focus:border-secondary focus:ring-2 focus:ring-secondary/30"
                id="new-user-name"
                maxLength={100}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nome e cognome"
                required
                type="text"
                value={name}
              />
              <label className="sr-only" htmlFor="new-user-email">
                Email del nuovo utente
              </label>
              <input
                autoComplete="off"
                className="min-w-0 rounded-lg border border-white/20 bg-primary-variant px-4 py-3 text-white outline-none placeholder:text-white/50 focus:border-secondary focus:ring-2 focus:ring-secondary/30"
                id="new-user-email"
                maxLength={254}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="utente@example.com"
                required
                type="email"
                value={email}
              />
              <button
                className="rounded-lg bg-secondary px-5 py-3 font-semibold text-white transition hover:bg-caramel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-60"
                disabled={submitting}
                type="submit"
              >
                {submitting ? "Creazione..." : "Crea utente"}
              </button>
            </form>
          </section>

          {status && (
            <div className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-950/50 p-5">
              <p className="text-sm text-emerald-200">{status}</p>
              {temporaryPassword && (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <code className="break-all rounded-lg bg-black/30 px-3 py-2 text-sm text-white">
                    {temporaryPassword}
                  </code>
                  <button
                    className="rounded-lg border border-emerald-300/40 px-3 py-2 text-sm hover:bg-emerald-900"
                    onClick={() => void navigator.clipboard.writeText(temporaryPassword)}
                    type="button"
                  >
                    Copia password
                  </button>
                </div>
              )}
              <p className="mt-2 text-xs text-emerald-100/70">
                La password scade tra 24 ore e non verrà mostrata nuovamente.
              </p>
            </div>
          )}

          {error && (
            <p className="mt-5 rounded-lg bg-red-950/70 px-4 py-3 text-sm text-red-200" role="alert">
              {error}
            </p>
          )}

          <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Account</h2>
              <button
                className="text-sm text-secondary hover:text-orange-300"
                onClick={() => void loadUsers()}
                type="button"
              >
                Aggiorna elenco
              </button>
            </div>
            {loading ? (
              <p className="mt-5 text-sm text-white/75">Caricamento...</p>
            ) : users.length === 0 ? (
              <p className="mt-5 text-sm text-white/75">Nessun account disponibile.</p>
            ) : (
              <ul className="mt-5 divide-y divide-white/10">
                {users.map((user) => (
                  <li
                    className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
                    key={user.id}
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="mt-1 text-sm text-white/75">{user.email}</p>
                      <p className="mt-1 text-xs text-white/55">
                        {user.role === "admin" ? "Amministratore" : "Utente"} ·{" "}
                        {user.mustChangePassword ? "Password temporanea da cambiare" : "Account attivo"}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {editingUserId === user.id ? (
                        <form
                          className="flex flex-wrap items-center gap-2"
                          onSubmit={(event) => {
                            event.preventDefault();
                            void saveName(user);
                          }}
                        >
                          <label className="sr-only" htmlFor={`edit-name-${user.id}`}>
                            Modifica nome per {user.email}
                          </label>
                          <input
                            autoComplete="off"
                            className="w-48 rounded-lg border border-white/20 bg-primary-variant px-3 py-2 text-sm text-white outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30"
                            id={`edit-name-${user.id}`}
                            maxLength={100}
                            onChange={(event) => setEditingName(event.target.value)}
                            required
                            value={editingName}
                          />
                          <button
                            className="rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-white hover:bg-caramel disabled:opacity-60"
                            disabled={savingName}
                            type="submit"
                          >
                            {savingName ? "Salvataggio..." : "Salva"}
                          </button>
                          <button
                            className="rounded-lg border border-white/30 px-3 py-2 text-sm hover:bg-white/10"
                            onClick={() => {
                              setEditingUserId("");
                              setEditingName("");
                            }}
                            type="button"
                          >
                            Annulla
                          </button>
                        </form>
                      ) : (
                        <button
                          className="rounded-lg border border-white/30 px-3 py-2 text-sm hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                          onClick={() => {
                            setEditingUserId(user.id);
                            setEditingName(user.name);
                          }}
                          type="button"
                        >
                          Modifica nome
                        </button>
                      )}
                      {user.role === "user" && (
                        <>
                          <button
                            className="rounded-lg border border-white/30 px-3 py-2 text-sm hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                            disabled={deletingUserId === user.id}
                            onClick={() => void resetPassword(user)}
                            type="button"
                          >
                            Genera password temporanea
                          </button>
                          <button
                            className="rounded-lg border border-red-300/50 px-3 py-2 text-sm text-red-200 transition hover:bg-red-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={deletingUserId === user.id}
                            onClick={() => void deleteUser(user)}
                            type="button"
                          >
                            {deletingUserId === user.id ? "Eliminazione..." : "Elimina account"}
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
