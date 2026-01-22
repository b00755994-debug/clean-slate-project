const BackgroundGrid = () => {
  // Generate regular grid lines with consistent spacing (every 6%)
  const verticalLines = [];
  const horizontalLines = [];
  
  // Vertical lines every 6% from 2% to 98%
  for (let i = 2; i <= 98; i += 6) {
    verticalLines.push(i);
  }
  
  // Horizontal lines every 6% from 2% to 98%
  for (let i = 2; i <= 98; i += 6) {
    horizontalLines.push(i);
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Vertical lines */}
      {verticalLines.map((pos) => (
        <div
          key={`v-${pos}`}
          className="absolute top-0 w-px h-full bg-border/30"
          style={{ left: `${pos}%` }}
        />
      ))}
      
      {/* Horizontal lines */}
      {horizontalLines.map((pos) => (
        <div
          key={`h-${pos}`}
          className="absolute left-0 h-px w-full bg-border/30"
          style={{ top: `${pos}%` }}
        />
      ))}
    </div>
  );
};

export default BackgroundGrid;