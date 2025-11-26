// @ts-nocheck
import React, { useState, useEffect, useCallback} from 'react';
import banner from './assets/screenshot-2025-11-25_23-18-16.png'
import pop from './assets/mixkit-hard-pop-click-2364.wav'
import useSound from 'use-sound';
import ending from './assets/ไม่มีชื่อ (1366 x 1024 px).png'
import { 
  Zap, 
  LayoutGrid, 
  FileText, 
  Hash, 
  Type, 
  Target, 
  Layers, 
  Ellipsis,
  Clock4
} from 'lucide-react';

// --- Utility Components ---
const GameCard = ({ icon: Icon, title, description, isNew = false, onClick,iconColor = 'text-[#2b87d1]' }) => (
  <div 
    className="bg-white p-6 group rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center border border-gray-100 relative"
    onClick={onClick}
  >
    {isNew && (
      <span className="absolute top-2 right-2 bg-pink-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">New</span>
    )}
    <div className={`mb-3 relative ${iconColor} group-hover:text-[#FF9345]`}>
      <Icon className="w-12 h-12 stroke-1" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

// --- Game Core Component ---
const CoreReactionTest = ({ gameState, reactionTime, renderContent, handleInteraction, isFullPage = false }) => {
  const colors = {
    idle: 'bg-[#2b87d1]',
    waiting: 'bg-[#ce2636]',
    ready: 'bg-[#4bdb6a]',
    clicked: 'bg-[#2b87d1]',
    tooSoon: 'bg-[#2b87d1]',
  };

  const baseClasses = `
    w-full
    ${isFullPage ? 'h-[600px] md:h-[600px] mt-4 rounded-xl max-w-8xl mx-auto' : 'h-[600px] md:h-[600px]'}
    ${colors[gameState]}
    cursor-pointer select-none flex flex-col items-center justify-center
    transition-colors duration-100 ease-in px-4 relative overflow-hidden
  `;

  return (
    <div 
      onMouseDown={handleInteraction}
      onTouchEnd={(e) => { e.preventDefault(); handleInteraction(); }}
      className={baseClasses}
    >
      {renderContent()}
    </div>
  );
};

// // Full-page Reaction Test
// const ReactionTestFullPage = ({ setView }) => {
//   const [gameState, setGameState] = useState('idle');
//   const [startTime, setStartTime] = useState(0);
//   const [reactionTime, setReactionTime] = useState(null);
//   const [timeoutId, setTimeoutId] = useState(null);

//   const handleInteraction = () => {
//     if (gameState === 'idle' || gameState === 'clicked' || gameState === 'tooSoon') startWaiting();
//     else if (gameState === 'waiting') triggerTooSoon();
//     else if (gameState === 'ready') finishTest();
//   };

//   const startWaiting = () => {
//     setGameState('waiting');
//     setReactionTime(null);

//     const delay = Math.random() * 3000 + 2000;

//     const id = setTimeout(() => {
//       setGameState('ready');
//       setStartTime(Date.now());
//     }, delay);

//     setTimeoutId(id);
//   };

//   const triggerTooSoon = () => {
//     clearTimeout(timeoutId);
//     setGameState('tooSoon');
//   };

//   const finishTest = () => {
//     const time = Date.now() - startTime;
//     setReactionTime(time);
//     setGameState('clicked');
//   };

//   const renderContent = () => {
//     switch (gameState) {
//       case 'idle':
//         return (
//           <div className="text-center animate-fade-in">
//             <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Reaction Time Test</h1>
//             <p className="text-xl md:text-2xl text-white/90">When the red box turns green, click fast.</p>
//             <p className="text-lg text-white/80 mt-4 font-semibold">Click anywhere to begin.</p> 
//           </div>
//         );
//       case 'waiting':
//         return <p className="text-center text-6xl md:text-8xl font-light text-white">Wait for Green...</p>;
//       case 'ready':
//         return <h1 className="text-center text-6xl md:text-8xl font-light text-white">CLICK!</h1>;
//       case 'clicked':
//         return (
//           <div className="text-center animate-fade-in-up">
//             <h1 className="text-6xl md:text-8xl font-light text-white mb-4">{reactionTime} ms</h1>
//             <p className="text-2xl text-white/90">Click to try again</p>
//           </div>
//         );
//       case 'tooSoon':
//         return (
//           <div className="text-center animate-shake">
//             <h1 className="text-10xl md:text-6xl font-light text-white mb-4">Too Soon!</h1>
//             <p className="text-xl text-white/90">Click to try again.</p>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="pb-12">
//       <button 
//         onClick={() => setView('dashboard')}
//         className="text-sm font-semibold text-gray-500 hover:text-gray-800 mt-4 ml-4 flex items-center"
//       >
//         <span className="text-2xl mr-2">&larr;</span> Back
//       </button>

//       <CoreReactionTest 
//         gameState={gameState}
//         reactionTime={reactionTime}
//         renderContent={renderContent}
//         handleInteraction={handleInteraction}
//         isFullPage={true}
//       />
//     </div>
//   );
// };

// Dashboard Component
const Dashboard = ({ setView }) => {
  const [gameState, setGameState] = useState('idle');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [script, setScript] = useState(0)
  const [endtitle, setEndtitle] = useState(false)
  const [popSound] = useSound(pop)
  const fetchData = useCallback(async () => {
    try {
       
      // NOTE: Replace this URL with your actual API endpoint
      const response = await fetch('https://shiny-sonia-burapat-c9f29e3d.koyeb.app/api/data');
      
      if (!response.ok) {
        // Log the error but continue. We won't set a specific error state.
        console.error(`Fetch failed with status: ${response.status}`);
        // Optional: If an error occurs, you can choose to set data back to null
        // or just let it keep the old value. We'll keep the old value for continuity.
        return; 
      }
      
      const jsonData = await response.json();
      console.log(jsonData)
      // Update data only on success
      setScript(jsonData['script_number']); 
      setEndtitle(jsonData['title'])

    } catch (err) {
      console.error("Network or parsing error:", err);
      // Data remains unchanged (or null if it was the initial fetch)
    }
  }, []); 

  useEffect(() => {
    // 1. Initial Fetch
    fetchData();
    // 2. Set up the Interval (100ms)
    const intervalId = setInterval(() => {
      fetchData();
    }, 500); // 100 milliseconds
  })
  const handleInteraction = () => {
    if (gameState === 'idle' || gameState === 'clicked' || gameState === 'tooSoon') startWaiting();
    // else if (gameState === 'waiting' && scriptnpm r != 0) startScript();
    else if (gameState === 'ready' && script != 0) startScript();
    else if (gameState === 'waiting') triggerTooSoon();
    else if (gameState === 'ready') finishTest();
  };
  const startScript = ()=>{
      // setGameState('ready');
      // const id = setTimeout(() => {
        setReactionTime(script)
        setGameState('clicked');
      // }, script);

      // setTimeoutId(id);
    
  }
  const startWaiting = () => {
    setGameState('waiting');
    setReactionTime(null);
    const delay = Math.random() * 3000 + 1500;
    // if (script == 0) { // On script
      const id = setTimeout(() => {
        setGameState('ready');
        setStartTime(Date.now());
      }, delay);
    // }
 
    setTimeoutId(id);
  };

  const triggerTooSoon = () => {
    clearTimeout(timeoutId);
    setGameState('tooSoon');
  };

  const finishTest = () => {
    setReactionTime(Date.now() - startTime);
    setGameState('clicked');
  };

  const renderHeroContent = () => {
    switch (gameState) {
      case 'idle':
        return (
          <div className="text-center animate-fade-in" >
            <Zap className="w-35 h-35 mx-auto stroke-1 mb-5 opacity-85" fill="white" stroke="white" />
            <h1 className="text-5xl md:text-7xl mb-4 text-white">Reaction Time Test</h1>
            <p className="text-2xl md:text-2xl font-normal   text-white">
              When the red box turns green, click as quickly as you can.  
            </p>
                    <p className="text-2xl md:text-2xl font-normal mb-8 text-white">
              Click anywhere to start.
            </p>
           
          </div>
        );
      case 'waiting':
        return (<div> <div className="flex items-center w-full justify-center"><Ellipsis size={120} color='white'/></div>
        <h1 className="text-center text-7xl md:text-7xl font-normal text-white">Wait for green</h1>
        </div>
      );
      case 'ready':
         popSound()
      return (
          
          <div> <div className="flex items-center w-full justify-center"><Ellipsis size={120} color='white'/></div>
           
            <h1 className="text-center text-8xl md:text-8xl font-normal text-white">Click!</h1>
             
          </div>
        
      )
      case 'clicked':
        return (
          <div className="text-center  ">
            <div className="flex justify-center mb-5"><Clock4 size={100} /></div>
             
            <h1 className="text-7xl md:text-8xl font-normal text-white mb-4">{reactionTime} ms</h1>
            <button
              onClick={startWaiting}
             >
             <p className="text-2xl text-white/90">Click to keep going</p>
            </button>
          </div>
        );
      case 'tooSoon':
        return (
          <div className="text-center  ">
            <h1 className="text-7xl md:text-8xl font-normal text-white mb-4">Too soon!</h1>
            <button
              onClick={startWaiting}>
                 <p className="text-2xl text-white mt-0.5">Click to try again.</p>

            </button>
          </div>
        );
    }
  };

  if (endtitle){
    return <img src={ending} className='h-full w-full'/>
  }
  else {
    return(
      <>
      <CoreReactionTest 
        gameState={gameState}
        reactionTime={reactionTime}
        renderContent={renderHeroContent}
        handleInteraction={handleInteraction}
      />
      <div className="flex justify-center mt-2.5"> 
       <img src={banner} className='cursor-pointer'></img>
       </div>
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <GameCard 
            icon={Zap} 
            title="Reaction Time "
            description="Test your reflexes."
            isNew={true}
          />
          <GameCard icon={Layers} title="Sequence Memory" description="Remember an increasingly long pattern of button presses." isNew={true} />
          <GameCard icon={Target} title="Aim Trainer" description="How quickly can you hit all the targets?." isNew={true} />
          <GameCard icon={Hash} title="Number Memory" description="Remember the longest number you can." />
          <GameCard icon={FileText} title="Verbal Memory" description="Keep as many words in short term memory as possible." />
          <GameCard icon={LayoutGrid} title="Chimp Test" description="Are you smarter than a chimpanzee?." />
          <GameCard icon={LayoutGrid} title="Visual Memory" description="Remember an increasingly large board of squares." />
          <GameCard icon={Type} title="Typing" description="How many words per minute can you type?" />
        </div>
      </div>
    </>
    )
  }
};

// Main App
export default function App() {
  const [view, setView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#f3fefb] font-sans ">
      <nav className="bg-white shadow-sm border-b border-gray-200 h-10 flex items-center px-4 md:px-8 justify-between">
        <div className="flex items-center gap-4 h-full">
          <Zap className="w-8 h-8 fill-[#CAC9C8]" />
          <span className="text-l font text-gray-700 mr hover:bg-gray-100  cursor-pointer h-full items-center flex duration-150 ">HUMAN BENCHMARK</span>
          <span className="text-l font text-gray-700 hover:bg-gray-100  cursor-pointer h-full items-center flex duration-150">DASHBOARD</span>

        </div>
    <div className="flex items-center gap-6 text-sm text-gray-900 h-full">
      <span className="bg-white hover:bg-gray-100 text-l cursor-pointer h-full  items-center flex duration-150">
        SIGN UP
      </span>
      <span className="hover:bg-gray-100 text-l cursor-pointer h-full  items-center flex duration-150">
        LOGIN
      </span>
    </div>

      </nav>

      {view === 'dashboard' && <Dashboard setView={setView} />}
    

      <footer className="w-full text-center py-8 text-xs text-gray-400 border-t border-gray-100 mt-12">
        <p>Copyright 2007-2025 Human Benchmark</p>
      </footer>
    </div>
  );
}
