/**
 * Promise hiç çözülmezse (ağ / SMTP takılması) UI sonsuz "yükleniyor" kalmasın.
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  timeoutMessage: string,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error(timeoutMessage)), ms);
    promise
      .then((v) => {
        clearTimeout(id);
        resolve(v);
      })
      .catch((e) => {
        clearTimeout(id);
        reject(e);
      });
  });
}
