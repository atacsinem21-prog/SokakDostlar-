type Props = {
  title: string;
  lead?: string;
  children: React.ReactNode;
  /** Uzun metin sayfalari icin */
  wide?: boolean;
  /** Form sayfalari (giris, kayit) */
  narrow?: boolean;
};

export function PageShell({ title, lead, children, wide, narrow }: Props) {
  const max =
    wide ? "max-w-3xl" : narrow ? "max-w-md" : "max-w-2xl";
  return (
    <main className={`mx-auto w-full px-4 py-10 sm:py-14 ${max}`}>
      <header className="mb-8 border-b border-zinc-200/90 pb-6">
        <h1 className="page-title">{title}</h1>
        {lead ? <p className="page-lead mt-2">{lead}</p> : null}
      </header>
      {children}
    </main>
  );
}
