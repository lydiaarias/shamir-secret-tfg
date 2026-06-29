import "./style.css"; 

interface ShareCardProps {
  id: string;
  xIndex: number;
  content: string;
}

export function ShareCard({ id, xIndex, content }: ShareCardProps) {
  return (
    <div className="display-share-card">
      <div className="badge-row">
        <span className="id-badge">SECRET ID: {id}</span>
        <span className="id-badge x-badge">X: {xIndex}</span>
      </div>
      <p className="share-content">
        {content}
      </p>
    </div>
  );
}