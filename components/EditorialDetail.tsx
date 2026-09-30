import type { EditorialContent } from "@/lib/editorial-content";

interface Props {
  content: EditorialContent;
}

export function EditorialDetail({ content }: Props) {
  return (
    <article>
      <p className="mt-6 text-body">{content.intro}</p>
      {content.sections.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="heading-h2">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-3 text-body">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
      <section className="mt-10">
        <h2 className="heading-h2">확인 체크포인트</h2>
        <ul className="mt-3 prose-list text-body">
          {content.checkpoints.map((checkpoint) => (
            <li key={checkpoint}>{checkpoint}</li>
          ))}
        </ul>
      </section>
      <section className="mt-10">
        <h2 className="heading-h2">자주 묻는 질문</h2>
        <div className="mt-4 space-y-4 text-sm text-slate-800">
          {content.faq.map((entry) => (
            <details key={entry.question} className="card p-4">
              <summary className="cursor-pointer font-semibold">{entry.question}</summary>
              <p className="mt-2 text-slate-700">{entry.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="mt-10">
        <h2 className="heading-h2">정리</h2>
        <p className="mt-3 text-body">{content.conclusion}</p>
      </section>
    </article>
  );
}
