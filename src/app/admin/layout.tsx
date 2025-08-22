import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '問題管理 - ShakaQuest Admin',
  description: 'スプレッドシートから問題を自動生成する管理画面',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <nav className="bg-gray-800 text-white p-4 mb-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">📚 ShakaQuest Admin</h1>
          <div className="flex gap-4">
            <a href="/admin" className="hover:underline">問題管理</a>
            <a href="/" className="hover:underline">アプリに戻る</a>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}