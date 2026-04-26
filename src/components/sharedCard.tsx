interface ShareCardProps {
  id: string;
  xIndex: number;
  content: string;
}

export function ShareCard({ id, xIndex, content }: ShareCardProps) {
  return (
    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">
          SHARE ID: {id.substring(0, 6)}
        </span>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-600 uppercase">
          X-INDEX: {xIndex}
        </span>
      </div>
      <p className="font-mono text-lg text-slate-800 break-all font-bold">
        {content}
      </p>
    </div>
  );
}