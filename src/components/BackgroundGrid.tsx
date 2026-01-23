const BackgroundGrid = () => {
  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(120, 120, 120, 0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(120, 120, 120, 0.08) 1px, transparent 1px)
        `,
        backgroundSize: '28px 28px'
      }}
    />
  );
};

export default BackgroundGrid;
