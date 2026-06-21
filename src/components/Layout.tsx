import { NavLink, Outlet } from 'react-router-dom';
import { IconItems, IconCart, IconSettings } from './icons';

export default function Layout() {
  return (
    <div className="app-shell">
      <main className="app-main">
        <Outlet />
      </main>
      <nav className="bottom-tabs">
        <NavLink to="/items" className="tab">
          <IconItems />
          商品
        </NavLink>
        <NavLink to="/lists" className="tab">
          <IconCart />
          お使い
        </NavLink>
        <NavLink to="/settings" className="tab">
          <IconSettings />
          設定
        </NavLink>
      </nav>
    </div>
  );
}
