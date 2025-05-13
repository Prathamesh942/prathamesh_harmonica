import React, { useState, useRef, useEffect } from "react";
import "./App.css";

const musics = [
  { name: "Annie's song", path: "/assets/annie's song.mp3" },
  { name: "Blowin in the wind", path: "/assets/bitw.mp3" },
  { name: "Fly me to the moon", path: "/assets/fmttm.mp3" },
  { name: "Can't help falling in love", path: "/assets/ichfilwy.mp3" },
  { name: "Imagine", path: "/assets/imagine&guitar.mp3" },
  { name: "Kal ho na ho", path: "/assets/khnh.mp3" },
  { name: "DDLJ", path: "/assets/ddlj2.m4a" },
  { name: "Country roads", path: "/assets/take me home.mp3" },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    audio.addEventListener("timeupdate", updateProgress);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [currentTrackIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) audio.pause();
    else audio.play();
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    const value = e.target.value;
    audio.currentTime = (value / 100) * audio.duration;
    setProgress(value);
  };

  const changeTrack = (index) => {
    setCurrentTrackIndex(index);
    setProgress(0);
    setIsPlaying(false);
    setTimeout(() => {
      audioRef.current.play();
      setIsPlaying(true);
    }, 100);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60) || 0;
    const seconds = Math.floor(time % 60) || 0;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Songs List with background image */}
        <div className="relative rounded-md overflow-hidden">
          {/* Background Image with reduced opacity */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage:
                "url('https://i.pinimg.com/736x/88/11/14/8811148dbf05cf71a4eb61e11fa9cec2.jpg')",
            }}
          ></div>

          {/* List overlay with a transparent black background */}
          <ul className="relative z-10 space-y-1 p-2 bg-black/40 rounded-md">
            {musics.map((track, index) => (
              <li
                key={index}
                onClick={() => changeTrack(index)}
                className={`cursor-pointer px-3 py-2 rounded-md transition ${
                  index === currentTrackIndex
                    ? " font-bold text-[#218cff]"
                    : "hover:bg-zinc-800"
                }`}
              >
                {track.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Player Controls */}
        <div className="bg-zinc-800 rounded p-4 shadow-md">
          <audio ref={audioRef} src={musics[currentTrackIndex].path} />
          <div className="flex justify-between items-center mb-3 text-sm">
            <span className="opacity-90">{musics[currentTrackIndex].name}</span>
            <button
              onClick={togglePlay}
              className="bg-zinc-200 text-zinc-900 px-3 py-1 rounded text-xs font-semibold hover:bg-zinc-300"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1 rounded-lg bg-zinc-600 accent-zinc-100 cursor-pointer"
          />
          <div className="flex justify-between text-xs opacity-70 mt-1">
            <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
            <span>{formatTime(audioRef.current?.duration || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
