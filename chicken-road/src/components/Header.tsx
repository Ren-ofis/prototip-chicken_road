
interface HeaderProps {
  balance: number;
}

export default function Header({ balance }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-8 pointer-events-none">
      <div className="flex flex-col pointer-events-auto">
        <div className="flex items-center gap-2 font-black text-4xl tracking-tighter glow-text">
          <span className="text-white">CHICKEN</span>
          <span className="text-red-500">ROAD</span>
        </div>
        <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] mt-1 font-bold">Arcade Edition</span>
      </div>

      <div className="flex items-center gap-6 pointer-events-auto">
        <div className="flex items-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 voxel-shadow">
          <div className="w-4 h-4 bg-yellow-400 rounded-sm mr-3 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
          <span className="text-2xl font-black text-yellow-400 font-mono tracking-tighter">
            {balance.toLocaleString()}
          </span>
        </div>
      </div>
    </header>
  );
}
