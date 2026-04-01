/**
 * Supabase Auth hatalarını (504 SMTP vb.) kullanıcı dostu metne çevirir.
 */
export function formatSupabaseAuthError(err: {
  message?: string;
  status?: number;
  name?: string;
} | null): string {
  if (!err?.message) {
    return "İşlem başarısız. Tekrar dene.";
  }
  const msg = err.message;
  const st = err.status;

  if (
    st === 504 ||
    st === 502 ||
    st === 503 ||
    /504|502|503|Gateway|timeout|timed out/i.test(msg)
  ) {
    return "E-posta gönderilirken sunucu zaman aşımına uğradı (504). Özel SMTP genelde hosting dışından bağlantıyı yavaşlatır veya kapatır. Supabase → Authentication → SMTP’yi geçici kapatıp varsayılan gönderimi dene; kalıcı çözüm için Resend + domain doğrulama önerilir.";
  }

  return msg;
}

export function formatUnknownAuthError(e: unknown): string {
  if (e instanceof Error) {
    if (/504|502|503|Gateway|timeout/i.test(e.message)) {
      return formatSupabaseAuthError({ message: e.message, status: 504 });
    }
    return e.message;
  }
  return "İşlem başarısız.";
}
