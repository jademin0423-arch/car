interface Item {
  title: string;
  description: string;
}

interface Props {
  title: string;
  items: Item[];
}

export function ChecklistBox({ title, items }: Props) {
  return (
    <section aria-labelledby="checklist-heading" className="mt-8">
      <div className="card p-4 sm:p-6">
        <h2 id="checklist-heading" className="heading-h2">
          {title}
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-800">
          {items.map((item) => (
            <li key={item.title} className="flex gap-3">
              <span className="mt-1 h-5 w-5 flex-none rounded-full bg-blue-50 text-center text-[11px] font-semibold text-primary">
                ✓
              </span>
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="mt-0.5 text-slate-600">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

