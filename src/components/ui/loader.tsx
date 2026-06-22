import React, { useState, useEffect } from 'react';

export const HydroLoader: React.FC = () => {
  const [frame, setFrame] = useState(0);

  const frames = [
    ` .-----. 
 | (#) | 
 )     ( 
 | (#) | 
 )     ( 
 | (#) | 
 )     ( 
 .-'------'-. 
  \\      .   /  
   \\________/   
 `,
    ` .-----. 
 |  (#)| 
 #)    | 
 |  (#)| 
 #)    | 
 |  (#)| 
 #)    | 
 .-'------'-. 
  \\      .   /  
   \\________/   
 `,
    ` .-----. 
 |   (#| 
 |#)   | 
 |   (#| 
 |#)   | 
 |   (#| 
 |#)   | 
 .-'------'-. 
  \\       .  /  
   \\________/   
 `,
    ` .-----. 
 |    (# 
 |(#)  | 
 |    (# 
 |(#)  | 
 |    (# 
 |(#)  | 
 .-'------'-. 
  \\       .  /  
   \\________/   
 `,
    ` .-----. 
 )     ( 
 | (#) | 
 )     ( 
 | (#) | 
 )     ( 
 | (#) | 
 .-'------'-. 
  \\        . /  
   \\________/   
 `,
    ` .-----. 
 #)    | 
 |  (#)| 
 #)    | 
 |  (#)| 
 #)    | 
 |  (#)| 
 .-'------'-. 
  \\        . /  
   \\________/   
 `,
    ` .-----. 
 |#)   | 
 |   (#| 
 |#)   | 
 |   (#| 
 |#)   | 
 |   (#| 
 .-'------'-. 
  \\          /  
   \\________/   
 `,
    ` .-----. 
 |(#)  | 
 |    (# 
 |(#)  | 
 |    (# 
 |(#)  | 
 |    (# 
 .-'------'-. 
  \\          /  
   \\________/   
 `,
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % frames.length);
    }, 90);

    return () => clearInterval(interval);
  }, [frames.length]);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto px-4 py-20 sm:px-6">
        <div className="flex flex-col items-center justify-center max-h-screen font-mono select-none tracking-wider">
          <div className="text-center">
            <pre className="text-[#84e78a] text-lg leading-tight whitespace-pre text-center mb-5 block animate-pulse">
              {frames[frame]}
            </pre>

            <div className="text-[#57bb5e] text-xs uppercase tracking-widest animate-pulse opacity-70">
              sys.rack // page under construction
              {/*sys.rack_01 // initializing_*/}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HydroLoader;
