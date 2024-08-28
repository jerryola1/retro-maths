import React, { useState, useEffect } from "react";
import { FaCalculator, FaMicrochip, FaClock, FaStar, FaHeart, FaGamepad, FaRedo, FaCheck, FaDumbbell, FaTimes, FaSmile, FaFrown, FaSignOutAlt } from 'react-icons/fa';
import LoginScreen from "../components/LoginScreen";

interface MathProblem {
  a: number;
  b: number;
  operator: string;
}

const SplashScreen: React.FC<{ onStart: (difficulty: string) => void; username: string }> = ({ onStart, username }) => {
  const [difficulty, setDifficulty] = useState("easy");

  return (
    <div className="text-center z-10 relative">
      <h1 className="text-4xl mb-4 animate-pulse">Matrix Math Challenge</h1>
      <h2 className="text-2xl mb-8">Welcome, {username}!</h2>
      <div className="mb-4">
        <select 
          value={difficulty} 
          onChange={(e) => setDifficulty(e.target.value)}
          className="bg-black border border-green-500 text-green-500 px-2 py-1 mr-2"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <button
        onClick={() => onStart(difficulty)}
        className="px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors"
      >
        Enter the Matrix
      </button>
    </div>
  );
};

const MathProblem: React.FC<{ 
  problem: MathProblem | null; 
  onAnswer: (answer: number) => void;
  feedback: string | null;
}> = ({ problem, onAnswer, feedback }) => {
  const [userAnswer, setUserAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnswer(parseFloat(userAnswer));
    setUserAnswer('');
  };

  if (!problem) {
    return <div>Loading new problem...</div>;
  }

  return (
    <div className="z-10 relative bg-black bg-opacity-70 p-6 rounded-lg border border-green-500">
      <p className="text-3xl mb-4 font-bold flex items-center justify-center">
        <FaCalculator className="mr-2 text-yellow-400" />
        {`${problem.a} ${problem.operator} ${problem.b} = ?`}
      </p>
      <form onSubmit={handleSubmit} className="flex justify-center items-center">
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="bg-black border-2 border-green-500 text-green-500 px-4 py-2 mr-2 text-xl w-24 text-center rounded"
          autoFocus
        />
        <button type="submit" className="px-6 py-2 border-2 border-green-500 hover:bg-green-500 hover:text-black transition-colors text-xl rounded flex items-center">
          <FaCheck className="mr-2 text-green-500" />Submit
        </button>
      </form>
      {feedback && (
        <div className={`mt-4 text-xl ${feedback === 'Correct!' ? 'text-green-500' : 'text-red-500'} flex items-center justify-center`}>
          {feedback === 'Correct!' ? <FaSmile className="mr-2" /> : <FaFrown className="mr-2" />}
          {feedback}
        </div>
      )}
    </div>
  );
};

const GameScreen: React.FC<{ 
  difficulty: string; 
  username: string; 
  onLogout: () => void; 
  onRestart: () => void 
}> = ({ difficulty, username, onLogout, onRestart }) => {
  const [score, setScore] = useState(0);
  const [chances, setChances] = useState(3);
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!gameOver) {
      generateNewProblem();
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setGameOver(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameOver]);

  const generateNewProblem = () => {
    const operators = ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let a, b;

    switch (difficulty) {
      case "easy":
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        break;
      case "medium":
        a = Math.floor(Math.random() * 50) + 1;
        b = Math.floor(Math.random() * 50) + 1;
        break;
      case "hard":
        a = Math.floor(Math.random() * 100) + 1;
        b = Math.floor(Math.random() * 100) + 1;
        break;
      default:
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
    }

    if (operator === '/') {
      [a, b] = [b, a];
      a = a * b;
    }

    setCurrentProblem({ a, b, operator });
  };

  const handleAnswer = (answer: number) => {
    if (!currentProblem) return;

    const correctAnswer = eval(`${currentProblem.a} ${currentProblem.operator} ${currentProblem.b}`);
    
    if (Math.abs(answer - correctAnswer) < 0.01) {
      setScore(score + 1);
      setFeedback('Correct!');
    } else {
      setChances(chances - 1);
      setFeedback('Incorrect, try again!');
    }

    setTimeout(() => {
      setFeedback(null);
      if (chances > 1) {
        generateNewProblem();
      } else {
        setGameOver(true);
      }
    }, 1000);
  };

  const handleRestart = () => {
    setScore(0);
    setChances(3);
    setTimeLeft(60);
    setGameOver(false);
    generateNewProblem();
  };

  return (
    <div className="text-center z-20 relative bg-black bg-opacity-80 p-6 rounded-lg border border-green-500 shadow-lg shadow-green-500/50 max-w-2xl w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl md:text-4xl font-bold flex items-center">
          <FaMicrochip className="mr-2 text-blue-500" />Matrix Math Challenge
        </h2>
        <button 
          onClick={onLogout}
          className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-colors rounded flex items-center"
        >
          <FaSignOutAlt className="mr-2" />Logout
        </button>
      </div>
      <h3 className="text-xl md:text-2xl mb-6">Player: {username}</h3>
      {!gameOver ? (
        <>
          <MathProblem problem={currentProblem} onAnswer={handleAnswer} feedback={feedback} />
          <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-4 text-lg md:text-xl">
            <p className="flex items-center"><FaClock className="mr-2 text-yellow-500" />Time: {timeLeft}s</p>
            <p className="flex items-center"><FaStar className="mr-2 text-yellow-400" />Score: {score}</p>
            <p className="flex items-center"><FaHeart className="mr-2 text-red-500" />Lives: {chances}</p>
            <p className="flex items-center"><FaDumbbell className="mr-2 text-purple-500" />Level: {difficulty}</p>
          </div>
        </>
      ) : (
        <div className="bg-black bg-opacity-90 p-6 md:p-8 rounded-lg border border-green-500">
          <p className="text-2xl md:text-3xl mb-4 flex items-center justify-center"><FaGamepad className="mr-2 text-blue-400" />Game Over</p>
          <p className="text-xl md:text-2xl mb-6">Final Score: {score}</p>
          <button 
            onClick={handleRestart} 
            className="px-6 py-3 border-2 border-green-500 hover:bg-green-500 hover:text-black transition-colors text-lg md:text-xl rounded flex items-center justify-center mx-auto mb-4"
          >
            <FaRedo className="mr-2 text-green-500" />Play Again
          </button>
        </div>
      )}
    </div>
  );
};

const MatrixRain: React.FC = () => {
  useEffect(() => {
    const canvas = document.getElementById('matrix-rain') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const fontSize = 14;
    const columns = canvas.width / fontSize;

    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    function draw() {
      if (ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
          const text = characters.charAt(Math.floor(Math.random() * characters.length));
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }

          drops[i]++;
        }
      }
    }

    const interval = setInterval(draw, 33);

    return () => clearInterval(interval);
  }, []);

  return <canvas id="matrix-rain" className="fixed top-0 left-0 w-full h-full pointer-events-none z-10" />;
};

const Home = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (loggedInUsername: string) => {
    setIsLoggedIn(true);
    setUsername(loggedInUsername);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setGameStarted(false);
  };

  const handleRestart = () => {
    setGameStarted(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-green-500 font-mono p-4 relative">
      <div className="relative w-full max-w-4xl mx-auto z-20">
        {!isLoggedIn ? (
          <LoginScreen onLogin={handleLogin} />
        ) : !gameStarted ? (
          <div className="bg-black bg-opacity-80 p-6 rounded-lg border border-green-500 shadow-lg shadow-green-500/50">
            <SplashScreen 
              onStart={(selectedDifficulty) => {
                setDifficulty(selectedDifficulty);
                setGameStarted(true);
              }} 
              username={username}
            />
          </div>
        ) : (
          <GameScreen 
            difficulty={difficulty} 
            username={username} 
            onLogout={handleLogout}
            onRestart={handleRestart}
          />
        )}
      </div>
      <MatrixRain />
    </main>
  );
};

export default Home;
