import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="app-shell">
      <main className="app-main">
        <Outlet />
      </main>
      <nav className="bottom-tabs">
        <NavLink to="/items" className="tab">
          <span className="tab-icon">🧴</span>
          商品
        </NavLink>
        <NavLink to="/lists" className="tab">
          <span className="tab-icon">🛒</span>
          お使い
        </NavLink>
        <NavLink to="/settings" className="tab">
          <span className="tab-icon">⚙️</span>
          設定
        </NavLink>
      </nav>
    </div>
  );
}
