import { useEffect, useState } from 'react';
import { UserAvatar } from '@/components/common/user-avatar';
import { useAuth, useUserProfile } from '@/context/AuthContext';
import { supabase } from '@/lib/client';

export function ProfilePage() {
  const { user } = useAuth();
  const profile = useUserProfile();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const username = profile?.username;
  const email = user?.email;

const [previewUrl, setPreviewUrl] = useState<string | null>(null);  
  
    useEffect(() => {  
    if (!selectedFile) {  
        setPreviewUrl(null);  
        return;  
    }  
    const objectUrl = URL.createObjectURL(selectedFile);  
    setPreviewUrl(objectUrl);  
    return () => URL.revokeObjectURL(objectUrl);  
    }, [selectedFile]);  
    
    const avatarPreviewUrl = previewUrl ?? profile?.avatar_url;
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleSave = async () => {
    if (!user) return;
    if (!selectedFile) {
      setError('Selecciona una imagen antes de guardar.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const objectPath = `${user.id}/avatar`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(objectPath, selectedFile, {
          upsert: true,
          cacheControl: '3600',
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(objectPath);
      const cacheBusted = `${data.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: cacheBusted },
      });

      if (updateError) throw updateError;

      // Se actualiza vía onAuthStateChange en AuthContext
      setSelectedFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir el avatar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 space-y-6 p-4 lg:p-8">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-sm font-semibold tracking-wide text-muted-foreground">
            PERFIL
          </h2>
        </div>

        <div className="glass-strong rounded-2xl p-5 lg:p-7">
          <h3 className="mb-5 font-heading text-sm font-semibold tracking-wide text-muted-foreground">
            Foto de perfil
          </h3>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <UserAvatar
                avatarUrl={avatarPreviewUrl}
                username={username}
                email={email}
                size="xl"
              />
              <div>
                <p className="font-heading text-sm font-semibold">
                  {username || 'Usuario'}
                </p>
                {email && <p className="text-xs text-muted-foreground">{email}</p>}
              </div>
            </div>

            <div className="w-full max-w-xl">
              <label className="block text-xs font-medium text-muted-foreground">
                Imagen
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2 w-full cursor-pointer rounded-lg border border-border bg-background px-3 py-2 text-sm file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-sm file:text-primary"
                  disabled={loading}
                />
              </label>

              {error && (
                <p className="mt-3 text-sm text-destructive">{error}</p>
              )}

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading || !selectedFile || !user}
                  className="glass inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Guardando...' : 'Subir'}
                </button>

                {selectedFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setError(null);
                    }}
                    disabled={loading}
                    className="rounded-xl border border-border bg-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Al guardar, se actualizará automáticamente tu avatar en el topbar y en el menú.
          </p>
        </div>
      </section>
    </main>
  );
}

