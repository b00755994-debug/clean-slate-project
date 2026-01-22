const BackgroundGrid = () => {
  const verticalLines = [];
  const horizontalLines = [];
  
  // Lines every 2% (3x denser than before)
  for (let i = 1; i <= 99; i += 2) {
    verticalLines.push(i);
    horizontalLines.push(i);
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {verticalLines.map((pos) => (
        <div
          key={`v-${pos}`}
          className="absolute top-0 w-px h-full bg-gray-800/20"
          style={{ left: `${pos}%` }}
        />
      ))}
      
      {horizontalLines.map((pos) => (
        <div
          key={`h-${pos}`}
          className="absolute left-0 h-px w-full bg-gray-800/20"
          style={{ top: `${pos}%` }}
        />
      ))}
    </div>
  );
};

export default BackgroundGrid;