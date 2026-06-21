import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GroupProvider, useGroup } from './contexts/GroupContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Groups from './pages/Groups';
import Join from './pages/Join';
import ItemList from './pages/ItemList';
import ItemDetail from './pages/ItemDetail';
import ItemForm from './pages/ItemForm';
import ShoppingLists from './pages/ShoppingLists';
import ShoppingListDetail from './pages/ShoppingListDetail';
import Settings from './pages/Settings';

/** ログイン後の入口：グループ未選択なら選択画面へ */
function Home() {
  const { currentGroup, loading } = useGroup();
  if (loading) return <div className="centered">読み込み中…</div>;
  return <Navigate to={currentGroup ? '/items' : '/groups'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GroupProvider>
          <AppRoutes />
        </GroupProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div className="centered">読み込み中…</div>;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/join" element={<Join />} />

      <Route
        path="/groups"
        element={
          <ProtectedRoute>
            <Groups />
          </ProtectedRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/items" element={<ItemList />} />
        <Route path="/items/new" element={<ItemForm />} />
        <Route path="/items/:itemId" element={<ItemDetail />} />
        <Route path="/items/:itemId/edit" element={<ItemForm />} />
        <Route path="/lists" element={<ShoppingLists />} />
        <Route path="/lists/:listId" element={<ShoppingListDetail />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
