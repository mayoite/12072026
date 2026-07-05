import { ThemeEditor } from './ThemeEditor'

export const metadata = {
  title: 'Theme Manager | Oando Admin',
}

export default function AdminThemesPage() {
  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Admin</p>
          <h1 className="admin-page__title">Theme Manager</h1>
          <p className="admin-page__copy">
            Manage the token dictionaries for planner rendering engines.
          </p>
        </div>
      </header>
      <ThemeEditor />
    </div>
  )
}
