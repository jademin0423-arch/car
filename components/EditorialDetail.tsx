import type { EditorialContent } from "@/lib/editorial-content";
import { ArticleCta } from "@/components/ArticleCta";

interface Props {
  content: EditorialContent;
}

function textBlocks(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
}

export function EditorialDetail({ content }: Props) {
  const introBlocks = textBlocks(content.intro);
  const conclusionBlocks = textBlocks(content.conclusion);
  const middleAfter =
    content.sections.length >= 3 ? Math.floor(content.sections.length / 2) - 1 : -1;
  return (
    <article>
      {introBlocks.map((block, index) => (
        <p key={`intro-${index}`} className={index === 0 ? "mt-6 text-body" : "mt-3 text-body"}>
          {block}
        </p>
      ))}
      <ArticleCta position="article-top" />
      {content.sections.map((section, sectionIndex) => (
        <div key={section.heading}>
          <section className="mt-10">
            <h2 className="heading-h2">{section.heading}</h2>
            {section.paragraphs.map((paragraph, index) => (
              <p key={`${section.heading}-${index}`} className="mt-3 text-body">
                {paragraph}
              </p>
            ))}
          </section>
          {sectionIndex === middleAfter ? <ArticleCta position="article-middle" /> : null}
        </div>
      ))}
      <section className="mt-10">
        <h2 className="heading-h2">확인 체크포인트</h2>
        <ul className="mt-3 prose-list text-body">
          {content.checkpoints.map((checkpoint, index) => (
            <li key={`checkpoint-${index}`}>{checkpoint}</li>
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
        {conclusionBlocks.map((block, index) => (
          <p key={`conclusion-${index}`} className="mt-3 text-body">
            {block}
          </p>
        ))}
      </section>
      <ArticleCta position="article-bottom" />
    </article>
  );
}
