/**
 * Remounted by Next on every navigation, unlike layout.tsx — which is what
 * makes it the right place for a page-enter animation. The header and footer
 * live in the layout and stay put; only the page lifts in.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
