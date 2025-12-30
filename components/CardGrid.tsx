import Link from "next/link";

interface CardItem {
  href: string;
  title: string;
  badge?: string;
  description?: string;
}

interface Props {
  title: string;
  subtitle?: string;
  items: CardItem[];
}

export function CardGrid({ title, subtitle, items }: Props) {
  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="heading-h2">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="card card-hover p-4">
            {item.badge ? <span className="badge mb-2">{item.badge}</span> : null}
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            {item.description ? (
              <p className="mt-1 text-xs text-slate-600 line-clamp-3">{item.description}</p>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}

