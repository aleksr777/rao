import styles from './blank-document-page.module.css';

type Page = 'diaries' | 'orders';

const sections: { id: Page; label: string; title: string }[] = [
  { id: 'diaries', label: 'Дневники', title: 'Дневник истории болезни' },
  { id: 'orders', label: 'Назначения', title: 'Лист назначений' },
];

export const BlankDocumentPage = ({ page }: { page: Page }) => {
  const title = sections.find((section) => section.id === page)!.title;
  const pageCount = page === 'orders' ? 2 : 1;

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="toolbar-wrap">
          <nav className="site-navigation" aria-label="Разделы сайта">
            {sections.map((section) =>
              section.id === page ? (
                <span
                  key={section.id}
                  className="site-navigation__link site-navigation__link--current"
                  aria-current="page"
                >
                  {section.label}
                </span>
              ) : (
                <a key={section.id} className="site-navigation__link" href={`#/${section.id}`}>
                  {section.label}
                </a>
              ),
            )}
          </nav>
          <div className={styles.actions}>
            <button type="button" className="print-button" onClick={() => window.print()}>
              Печать
            </button>
          </div>
        </div>
      </header>
      <div className={styles.sheetWrap}>
        {Array.from({ length: pageCount }, (_, index) => (
          <article
            key={index}
            className={`${styles.sheet}${page === 'orders' ? ` ${styles.landscape}` : ''}`}
            aria-label={pageCount === 1 ? title : `${title}, страница ${index + 1}`}
          >
            <h1 className={styles.title}>{title}</h1>
          </article>
        ))}
      </div>
    </main>
  );
};
