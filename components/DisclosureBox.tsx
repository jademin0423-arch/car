interface Props {
  title?: string;
  children: React.ReactNode;
}

export function DisclosureBox({ title = "주의사항 및 안내", children }: Props) {
  return (
    <section className="mt-10">
      <div className="card border-dashed border-orange-200 bg-orange-50/60 p-4 sm:p-5">
        <h2 className="heading-h2 text-sm sm:text-base">{title}</h2>
        <div className="mt-2 space-y-2 text-xs sm:text-sm text-slate-700">{children}</div>
      </div>
    </section>
  );
}

