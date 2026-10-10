// Draws a plant in a pot from a few fields, so the shop needs no image files.
export default function PlantArt({ shape = 'rosette', leaf = '#2f6b4f', pot = '#f2a65a', title }) {
  const cx = 100, base = 168;
  let leaves = null;

  if (shape === 'rosette') {
    leaves = [-72, -48, -24, 0, 24, 48, 72].map(a => (
      <ellipse key={a} cx={cx} cy={base - 48} rx="11" ry="50" fill={leaf}
        transform={`rotate(${a} ${cx} ${base})`} opacity={a % 48 === 0 ? 0.88 : 1} />
    ));
  } else if (shape === 'tall') {
    leaves = [-28, -14, 0, 14, 28].map((a, i) => (
      <path key={a} d={`M${cx - 9} ${base} Q${cx} ${base - 130 - (i % 2) * 22} ${cx + 9} ${base} Z`} fill={leaf}
        transform={`rotate(${a} ${cx} ${base})`} />
    ));
  } else if (shape === 'paddle') {
    leaves = [-60, -34, -10, 14, 38, 62].map((a, i) => (
      <g key={a} transform={`rotate(${a} ${cx} ${base})`}>
        <line x1={cx} y1={base} x2={cx} y2={base - 52} stroke={leaf} strokeWidth="4" />
        <ellipse cx={cx} cy={base - 82} rx="24" ry="34" fill={leaf} opacity={i % 2 ? 0.88 : 1} />
      </g>
    ));
  } else {
    const vines = [
      { d: `M${cx - 18} ${base} C${cx - 60} ${base - 40} ${cx - 66} ${base + 10} ${cx - 56} ${base + 54}`, dots: [[-50,-8],[-62,18],[-58,40]] },
      { d: `M${cx} ${base} C${cx - 10} ${base - 70} ${cx + 22} ${base - 90} ${cx + 30} ${base - 40}`, dots: [[-6,-52],[10,-72],[26,-58],[30,-38]] },
      { d: `M${cx + 18} ${base} C${cx + 64} ${base - 30} ${cx + 70} ${base + 14} ${cx + 58} ${base + 58}`, dots: [[52,-4],[64,20],[58,44]] },
    ];
    leaves = vines.map((v, i) => (
      <g key={i}>
        <path d={v.d} stroke={leaf} strokeWidth="3" fill="none" />
        {v.dots.map(([dx, dy], j) => <circle key={j} cx={cx + dx} cy={base + dy} r="11" fill={leaf} />)}
      </g>
    ));
  }

  return (
    <svg viewBox="0 0 200 240" role="img" aria-label={title || 'Potted plant'} className="plant-art">
      {leaves}
      <path d="M62 168 H138 L128 226 Q127 232 120 232 H80 Q73 232 72 226 Z" fill={pot} />
      <rect x="56" y="162" width="88" height="14" rx="5" fill={pot} />
      <rect x="56" y="162" width="88" height="14" rx="5" fill="#000" opacity="0.08" />
    </svg>
  );
}
