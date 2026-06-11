/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal as TerminalIcon, 
  Settings as SettingsIcon, 
  AlertTriangle, 
  Play, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Award, 
  RotateCcw, 
  Heart, 
  Info, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  BookOpen, 
  Cpu, 
  X, 
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Layers,
  Database,
  Activity,
  Network,
  Timer,
  PlusCircle,
  Trash2,
  Edit3,
  CheckSquare,
  Binary,
  RefreshCw,
  Plus
} from 'lucide-react';
import { challenges } from './data';
import { Challenge, ChallengeMode, FindChallenge, MultipleChallenge, FixChallenge } from './types';
import { sound } from './sound';
import api from './api';

// Matrix Rain Backdrop Component
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = latin + nums + '<>/{}=+:;';

    const fontSize = 14;
    const columns = Math.floor(width / fontSize);

    const rainDrops: number[] = Array.from({ length: columns }, () => 1);

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.12)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-30" />;
}

const DINO_PIXELS = [
  "            ############",
  "            ############",
  "            ###  #######",
  "            ###  #######",
  "            ############",
  "            ######      ",
  "            ########    ",
  "            ####        ",
  "     #      ####        ",
  "     #      ######      ",
  "     #      #######  ## ",
  "     ##    ######### ## ",
  "     ###############    ",
  "     ###############    ",
  "      #############     ",
  "       ###########      ",
  "        #########       ",
  "        ###   ###       ",
  "        ##     ##       ",
  "        #       #       ",
  "        ##      ##      "
];

function RetroDinosaur() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(f => (f + 1) % 2);
    }, 300); // slightly faster pacing for an eager 8-bit running look
    return () => clearInterval(timer);
  }, []);

  const modifiedMatrix = [...DINO_PIXELS];
  if (frame === 1) {
    // Leg frame B: Left leg raised, right leg down
    modifiedMatrix[17] = "        ###   ###       ";
    modifiedMatrix[18] = "         ##    ##       ";
    modifiedMatrix[19] = "         #      #       ";
    modifiedMatrix[20] = "                ##      ";
  } else {
    // Leg frame A: Right leg raised, left leg down
    modifiedMatrix[17] = "        ###   ###       ";
    modifiedMatrix[18] = "        ##     #        ";
    modifiedMatrix[19] = "        #      ##       ";
    modifiedMatrix[20] = "        ##              ";
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="grid gap-[2px]" style={{ gridTemplateRows: `repeat(${modifiedMatrix.length}, minmax(0, 1fr))` }}>
        {modifiedMatrix.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-[2px]">
            {row.split("").map((char, cIdx) => (
              <div 
                key={cIdx} 
                className={`w-[6px] h-[6px] transition-colors duration-200 ${
                  char === "#" 
                     ? "bg-[#ff2a5f] shadow-[0_0_8px_rgba(255,42,95,0.8)] animate-pulse" 
                     : "bg-transparent"
                }`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="text-[10px] text-error font-pixel uppercase mt-4 animate-bounce text-center tracking-widest bg-error-container/25 border border-error px-4 py-1.5 rounded-sm">
        ERROR_DINO_404_CONNECTION_TERMINATED
      </div>
    </div>
  );
}

export default function App() {
  // Navigation & Config state
  const [screen, setScreen] = useState<'auth' | 'menu' | 'settings' | 'game' | 'gameover' | 'victory' | 'infographic'>('auth');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(1);
  const [selectedMode, setSelectedMode] = useState<ChallengeMode | 'mixed'>('mixed');
  
  // Auth Form State (Offline persistence with localStorage accounts array)
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Game Loop states
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [warnings, setWarnings] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [highestScore, setHighestScore] = useState<number>(0);
  const [timer, setTimer] = useState<number>(20);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMusicOn, setIsMusicOn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('retro_coder_music_on');
      return saved !== null ? saved === 'true' : true;
    } catch (e) {
      return true;
    }
  });
  const [musicVol, setMusicVol] = useState<number>(sound.getMusicVolume());
  const [questionCount, setQuestionCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('retro_coder_question_count');
      return saved ? parseInt(saved, 10) : 15;
    } catch (e) {
      return 15;
    }
  });
  const [playedChallengeIds, setPlayedChallengeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('played_challenge_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [maxTimer, setMaxTimer] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('retro_coder_max_timer');
      return saved ? parseInt(saved, 10) : 20;
    } catch (e) {
      return 20;
    }
  });
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<number>(0);

  // Shared Bug Database CRUD states
  const [dbMode, setDbMode] = useState<'simulation' | 'mongodb'>('simulation');
  const [bugs, setBugs] = useState<any[]>([]);
  const [bugsLoading, setBugsLoading] = useState<boolean>(false);
  const [bugsError, setBugsError] = useState<string | null>(null);
  const [selectedBug, setSelectedBug] = useState<any | null>(null);
  const [isCreatingBug, setIsCreatingBug] = useState<boolean>(false);
  const [isEditingBug, setIsEditingBug] = useState<boolean>(false);
  
  // Bug form state
  const [bugFormTitle, setBugFormTitle] = useState<string>('');
  const [bugFormDescription, setBugFormDescription] = useState<string>('');
  const [bugFormCode, setBugFormCode] = useState<string>('');
  const [bugFormSeverity, setBugFormSeverity] = useState<string>('medium');
  const [bugFormStatus, setBugFormStatus] = useState<string>('open');

  const formatTimeLabel = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} Segundos`;
    }
    const mins = Math.floor(seconds / 60);
    const remainingSecs = seconds % 60;
    if (remainingSecs === 0) {
      return `${mins} Minuto${mins > 1 ? 's' : ''}`;
    }
    return `${mins} Min ${remainingSecs} Seg`;
  };

  const getTimeMultiplier = (maxT: number) => {
    if (maxT < 20) {
      // Bonus: lower time = more points
      return 20 / maxT;
    }
    if (maxT > 90) {
      // Penalty: from 1.5 minutes (90 seconds) onwards, score is penalized (90/maxT)
      return 90 / maxT;
    }
    // Standard multiplier of 1.0x between 20s and 90s
    return 1.0;
  };
  
  // Interaction/UX states
  const [userFixInput, setUserFixInput] = useState<string>('');
  const [hintUsed, setHintUsed] = useState<boolean>(false);
  const [wrongLineIndex, setWrongLineIndex] = useState<number | null>(null);
  const [correctLineSelected, setCorrectLineSelected] = useState<boolean>(false);
  const [feedbackOverlay, setFeedbackOverlay] = useState<{
    show: boolean;
    isCorrect: boolean;
    title: string;
    msg: string;
  } | null>(null);
  const [aiLogs, setAiLogs] = useState<Array<{ text: string; type: 'info' | 'success' | 'danger' }>>([]);
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null);
  
  // Visual Toggles
  const [crtFilter, setCrtFilter] = useState<boolean>(true);
  const [crtFlicker, setCrtFlicker] = useState<boolean>(true);
  const [scanlines, setScanlines] = useState<boolean>(true);
  const [showCredits, setShowCredits] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [showFlasher, setShowFlasher] = useState<boolean>(false); // Quick screen white flicker on success/damage
  const [infoTab, setInfoTab] = useState<'overview' | 'architecture' | 'gameplay'>('overview');
  
  // Refs
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  // Music trigger to match screen state
  useEffect(() => {
    if (isMusicOn) {
      if (screen === 'game') {
        sound.startMusic('game');
      } else {
        sound.startMusic('menu');
      }
    } else {
      sound.stopMusic();
    }
  }, [screen, isMusicOn]);

  // Load High Score and session on mount
  useEffect(() => {
    const saved = localStorage.getItem('retro_coder_high_score');
    if (saved) {
      setHighestScore(parseInt(saved, 10));
    }
    
    const verifySession = async () => {
      const token = localStorage.getItem('retro_coder_jwt_token');
      if (token) {
        try {
          const res = await api.get('/api/auth/profile');
          if (res.data.username) {
            setCurrentUser(res.data.username);
            setHighestScore(res.data.highestScore || 0);
            if (res.data.dbMode) {
              setDbMode(res.data.dbMode);
            }
            setScreen('menu');
          }
        } catch (e) {
          console.error('Session verification expired:', e);
          localStorage.removeItem('retro_coder_session');
          localStorage.removeItem('retro_coder_jwt_token');
          setCurrentUser(null);
          setScreen('auth');
        }
      } else {
        const savedUser = localStorage.getItem('retro_coder_session');
        if (savedUser) {
          setCurrentUser(savedUser);
          setScreen('menu');
        } else {
          setScreen('auth');
        }
      }
    };

    verifySession();
  }, []);

  // Save High Score on change
  useEffect(() => {
    if (score > highestScore) {
      setHighestScore(score);
      localStorage.setItem('retro_coder_high_score', score.toString());
      
      // Upload score to database via Axios if authorized
      const token = localStorage.getItem('retro_coder_jwt_token');
      if (token && currentUser) {
        api.post('/api/auth/high-score', { score: score })
          .then(res => {
            if (res.data.highestScore !== undefined) {
              setHighestScore(res.data.highestScore);
              if (res.data.dbMode) {
                setDbMode(res.data.dbMode);
              }
            }
          })
          .catch(e => console.error('Error uploading high score:', e));
      }
    }
  }, [score, highestScore, currentUser]);

  // Audio helper
  const playSfx = (type: 'click' | 'tick' | 'correct' | 'wrong' | 'victory' | 'fail') => {
    if (isMuted) return;
    if (type === 'click') sound.playClick();
    if (type === 'tick') sound.playTick();
    if (type === 'correct') sound.playCorrect();
    if (type === 'wrong') sound.playWrong();
    if (type === 'victory') sound.playVictory();
    if (type === 'fail') sound.playFail();

    // Auto-resume background synthesizer music on user interaction if active but blocked by browser's autoplay policies
    if (isMusicOn && !sound.isMusicActive()) {
      sound.startMusic(screen === 'game' ? 'game' : 'menu');
    }
  };

  const toggleBackgroundMusic = () => {
    playSfx('click');
    const targetTrack = screen === 'game' ? 'game' : 'menu';
    const newState = sound.toggleMusic(targetTrack);
    setIsMusicOn(newState);
    try {
      localStorage.setItem('retro_coder_music_on', newState.toString());
    } catch (e) {}
  };

  const handleMuteChange = () => {
    if (isMuted) {
      setIsMuted(false);
      // Play a click as feedback
      setTimeout(() => {
        sound.playClick();
      }, 50);
    } else {
      sound.stopMusic();
      setIsMusicOn(false);
      setIsMuted(true);
    }
  };

  const handleLogout = () => {
    playSfx('click');
    localStorage.removeItem('retro_coder_session');
    localStorage.removeItem('retro_coder_jwt_token');
    setCurrentUser(null);
    setScreen('auth');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (authMode === 'login') {
      if (!loginEmail || !loginPassword) {
        setAuthError('Todos los campos son obligatorios.');
        playSfx('wrong');
        return;
      }
      try {
        const res = await api.post('/api/auth/login', {
          email: loginEmail,
          password: loginPassword,
        });

        playSfx('correct');
        setAuthSuccess(`SESIÓN AUTORIZADA: BIENVENIDO ${res.data.username.toUpperCase()}`);
        
        // Save token and username to localStorage
        localStorage.setItem('retro_coder_jwt_token', res.data.token);
        localStorage.setItem('retro_coder_session', res.data.username);
        setCurrentUser(res.data.username);
        
        if (res.data.highestScore !== undefined) {
          setHighestScore(res.data.highestScore);
        }
        if (res.data.dbMode) {
          setDbMode(res.data.dbMode);
        }

        setTimeout(() => {
          setScreen('menu');
          setLoginEmail('');
          setLoginPassword('');
          setAuthSuccess(null);
        }, 1500);
      } catch (err: any) {
        setAuthError(err.response?.data?.error || 'Falló el inicio de sesión. Credenciales incorrectas.');
        playSfx('wrong');
      }
    } else {
      // Register
      if (!registerUsername || !registerEmail || !registerPassword) {
        setAuthError('Todos los campos son obligatorios.');
        playSfx('wrong');
        return;
      }
      if (registerUsername.length < 3) {
        setAuthError('El usuario debe tener al menos 3 caracteres.');
        playSfx('wrong');
        return;
      }
      if (registerPassword.length < 5) {
        setAuthError('La contraseña debe tener al menos 5 caracteres.');
        playSfx('wrong');
        return;
      }
      if (!registerEmail.includes('@') || !registerEmail.includes('.')) {
        setAuthError('Formato de correo electrónico inválido.');
        playSfx('wrong');
        return;
      }

      try {
        const res = await api.post('/api/auth/register', {
          username: registerUsername,
          email: registerEmail,
          password: registerPassword,
        });

        playSfx('correct');
        setAuthSuccess('REGISTRO COMPLETADO CON ÉXITO EN MONGODB');
        
        localStorage.setItem('retro_coder_jwt_token', res.data.token);
        localStorage.setItem('retro_coder_session', res.data.username);
        setCurrentUser(res.data.username);
        if (res.data.dbMode) {
          setDbMode(res.data.dbMode);
        }

        setTimeout(() => {
          setScreen('menu');
          setRegisterUsername('');
          setRegisterEmail('');
          setRegisterPassword('');
          setAuthSuccess(null);
        }, 1500);
      } catch (err: any) {
        setAuthError(err.response?.data?.error || 'Error al registrar la cuenta. El usuario o correo ya podría existir.');
        playSfx('wrong');
      }
    }
  };

  // Shared Bug Database CRUD helper functions
  const fetchBugs = async () => {
    setBugsLoading(true);
    setBugsError(null);
    try {
      const res = await api.get('/api/bugs');
      setBugs(res.data.bugs || []);
      if (res.data.dbMode) {
        setDbMode(res.data.dbMode);
      }
    } catch (err: any) {
      console.error('Error fetching bugs:', err);
      setBugsError(err.response?.data?.error || 'No se pudo cargar el listado de bugs.');
    } finally {
      setBugsLoading(false);
    }
  };

  const handleCreateBugSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugFormTitle.trim() || !bugFormDescription.trim() || !bugFormCode.trim()) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }
    try {
      const res = await api.post('/api/bugs', {
        title: bugFormTitle,
        description: bugFormDescription,
        codeSnippet: bugFormCode,
        severity: bugFormSeverity
      });
      playSfx('correct');
      fetchBugs();
      // Clear form values
      setBugFormTitle('');
      setBugFormDescription('');
      setBugFormCode('');
      setBugFormSeverity('medium');
      setIsCreatingBug(false);
    } catch (err: any) {
      console.error('Error creating bug:', err);
      alert(err.response?.data?.error || 'Error al guardar el bug.');
      playSfx('wrong');
    }
  };

  const handleUpdateBugSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBug) return;
    try {
      const res = await api.put(`/api/bugs/${selectedBug._id}`, {
        title: bugFormTitle,
        description: bugFormDescription,
        codeSnippet: bugFormCode,
        severity: bugFormSeverity,
        status: bugFormStatus
      });
      playSfx('correct');
      fetchBugs();
      setSelectedBug(res.data.bug || null);
      setIsEditingBug(false);
    } catch (err: any) {
      console.error('Error updating bug:', err);
      alert(err.response?.data?.error || 'No tienes permisos de autor para editar este bug.');
      playSfx('wrong');
    }
  };

  const handleDeleteBug = async (id: string) => {
    if (!window.confirm('¿Confirmas eliminar permanentemente este registro de bug?')) {
      return;
    }
    try {
      await api.delete(`/api/bugs/${id}`);
      playSfx('correct');
      setSelectedBug(null);
      fetchBugs();
    } catch (err: any) {
      console.error('Error deleting bug:', err);
      alert(err.response?.data?.error || 'No tienes permisos de autor para eliminar este bug.');
      playSfx('wrong');
    }
  };

  // Build the game list based on level & mode selections
  const startGame = () => {
    playSfx('correct');
    
    // Filter challenges based on chosen difficulty and mode
    const challengesForMode = selectedMode !== 'mixed' 
      ? challenges.filter(c => c.mode === selectedMode)
      : challenges;

    let list = challengesForMode.filter(c => c.level === selectedDifficulty);
    
    // fallback if no exact mode matches: pull all matching this mode across all levels
    if (list.length === 0) {
      list = challengesForMode;
    }

    // Filter out already played questions for non-repetition
    let availableUnplayed = list.filter(c => !playedChallengeIds.includes(c.id));
    if (availableUnplayed.length === 0) {
      // If all elements matching criteria have been completed in history, reset played history for *these* matching challenges
      const matchingIds = list.map(c => c.id);
      setPlayedChallengeIds(prev => {
        const next = prev.filter(id => !matchingIds.includes(id));
        localStorage.setItem('played_challenge_ids', JSON.stringify(next));
        return next;
      });
      availableUnplayed = list;
    }

    // Let's sort the unplayed ones randomly
    let shuffled = [...availableUnplayed].sort(() => Math.random() - 0.5);
    
    // If we need more questions to reach the requested `questionCount`, we supplement with the played ones of the same filter
    if (shuffled.length < questionCount) {
      const playedSameFilter = list.filter(c => playedChallengeIds.includes(c.id)).sort(() => Math.random() - 0.5);
      shuffled = [...shuffled, ...playedSameFilter];
    }
    
    // If still less than `questionCount` (e.g. they selected a specialized mode that has very few questions overall), we supplement from other difficulties OF THE ACCORDING MODE
    if (shuffled.length < questionCount) {
      const otherDiffs = challengesForMode.filter(c => c.level !== selectedDifficulty).sort(() => Math.random() - 0.5);
      shuffled = [...shuffled, ...otherDiffs];
    }

    // If still less, we duplicate questions with temporary unique IDs
    let finalSelection = [...shuffled];
    while (finalSelection.length < questionCount) {
      const copies = shuffled.map((c, i) => ({
        ...c,
        id: `${c.id}_dup_${i}_${Math.random().toString(36).substring(2, 6)}`
      }));
      finalSelection = [...finalSelection, ...copies];
    }

    // Slice to exact target questionCount
    finalSelection = finalSelection.slice(0, questionCount);

    setActiveChallenges(finalSelection);
    setCurrentIdx(0);
    setLives(3);
    setWarnings(0);
    setScore(0);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    
    // Initialize first challenge
    loadChallenge(finalSelection, 0);
    setScreen('game');
  };

  // Set active parameters for next challenge
  const loadChallenge = (list: Challenge[], index: number) => {
    const active = list[index];
    if (!active) return;

    setUserFixInput('');
    setHintUsed(false);
    setSelectedLineIndex(null);
    setWrongLineIndex(null);
    setCorrectLineSelected(false);
    
    // Define starting logs for the AI Debugger feed
    const welcomeLog = {
      text: `Secuencia de Diagnóstico Iniciada para el componente [${active.filename}]. Modo: ${
        active.mode === 'find' ? 'ENCONTRAR EL ERROR' : active.mode === 'multiple' ? 'OPCIÓN MÚLTIPLE' : 'CORREGIR CÓDIGO'
      }.`,
      type: 'info' as const
    };
    const descLog = {
      text: `Descripción del Módulo: "${active.description}"`,
      type: 'info' as const
    };
    
    setAiLogs([welcomeLog, descLog]);
    setTimer(maxTimer);
    setTimerActive(true);
  };

  // Timer loop effect
  useEffect(() => {
    if (timerActive && screen === 'game') {
      timerIntervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            handleTimeout();
            return 0;
          }
          if (prev <= 6) {
            playSfx('tick');
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerActive, screen, currentIdx]);

  // Handle Timeout / No answer on time
  const handleTimeout = () => {
    playSfx('wrong');
    triggerDamageFlash();
    
    const active = activeChallenges[currentIdx];
    const fineMsg = active.mode === 'find' 
      ? `Tiempo agotado. La respuesta correcta era la línea ${active.errorLineIndex + 1}.` 
      : active.mode === 'multiple' 
      ? `Tiempo agotado. La opción correcta era la número ${active.correctOptionIndex + 1}.`
      : `Tiempo agotado. El código correcto era: "${active.correctText}".`;

    applyWrongGuess(fineMsg + " Se ha restado un punto de advertencia.");
  };

  // Quick graphical flash effect
  const triggerDamageFlash = () => {
    setShowFlasher(true);
    setTimeout(() => setShowFlasher(false), 200);
  };

  // Process a wrong turn
  const applyWrongGuess = (feedbackText: string) => {
    setIncorrectAnswers(prev => prev + 1);
    setLives(prev => {
      const nextLives = prev - 1;
      setWarnings(3 - nextLives);
      
      const updatedLogs = [
        { text: `[ADVERTENCIA EMITIDA]: ${feedbackText}`, type: 'danger' as const },
        ...aiLogs
      ];
      setAiLogs(updatedLogs);

      if (nextLives <= 0) {
        setTimerActive(false);
        playSfx('fail');
        setScreen('gameover');
      } else {
        // Show feedback modal, lock inputs momentarily, then load next challenge
        setFeedbackOverlay({
          show: true,
          isCorrect: false,
          title: "ACCESO DENEGADO",
          msg: feedbackText
        });
        
        setTimeout(() => {
          setFeedbackOverlay(null);
          // Auto advance to next challenge
          nextChallenge();
        }, 3000);
      }
      return nextLives;
    });
  };

  const nextChallenge = () => {
    setCurrentIdx(prev => {
      const nextIdx = prev + 1;
      if (nextIdx >= activeChallenges.length) {
        setTimerActive(false);
        playSfx('victory');
        setScreen('victory');
        return prev;
      } else {
        loadChallenge(activeChallenges, nextIdx);
        return nextIdx;
      }
    });
  };

  // Evaluate the correct event
  const handleSuccessAnswer = (successText: string) => {
    playSfx('correct');
    
    // Calculate point scaling using the getTimeMultiplier helper (penalty starts from 1.5 min onwards)
    const timeMultiplier = getTimeMultiplier(maxTimer);
    const addedPoints = Math.round((100 + timer * 10) * timeMultiplier);
    
    setScore(prev => prev + addedPoints);
    setCorrectAnswers(prev => prev + 1);

    const currentChall = activeChallenges[currentIdx];
    if (currentChall) {
      setPlayedChallengeIds(prev => {
        if (!prev.includes(currentChall.id)) {
          const next = [...prev, currentChall.id];
          localStorage.setItem('played_challenge_ids', JSON.stringify(next));
          return next;
        }
        return prev;
      });
    }

    const newLogs = [
      { text: `[RESOLVIDO]: ${successText} (+${addedPoints} pts con mult. x${timeMultiplier.toFixed(2)})`, type: 'success' as const },
      ...aiLogs
    ];
    setAiLogs(newLogs);

    setFeedbackOverlay({
      show: true,
      isCorrect: true,
      title: "ACCESO CONCEDIDO",
      msg: successText
    });

    setTimerActive(false);

    setTimeout(() => {
      setFeedbackOverlay(null);
      nextChallenge();
    }, 2500);
  };

  // Click on a line (for Find the Bug mode)
  const handleLineClick = (idx: number) => {
    if (feedbackOverlay || lives <= 0 || correctLineSelected) return;
    playSfx('click');
    setSelectedLineIndex(idx);

    const active = activeChallenges[currentIdx] as FindChallenge;
    if (idx === active.errorLineIndex) {
      setCorrectLineSelected(true);
      setWrongLineIndex(null);
      
      const solvedMsg = `¡Acertaste! Error de sintaxis detectado en la línea ${idx + 1}: ${active.errorName}. EXPLICACIÓN: ${active.explanation}`;
      handleSuccessAnswer(solvedMsg);
    } else {
      setWrongLineIndex(idx);
      applyWrongGuess(`Línea ${idx + 1} no posee errores de sintaxis críticos.`);
    }
  };

  // Select option (for Multiple Choice mode)
  const handleOptionSelect = (optionIdx: number) => {
    if (feedbackOverlay || lives <= 0) return;
    playSfx('click');

    const active = activeChallenges[currentIdx] as MultipleChallenge;
    if (optionIdx === active.correctOptionIndex) {
      const solvedMsg = `¡Correcto! Respuesta correcta elegida. Explicación: ${active.explanation}`;
      handleSuccessAnswer(solvedMsg);
    } else {
      const wrongMsg = `Respuesta incorrecta. Elegiste "${active.options[optionIdx]}". La correcta era "${active.options[active.correctOptionIndex]}".`;
      applyWrongGuess(wrongMsg);
    }
  };

  // Submit typed correction (for Fix the Code mode)
  const handleFixSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (feedbackOverlay || lives <= 0) return;
    playSfx('click');

    const active = activeChallenges[currentIdx] as FixChallenge;
    const cleanProposed = userFixInput.trim().replace(/\s+/g, ' ');
    const cleanSolution = active.correctText.trim().replace(/\s+/g, ' ');

    if (cleanProposed === cleanSolution) {
      const solvedMsg = `¡Código corregido! Conexión compilada con éxito. Explicación: ${active.explanation}`;
      handleSuccessAnswer(solvedMsg);
    } else {
      const wrongMsg = `La corrección planteada falló al compilar. Solución esperada: "${active.correctText}"`;
      applyWrongGuess(wrongMsg);
    }
  };

  // Request a hint
  const triggerHint = () => {
    if (hintUsed || feedbackOverlay || lives <= 0) return;
    playSfx('click');
    setHintUsed(true);

    const active = activeChallenges[currentIdx];
    const hintLog = {
      text: `[PISTA ADQUIRIDA]: ${active.hint}`,
      type: 'info' as const
    };
    setAiLogs(prev => [hintLog, ...prev]);
  };

  // Auto scroll effects for AI diagnostics panel
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiLogs]);

  // Restart settings view
  const loadSettingsView = () => {
    playSfx('click');
    setScreen('settings');
  };

  return (
    <div className="min-h-screen bg-slate-950 font-mono text-on-surface relative overflow-auto pb-10 flex flex-col items-center justify-center p-4 selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Dynamic Damage Overlay Flash */}
      <AnimatePresence>
        {showFlasher && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-red-800 z-[999] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Global CRT Overlay */}
      {crtFilter && <div className="crt-overlay" />}

      {/* Atmospheric Background Art & Cyber Elements */}
      <div className="absolute top-8 left-8 opacity-20 hidden lg:block -rotate-6 pointer-events-none z-0">
        <div className="p-3 border-2 border-secondary-container rounded-lg bg-surface-container-lowest shadow-[0_0_15px_rgba(0,113,23,0.5)]">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJIbHjhoffedV93bwhZXeJXHHQHzcnbQNpOY8PHs4fi4wQ3YVD46vD3bTgnaS4y7-jpq1zE2w__OQu2DolTh4tUbb1wksHUp_P3usYEVJpzvziDhvlwoYyl8F0nOR2anmyZ6F-qjQpRPX-R59HUMwwIzhfcCttbaP5PKb_QAb5eABd4yDKkoP0Y8FGeObAu3zqoRdyRgLOcS1T5oXWWHVlz-U7gQbOdUhB0ASRRgK5c0hI3yhSV1JoxnmyXVRiIEuhgfA2NdgTufY" 
            alt="Vintage Cyber Hacker Terminal" 
            className="w-40 h-40 object-cover opacity-60 rounded border border-outline"
            referrerPolicy="no-referrer"
          />
          <div className="text-[10px] text-center text-primary-fixed-dim mt-2 tracking-wider uppercase font-sans">RECURSION_UNIT_.EXE</div>
        </div>
      </div>

      <div className="absolute top-12 right-12 opacity-25 hidden xl:block rotate-6 pointer-events-none z-0">
        <div className="p-3 border-2 border-secondary-container rounded-lg bg-surface-container-lowest shadow-[0_0_15px_rgba(0,238,252,0.4)]">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0IJ8x6euOpuzEMVxyafbPR_3HZJO31e5L3C6MEIQW43TFCvww9x4vLaVNWoi1XVW4li9Jmg4PBQCgr38POjOgV-OCyoE_bCeYxXJ5XbfGQtIH87DOidUxGoUWFz5x3TqLaW219-zn63_u2mIJxKsXngOnkSWMn2wywbF7UDrf_X_gjljBU6fYCQ1q6_SCCUGv7spCZvcsdpzShEkgNEypwCVUPG3U6VBB0uXSj8Xszj9NkzaiHafvtTf9PILHwC-1kpFDd5JpgJ4" 
            alt="Neon Retro Grid Space" 
            className="w-44 h-40 object-cover opacity-60 rounded border border-outline"
            referrerPolicy="no-referrer"
          />
          <div className="text-[10px] text-center text-secondary-container mt-2 tracking-wider uppercase font-sans">SPACEGRID_SIMULATION</div>
        </div>
      </div>

      {/* DESK ENVIRONMENT COMPUTER FRAME WRAPPER */}
      <div className="w-full max-w-container-max z-10 flex flex-col items-center">
        
        {/* PHYSICAL ADVANCED MONITOR CABINET HOUSING */}
        <div className="w-full bg-[#1e1e24] border-t-8 border-l-8 border-[#32323f] border-r-8 border-b-8 border-[#121217] shadow-2xl rounded-[32px] p-2 md:p-3 relative">
          
          <div className="monitor-frame bg-surface w-full overflow-hidden flex flex-col relative aspect-video md:aspect-auto">
            
            {/* SCREEN GLASS CRT HIGHLIGHTS */}
            <div className={`crt-screen w-full flex-grow flex flex-col ${crtFlicker ? 'screen-flicker' : ''}`}>
              
              {/* TOP HEADER MENU */}
              <header className="bg-surface-container text-secondary flex justify-between items-center w-full px-4 h-16 md:h-20 border-b-4 border-on-secondary-fixed-variant shadow-[inset_0_2px_0_rgba(255,255,255,0.1)] shrink-0 z-50">
                <div className="flex items-center gap-3">
                  <TerminalIcon className="text-secondary h-6 w-6 md:h-8 md:w-8 neon-glow" />
                  <div className="flex flex-col">
                    <span 
                      onClick={() => { playSfx('click'); if (currentUser) setScreen('menu'); else setScreen('auth'); }}
                      className="font-pixel text-xs sm:text-sm md:text-md text-secondary-container drop-shadow-[0_0_6px_rgba(0,238,252,0.8)] leading-tight cursor-pointer hover:brightness-110"
                    >
                      TIME-TRIAL CODE
                    </span>
                    <span className="text-[8px] md:text-[10px] text-outline font-sans tracking-widest hidden sm:inline">
                      {currentUser ? `SESIÓN_ACTIVA: ${currentUser.toUpperCase()}` : 'SISTEMA OPERATIVO RETRO v1.99'}
                    </span>
                  </div>
                </div>

                {/* Dashboard Stats & Header Details */}
                <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
                  {screen === 'game' && (
                    <>
                      {/* Progress Index display */}
                      <div className="bg-surface-container-low px-2 md:px-4 py-1 border border-outline-variant bevel-inset flex flex-col items-center justify-center">
                        <span className="font-sans text-[8px] md:text-[10px] text-tertiary-fixed font-bold">NIVEL {selectedDifficulty}</span>
                        <span className="text-[10px] md:text-xs text-primary-container font-mono tracking-tighter">RETO: {currentIdx + 1}/{activeChallenges.length}</span>
                      </div>

                      {/* Display Warnings / Hearts Left */}
                      <div className="flex items-center gap-2 bg-surface-container-low px-2 md:px-4 py-1.5 border border-outline-variant bevel-inset">
                        <div className="flex gap-1">
                          {Array.from({ length: 3 }).map((_, idx) => (
                            <Heart 
                              key={idx}
                              className={`h-4 w-4 md:h-5 md:w-5 ${
                                idx < lives 
                                  ? 'text-error fill-error neon-glow-error animate-pulse' 
                                  : 'text-surface-container-highest'
                              } transition-all duration-300`}
                            />
                          ))}
                        </div>
                        <div className="h-4 w-px bg-outline-variant hidden sm:block" />
                        <span className="font-sans font-bold text-[8px] md:text-[10px] uppercase text-on-surface-variant hidden sm:inline">
                          Fallos: <span className="text-error">{warnings}/3</span>
                        </span>
                      </div>

                      {/* Timer Clock Circle counter */}
                      <div className="relative w-12 h-12 flex items-center justify-center bg-surface-container-low border border-outline-variant rounded p-1">
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                          <circle cx="24" cy="24" fill="transparent" r="20" stroke="#1f1f27" strokeWidth="2"></circle>
                          <circle 
                            cx="24" 
                            cy="24" 
                            fill="transparent" 
                            r="20" 
                            stroke={timer <= 5 ? '#ffb4ab' : '#00eefc'} 
                            strokeWidth="3"
                            strokeDasharray="125.6"
                            strokeDashoffset={125.6 - (timer / 20) * 125.6}
                            className="transition-all duration-1000 ease-linear shadow-lg"
                          ></circle>
                        </svg>
                        <span className={`text-xs md:text-sm font-bold ${timer <= 5 ? 'text-error animate-pulse font-bold' : 'text-secondary-fixed-dim'}`}>
                          {timer}s
                        </span>
                      </div>
                    </>
                  )}

                  {/* Header Volume controller and Config drawer */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    {/* Retro Music panel */}
                    <div className="flex items-center gap-1.5 border border-outline-variant/60 rounded-md px-2 py-1 bg-surface-container-high shadow-sm">
                      <div className="flex items-center gap-1 font-mono text-[9px] text-[#00eefc]">
                        <span className="hidden xs:inline tracking-tight font-bold">MÚSICA:</span>
                        <button 
                          onClick={toggleBackgroundMusic}
                          className={`font-pixel text-[8px] px-2 py-0.5 rounded border transition-colors ${isMusicOn ? 'bg-[#00eefc]/15 text-[#00eefc] border-[#00eefc]/40' : 'bg-surface-container-low text-outline border-outline-variant hover:border-outline'}`}
                          title={isMusicOn ? 'Silenciar música' : 'Activar música 8 bits'}
                        >
                          {isMusicOn ? 'SÍ' : 'NO'}
                        </button>
                      </div>

                      {isMusicOn && (
                        <div className="flex items-center gap-1 font-mono text-[9px] text-[#00eefc] border-l border-outline-variant/40 pl-2">
                          <span className="hidden xs:inline font-bold leading-none">VOL:</span>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={musicVol}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setMusicVol(val);
                              sound.setMusicVolume(val);
                            }}
                            className="w-10 sm:w-14 md:w-16 h-1 bg-surface-container-highest rounded appearance-none cursor-pointer accent-[#00eefc]"
                            title="Volumen de Música 8-bits"
                          />
                          <span className="text-right w-6 font-bold leading-none">
                            {Math.round(musicVol * 100)}%
                          </span>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={toggleBackgroundMusic}
                      title={isMusicOn ? 'Silenciar música' : 'Activar música 8 bits'}
                      className={`p-2 rounded hover:bg-surface-container-highest transition-colors flex items-center justify-center ${isMusicOn ? 'text-primary-container' : 'text-outline-variant hover:text-outline'}`}
                    >
                      <Sparkles className={`h-4 w-4 md:h-5 md:w-5 ${isMusicOn ? 'animate-bounce' : ''}`} />
                    </button>
                    
                    <button 
                      onClick={handleMuteChange}
                      title={isMuted ? 'Activar Sonido' : 'Mutear'}
                      className="p-2 rounded hover:bg-surface-container-highest transition-colors text-outline-variant hover:text-on-surface"
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4 md:h-5 md:w-5 text-error" />
                      ) : (
                        <Volume2 className="h-4 w-4 md:h-5 md:w-5 text-primary-fixed-dim" />
                      )}
                    </button>

                    <button 
                      onClick={() => { playSfx('click'); if (currentUser) setScreen('settings'); else setScreen('auth'); }}
                      title="Configurar modo"
                      className="p-2 rounded hover:bg-surface-container-highest transition-colors text-outline-variant hover:text-on-surface"
                    >
                      <SettingsIcon className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  </div>
                </div>
              </header>

              {/* ACTIVE SCREEN CONTENT DISPLAY AREA */}
              <div className="flex-grow flex flex-col md:flex-row h-[500px] md:h-[580px] overflow-hidden relative scanline-content bg-surface-container-lowest">
                
                {/* 0. AUTH SCREEN (LOGIN & REGISTER) */}
                {screen === 'auth' && (
                  <div className="flex-grow flex flex-col justify-center items-center p-6 relative">
                    <MatrixRain />
                    
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full max-w-md bg-surface-container/90 border-2 border-[#00eefc]/50 rounded-xl overflow-hidden shadow-[0_0_25px_rgba(0,238,252,0.3)] backdrop-blur-md z-10 flex flex-col"
                    >
                      {/* Terminal header */}
                      <div className="bg-[#1e1e24] px-4 py-2 border-b border-outline-variant flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TerminalIcon className="text-secondary-container h-4 w-4" />
                          <span className="text-[10px] font-pixel text-secondary-container animate-pulse">AUTENTICACIÓN_REQUERIDA</span>
                        </div>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-error" />
                          <div className="w-2 h-2 rounded-full bg-[#00eefc]" />
                        </div>
                      </div>

                      {/* Tab toggler with the web layout style */}
                      <div className="flex border-b border-outline-variant text-[11px] font-pixel">
                        <button
                          type="button"
                          onClick={() => { playSfx('click'); setAuthMode('login'); setAuthError(null); setAuthSuccess(null); }}
                          className={`flex-1 py-3 text-center transition-all ${
                            authMode === 'login' 
                              ? 'bg-surface-container-lowest border-b-2 border-secondary-container text-secondary font-bold' 
                              : 'bg-surface-container/50 text-outline hover:text-white'
                          }`}
                        >
                          [ INICIAR SESIÓN ]
                        </button>
                        <button
                          type="button"
                          onClick={() => { playSfx('click'); setAuthMode('register'); setAuthError(null); setAuthSuccess(null); }}
                          className={`flex-1 py-3 text-center transition-all ${
                            authMode === 'register' 
                              ? 'bg-surface-container-lowest border-b-2 border-secondary-container text-secondary font-bold' 
                              : 'bg-surface-container/50 text-outline hover:text-white'
                          }`}
                        >
                          [ REGISTRARSE ]
                        </button>
                      </div>

                      {/* Inputs & form content with retro CRT graphics */}
                      <form onSubmit={handleAuthSubmit} className="p-5 flex flex-col gap-4 font-mono">
                        
                        {authMode === 'register' && (
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase text-outline font-bold tracking-wider">Nombre de Usuario:</label>
                            <div className="relative flex items-center">
                              <span className="absolute left-3 text-secondary-container font-bold text-xs">{">"}</span>
                              <input
                                type="text"
                                value={registerUsername}
                                onChange={(e) => setRegisterUsername(e.target.value)}
                                placeholder="CODERS_99"
                                className="w-full pl-7 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-xs select-none placeholder-outline-variant/60 outline-none text-white focus:border-[#00eefc] transition-colors"
                                required
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase text-outline font-bold tracking-wider">Correo Electrónico:</label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-secondary-container font-bold text-xs">{">"}</span>
                            <input
                              type="email"
                              value={authMode === 'login' ? loginEmail : registerEmail}
                              onChange={(e) => authMode === 'login' ? setLoginEmail(e.target.value) : setRegisterEmail(e.target.value)}
                              placeholder="correo@servidor.com"
                              className="w-full pl-7 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-xs select-none placeholder-outline-variant/60 outline-none text-white focus:border-[#00eefc] transition-colors"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase text-outline font-bold tracking-wider">Contraseña de Acceso:</label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-secondary-container font-bold text-xs">{"*"}</span>
                            <input
                              type="password"
                              value={authMode === 'login' ? loginPassword : registerPassword}
                              onChange={(e) => authMode === 'login' ? setLoginPassword(e.target.value) : setRegisterPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full pl-7 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-xs select-none placeholder-outline-variant/60 outline-none text-white focus:border-[#00eefc] transition-colors"
                              required
                            />
                          </div>
                        </div>

                        {/* Error & Success indicators */}
                        <AnimatePresence>
                          {authError && (
                            <motion.div 
                              initial={{ opacity: 0, y: -5 }} 
                              animate={{ opacity: 1, y: 0 }} 
                              exit={{ opacity: 0 }}
                              className="p-2 border border-error bg-error-container/20 rounded text-[10px] text-error font-medium uppercase text-center"
                            >
                              [DENEGADO]: {authError}
                            </motion.div>
                          )}
                          {authSuccess && (
                            <motion.div 
                              initial={{ opacity: 0, y: -5 }} 
                              animate={{ opacity: 1, y: 0 }} 
                              exit={{ opacity: 0 }}
                              className="p-2 border border-primary bg-primary-container/20 rounded text-[10px] text-primary neon-glow-green font-bold uppercase text-center"
                            >
                              [CONCEDIDO]: {authSuccess}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          className="w-full mt-2 py-3 bg-primary-container text-on-primary-container font-pixel text-xs uppercase bevel-outset hover:brightness-110 active:translate-y-1 transition-all rounded shadow-[0_0_15px_rgba(0,113,23,0.2)]"
                        >
                          {authMode === 'login' ? 'FIRMAR_SESION.EXE' : 'REGISTRAR_CUENTA.EXE'}
                        </button>
                      </form>

                      {/* Seed default account hint for convenience */}
                      <div className="px-5 pb-4 border-t border-outline-variant/35 pt-3 bg-surface-container-low text-[9px] uppercase text-outline-variant leading-relaxed text-center">
                        PRO TIP: Registra cualquier cuenta ficticia para jugar offline, o inicia sesión con tus cuentas creadas previamente en este dispositivo.
                      </div>
                    </motion.div>
                  </div>
                )}
                
                {/* 1. START MENU LAUNCHER SCREEN STATE */}
                {screen === 'menu' && (
                  <div className="flex-grow flex flex-col justify-between items-center p-6 md:p-8 relative">
                    <MatrixRain />
                    
                    <div className="text-center mt-6 md:mt-10 max-w-2xl z-10">
                      <motion.h1 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="font-pixel text-2xl sm:text-4xl md:text-5xl lg:text-5xl text-yellow-400 glow-yellow tracking-tighter uppercase mb-4"
                      >
                        PROGRAMANDO
                      </motion.h1>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center justify-center gap-3 bg-surface-container border-2 border-secondary-container px-6 py-2 rounded-lg shadow-[0_0_15px_rgba(0,238,252,0.4)] md:max-w-xs mx-auto"
                      >
                        <Zap className="h-6 w-6 text-secondary-container animate-pulse" />
                        <span className="font-pixel text-lg sm:text-xl text-secondary-container">EN 20s</span>
                      </motion.div>

                      <p className="font-mono text-outline-variant text-[11px] md:text-xs mt-6 tracking-[0.16em] uppercase">
                        SISTEMA DE PREGUNTAS Y DEPURACIÓN BAJO PRESIÓN
                      </p>
                    </div>

                    {/* Navigation buttons center alignment */}
                    <div className="w-full max-w-sm flex flex-col gap-3 rounded-lg z-10">
                      
                      <button 
                        onClick={() => { playSfx('click'); setScreen('settings'); }}
                        className="pixel-btn text-center select-none cursor-pointer py-3.5 bg-primary-container text-on-primary-container font-pixel text-xs sm:text-sm uppercase tracking-wider bevel-outset hover:brightness-110 active:translate-y-1 transition-all"
                      >
                        INICIAR TERMINAL
                      </button>

                      <button 
                        onClick={() => { playSfx('click'); setShowGuide(true); }}
                        className="pixel-btn text-center select-none cursor-pointer py-3 bg-surface-container-high text-secondary font-pixel text-xs uppercase tracking-wider border-2 border-outline-variant hover:border-secondary transition-all"
                      >
                        ¿CÓMO JUGAR?
                      </button>

                      <button 
                        onClick={() => { playSfx('click'); setScreen('infographic'); }}
                        className="pixel-btn text-center select-none cursor-pointer py-3 bg-surface-container-high text-primary font-pixel text-xs uppercase tracking-wider border-2 border-[#00eefc]/40 hover:border-[#00eefc] transition-all"
                      >
                        [ INFOGRAFÍA DEL PROYECTO ]
                      </button>

                      <button 
                        onClick={() => { playSfx('click'); setScreen('bugs-registry'); fetchBugs(); }}
                        className="pixel-btn text-center select-none cursor-pointer py-3 bg-[#0c1e30] text-[#00eefc] font-pixel text-xs uppercase tracking-wider border-2 border-[#00eefc] hover:bg-[#00eefc] hover:text-black transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,238,252,0.2)]"
                      >
                        <Database className="h-4 w-4 shrink-0" /> [ BITÁCORA DE BUGS CRUD ]
                      </button>

                      <button 
                        onClick={() => { playSfx('click'); setShowCredits(true); }}
                        className="pixel-btn text-center select-none cursor-pointer py-3 bg-surface-container-high text-tertiary-fixed font-pixel text-xs uppercase tracking-wider border-2 border-outline-variant hover:border-tertiary-fixed-dim transition-all"
                      >
                        CRÉDITOS
                      </button>

                      {currentUser && (
                        <button 
                          onClick={handleLogout}
                          className="pixel-btn text-center select-none cursor-pointer py-2.5 bg-surface-container-high text-error font-pixel text-[10px] uppercase tracking-wider border-2 border-error hover:border-red-500 hover:bg-error-container/20 transition-all"
                        >
                          CERRAR SESIÓN ({currentUser.toUpperCase()})
                        </button>
                      )}
                    </div>

                    {/* High Score local storage persistent panel */}
                    <div className="w-full max-w-md z-10 flex justify-between items-center bg-surface-container-low border border-outline-variant px-4 py-2 text-[10px] md:text-xs">
                      <span className="text-outline uppercase">Puntaje Máximo:</span>
                      <span className="text-secondary font-bold text-sm tracking-wide flex items-center gap-1">
                        <Award className="h-4 w-4 text-yellow-400" /> {highestScore ? `${highestScore} pts` : 'N/A'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 2. MATCH SETTINGS / PARAMETERS BUILD SCREEN */}
                {screen === 'settings' && (
                  <div className="flex-grow flex flex-col p-6 md:p-8 relative z-10 overflow-y-auto">
                    
                    <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-2">
                      <button 
                        onClick={() => { playSfx('click'); setScreen('menu'); }}
                        className="text-primary-fixed-dim hover:text-primary transition-colors flex items-center gap-1 font-sans font-bold text-xs"
                      >
                        <ArrowLeft className="h-4 w-4" /> VOLVER
                      </button>
                      <div className="h-4 w-px bg-outline-variant" />
                      <span className="text-secondary font-pixel text-sm uppercase">/ CONFIGURACIÓN DE SISTEMA</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
                      
                      {/* Left: Level selector */}
                      <div className="flex flex-col">
                        <h2 className="font-sans text-[11px] md:text-xs font-bold text-primary-fixed-dim mb-3 tracking-widest uppercase flex items-center gap-1.5">
                          <Cpu className="h-4 w-4" /> SELECCIONAR_DIFICULTAD (NIVEL)
                        </h2>
                        <div className="flex flex-col gap-2.5">
                          {[
                            { value: 1, label: 'Principiante', desc: 'Conceptos básicos, variables y condicionales.' },
                            { value: 2, label: 'Fácil', desc: 'Funciones elementales y coercion simple.' },
                            { value: 3, label: 'Medio', desc: 'Lógica intermedia, asincronía y regex.' },
                            { value: 4, label: 'Difícil', desc: 'Closures, ámbitos complejos y recursión.' },
                            { value: 5, label: 'Experto', desc: 'Ciclos de vida complejos, memoria y patrones.' }
                          ].map(opt => (
                            <button
                              key={opt.value}
                              onClick={() => { playSfx('click'); setSelectedDifficulty(opt.value); }}
                              className={`text-left p-3 flex flex-col justify-between border transition-all rounded ${
                                selectedDifficulty === opt.value
                                  ? 'bg-primary-container text-on-primary-container border-primary-container shadow-lg'
                                  : 'bg-surface-container text-on-surface-variant border-outline-variant hover:border-outline'
                              }`}
                            >
                              <div className="flex justify-between items-center w-full">
                                <span className="font-pixel text-[11px] md:text-xs uppercase">{opt.label}</span>
                                <span className="text-[10px] tracking-widest font-mono">Niv {opt.value}</span>
                              </div>
                              <p className="text-[10px] mt-1 opacity-80 leading-relaxed font-sans">{opt.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Right: Challenge Modes picker */}
                      <div className="flex flex-col justify-between">
                        <div>
                          <h2 className="font-sans text-[11px] md:text-xs font-bold text-primary-fixed-dim mb-3 tracking-widest uppercase flex items-center gap-1.5">
                            <BookOpen className="h-4 w-4" /> MODOS_DE_RETO
                          </h2>
                          <div className="flex flex-col gap-2 bg-surface-container p-4 border border-outline-variant rounded">
                            {[
                              { id: 'mixed', label: 'Modo Mixto (Combinado)', icon: 'terminal' },
                              { id: 'find', label: 'Encontrar el Error (Línea defectuosa)', icon: 'bug_report' },
                              { id: 'multiple', label: 'Opción Múltiple (Pregunta técnica)', icon: 'school' },
                              { id: 'fix', label: 'Corregir Código (Escribir sintaxis)', icon: 'edit' }
                            ].map(modeOpt => (
                              <label 
                                key={modeOpt.id}
                                className={`flex items-center gap-3 p-2.5 rounded cursor-pointer transition-colors ${
                                  selectedMode === modeOpt.id 
                                    ? 'bg-surface-container-high border border-outline-variant text-primary-container' 
                                    : 'text-on-surface-variant hover:bg-surface-container-low'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="challenge_mode"
                                  checked={selectedMode === modeOpt.id}
                                  onChange={() => { playSfx('click'); setSelectedMode(modeOpt.id as any); }}
                                  className="form-radio text-primary-container focus:ring-primary-container bg-surface-containerLowest border-outline-variant h-4 w-4"
                                />
                                <span className="text-xs uppercase font-mono">{modeOpt.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* CANTIDAD DE PREGUNTAS Selector */}
                        <div className="bg-surface-container p-4 border border-outline-variant rounded flex flex-col gap-3 mt-4 md:mt-2">
                          <h3 className="font-sans text-[10px] sm:text-[11px] font-bold text-[#00eefc] uppercase tracking-widest flex items-center gap-1.5 border-b border-outline-variant pb-1.5">
                            <Layers className="h-4 w-4" /> CANTIDAD_DE_PREGUNTAS
                          </h3>
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-xs items-center font-mono text-outline">
                              <span>PREGUNTAS POR JUEGO:</span>
                              <span className="font-bold text-[#00eefc] text-xs bg-surface-container-high px-2 py-0.5 rounded border border-outline-variant font-mono">{questionCount} RETOS</span>
                            </div>

                            <input
                              type="range"
                              min="5"
                              max="30"
                              step="1"
                              value={questionCount}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                setQuestionCount(val);
                                try {
                                  localStorage.setItem('retro_coder_question_count', val.toString());
                                } catch (err) {}
                              }}
                              className="w-full h-1.5 bg-surface-container-highest rounded appearance-none cursor-pointer accent-[#00eefc]"
                            />

                            {/* Presets buttons */}
                            <div className="flex gap-1 mt-1 justify-between">
                              {[5, 10, 15, 20, 25, 30].map((num) => (
                                <button
                                  key={num}
                                  onClick={() => {
                                    playSfx('click');
                                    setQuestionCount(num);
                                    try {
                                      localStorage.setItem('retro_coder_question_count', num.toString());
                                    } catch (err) {}
                                  }}
                                  className={`flex-1 py-1 font-mono text-[9px] font-bold border transition-all rounded ${
                                    questionCount === num
                                      ? 'bg-[#00eefc]/15 text-[#00eefc] border-[#00eefc]/40'
                                      : 'bg-surface-container-low text-outline border-outline-variant hover:border-outline'
                                  }`}
                                >
                                  {num}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* TIEMPO LÍMITE POR PREGUNTA Selector */}
                        <div className="bg-surface-container p-4 border border-outline-variant rounded flex flex-col gap-3 mt-4 md:mt-2">
                          <h3 className="font-sans text-[10px] sm:text-[11px] font-bold text-[#00eefc] uppercase tracking-widest flex items-center gap-1.5 border-b border-outline-variant pb-1.5">
                            <Timer className="h-4 w-4" /> TIEMPO_LÍMITE_POR_RETO
                          </h3>
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-xs items-center font-mono text-outline">
                              <span>TIEMPO MÁXIMO:</span>
                              <span className="font-bold text-[#00eefc] text-xs bg-surface-container-high px-2 py-0.5 rounded border border-outline-variant font-mono">
                                {formatTimeLabel(maxTimer).toUpperCase()}
                              </span>
                            </div>

                            <input
                              type="range"
                              min="5"
                              max="300"
                              step="5"
                              value={maxTimer}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                setMaxTimer(val);
                                try {
                                  localStorage.setItem('retro_coder_max_timer', val.toString());
                                } catch (err) {}
                              }}
                              className="w-full h-1.5 bg-surface-container-highest rounded appearance-none cursor-pointer accent-[#00eefc]"
                            />

                            {/* Adjust buttons (+ / -) */}
                            <div className="flex items-center gap-2 justify-between">
                              <button
                                onClick={() => {
                                  playSfx('click');
                                  setMaxTimer(prev => {
                                    const next = Math.max(5, prev - 5);
                                    try { localStorage.setItem('retro_coder_max_timer', next.toString()); } catch (err) {}
                                    return next;
                                  });
                                }}
                                className="px-2 py-0.5 bg-surface-container-low border border-outline-variant rounded text-[10px] font-bold text-[#00eefc] hover:bg-surface-container-high min-w-[32px] transition-all"
                              >
                                -5s
                              </button>

                              {/* Warning message explaining points penalty */}
                              <span className="text-[9px] uppercase font-mono tracking-tighter text-center leading-normal">
                                {maxTimer > 90 ? (
                                  <span className="text-yellow-500 font-bold">⚠️ penalización de pts: -{Math.round((1 - getTimeMultiplier(maxTimer)) * 100)}%</span>
                                ) : maxTimer < 20 ? (
                                  <span className="text-green-400 font-bold">⚡ extra pts: +{Math.round((getTimeMultiplier(maxTimer) - 1) * 100)}%</span>
                                ) : (
                                  <span className="text-slate-400 font-medium">multiplicador estándar (1.0x)</span>
                                )}
                              </span>

                              <button
                                onClick={() => {
                                  playSfx('click');
                                  setMaxTimer(prev => {
                                    const next = Math.min(300, prev + 5);
                                    try { localStorage.setItem('retro_coder_max_timer', next.toString()); } catch (err) {}
                                    return next;
                                  });
                                }}
                                className="px-2 py-0.5 bg-surface-container-low border border-outline-variant rounded text-[10px] font-bold text-[#00eefc] hover:bg-surface-container-high min-w-[32px] transition-all"
                              >
                                +5s
                              </button>
                            </div>

                            {/* Presets buttons */}
                            <div className="grid grid-cols-3 gap-1 mt-1 justify-between">
                              {[
                                { val: 10, label: '10 Seg' },
                                { val: 20, label: '20 Seg (Est.)' },
                                { val: 30, label: '30 Seg' },
                                { val: 60, label: '1 Min' },
                                { val: 120, label: '2 Min' },
                                { val: 300, label: '5 Min' },
                              ].map((preset) => (
                                <button
                                  key={preset.val}
                                  onClick={() => {
                                    playSfx('click');
                                    setMaxTimer(preset.val);
                                    try {
                                      localStorage.setItem('retro_coder_max_timer', preset.val.toString());
                                    } catch (err) {}
                                  }}
                                  className={`py-1 font-mono text-[9px] font-bold border transition-all rounded ${
                                    maxTimer === preset.val
                                      ? 'bg-[#00eefc]/15 text-[#00eefc] border-[#00eefc]/40'
                                      : 'bg-surface-container-low text-outline border-outline-variant hover:border-outline'
                                  }`}
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Audio Regulator in Settings panel */}
                        <div className="bg-surface-container p-4 border border-outline-variant rounded flex flex-col gap-3 mt-4 md:mt-2">
                          <h3 className="font-sans text-[10px] sm:text-[11px] font-bold text-[#00eefc] uppercase tracking-widest flex items-center gap-1.5 border-b border-outline-variant pb-1.5">
                            <Volume2 className="h-4 w-4" /> REGULACIÓN DE AUDIO Y MÚSICA
                          </h3>
                          
                          <div className="flex flex-col gap-2.5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-mono text-[10px] text-outline">REPRODUCTOR DE MÚSICA:</span>
                              <button
                                onClick={toggleBackgroundMusic}
                                className={`px-3 py-1 font-pixel text-[10px] rounded border transition-colors ${
                                  isMusicOn 
                                    ? 'bg-[#00eefc]/15 text-[#00eefc] border-[#00eefc]/30' 
                                    : 'bg-surface-container-low text-outline border-outline-variant hover:border-outline'
                                }`}
                              >
                                {isMusicOn ? 'CONECTADA' : 'DESCONECTADA'}
                              </button>
                            </div>

                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between text-[10px] font-mono text-outline">
                                <span>VOLUMEN RETRO:</span>
                                <span className="font-bold text-[#00eefc]">{Math.round(musicVol * 100)}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={musicVol}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  setMusicVol(val);
                                  sound.setMusicVolume(val);
                                }}
                                className="w-full h-1.5 bg-surface-container-highest rounded appearance-none cursor-pointer accent-[#00eefc]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Outer desk decoration credit details / Run match action */}
                        <div className="mt-4 md:mt-0">
                          <button 
                            onClick={startGame}
                            className="w-full py-5 px-6 bg-primary-container text-on-primary-container font-pixel text-sm tracking-wider border-b-4 border-r-4 border-on-primary-container hover:brightness-110 active:translate-y-1 transition-all rounded shadow-[0_0_15px_rgba(0,113,23,0.3)]"
                          >
                            INICIAR JUEGO
                          </button>
                          <div className="mt-2 text-[10px] text-outline text-center uppercase tracking-widest">
                            Kernel v1.9.9 | No se requiere conexión a la nube
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                )}

                {/* 3. CORE CHALLENGE GAME BOARD SCREEN */}
                {screen === 'game' && activeChallenges.length > 0 && (
                  <div className="flex-grow flex flex-col md:flex-row h-full w-full overflow-hidden">
                    
                    {/* FEEDBACK RESOLUTION PANEL OVERLAY */}
                    <AnimatePresence>
                      {feedbackOverlay && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-black/92 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-6 text-center"
                        >
                          <div className="bevel-outset bg-surface-container p-6 sm:p-10 max-w-lg rounded-xl flex flex-col items-center">
                            <h2 className={`font-pixel text-md sm:text-lg mb-4 uppercase ${
                              feedbackOverlay.isCorrect 
                                ? 'text-primary neon-glow-green' 
                                : 'text-error neon-glow-error'
                            }`}>
                              {feedbackOverlay.title}
                            </h2>
                            <div className="text-5xl md:text-6xl mb-4">
                              {feedbackOverlay.isCorrect ? '✓' : '✗'}
                            </div>
                            <p className="font-mono text-xs sm:text-sm text-on-surface leading-relaxed border-t border-outline-variant pt-4 max-h-[160px] overflow-y-auto">
                              {feedbackOverlay.msg}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Left: Code Editor or Question space (2/3 width) */}
                    <div className="w-full md:w-2/3 h-full flex flex-col border-b md:border-b-0 md:border-r-2 border-outline-variant overflow-hidden">
                      
                      {/* Code file header tab */}
                      <div className="bg-surface-container-high h-10 flex items-center px-4 border-b border-outline-variant justify-between shrink-0">
                        <div className="flex items-center gap-1 bg-surface-container-lowest px-3 py-1 border-t-2 border-primary-container rounded-t-sm">
                          <span className="font-mono text-xs text-primary-container font-semibold">
                            {activeChallenges[currentIdx].filename}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-outline font-sans uppercase">
                            MODO: {
                              activeChallenges[currentIdx].mode === 'find' 
                                ? 'Encontrar el Error_ ' 
                                : activeChallenges[currentIdx].mode === 'multiple' 
                                ? 'Opción Múltiple_ ' 
                                : 'Corregir Código_ '
                            }
                          </span>
                        </div>
                      </div>

                      {/* Primary editor container body */}
                      <div className="flex-grow p-4 md:p-6 overflow-auto relative">
                        
                        {/* MODE: FIND THE BUG (LINE CLICK SELECTION) */}
                        {activeChallenges[currentIdx].mode === 'find' && (
                          <div className="flex font-mono text-xs sm:text-sm leading-relaxed relative">
                            {/* Line Numbers column */}
                            <div className="w-10 text-outline-variant text-right pr-3 select-none border-r border-outline-variant/55 mr-4 font-mono font-bold">
                              {activeChallenges[currentIdx].codeLines.map((_, index) => (
                                <div key={index}>{(index + 1).toString().padStart(2, '0')}</div>
                              ))}
                            </div>

                            {/* Lines of code lines render */}
                            <div className="flex-grow flex flex-col relative select-none">
                              {activeChallenges[currentIdx].codeLines.map((line, idx) => {
                                const isSelected = selectedLineIndex === idx;
                                const isWrong = wrongLineIndex === idx;
                                const isWinner = correctLineSelected && idx === (activeChallenges[currentIdx] as FindChallenge).errorLineIndex;
                                
                                return (
                                  <div 
                                    key={idx}
                                    onClick={() => handleLineClick(idx)}
                                    className={`pl-2 pr-2 font-mono whitespace-pre-wrap rounded cursor-pointer transition-all ${
                                      isWinner 
                                        ? 'bg-primary-container/20 border-l-4 border-primary shadow-[inset_0_0_10px_rgba(0,255,65,0.1)] text-primary neon-glow-green font-bold' 
                                        : isWrong 
                                        ? 'bg-error-container/30 border-l-4 border-error text-error' 
                                        : isSelected 
                                        ? 'bg-surface-container-highest border-l-4 border-secondary' 
                                        : 'hover:bg-white/5'
                                    }`}
                                  >
                                    {line}
                                  </div>
                                );
                              })}
                              <div className="mt-4"><span className="cursor-blink bg-primary-container w-2.5 h-4.5 inline-block align-middle ml-1"></span></div>
                            </div>
                          </div>
                        )}

                        {/* MODE: MULTIPLE CHOICE (Retro Card + Grid choices buttons) */}
                        {activeChallenges[currentIdx].mode === 'multiple' && (
                          <div className="h-full flex flex-col justify-center items-center gap-6 py-4">
                            <div className="bg-surface-container-high border-2 border-secondary-container/40 p-5 rounded bevel-outset w-full max-w-xl shadow-[0_0_15px_rgba(0,238,252,0.15)]">
                              <h3 className="font-sans text-xs text-outline mb-2 uppercase tracking-widest font-bold">PREGUNTA_</h3>
                              <p className="font-mono text-xs sm:text-sm text-secondary-container leading-relaxed">
                                {activeChallenges[currentIdx].questionText}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                              {(activeChallenges[currentIdx] as MultipleChallenge).options.map((option, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleOptionSelect(idx)}
                                  className="text-left font-mono text-xs p-3.5 bg-surface-container border border-outline-variant hover:border-secondary hover:text-secondary rounded select-none shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all flex items-center gap-2 group cursor-pointer"
                                >
                                  <span className="h-4 w-4 border border-outline rounded-full flex items-center justify-center shrink-0 group-hover:border-secondary">
                                    <span className="h-2 w-2 bg-secondary opacity-0 group-hover:opacity-100 rounded-full transition-opacity" />
                                  </span>
                                  <span className="truncate">{option}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* MODE: FIX THE CODE (Interactive code prompt input with syntax render) */}
                        {activeChallenges[currentIdx].mode === 'fix' && (
                          <div className="h-full flex flex-col justify-between">
                            <div className="font-mono text-xs sm:text-sm leading-relaxed p-2 select-none">
                              <pre className="text-outline-variant">{ (activeChallenges[currentIdx] as FixChallenge).codePre }</pre>
                              
                              {/* Central Interactive Error Input Line */}
                              <form onSubmit={handleFixSubmit} className="flex flex-col sm:flex-row sm:items-center gap-2 my-4 p-3 bg-surface-container-low border border-outline-variant error-pulse rounded">
                                <div className="flex items-center gap-1.5 font-mono text-primary-fixed-dim">
                                  <span>{ (activeChallenges[currentIdx] as FixChallenge).prefixText }</span>
                                </div>
                                <input
                                  type="text"
                                  value={userFixInput}
                                  onChange={(e) => setUserFixInput(e.target.value)}
                                  placeholder="Corrige el error de sintaxis y presiona Enter o CORREGIR..."
                                  className="flex-grow font-mono bg-surface-container-lowest border-b-2 border-primary-container text-primary-container px-2 py-1 outline-none font-semibold text-xs transition-colors focus:bg-surface-container focus:text-white"
                                  autoFocus
                                  autoComplete="off"
                                  spellCheck={false}
                                />
                                <button 
                                  type="submit"
                                  className="py-1 px-4 bg-primary text-on-primary font-pixel text-[10px] uppercase bevel-outset hover:brightness-110 shrink-0 cursor-pointer"
                                >
                                  CORREGIR
                                </button>
                              </form>

                              <pre className="text-outline-variant">{ (activeChallenges[currentIdx] as FixChallenge).codePost }</pre>
                            </div>

                            {/* Help indicator label */}
                            <div className="text-[10px] text-outline-variant p-2 uppercase border-t border-outline-variant/30 font-sans">
                              Nota: Ingresa la línea corregida exactamente correspondiente al prefijo de código resaltado en ambar.
                            </div>
                          </div>
                        )}

                        {/* Visual background bug watermark */}
                        <div className="absolute bottom-4 right-4 opacity-5 pointer-events-none">
                          <AlertTriangle className="h-32 w-32" />
                        </div>
                      </div>

                    </div>

                    {/* Right Side: AI Debugger logs, Help drawer (1/3 width) */}
                    <aside className="w-full md:w-1/3 bg-surface-container-low flex flex-col relative overflow-hidden h-44 md:h-full shrink-0">
                      
                      <div className="bg-surface-container-high h-10 flex items-center px-4 border-b border-outline-variant justify-between shrink-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-sans font-extrabold text-[10px] text-tertiary-container tracking-wider uppercase">
                            DEPURADOR IA_
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-error" />
                          <div className="w-2.5 h-2.5 rounded-full bg-warning-amber bg-yellow-500 opacity-60" />
                          <div className="w-2.5 h-2.5 rounded-full bg-primary-container opacity-60" />
                        </div>
                      </div>

                      {/* Display Log Output history */}
                      <div className="flex-grow p-3 overflow-y-auto leading-relaxed font-mono text-[10px] md:text-xs flex flex-col-reverse gap-2 shadow-[inset_0_2px_12px_rgba(0,0,0,0.5)]">
                        <div ref={logsEndRef} />
                        {aiLogs.map((log, index) => (
                          <div 
                            key={index}
                            className={`p-2 rounded border border-outline-variant ${
                              log.type === 'success' 
                                ? 'bg-primary-container/10 border-primary text-primary neon-glow-green' 
                                : log.type === 'danger'
                                ? 'bg-error-container/10 border-error text-error neon-glow-error'
                                : 'bg-surface-container-lowest text-on-surface-variant'
                            }`}
                          >
                            <span className="font-bold mr-1">
                              {log.type === 'success' ? '[VALIDADO]' : log.type === 'danger' ? '[FALLO]' : '[DIAGNOSTICO]'}
                            </span>
                            <span>{log.text}</span>
                          </div>
                        ))}
                      </div>

                      {/* Clue button footer logic */}
                      <div className="p-3 bg-surface-container-lowest border-t border-outline-variant shrink-0 flex flex-col gap-2">
                        <button
                          onClick={triggerHint}
                          disabled={hintUsed}
                          className={`w-full py-2 px-3 flex items-center justify-center gap-1.5 font-pixel text-[10px] border rounded transition-all select-none cursor-pointer ${
                            hintUsed 
                              ? 'bg-surface-container-high border-outline-variant text-outline-variant opacity-50 cursor-not-allowed'
                              : 'bg-surface-container text-tertiary-container border-outline hover:bg-surface-container-high'
                          }`}
                        >
                          <Lightbulb className="h-4 w-4" /> 
                          {hintUsed ? 'PISTA DEVELADA en feed_' : 'SOLICITAR PISTA (-50 pts)'}
                        </button>
                      </div>
                    </aside>

                  </div>
                )}

                {/* 4. GAME OVER STATE */}
                {screen === 'gameover' && (
                  <div className="flex-grow flex flex-col items-center justify-center p-6 text-center z-10 relative overflow-y-auto">
                    <MatrixRain />
                    
                    <div className="p-4 bg-error-container/20 border-2 border-error rounded-xl max-w-sm flex flex-col items-center shadow-2xl backdrop-blur-md mb-6">
                      <RetroDinosaur />
                      
                      <h2 className="font-pixel text-lg text-error uppercase mb-2 tracking-tighter shadow-sm">
                        FALLO DEL SISTEMA
                      </h2>
                      
                      <p className="font-mono text-[10px] text-on-error-container/90 uppercase tracking-widest bg-error-container/30 px-3 py-1 rounded mb-3 font-bold">
                        ADVERTENCIAS EXCEDIDAS
                      </p>
                      
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        El núcleo ha desbordado su ejecución. Diagnóstico crítico: se rebasaron las 3 advertencias de tolerancia permitidas.
                      </p>

                      <div className="border-t border-error/30 pt-3 mt-4 w-full grid grid-cols-2 gap-3 text-left text-xs bg-error-container/10 p-2.5 rounded-lg border border-error/15">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-outline-variant uppercase font-sans">Aciertos:</span>
                          <span className="text-white font-bold">{correctAnswers} / {correctAnswers + incorrectAnswers}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-outline-variant uppercase font-sans">Porcentaje:</span>
                          <span className="text-[#00eefc] font-pixel text-[11px] font-bold">
                            {correctAnswers + incorrectAnswers > 0
                              ? Math.round((correctAnswers / (correctAnswers + incorrectAnswers)) * 100)
                              : 0}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-xs">
                      <button 
                        onClick={() => { playSfx('click'); startGame(); }}
                        className="py-3 px-5 bg-error text-on-error font-pixel text-xs uppercase bevel-outset hover:brightness-110 active:translate-y-1 transition-all rounded"
                      >
                        REINTENTAR NIVEL
                      </button>

                      <button 
                        onClick={loadSettingsView}
                        className="py-3 px-5 bg-surface-container text-secondary font-pixel text-xs uppercase border border-outline-variant hover:border-secondary transition-all rounded"
                      >
                        CAMBIAR CONFIGURACIÓN
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. VICTORY STATE */}
                {screen === 'victory' && (
                  <div className="flex-grow flex flex-col items-center justify-center p-6 text-center z-10 relative">
                    <MatrixRain />

                    <div className="p-6 bg-primary-container/25 border-4 border-primary-container rounded-xl max-w-md flex flex-col items-center shadow-[0_0_25px_rgba(0,113,23,0.4)] backdrop-blur-md mb-8">
                      <Award className="h-16 w-16 text-primary-container neon-glow-green mb-3 animate-bounce" />
                      
                      <h2 className="font-pixel text-xl text-primary-container uppercase mb-2">
                        SISTEMA ASEGURADO
                      </h2>
                      
                      <p className="font-mono text-xs text-primary bg-primary-container/40 px-3 py-0.5 rounded uppercase tracking-wider mb-4 font-bold flex items-center gap-1.5">
                        <Flame className="h-4 w-4" /> PROGRAMADOR MAESTRO DETECTADO
                      </p>

                      <div className="border-t border-primary-container/30 pt-4 w-full grid grid-cols-2 gap-4 text-left text-xs bg-black/20 p-3 rounded-lg border border-primary-container/10">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-outline uppercase font-sans">Nivel Terminado:</span>
                          <span className="text-white font-bold">{selectedDifficulty}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-outline uppercase font-sans font-bold text-secondary">Puntaje Final:</span>
                          <span className="text-secondary font-bold text-sm">{score} pts</span>
                        </div>
                        <div className="flex flex-col border-t border-dashed border-outline-variant/30 pt-2">
                          <span className="text-[10px] text-outline uppercase font-sans">Preguntas correctas:</span>
                          <span className="text-green-400 font-bold">{correctAnswers} de {correctAnswers + incorrectAnswers}</span>
                        </div>
                        <div className="flex flex-col border-t border-dashed border-outline-variant/30 pt-2">
                          <span className="text-[10px] text-outline uppercase font-sans">% de Aciertos:</span>
                          <span className="text-[#00eefc] font-pixel text-xs font-bold">
                            {correctAnswers + incorrectAnswers > 0
                              ? Math.round((correctAnswers / (correctAnswers + incorrectAnswers)) * 100)
                              : 0}%
                          </span>
                        </div>
                        <div className="flex flex-col col-span-2 border-t border-primary-container/20 pt-2 text-center bg-black/45 py-1.5 rounded">
                          <span className="text-[9px] text-outline-variant uppercase font-mono">Factor por Configuración de Tiempo ({maxTimer}s):</span>
                          <span className="text-yellow-400 font-pixel text-[10px] font-bold">
                            {getTimeMultiplier(maxTimer).toFixed(2)}x Multiplicador
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-on-surface-variant leading-relaxed mt-4">
                        Has neutralizado con éxito todas las amenazas de lógica y sintaxis de este nodo del sistema en tiempo record.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-xs">
                      <button 
                        onClick={startGame}
                        className="py-3 px-5 bg-primary-container text-on-primary-container font-pixel text-xs uppercase bevel-outset hover:brightness-110 active:translate-y-1 transition-all rounded"
                      >
                        VOLVER A JUGAR NODO
                      </button>

                      <button 
                        onClick={loadSettingsView}
                        className="py-3 px-5 bg-surface-container text-secondary font-pixel text-xs uppercase border border-outline-variant hover:border-secondary transition-all rounded"
                      >
                        CAMBIAR NIVEL DE DIFICULTAD
                      </button>
                    </div>
                  </div>
                )}

                {/* 6. PROJECT INFOGRAPHIC SCREEN */}
                {screen === 'infographic' && (
                  <div className="flex-grow flex flex-col p-5 md:p-6 relative z-10 overflow-y-auto w-full text-white">
                    <MatrixRain />

                    {/* Back header */}
                    <div className="flex items-center justify-between mb-5 border-b border-outline-variant pb-2 z-10">
                      <button 
                        onClick={() => { playSfx('click'); setScreen('menu'); }}
                        className="text-primary-fixed-dim hover:text-primary transition-colors flex items-center gap-1 font-sans font-bold text-xs"
                      >
                        <ArrowLeft className="h-4 w-4" /> VOLVER AL MENÚ
                      </button>
                      <div className="text-[9px] sm:text-xs font-pixel text-secondary-container bg-secondary-container/10 border border-secondary/30 px-3 py-1 rounded">
                        // ARCHIVO_INFOGRAFIA_RECURSOS.SYS
                      </div>
                    </div>

                    {/* Info core title */}
                    <div className="text-center mb-6 z-10">
                      <h1 className="font-pixel text-xl sm:text-2xl text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)] uppercase tracking-wide">
                        INFOGRAFÍA DEL PROYECTO
                      </h1>
                      <p className="text-[9px] sm:text-[11px] text-outline uppercase tracking-wider mt-1.5 max-w-xl mx-auto leading-relaxed">
                        Explora la arquitectura técnica, las estadísticas del código y las metodologías que hacen posible esta terminal retro interactiva de depuración.
                      </p>
                    </div>

                    {/* Infographic Tabs Selection Nav */}
                    <div className="flex bg-[#121217] p-1 border border-outline-variant rounded-lg mb-6 max-w-md mx-auto w-full z-10 text-[10px] sm:text-[11px] font-pixel">
                      {[
                        { id: 'overview', label: '1. VISTA GENERAL', icon: Layers },
                        { id: 'architecture', label: '2. ARQUITECTURA', icon: Network },
                        { id: 'gameplay', label: '3. RETO Y RETRO-DINO', icon: Activity }
                      ].map(tab => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => { playSfx('click'); setInfoTab(tab.id as any); }}
                            className={`flex-1 py-2 px-1 rounded flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all uppercase ${
                              infoTab === tab.id 
                                ? 'bg-primary-container text-on-primary-container shadow-md font-bold' 
                                : 'text-outline hover:text-white hover:bg-surface-container/40'
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                            <span className="text-center sm:text-left">{tab.label.split('. ')[1]}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Content display based on tab selection */}
                    <div className="flex-grow z-10">
                      
                      {/* Sub-Tab 1: Overview */}
                      {infoTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          
                          {/* Code Statistics Section */}
                          <div className="bg-surface-container/60 border border-outline-variant/65 rounded-xl p-4 flex flex-col hover:border-primary-container/60 transition-colors backdrop-blur-sm">
                            <h2 className="font-pixel text-xs text-primary mb-3 uppercase flex items-center gap-2 border-b border-outline-variant pb-1.5">
                              <Database className="h-4 w-4 text-primary animate-pulse" /> ESTADÍSTICAS DEL CÓDIGO_
                            </h2>
                            
                            <div className="flex flex-col gap-3 font-mono text-xs text-on-surface-variant flex-grow">
                              <p className="leading-relaxed">
                                El juego compila un banco de retos locales estructurados por dificultades y tipología de errores.
                              </p>

                              {/* Simple interactive SVG custom infographic bar chart */}
                              <div className="bg-[#121217] border border-outline-variant/40 p-3 rounded-lg flex flex-col gap-2.5 mt-2">
                                <div className="flex justify-between text-[10px] uppercase font-bold text-outline">
                                  <span>TIPO DE RETO</span>
                                  <span>CANTIDAD (PROP.)</span>
                                </div>
                                
                                <div className="space-y-2">
                                  {/* Find bug */}
                                  <div>
                                    <div className="flex justify-between text-[10px] mb-1">
                                      <span className="text-[#00eefc]">ENCONTRAR EL ERROR (FIND)</span>
                                      <span className="font-bold">{challenges.filter(c => c.mode === 'find').length} RETOS</span>
                                    </div>
                                    <div className="w-full bg-surface-container-highest h-2 rounded overflow-hidden">
                                      <div 
                                        className="bg-[#00eefc] h-full shadow-[0_0_8px_rgba(0,238,252,0.8)]" 
                                        style={{ width: `${(challenges.filter(c => c.mode === 'find').length / challenges.length) * 100}%` }}
                                      />
                                    </div>
                                  </div>

                                  {/* Multiple option */}
                                  <div>
                                    <div className="flex justify-between text-[10px] mb-1">
                                      <span className="text-yellow-400">OPCIÓN MÚLTIPLE (QUESTION)</span>
                                      <span className="font-bold">{challenges.filter(c => c.mode === 'multiple').length} RETOS</span>
                                    </div>
                                    <div className="w-full bg-surface-container-highest h-2 rounded overflow-hidden">
                                      <div 
                                        className="bg-yellow-400 h-full shadow-[0_0_8px_rgba(250,204,21,0.8)]" 
                                        style={{ width: `${(challenges.filter(c => c.mode === 'multiple').length / challenges.length) * 100}%` }}
                                      />
                                    </div>
                                  </div>

                                  {/* Fix code */}
                                  <div>
                                    <div className="flex justify-between text-[10px] mb-1">
                                      <span className="text-secondary">CORREGIR CÓDIGO (FIX)</span>
                                      <span className="font-bold">{challenges.filter(c => c.mode === 'fix').length} RETOS</span>
                                    </div>
                                    <div className="w-full bg-surface-container-highest h-2 rounded overflow-hidden">
                                      <div 
                                        className="bg-secondary h-full shadow-[0_0_8px_rgba(255,42,95,0.8)]" 
                                        style={{ width: `${(challenges.filter(c => c.mode === 'fix').length / challenges.length) * 100}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="text-center text-[10px] border-t border-outline-variant/30 pt-2 text-outline uppercase mt-1">
                                  TOTAL_COMPILADO: {challenges.length} MÓDULOS DE RETO DISPONIBLES
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Technologies Core Stack */}
                          <div className="bg-surface-container/60 border border-outline-variant/65 rounded-xl p-4 flex flex-col hover:border-secondary-container/60 transition-colors backdrop-blur-sm">
                            <h2 className="font-pixel text-xs text-secondary mb-3 uppercase flex items-center gap-2 border-b border-outline-variant pb-1.5">
                              <Cpu className="h-4 w-4 text-secondary animate-pulse" /> MATRIZ DE TECNOLOGÍAS_
                            </h2>
                            
                            <div className="flex flex-col gap-3 font-mono text-xs text-on-surface-variant flex-grow justify-between">
                              <p className="leading-relaxed">
                                El juego combina recursos modernos de front Web de forma offline-primera, sin librerías pesadas en servidor.
                              </p>

                              <div className="space-y-2.5 my-2">
                                <div className="flex items-start gap-2">
                                  <div className="p-1 px-1.5 bg-[#00eefc]/15 text-[#00eefc] border border-[#00eefc]/30 rounded text-[9px] font-pixel shrink-0 mt-0.5">VITE + REACT 19</div>
                                  <p className="text-[11px] text-outline-variant leading-normal">
                                    Despliegue ultrarrápido y reactividad robusta de estado. Modularidad limpia para persistir récords y sesiones.
                                  </p>
                                </div>

                                <div className="flex items-start gap-2">
                                  <div className="p-1 px-1.5 bg-yellow-400/15 text-yellow-400 border border-yellow-400/30 rounded text-[9px] font-pixel shrink-0 mt-0.5">SYNTH AUDIO</div>
                                  <p className="text-[11px] text-outline-variant leading-normal">
                                    Web AudioContext API. Sintetizador digital de oscilación dinámica para clicks, aciertos y fallos sin descargar audio.
                                  </p>
                                </div>

                                <div className="flex items-start gap-2">
                                  <div className="p-1 px-1.5 bg-secondary/15 text-secondary border border-secondary/30 rounded text-[9px] font-pixel shrink-0 mt-0.5">TAILWIND STYLE</div>
                                  <p className="text-[11px] text-outline-variant leading-normal">
                                    Capas de estilo retro-terminal con oscilador de scanline CRT, filtros CRT dinámicos y paletas oscuras de descanso ocular.
                                  </p>
                                </div>

                                <div className="flex items-start gap-2">
                                  <div className="p-1 px-1.5 bg-green-400/15 text-green-400 border border-green-400/30 rounded text-[9px] font-pixel shrink-0 mt-0.5">LOCALPERSIST</div>
                                  <p className="text-[11px] text-outline-variant leading-normal">
                                    Almacenamiento dinámico localStorage de cuentas con hash simulado offline y records de depuración (High scores).
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      )}

                      {/* Sub-Tab 2: Architecture Diagram */}
                      {infoTab === 'architecture' && (
                        <div className="bg-surface-container/60 border border-outline-variant/65 rounded-xl p-4 md:p-5 flex flex-col hover:border-primary-container/60 transition-colors backdrop-blur-sm">
                          <h2 className="font-pixel text-xs text-primary mb-4 uppercase flex items-center gap-2 border-b border-outline-variant pb-2">
                            <Network className="h-4 w-4 text-primary animate-pulse" /> FLUJO DE SISTEMA Y ARQUITECTURA DE DATOS_
                          </h2>

                          {/* Architecture diagram boxes */}
                          <div className="flex flex-col gap-4 font-mono text-center">
                            <p className="text-xs text-on-surface-variant text-left leading-relaxed mb-1">
                              A continuación, se detalla el ciclo interactivo que orquesta las pantallas de depuración de código:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center relative text-[10px] sm:text-xs">
                              
                              {/* Box 1: Entrada */}
                              <div className="p-3 bg-[#121217] border border-outline-variant rounded-lg flex flex-col items-center gap-1.5 hover:border-[#00eefc] transition-colors group">
                                <div className="w-7 h-7 rounded-full bg-[#00eefc]/10 text-[#00eefc] flex items-center justify-center font-bold border border-[#00eefc]/30 group-hover:scale-105 transition-transform">1</div>
                                <span className="font-pixel text-secondary text-[10px] uppercase">ENTRADA USUARIO (DUMMY)</span>
                                <span className="text-outline-variant text-[10px] leading-normal uppercase">
                                  Firma / Registro offline, selección de Nivel y modo de reto.
                                </span>
                              </div>

                              {/* Box 2: Engine */}
                              <div className="p-3 bg-[#121217] border border-outline-variant rounded-lg flex flex-col items-center gap-1.5 hover:border-yellow-400 transition-colors group">
                                <div className="w-7 h-7 rounded-full bg-yellow-400/10 text-yellow-400 flex items-center justify-center font-bold border border-yellow-400/30 group-hover:scale-105 transition-transform">2</div>
                                <span className="font-pixel text-yellow-400 text-[10px] uppercase">TIEMPO LÍMITE (DEBUGLOOP)</span>
                                <span className="text-outline-variant text-[10px] leading-normal uppercase">
                                  Bucle reactivo con temporizador de 20s. Validación sintáctica y de líneas.
                                </span>
                              </div>

                              {/* Box 3: Salida */}
                              <div className="p-3 bg-[#121217] border border-outline-variant rounded-lg flex flex-col items-center gap-1.5 hover:border-secondary transition-colors group">
                                <div className="w-7 h-7 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold border border-secondary/30 group-hover:scale-105 transition-transform">3</div>
                                <span className="font-pixel text-secondary text-[10px] uppercase">SÍNTESIS DE RESPUESTA</span>
                                <span className="text-outline-variant text-[10px] leading-normal uppercase">
                                  Evaluación: Modificación de vidas / warnings y trigger de dino de error.
                                </span>
                              </div>

                            </div>

                            {/* ASCII Representation pipeline */}
                            <div className="hidden md:block bg-[#09090b]/80 p-3 border-2 border-dashed border-outline-variant/40 rounded-lg text-outline-variant text-[10px] mt-2 font-mono leading-relaxed text-center">
                              {`[REGISTRO_SESION] ---> [EVALUACION: 20 SEGUNDOS] ---> [VALIDACIÓN TERMINAL]`}
                              <br />
                              {`                           |                                |`}
                              <br />
                              {`                           v (Éxito)                        v (Fallo > 3 Err)`}
                              <br />
                              {`                  [GRABAR RECORD EXTRA]            [PAGINA EASTER EGG DINOSAUR]`}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Sub-Tab 3: Dino details & game specs */}
                      {infoTab === 'gameplay' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          
                          {/* Retro dino description & mini visual */}
                          <div className="bg-surface-container/60 border border-outline-variant/65 rounded-xl p-4 flex flex-col items-center justify-between hover:border-error/40 transition-colors backdrop-blur-sm font-mono text-xs">
                            <div className="w-full">
                              <h2 className="font-pixel text-xs text-error mb-3 uppercase flex items-center gap-2 border-b border-outline-variant pb-1.5 w-full">
                                <Activity className="h-4 w-4 text-error animate-pulse" /> HUEVO DE PASCUA: RETRO-DINOSAURIO_
                              </h2>
                              <p className="leading-relaxed text-on-surface-variant mb-3">
                                Al exceder las <strong className="text-error">3 advertencias permitidas</strong> durando el reto, se gatilla un sistema de desconexión simulada que renderiza a nuestro amigable tiranosaurio de pixeles saltarines en un entorno desconectado, diseñado enteramente con una matriz estática en React.
                              </p>
                            </div>

                            {/* Mini Dino Representation */}
                            <div className="scale-75 origin-center my-1 bg-[#121217] border border-error/30 p-2.5 rounded-lg flex flex-col justify-center items-center shadow-inner">
                              <div className="flex gap-[1px]">
                                <div className="w-1.5 h-1.5 bg-[#ff2a5f] rounded" />
                                <div className="w-1.5 h-1.5 bg-[#ff2a5f] rounded" />
                                <div className="w-1.5 h-1.5 bg-transparent" />
                                <div className="w-1.5 h-1.5 bg-[#ff2a5f] rounded" />
                                <div className="w-1.5 h-1.5 bg-[#ff2a5f] rounded" />
                              </div>
                              <span className="text-[8px] text-error font-pixel mt-1.5 tracking-wider uppercase animate-pulse">MINI_ERROR_DINO</span>
                            </div>

                            <p className="text-[10px] text-outline uppercase mt-2 w-full text-center border-t border-outline-variant/30 pt-1.5">
                              Pulsar Reintentar reiniciará tu núcleo de tolerancia de salud.
                            </p>
                          </div>

                          {/* Detail of logic topics */}
                          <div className="bg-surface-container/60 border border-outline-variant/65 rounded-xl p-4 flex flex-col justify-between hover:border-[#00eefc]/40 transition-colors backdrop-blur-sm">
                            <div>
                              <h2 className="font-pixel text-xs text-[#00eefc] mb-3 uppercase flex items-center gap-2 border-b border-outline-variant pb-1.5">
                                <BookOpen className="h-4 w-4 text-[#00eefc] animate-pulse" /> TEMARIO METODOLÓGICO_
                              </h2>
                              
                              <ul className="space-y-2 text-[11px] text-on-surface-variant leading-relaxed">
                                <li className="flex items-center gap-1.5">
                                  <ChevronRight className="h-3.5 w-3.5 text-[#00eefc] shrink-0" />
                                  <span><strong>Nivel 1-2:</strong> Declaración de variables, igualdad tipada y off-by-one.</span>
                                </li>
                                <li className="flex items-center gap-1.5">
                                  <ChevronRight className="h-3.5 w-3.5 text-[#00eefc] shrink-0" />
                                  <span><strong>Nivel 3:</strong> Expresiones regulares, asincronía y desbordamiento léxico.</span>
                                </li>
                                <li className="flex items-center gap-1.5">
                                  <ChevronRight className="h-3.5 w-3.5 text-[#00eefc] shrink-0" />
                                  <span><strong>Nivel 4:</strong> Ámbitos (scopes), closures encadenados y recursividad de funciones.</span>
                                </li>
                                <li className="flex items-center gap-1.5">
                                  <ChevronRight className="h-3.5 w-3.5 text-[#00eefc] shrink-0" />
                                  <span><strong>Nivel 5:</strong> Métodos nativos de consumo, buffers de memoria y fugas de ciclo.</span>
                                </li>
                              </ul>
                            </div>

                            <div className="bg-primary-container/10 border border-[#00eefc]/25 rounded p-2.5 mt-4 text-[10px] text-on-primary-container leading-relaxed uppercase">
                              <strong>💡 PROPÓSITO:</strong> Ayuda a los desarrolladores a adquirir velocidad analítica de lectura de código al emular errores reales bajo temporizaciones de estrés cognitivo.
                            </div>
                          </div>

                        </div>
                      )}

                    </div>

                    {/* Footer bar interface */}
                    <div className="mt-6 pt-3 border-t border-outline-variant/40 flex flex-col sm:flex-row justify-between items-center text-[10px] text-outline uppercase gap-3 z-10 font-mono">
                      <span>CLIENTE: {currentUser ? currentUser.toUpperCase() : 'DESCONOCIDO'}</span>
                      <button 
                        onClick={() => { playSfx('click'); setScreen('menu'); }}
                        className="py-1 px-4 border border-[#00eefc]/50 text-[#00eefc] rounded hover:bg-[#00eefc]/15 transition-all font-pixel text-[9px]"
                      >
                        [ VOLVER_INICIO.EXE ]
                      </button>
                      <span>V1.99 INFOGRAPHY</span>
                    </div>

                  </div>
                )}

                {/* 7. SHARED BUG REGISTRY SCREEN */}
                {screen === 'bugs-registry' && (
                  <div className="flex-grow flex flex-col p-4 md:p-6 relative z-10 overflow-hidden w-full text-white font-mono text-xs max-h-[640px]">
                    <span className="hidden">Matrix Rain</span>

                    {/* Back header navigation */}
                    <div className="flex items-center justify-between mb-4 border-b border-outline-variant pb-2 z-10 shrink-0">
                      <button 
                        onClick={() => { playSfx('click'); setScreen('menu'); }}
                        className="text-[#00eefc] hover:brightness-110 transition-colors flex items-center gap-1 font-sans font-bold text-xs"
                      >
                        <ArrowLeft className="h-4 w-4" /> VOLVER AL MENÚ
                      </button>
                      <div className="flex items-center gap-2">
                        {dbMode === 'mongodb' ? (
                          <div className="text-[9px] sm:text-[10px] font-pixel text-primary bg-primary/10 border border-primary px-3 py-1 rounded flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                            MONGODB CONECTADO
                          </div>
                        ) : (
                          <div className="text-[9px] sm:text-[10px] font-pixel text-yellow-500 bg-yellow-500/10 border border-yellow-500/40 px-3 py-1 rounded flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                            MEMORIA SIMULADA
                          </div>
                        )}
                        <span className="text-[9px] font-mono text-outline-variant bg-[#111218] border border-outline-variant/50 px-2 py-1 rounded">
                          DEB_NET_LOGS.SYS
                        </span>
                      </div>
                    </div>

                    {/* Core Screen Title */}
                    <div className="mb-4 z-10 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <h1 className="font-pixel text-base md:text-lg text-yellow-400 tracking-wide uppercase">
                          REGISTRO COMPARTIDO DE BUGS (REST CRUD)
                        </h1>
                        <p className="text-[10px] text-[#00eefc] uppercase tracking-wider mt-0.5">
                          Bitácora de errores sincronizados mediante servidor de base de datos MongoDB.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          playSfx('click');
                          setBugFormTitle('');
                          setBugFormDescription('');
                          setBugFormCode('// Fragmento experimental roto...\nfunction debugLog() {\n  console.log("Error de logica en producción");\n}');
                          setBugFormSeverity('medium');
                          setIsCreatingBug(true);
                        }}
                        className="py-1.5 px-3 bg-[#133c55] border border-cyan-400 text-cyan-200 rounded text-[10px] hover:bg-cyan-400 hover:text-black font-pixel transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <PlusCircle className="h-4 w-4 shrink-0" /> REGISTRAR NUEVO BUG_
                      </button>
                    </div>

                    {/* Main Content Layout */}
                    <div className="flex-grow flex flex-col md:flex-row gap-4 overflow-hidden z-10">
                      
                      {/* Sidebar List */}
                      <div className="w-full md:w-80 bg-surface-container/60 border border-outline-variant/65 rounded-xl p-3 flex flex-col overflow-hidden backdrop-blur-sm">
                        <div className="text-on-surface-variant font-pixel text-[10px] uppercase pb-2 border-b border-outline-variant/40 mb-2 flex justify-between items-center shrink-0">
                          <span>REGISTROS EN RED:</span>
                          <span className="text-secondary font-bold">({bugs.length})</span>
                        </div>

                        {bugsLoading ? (
                          <div className="flex-grow flex flex-col items-center justify-center p-4">
                            <RefreshCw className="h-6 w-6 text-cyan-400 animate-spin mb-2" />
                            <span className="text-[10px] text-outline-variant uppercase animate-pulse">Consultando base de...</span>
                          </div>
                        ) : bugsError ? (
                          <div className="flex-grow flex flex-col items-center justify-center p-4 text-center bg-red-950/20 border border-red-500/20 rounded">
                            <AlertTriangle className="h-6 w-6 text-error mb-1.5" />
                            <span className="text-[10px] text-error font-bold block mb-1">ACCESO_DENEGADO</span>
                            <span className="text-[9px] text-[#00eefc] uppercase">{bugsError}</span>
                            <button 
                              onClick={() => { playSfx('click'); fetchBugs(); }}
                              className="mt-3 px-2 py-1 bg-surface-container text-white border border-outline hover:border-white text-[9px] rounded"
                            >
                              REFRESCAR TERMINAL
                            </button>
                          </div>
                        ) : (
                          <div className="flex-grow overflow-y-auto space-y-2 pr-1 select-none">
                            {bugs.length === 0 ? (
                              <div className="text-center p-6 text-outline-variant font-sans text-[11px] uppercase">
                                No hay ningún bug reportado en la bitácora mundial de código.
                              </div>
                            ) : (
                              bugs.map((bug: any) => (
                                <div 
                                  key={bug._id}
                                  onClick={() => {
                                    playSfx('click');
                                    setSelectedBug(bug);
                                    setIsEditingBug(false);
                                  }}
                                  className={`p-2.5 rounded-lg border transition-all cursor-pointer text-[11px] leading-tight flex flex-col gap-1.5 ${
                                    selectedBug?._id === bug._id 
                                      ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_10px_rgba(0,238,252,0.15)] text-white' 
                                      : 'bg-[#121217]/50 border-outline-variant/50 hover:border-[#00eefc]/50 hover:bg-[#121217]'
                                  }`}
                                >
                                  <div className="flex justify-between items-start gap-1">
                                    <span className="font-bold truncate max-w-[160px] text-[#00eefc]">
                                      {bug.title}
                                    </span>
                                    <span className={`text-[8px] font-pixel px-1.5 rounded uppercase ${
                                      bug.severity === 'critical' ? 'bg-red-950 text-red-400 border border-red-500/30' :
                                      bug.severity === 'high' ? 'bg-orange-950 text-orange-400 border border-orange-500/30' :
                                      bug.severity === 'medium' ? 'bg-yellow-950 text-yellow-400 border border-yellow-500/30' :
                                      'bg-green-950 text-green-400'
                                    }`}>
                                      {bug.severity}
                                    </span>
                                  </div>
                                  
                                  <div className="flex justify-between text-[9px] text-outline-variant uppercase">
                                    <span>POR: @{bug.author || 'invitado'}</span>
                                    <span className={`font-mono ${bug.status === 'resolved' ? 'text-green-400 font-bold' : 'text-yellow-500'}`}>
                                      [{bug.status?.replace('-', ' ')}]
                                    </span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                        
                        <div className="mt-2 pt-2 border-t border-outline-variant/30 flex justify-between shrink-0 text-[10px]">
                          <button
                            onClick={() => { playSfx('click'); fetchBugs(); }}
                            className="text-[#00eefc] hover:brightness-110 flex items-center gap-1 uppercase"
                          >
                            <RefreshCw className="h-3 w-3" /> REPROCESAR LISTA
                          </button>
                        </div>
                      </div>

                      {/* Main Detail Display Section */}
                      <div className="flex-grow bg-surface-container/60 border border-outline-variant/65 rounded-xl p-4 flex flex-col overflow-hidden backdrop-blur-sm justify-between">
                        {selectedBug ? (
                          <div className="flex flex-col overflow-hidden h-full">
                            {/* Bug Header details */}
                            <div className="border-b border-outline-variant/40 pb-3 mb-3 flex-shrink-0">
                              <div className="flex justify-between items-start gap-2 mb-1.5">
                                <h3 className="font-pixel text-[#00eefc] text-xs sm:text-sm tracking-wide">
                                  TICKET: {selectedBug.title.toUpperCase()}
                                </h3>
                                <div className="flex gap-2">
                                  <span className={`text-[9px] font-pixel px-2 py-0.5 rounded-full uppercase ${
                                    selectedBug.status === 'resolved' 
                                      ? 'bg-green-500/20 text-green-400 border border-green-500' 
                                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/45'
                                  }`}>
                                    ESTADO: {selectedBug.status?.replace('-', ' ')}
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-outline-variant uppercase font-mono">
                                <div className="bg-black/20 p-1.5 rounded border border-outline-variant/35">
                                  <span className="text-[8px] text-outline-variant font-bold block">AUTOR TICKET:</span>
                                  <span className="text-white">@{selectedBug.author || 'desconocido'}</span>
                                </div>
                                <div className="bg-black/20 p-1.5 rounded border border-outline-variant/35">
                                  <span className="text-[8px] text-outline-variant font-bold block">GRAVEDAD_NIVEL:</span>
                                  <span className="text-yellow-400">{selectedBug.severity}</span>
                                </div>
                                <div className="bg-black/20 p-1.5 rounded border border-outline-variant/35 col-span-2">
                                  <span className="text-[8px] text-outline-variant font-bold block">FECHA REGISTRO:</span>
                                  <span className="text-white/80">{new Date(selectedBug.createdAt).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>

                            {/* Bug Description */}
                            <div className="flex-grow overflow-y-auto space-y-3 pr-2 text-xs leading-relaxed font-sans">
                              <div className="bg-black/10 p-3 rounded-lg border border-outline-variant/45">
                                <h4 className="font-pixel text-[10px] text-yellow-400 mb-1 uppercase tracking-wide">
                                  _DECONSTRUCCIÓN DEL SÍNTOMA (READ):
                                </h4>
                                <p className="text-on-surface-variant font-medium text-[11px] sm:text-xs">
                                  {selectedBug.description}
                                </p>
                              </div>

                              {/* Code Snippet block */}
                              <div>
                                <h4 className="font-pixel text-[10px] text-[#00eefc] mb-1 uppercase tracking-wide">
                                  _FRACTURA SINTÁCTICA (CÓDIGO CON ERROR):
                                </h4>
                                <div className="bg-[#0c0d12] rounded-lg border border-outline-variant/65 p-3 font-mono text-[11px] relative overflow-x-auto shadow-inner">
                                  <pre className="text-red-400 select-text"><code>{selectedBug.codeSnippet}</code></pre>
                                  <span className="absolute bottom-2 right-2 text-[8px] text-[#00eefc] uppercase">
                                    SYNTAX_ERROR
                                  </span>
                                </div>
                              </div>

                              {/* Author note */}
                              {selectedBug.author !== currentUser && (
                                <div className="bg-yellow-400/10 border border-yellow-400/20 rounded p-2 text-[9px] text-yellow-300 uppercase leading-normal">
                                  AVISO SEGURIDAD: Estás visualizando un ticket reportado por @{selectedBug.author}. Al no ser el creador, tus operaciones podrían estar limitadas según las variables de sesión JWT.
                                </div>
                              )}
                            </div>

                            {/* CRUD Interactive Footer controls */}
                            <div className="border-t border-outline-variant/40 pt-3 mt-3 flex flex-wrap gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  playSfx('click');
                                  setBugFormTitle(selectedBug.title);
                                  setBugFormDescription(selectedBug.description);
                                  setBugFormCode(selectedBug.codeSnippet);
                                  setBugFormSeverity(selectedBug.severity);
                                  setBugFormStatus(selectedBug.status);
                                  setIsEditingBug(true);
                                }}
                                className="py-2 px-3 bg-[#111218] hover:bg-black/40 text-[#00eefc] rounded border border-cyan-800 text-[10px] uppercase font-pixel tracking-wider flex items-center gap-1.5"
                              >
                                <Edit3 className="h-4 w-4 shrink-0 text-cyan-400" /> [ EDITAR DETALLES ]
                              </button>
                              
                              <button
                                onClick={() => handleDeleteBug(selectedBug._id)}
                                className="py-2 px-3 bg-red-950/20 border border-red-500/50 hover:bg-red-500 hover:text-white text-red-400 rounded text-[10px] uppercase font-pixel tracking-wider flex items-center gap-1.5"
                              >
                                <Trash2 className="h-4 w-4 shrink-0" /> [ ELIMINAR REGISTRO_ ]
                              </button>

                              {selectedBug.status !== 'resolved' && (
                                <button
                                  onClick={async () => {
                                    try {
                                      const res = await api.put(`/api/bugs/${selectedBug._id}`, {
                                        ...selectedBug,
                                        status: 'resolved'
                                      });
                                      playSfx('correct');
                                      fetchBugs();
                                      setSelectedBug(res.data.bug || null);
                                    } catch (err: any) {
                                      alert(err.response?.data?.error || 'No tienes permisos de autor para resolver este bug.');
                                      playSfx('wrong');
                                    }
                                  }}
                                  className="py-2 px-3 bg-green-950/40 hover:bg-green-600 hover:text-black hover:border-transparent text-green-400 rounded border border-green-500/40 text-[10px] uppercase font-pixel tracking-wider ml-auto flex items-center gap-1.5"
                                >
                                  <CheckSquare className="h-4 w-4 shrink-0" /> [ MARCAR RESOLVIDO ]
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center text-outline-variant">
                            <Binary className="h-14 w-14 text-[#00eefc]/30 mb-3 animate-pulse" />
                            <h3 className="font-pixel text-[11px] text-[#00eefc] uppercase tracking-wider mb-2">
                              -- EN ESPERA DE INSPECCIÓN TÁCTICA --
                            </h3>
                            <p className="max-w-xs text-[10px] sm:text-[11px] leading-relaxed uppercase">
                              Selecciona un reporte de bug específico en el listado izquierdo para iniciar la inspección de su código, o registra uno nuevo en la red.
                            </p>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* CREATE CUSTOM DIALOG OVERLAY */}
                    <AnimatePresence>
                      {isCreatingBug && (
                        <div className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center p-4 backdrop-blur-sm">
                          <motion.div 
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="w-full max-w-lg bg-[#0e0f14] border-2 border-[#00eefc]/50 rounded-xl overflow-hidden shadow-2xl p-5 relative text-white"
                          >
                            <button 
                              onClick={() => { playSfx('click'); setIsCreatingBug(false); }}
                              className="absolute top-4 right-4 text-outline-variant hover:text-white p-1 rounded"
                            >
                              <X className="h-5 w-5" />
                            </button>

                            <div className="flex items-center gap-2 text-[#00eefc] w-full border-b border-outline-variant pb-3 mb-4 font-pixel select-none">
                              <PlusCircle className="h-5 w-5 animate-bounce" />
                              <h3 className="text-xs uppercase">Registrar Nuevo Reporte de Bug</h3>
                            </div>

                            <form onSubmit={handleCreateBugSubmit} className="space-y-3 text-[11px]">
                              <div>
                                <label className="block font-pixel text-[9px] uppercase tracking-wide text-outline-variant mb-1">
                                  Título del Error_
                                </label>
                                <input 
                                  type="text"
                                  required
                                  value={bugFormTitle}
                                  onChange={e => setBugFormTitle(e.target.value)}
                                  placeholder="Ej: Coerción implícita en retorno de array"
                                  className="w-full bg-[#121217] border border-outline-variant/60 rounded px-2.5 py-1.5 font-mono text-xs focus:border-cyan-400 focus:outline-none text-white"
                                />
                              </div>

                              <div>
                                <label className="block font-pixel text-[9px] uppercase tracking-wide text-outline-variant mb-1">
                                  Descripción / Síntomas_
                                </label>
                                <textarea 
                                  required
                                  rows={2}
                                  value={bugFormDescription}
                                  onChange={e => setBugFormDescription(e.target.value)}
                                  placeholder="Explica qué error experimental ocurre con este código..."
                                  className="w-full bg-[#121217] border border-outline-variant/60 rounded px-2.5 py-1.5 font-mono text-xs focus:border-cyan-400 focus:outline-none resize-none text-white"
                                />
                              </div>

                              <div>
                                <label className="block font-pixel text-[9px] uppercase tracking-wide text-outline-variant mb-1">
                                  Nivel de Peligro / Gravedad_
                                </label>
                                <select
                                  value={bugFormSeverity}
                                  onChange={e => setBugFormSeverity(e.target.value)}
                                  className="w-full bg-[#121217] border border-outline-variant/60 rounded px-2.5 py-1.5 font-mono text-xs focus:border-cyan-400 focus:outline-none text-white font-pixel"
                                >
                                  <option value="low">LOW - MENOR</option>
                                  <option value="medium">MEDIUM - INTERMEDIO</option>
                                  <option value="high">HIGH - ELEVADO</option>
                                  <option value="critical">CRITICAL - IMPRESCINDIBLE</option>
                                </select>
                              </div>

                              <div>
                                <label className="block font-pixel text-[9px] uppercase tracking-wide text-outline-variant mb-1">
                                  Fragmento de Código Roto (JavaScript/TypeScript)_
                                </label>
                                <textarea 
                                  required
                                  rows={5}
                                  value={bugFormCode}
                                  onChange={e => setBugFormCode(e.target.value)}
                                  className="w-full bg-[#050608] border border-outline-variant/60 rounded px-2.5 py-1.5 font-mono text-xs text-[#00eefc] focus:border-cyan-400 focus:outline-none resize-none"
                                />
                              </div>

                              <div className="flex gap-2 pt-3 border-t border-outline-variant/35 mt-4">
                                <button
                                  type="button"
                                  onClick={() => { playSfx('click'); setIsCreatingBug(false); }}
                                  className="flex-1 py-1.5 bg-surface-container border border-outline text-outline font-pixel text-[10px] uppercase hover:brightness-110 active:translate-y-0.5 rounded transition-all"
                                >
                                  [ CANCELAR ]
                                </button>
                                <button
                                  type="submit"
                                  className="flex-1 py-1.5 bg-cyan-400 text-black font-pixel text-[10px] uppercase hover:brightness-110 active:translate-y-0.5 rounded transition-all font-bold"
                                >
                                  [ REGISTRAR TICKET (CREATE) ]
                                </button>
                              </div>
                            </form>
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>

                    {/* EDIT OVERLAY DIALOG */}
                    <AnimatePresence>
                      {isEditingBug && selectedBug && (
                        <div className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center p-4 backdrop-blur-sm">
                          <motion.div 
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="w-full max-w-lg bg-[#0e0f14] border-2 border-yellow-400/50 rounded-xl overflow-hidden shadow-2xl p-5 relative text-white"
                          >
                            <button 
                              onClick={() => { playSfx('click'); setIsEditingBug(false); }}
                              className="absolute top-4 right-4 text-outline hover:text-white p-1 rounded"
                            >
                              <X className="h-5 w-5" />
                            </button>

                            <div className="flex items-center gap-2 text-yellow-400 w-full border-b border-outline-variant pb-3 mb-4 font-pixel select-none">
                              <Edit3 className="h-5 w-5 animate-pulse" />
                              <h3 className="text-xs">Modificar Detalles de Ticket (Update)</h3>
                            </div>

                            <form onSubmit={handleUpdateBugSubmit} className="space-y-3 text-[11px]">
                              <div>
                                <label className="block font-pixel text-[9px] uppercase tracking-wide text-outline-variant mb-1">
                                  Título del Error_
                                </label>
                                <input 
                                  type="text"
                                  required
                                  value={bugFormTitle}
                                  onChange={e => setBugFormTitle(e.target.value)}
                                  className="w-full bg-[#121217] border border-outline-variant/60 rounded px-2.5 py-1.5 font-mono text-xs focus:border-yellow-400 focus:outline-none text-white"
                                />
                              </div>

                              <div>
                                <label className="block font-pixel text-[9px] uppercase tracking-wide text-outline-variant mb-1">
                                  Descripción / Síntomas_
                                </label>
                                <textarea 
                                  required
                                  rows={2}
                                  value={bugFormDescription}
                                  onChange={e => setBugFormDescription(e.target.value)}
                                  className="w-full bg-[#121217] border border-outline-variant/60 rounded px-2.5 py-1.5 font-mono text-xs focus:border-yellow-400 focus:outline-none resize-none text-white"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block font-pixel text-[9px] uppercase tracking-wide text-outline-variant mb-1">
                                    Peligro / Gravedad_
                                  </label>
                                  <select
                                    value={bugFormSeverity}
                                    onChange={e => setBugFormSeverity(e.target.value)}
                                    className="w-full bg-[#121217] border border-outline-variant/60 rounded px-2.5 py-1.5 font-mono text-xs focus:border-yellow-400 focus:outline-none text-white font-pixel"
                                  >
                                    <option value="low">LOW - MENOR</option>
                                    <option value="medium">MEDIUM - INTERMEDIO</option>
                                    <option value="high">HIGH - ELEVADO</option>
                                    <option value="critical">CRITICAL - IMPRESCINDIBLE</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block font-pixel text-[9px] uppercase tracking-wide text-outline-variant mb-1">
                                    Estado / Resolución_
                                  </label>
                                  <select
                                    value={bugFormStatus}
                                    onChange={e => setBugFormStatus(e.target.value)}
                                    className="w-full bg-[#121217] border border-outline-variant/60 rounded px-2.5 py-1.5 font-mono text-xs focus:border-yellow-400 focus:outline-none text-white font-pixel"
                                  >
                                    <option value="open">OPEN - SIN RESOLVER</option>
                                    <option value="in-progress">IN PROGRESS - REVISANDO</option>
                                    <option value="resolved">RESOLVED - DEPURADO</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="block font-pixel text-[9px] uppercase tracking-wide text-outline-variant mb-1">
                                  Fragmento de Código Roto (JavaScript/TypeScript)_
                                </label>
                                <textarea 
                                  required
                                  rows={5}
                                  value={bugFormCode}
                                  onChange={e => setBugFormCode(e.target.value)}
                                  className="w-full bg-[#050608] border border-outline-variant/60 rounded px-2.5 py-1.5 font-mono text-xs text-yellow-400 focus:border-yellow-400 focus:outline-none resize-none"
                                />
                              </div>

                              <div className="flex gap-2 pt-3 border-t border-outline-variant/35 mt-4">
                                <button
                                  type="button"
                                  onClick={() => { playSfx('click'); setIsEditingBug(false); }}
                                  className="flex-1 py-1.5 bg-surface-container border border-outline text-outline font-pixel text-[10px] uppercase hover:brightness-110 active:translate-y-0.5 rounded transition-all"
                                >
                                  [ CANCELAR ]
                                </button>
                                <button
                                  type="submit"
                                  className="flex-1 py-1.5 bg-yellow-400 text-black font-pixel text-[10px] uppercase hover:brightness-110 active:translate-y-0.5 rounded transition-all font-bold"
                                >
                                  [ APLICAR UPDATE ]
                                </button>
                              </div>
                            </form>
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>

                    {/* Footer strip */}
                    <div className="mt-4 pt-2 border-t border-outline-variant/35 flex flex-col sm:flex-row justify-between items-center text-[9px] text-outline uppercase gap-2 z-10 font-mono shrink-0">
                      <span>CLIENTE: {currentUser ? currentUser.toUpperCase() : 'DESCONOCIDO'}</span>
                      <button 
                        onClick={() => { playSfx('click'); setScreen('menu'); }}
                        className="py-1 px-4 border border-[#00eefc]/50 text-[#00eefc] rounded hover:bg-[#00eefc]/15 transition-all font-pixel text-[9px]"
                      >
                        [ VOLVER_INICIO.EXE ]
                      </button>
                      <span>SOPORTE DE BUGS V2.55</span>
                    </div>

                  </div>
                )}

              </div>

              {/* EDITOR GENERAL STATUS CONSOLE BAR FOOTER */}
              <footer className="shrink-0 bg-surface-container-lowest h-10 border-t border-outline-variant text-on-surface-variant flex items-center px-4 justify-between font-mono text-[10px] sm:text-xs">
                <div className="flex gap-4">
                  <span className="hidden sm:inline">TERMINAL</span>
                  <span className="hidden sm:inline">SALIDA</span>
                  <span className="text-primary font-bold border-t-2 border-primary">CONSOLA DEBUG</span>
                  <span className="hidden md:inline">PROBLEMAS ({lives === 0 ? 'X' : lives})</span>
                </div>
                <div className="font-bold flex items-center gap-2">
                  <span>ESTADO:</span> 
                  <span className={lives === 0 ? 'text-error' : 'text-primary-container'}>
                    {screen === 'game' ? 'DEPURANDO_DIAGNOSTICOS' : 'SISTEMA_STANDBY'}
                  </span>
                  <div className={`h-2.5 w-2.5 rounded-full ${lives === 0 ? 'bg-error animate-ping' : 'bg-primary-container animate-pulse'}`} />
                </div>
              </footer>

            </div>

          </div>

          {/* PHYSICAL RETO CABINET EXTRA BASE ELEMENTS */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-6 bg-[#1a1a22] border-t-4 border-[#2b2b36] border-b-2 border-black rounded-b-lg hidden md:block z-0 shadow-lg" />
          <div className="absolute -bottom-[44px] left-1/2 -translate-x-1/2 w-64 h-3 bg-[#111116] border-t-2 border-[#1c1c22] border-b border-black rounded-b-lg hidden md:block z-0 shadow-xl" />

        </div>

        {/* EXTRA DESKTOP INTERACTIVE ENVIRONMENT CONTROLS PANEL */}
        <div className="w-full max-w-container-max mt-14 px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-outline font-medium">
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="font-sans text-[10px] tracking-widest font-bold uppercase">OPCIONES CRT:</span>
            
            <button 
              onClick={() => { playSfx('click'); setCrtFilter(!crtFilter); }}
              className={`px-3 py-1.5 border rounded-sm transition-colors cursor-pointer select-none ${
                crtFilter ? 'bg-primary-container/10 border-primary text-primary-container' : 'border-outline-variant hover:border-outline'
              }`}
            >
              Curvatura CRT: {crtFilter ? 'ON' : 'OFF'}
            </button>

            <button 
              onClick={() => { playSfx('click'); setCrtFlicker(!crtFlicker); }}
              className={`px-3 py-1.5 border rounded-sm transition-colors cursor-pointer select-none ${
                crtFlicker ? 'bg-primary-container/10 border-primary text-primary-container' : 'border-outline-variant hover:border-outline'
              }`}
            >
              Flicker Phosphor: {crtFlicker ? 'ON' : 'OFF'}
            </button>
          </div>

          <p className="font-sans text-[10px] uppercase text-center md:text-right tracking-widest text-outline-variant leading-relaxed">
            PROGRAMANDO EN 20s © 2026 | CONSTRUIDO CON SÍNTESIS DE AUDIO REALISTA
          </p>
        </div>

      </div>

      {/* DETAILED USER MANUAL / GUIDE DRAWER */}
      <AnimatePresence>
        {showGuide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-xl bg-surface-container border-2 border-secondary-container rounded-xl overflow-hidden shadow-2xl p-6 relative"
            >
              <button 
                onClick={() => { playSfx('click'); setShowGuide(false); }}
                className="absolute top-4 right-4 text-outline hover:text-white p-1 rounded"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 text-secondary w-full border-b border-outline-variant pb-3 mb-4">
                <HelpCircle className="h-6 w-6 text-secondary shadow-lg animate-bounce" />
                <h3 className="font-pixel text-xs sm:text-sm uppercase tracking-wide">Manual del Depurador</h3>
              </div>

              <div className="font-mono text-xs space-y-4 max-h-[400px] overflow-y-auto leading-relaxed pr-2">
                <p className="text-secondary-container font-sans font-bold uppercase">
                  Código bajo presión. Tienes exactamente 20 segundos.
                </p>
                <p>
                  El sistema emula un simulador táctico de depuración y lógica. Tienes tres modos de juego:
                </p>
                
                <div className="space-y-2 border-l-2 border-outline-variant pl-3">
                  <div>
                    <span className="text-primary-container font-bold">1_ Encontrar el Error:</span>
                    <p className="text-on-surface-variant font-sans text-[11px] mt-0.5">Analiza el código mostrado. Identifica la línea incorrecta y haz clic para reportarla. No asumas nada.</p>
                  </div>
                  <div>
                    <span className="text-primary-container font-bold">2_ Opción Múltiple:</span>
                    <p className="text-on-surface-variant font-sans text-[11px] mt-0.5">Teoría analítica de coerción, rendimiento y asincronía. Elige entre cuatro alternativas lógicas.</p>
                  </div>
                  <div>
                    <span className="text-primary-container font-bold">3_ Corregir Código:</span>
                    <p className="text-on-surface-variant font-sans text-[11px] mt-0.5">Escribe la deconstrucción correcta directamente en el campo. Verifica paréntesis, llaves, variables e igualdad.</p>
                  </div>
                </div>

                <div className="bg-surface-container-low p-3 border border-outline-variant rounded">
                  <span className="text-error font-bold flex items-center gap-1"><AlertTriangle className="h-4 w-4 shrink-0" /> ADVERTENCIAS CLAVE:</span>
                  <p className="text-on-surface-variant font-sans text-[11px] mt-1">
                    Cada error o tiempo agotado consume un punto de vida de advertencia. Recibir 3 advertencias detiene el sistema por fallo crítico y pierdes tu racha. ¡Pide pistas si necesitas ayuda!
                  </p>
                </div>
              </div>

              <button 
                onClick={() => { playSfx('click'); setShowGuide(false); }}
                className="w-full mt-6 py-2.5 bg-secondary-container text-on-secondary-container font-pixel text-[10px] uppercase bevel-outset hover:brightness-110 active:translate-y-1 transition-all rounded"
              >
                ENTENDIDO
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREDITS OVERLAY LIST DRAWER */}
      <AnimatePresence>
        {showCredits && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-md bg-surface-container border-2 border-tertiary-container rounded-xl overflow-hidden shadow-2xl p-6 relative"
            >
              <button 
                onClick={() => { playSfx('click'); setShowCredits(false); }}
                className="absolute top-4 right-4 text-outline hover:text-white p-1 rounded"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 text-tertiary-container w-full border-b border-outline-variant pb-3 mb-6">
                <Award className="h-6 w-6 text-tertiary-container animate-bounce" />
                <h3 className="font-pixel text-xs sm:text-xs uppercase tracking-wide">Créditos de Desarrollo</h3>
              </div>

              <div className="space-y-4 text-center">
                <p className="text-[11px] text-outline uppercase font-sans tracking-widest">Autores del Proyecto:</p>
                
                <div className="space-y-2.5">
                  {[
                    'Felix Daniel Garcia Cordova',
                    'Samuel Eduardo Garay Ibarra',
                    'Emiliano Pulido Arias',
                    'Samantha Sarai Aleman De La Torre'
                  ].map((author, i) => (
                    <div key={i} className="p-2.5 bg-surface-container-low border border-outline-variant/60 rounded font-bold text-xs text-white">
                      {author}
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-outline-variant uppercase font-sans mt-6">
                  CBTIS 258 | PROGRAMANDO EN 20 SEGUNDOS ESTUDIOS
                </p>
              </div>

              <button 
                onClick={() => { playSfx('click'); setShowCredits(false); }}
                className="w-full mt-6 py-2.5 bg-tertiary text-on-tertiary font-pixel text-[10px] uppercase bevel-outset hover:brightness-110 active:translate-y-1 transition-all rounded"
              >
                CERRAR
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
