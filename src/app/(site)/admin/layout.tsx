export const metadata = { title: 'CMS — BORIS HALAS' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body { overflow: auto !important; }
          `,
        }}
      />
      {children}
    </>
  );
}
