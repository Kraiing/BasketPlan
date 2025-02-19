import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Trash2, ArrowRight, UserPlus, UserMinus, Undo2, Redo2, Eraser } from 'lucide-react';

const translations = {
  th: {
    title: '🏀 กระดานกลยุทธ์บาสเกตบอล',
    redTeam: 'ทีมแดง',
    blueTeam: 'ทีมน้ำเงิน',
    add: 'เพิ่ม',
    remove: 'ลบ',
    movePlayer: 'เคลื่อนย้ายผู้เล่น',
    drawArrow: 'วาดลูกศร',
    eraseArrow: 'ลบลูกศร',
    clearBoard: 'ล้างกระดาน',
    undo: 'ย้อนกลับ',
    redo: 'ทำซ้ำ',
    notesPlaceholder: 'เพิ่มคำอธิบายแผนการเล่นที่นี่...',
    teamCount: (count) => `(${count}/5)`
  },
  en: {
    title: '🏀 Basketball Strategy Board',
    redTeam: 'Red Team',
    blueTeam: 'Blue Team',
    add: 'Add',
    remove: 'Remove',
    movePlayer: 'Move Player',
    drawArrow: 'Draw Arrow',
    eraseArrow: 'Erase Arrow',
    clearBoard: 'Clear Board',
    undo: 'Undo',
    redo: 'Redo',
    notesPlaceholder: 'Add play description here...',
    teamCount: (count) => `(${count}/5)`
  },
  ja: {
    title: '🏀 バスケットボール作戦ボード',
    redTeam: 'レッドチーム',
    blueTeam: 'ブルーチーム',
    add: '追加',
    remove: '削除',
    movePlayer: 'プレイヤー移動',
    drawArrow: '矢印を描く',
    eraseArrow: '矢印を消す',
    clearBoard: 'ボードをクリア',
    undo: '元に戻す',
    redo: 'やり直し',
    notesPlaceholder: 'プレー説明を追加...',
    teamCount: (count) => `(${count}/5)`
  }
};

const BasketballBoard = () => {
  const [language, setLanguage] = useState('th');
  const [players, setPlayers] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [history, setHistory] = useState([{ arrows: [], players: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedTool, setSelectedTool] = useState('move');
  const [nextId, setNextId] = useState(1);
  const [notes, setNotes] = useState('');
  
  const boardRef = useRef(null);
  const t = translations[language];

  const LanguageSelector = () => (
    <div className="flex gap-2 mb-4">
      <Button
        variant={language === 'th' ? 'default' : 'outline'}
        onClick={() => setLanguage('th')}
        size="sm"
        className="rounded-full font-bold hover:scale-105 transition-transform"
      >
        <span className="mr-1 text-xl">🇹🇭</span> ไทย
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        onClick={() => setLanguage('en')}
        size="sm"
        className="rounded-full font-bold hover:scale-105 transition-transform"
      >
        <span className="mr-1 text-xl">🇬🇧</span> English
      </Button>
      <Button
        variant={language === 'ja' ? 'default' : 'outline'}
        onClick={() => setLanguage('ja')}
        size="sm"
        className="rounded-full font-bold hover:scale-105 transition-transform"
      >
        <span className="mr-1 text-xl">🇯🇵</span> 日本語
      </Button>
    </div>
  );

  const getTeamCount = (teamColor) => {
    return players.filter(p => p.team === teamColor).length;
  };

  const addToHistory = (newState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const previousState = history[historyIndex - 1];
      setArrows(previousState.arrows);
      setPlayers(previousState.players);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextState = history[historyIndex + 1];
      setArrows(nextState.arrows);
      setPlayers(nextState.players);
    }
  };

  const addPlayer = (team) => {
    if (getTeamCount(team) >= 5) {
      alert(`${team === 'red' ? t.redTeam : t.blueTeam} ${t.teamCount(5)}`);
      return;
    }

    const startX = team === 'red' ? 100 : 300;
    const startY = 150 + (getTeamCount(team) * 50);

    const newPlayers = [...players, {
      id: nextId,
      x: startX,
      y: startY,
      team: team,
      isDragging: false
    }];
    
    setPlayers(newPlayers);
    setNextId(nextId + 1);
    addToHistory({ arrows, players: newPlayers });
  };

  const removePlayer = (team) => {
    const teamPlayers = players.filter(p => p.team === team);
    if (teamPlayers.length === 0) {
      alert(`${team === 'red' ? t.redTeam : t.blueTeam} ${t.teamCount(0)}`);
      return;
    }
    
    const lastPlayer = teamPlayers[teamPlayers.length - 1];
    const newPlayers = players.filter(p => p.id !== lastPlayer.id);
    setPlayers(newPlayers);
    addToHistory({ arrows, players: newPlayers });
  };

  const handleMouseDown = (e) => {
    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === 'move') {
      const playerIndex = players.findIndex(p => 
        Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2)) < 15
      );
      
      if (playerIndex !== -1) {
        const newPlayers = [...players];
        newPlayers[playerIndex].isDragging = true;
        setPlayers(newPlayers);
      }
    } else if (selectedTool === 'arrow') {
      setIsDrawing(true);
      setCurrentPath([{ x, y }]);
    } else if (selectedTool === 'eraser') {
      // ตรวจสอบว่าคลิกใกล้เส้นลูกศรหรือไม่
      const arrowIndex = arrows.findIndex(arrow => {
        return arrow.points.some(point => {
          const dx = point.x - x;
          const dy = point.y - y;
          return Math.sqrt(dx * dx + dy * dy) < 20; // ระยะห่างในการตรวจจับการคลิก
        });
      });
      
      if (arrowIndex !== -1) {
        const newArrows = arrows.filter((_, index) => index !== arrowIndex);
        setArrows(newArrows);
        addToHistory({ arrows: newArrows, players });
      }
    }
  };

  const smoothPath = (points) => {
    if (points.length < 3) {
      if (points.length === 2) {
        return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
      }
      if (points.length === 1) {
        return `M ${points[0].x} ${points[0].y}`;
      }
      return '';
    }

    let path = `M ${points[0].x} ${points[0].y}`;

    // ใช้ Bezier curves สำหรับทุกๆ 3 จุด
    for (let i = 1; i < points.length - 1; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];

      // คำนวณจุดควบคุมสำหรับ curve
      const cp1x = p1.x + (p0.x - p2.x) / 6;
      const cp1y = p1.y + (p0.y - p2.y) / 6;
      const cp2x = p1.x + (p2.x - p0.x) / 6;
      const cp2y = p1.y + (p2.y - p0.y) / 6;

      path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p1.x} ${p1.y}`;
    }

    // เพิ่มจุดสุดท้าย
    path += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;

    return path;
  };

  const handleMouseMove = (e) => {
    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === 'move') {
      const draggedPlayer = players.find(p => p.isDragging);
      if (draggedPlayer) {
        const newPlayers = players.map(p => 
          p.id === draggedPlayer.id ? { ...p, x, y } : p
        );
        setPlayers(newPlayers);
      }
    } else if (selectedTool === 'arrow' && isDrawing) {
      // เพิ่มจุดใหม่เมื่อระยะห่างมากพอ
      const lastPoint = currentPath[currentPath.length - 1];
      const dx = x - lastPoint.x;
      const dy = y - lastPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 10) { // ลดจำนวนจุดที่เก็บ
        setCurrentPath(prev => [...prev, { x, y }]);
      }
    }
  };

  const handleMouseUp = (e) => {
    if (selectedTool === 'move') {
      const draggedPlayer = players.find(p => p.isDragging);
      if (draggedPlayer) {
        const newPlayers = players.map(p => ({ ...p, isDragging: false }));
        setPlayers(newPlayers);
        addToHistory({ arrows, players: newPlayers });
      }
    } else if (selectedTool === 'arrow' && isDrawing && currentPath.length > 1) {
      const newArrow = {
        points: currentPath,
        type: 'curve'
      };
      const newArrows = [...arrows, newArrow];
      setArrows(newArrows);
      addToHistory({ arrows: newArrows, players });
      setIsDrawing(false);
      setCurrentPath([]);
    }
  };

  const clearBoard = () => {
    const newState = { arrows: [], players: [] };
    setArrows([]);
    setPlayers([]);
    setNotes('');
    setNextId(1);
    addToHistory(newState);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-b from-blue-50 to-purple-50 shadow-xl rounded-3xl">
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-indigo-600">
          {t.title}
        </h1>
        
        <LanguageSelector />
        
        <div className="mb-4 flex flex-wrap gap-4">
          <div className="flex gap-2 items-center p-4 bg-pink-50 rounded-2xl shadow-md border-2 border-pink-200">
            <span className="font-bold text-pink-600">{t.redTeam} {t.teamCount(getTeamCount('red'))}:</span>
            <Button 
              onClick={() => addPlayer('red')} 
              size="sm"
              className="bg-pink-500 hover:bg-pink-600 rounded-full shadow-md hover:scale-105 transition-transform"
            >
              <UserPlus className="mr-1 h-4 w-4" />
              {t.add}
            </Button>
            <Button 
              onClick={() => removePlayer('red')} 
              size="sm" 
              variant="destructive"
              className="rounded-full shadow-md hover:scale-105 transition-transform"
            >
              <UserMinus className="mr-1 h-4 w-4" />
              {t.remove}
            </Button>
          </div>

          <div className="flex gap-2 items-center p-4 bg-blue-50 rounded-2xl shadow-md border-2 border-blue-200">
            <span className="font-bold text-blue-600">{t.blueTeam} {t.teamCount(getTeamCount('blue'))}:</span>
            <Button 
              onClick={() => addPlayer('blue')} 
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 rounded-full shadow-md hover:scale-105 transition-transform"
            >
              <UserPlus className="mr-1 h-4 w-4" />
              {t.add}
            </Button>
            <Button 
              onClick={() => removePlayer('blue')} 
              size="sm" 
              variant="destructive"
              className="rounded-full shadow-md hover:scale-105 transition-transform"
            >
              <UserMinus className="mr-1 h-4 w-4" />
              {t.remove}
            </Button>
          </div>
        </div>

        <div className="mb-4 flex gap-4">
                      <Button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              variant={selectedTool === 'undo' ? 'default' : 'outline'}
              className="rounded-full shadow-md hover:scale-105 transition-transform"
            >
              <Undo2 className="mr-2" />
              {t.undo}
            </Button>
            <Button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              variant={selectedTool === 'redo' ? 'default' : 'outline'}
              className="rounded-full shadow-md hover:scale-105 transition-transform"
            >
              <Redo2 className="mr-2" />
              {t.redo}
            </Button>
            <Button
              onClick={() => setSelectedTool('move')}
              variant={selectedTool === 'move' ? 'default' : 'outline'}
              className={`rounded-full shadow-md hover:scale-105 transition-transform ${
                selectedTool === 'move' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white ring-2 ring-indigo-300 ring-offset-2' 
                  : ''
              }`}
            >
              {t.movePlayer}
            </Button>
            <Button
              onClick={() => setSelectedTool('arrow')}
              variant={selectedTool === 'arrow' ? 'default' : 'outline'}
              className={`rounded-full shadow-md hover:scale-105 transition-transform ${
                selectedTool === 'arrow' 
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white ring-2 ring-green-300 ring-offset-2' 
                  : ''
              }`}
            >
              <ArrowRight className="mr-2" />
              {t.drawArrow}
            </Button>
            <Button
              onClick={() => setSelectedTool('eraser')}
              variant={selectedTool === 'eraser' ? 'default' : 'outline'}
              className={`rounded-full shadow-md hover:scale-105 transition-transform ${
                selectedTool === 'eraser' 
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white ring-2 ring-orange-300 ring-offset-2' 
                  : ''
              }`}
            >
              <Eraser className="mr-2" />
              ลบลูกศร
            </Button>
            <Button 
              onClick={clearBoard} 
              variant="destructive"
              className="rounded-full shadow-md hover:scale-105 transition-transform"
            >
              <Trash2 className="mr-2" />
              {t.clearBoard}
            </Button>
        </div>

        <div
          ref={boardRef}
          className="w-full h-96 bg-red-100 relative border-4 border-indigo-300 rounded-3xl shadow-lg overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            if (selectedTool === 'move') {
              const draggedPlayer = players.find(p => p.isDragging);
              if (draggedPlayer) {
                const newPlayers = players.map(p => ({ ...p, isDragging: false }));
                setPlayers(newPlayers);
                addToHistory({ arrows, players: newPlayers });
              }
            }
          }}
        >
          {/* สนามบาสเกตบอล */}
          <svg width="100%" height="100%" className="absolute top-0 left-0">
            {/* พื้นสนาม */}
            <rect x="0" y="0" width="100%" height="100%" fill="#FFB6C1" opacity="0.3"/>
            
            {/* เส้นขอบสนาม */}
            <rect x="5%" y="5%" width="90%" height="90%" 
                  fill="none" stroke="white" strokeWidth="3"/>
            
            {/* เส้นกลางสนาม */}
            <line x1="50%" y1="5%" x2="50%" y2="95%" 
                  stroke="white" strokeWidth="3"/>
            
            {/* วงกลมกลางสนาม */}
            <circle cx="50%" cy="50%" r="60" 
                    fill="none" stroke="white" strokeWidth="3"/>
            
            {/* ฝั่งซ้าย */}
            {/* เขตโทษฝั่งซ้าย */}
            <rect x="5%" y="30%" width="15%" height="40%" 
                  fill="none" stroke="white" strokeWidth="3"/>
            <path d="M 20% 30% C 25% 30%, 25% 70%, 20% 70%"
                  fill="none" stroke="white" strokeWidth="3"/>
            
            {/* ฝั่งขวา */}
            {/* เขตโทษฝั่งขวา */}
            <rect x="80%" y="30%" width="15%" height="40%" 
                  fill="none" stroke="white" strokeWidth="3"/>
            <path d="M 80% 30% C 75% 30%, 75% 70%, 80% 70%"
                  fill="none" stroke="white" strokeWidth="3"/>

            {/* ลูกศร */}
            {arrows.map((arrow, index) => (
              <g key={index}>
                <path
                  d={smoothPath(arrow.points)}
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  markerEnd="url(#arrowhead)"
                />
              </g>
            ))}
            
            {/* ลูกศรที่กำลังวาด */}
            {isDrawing && currentPath.length > 1 && (
              <path
                d={smoothPath(currentPath)}
                fill="none"
                stroke="#6366F1"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="5,5"
                markerEnd="url(#arrowhead)"
              />
            )}
            
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#6366F1"/>
              </marker>
            </defs>
          </svg>

          {/* ผู้เล่น */}
          {players.map((player) => (
            <div
              key={player.id}
              className={`absolute w-12 h-12 rounded-full border-4 cursor-move flex items-center justify-center text-white font-bold transform hover:scale-110 transition-transform shadow-lg
                         ${player.team === 'red' ? 'bg-gradient-to-r from-pink-500 to-rose-500 border-pink-300' : 'bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-300'}`}
              style={{
                left: player.x - 24,
                top: player.y - 24,
                transition: 'left 0.1s, top 0.1s'
              }}
            >
              {player.id}
            </div>
          ))}
        </div>

        <textarea
          className="w-full mt-6 p-4 border-2 border-indigo-200 rounded-2xl shadow-inner bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all"
          rows="3"
          placeholder={t.notesPlaceholder}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </CardContent>
    </Card>
  );
};

export default BasketballBoard;