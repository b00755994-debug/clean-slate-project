const BackgroundGrid = () => {
  return (
    <div className="fixed inset-0 z-0 blur-[0.5px] pointer-events-none overflow-hidden hidden lg:block">
      {/* Premium grouped vertical lines - LEFT SIDE */}
      {/* Group 1: 3 lines */}
      <div className="absolute top-0 left-[2%] w-px h-full bg-gradient-to-t from-primary/20 via-primary/8 to-transparent" />
      <div className="absolute top-0 left-[3.5%] w-px h-full bg-gradient-to-t from-primary/15 via-primary/5 to-transparent" />
      <div className="absolute top-0 left-[5%] w-px h-full bg-gradient-to-t from-primary/20 via-primary/8 to-transparent" />
      
      {/* Group 2: 2 lines */}
      <div className="absolute top-0 left-[12%] w-px h-full bg-gradient-to-t from-primary/18 via-primary/6 to-transparent" />
      <div className="absolute top-0 left-[13.5%] w-px h-full bg-gradient-to-t from-primary/18 via-primary/6 to-transparent" />
      
      {/* Group 3: 4 lines */}
      <div className="absolute top-0 left-[21%] w-px h-full bg-gradient-to-t from-primary/15 via-primary/5 to-transparent" />
      <div className="absolute top-0 left-[22.5%] w-px h-full bg-gradient-to-t from-primary/20 via-primary/8 to-transparent" />
      <div className="absolute top-0 left-[24%] w-px h-full bg-gradient-to-t from-primary/15 via-primary/5 to-transparent" />
      <div className="absolute top-0 left-[25.5%] w-px h-full bg-gradient-to-t from-primary/12 via-primary/4 to-transparent" />
      
      {/* Premium grouped vertical lines - RIGHT SIDE (mirrored) */}
      {/* Group 3: 4 lines */}
      <div className="absolute top-0 right-[25.5%] w-px h-full bg-gradient-to-t from-primary/12 via-primary/4 to-transparent" />
      <div className="absolute top-0 right-[24%] w-px h-full bg-gradient-to-t from-primary/15 via-primary/5 to-transparent" />
      <div className="absolute top-0 right-[22.5%] w-px h-full bg-gradient-to-t from-primary/20 via-primary/8 to-transparent" />
      <div className="absolute top-0 right-[21%] w-px h-full bg-gradient-to-t from-primary/15 via-primary/5 to-transparent" />
      
      {/* Group 2: 2 lines */}
      <div className="absolute top-0 right-[13.5%] w-px h-full bg-gradient-to-t from-primary/18 via-primary/6 to-transparent" />
      <div className="absolute top-0 right-[12%] w-px h-full bg-gradient-to-t from-primary/18 via-primary/6 to-transparent" />
      
      {/* Group 1: 3 lines */}
      <div className="absolute top-0 right-[5%] w-px h-full bg-gradient-to-t from-primary/20 via-primary/8 to-transparent" />
      <div className="absolute top-0 right-[3.5%] w-px h-full bg-gradient-to-t from-primary/15 via-primary/5 to-transparent" />
      <div className="absolute top-0 right-[2%] w-px h-full bg-gradient-to-t from-primary/20 via-primary/8 to-transparent" />
      
      {/* Premium grouped horizontal lines - distributed across full height */}
      {/* Top section */}
      <div className="absolute top-[5%] left-0 h-px w-full bg-gradient-to-r from-primary/18 via-transparent to-primary/18" />
      <div className="absolute top-[7%] left-0 h-px w-full bg-gradient-to-r from-primary/15 via-transparent to-primary/15" />
      
      <div className="absolute top-[18%] left-0 h-px w-full bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />
      <div className="absolute top-[20%] left-0 h-px w-full bg-gradient-to-r from-primary/15 via-transparent to-primary/15" />
      <div className="absolute top-[22%] left-0 h-px w-full bg-gradient-to-r from-primary/12 via-transparent to-primary/12" />
      
      {/* Middle section */}
      <div className="absolute top-[38%] left-0 h-px w-full bg-gradient-to-r from-primary/15 via-transparent to-primary/15" />
      <div className="absolute top-[40%] left-0 h-px w-full bg-gradient-to-r from-primary/18 via-transparent to-primary/18" />
      
      <div className="absolute top-[58%] left-0 h-px w-full bg-gradient-to-r from-primary/12 via-transparent to-primary/12" />
      <div className="absolute top-[60%] left-0 h-px w-full bg-gradient-to-r from-primary/15 via-transparent to-primary/15" />
      <div className="absolute top-[62%] left-0 h-px w-full bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />
      
      {/* Bottom section */}
      <div className="absolute top-[78%] left-0 h-px w-full bg-gradient-to-r from-primary/18 via-transparent to-primary/18" />
      <div className="absolute top-[80%] left-0 h-px w-full bg-gradient-to-r from-primary/15 via-transparent to-primary/15" />
      
      <div className="absolute top-[93%] left-0 h-px w-full bg-gradient-to-r from-primary/15 via-transparent to-primary/15" />
      <div className="absolute top-[95%] left-0 h-px w-full bg-gradient-to-r from-primary/18 via-transparent to-primary/18" />
    </div>
  );
};

export default BackgroundGrid;
