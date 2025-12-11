import React, { useEffect, useRef, useState } from "react";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Upload,
    MoreVertical,
    Repeat,
} from "lucide-react";

// Single-file React component (copy/paste into a .jsx/.tsx file)
export default function MusicPlayer() {
    const audioRef = useRef(null);
    const [tracks, setTracks] = useState([]); // { id, title, url, date, duration (seconds) }
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isLoop, setIsLoop] = useState(false);
    const [autoNext, setAutoNext] = useState(false);
    // keep up-to-date refs so audio event handlers never use stale values
    const isLoopRef = useRef(isLoop);
    const autoNextRef = useRef(autoNext);
    const tracksRef = useRef(tracks);
    const currentTrackRef = useRef(currentTrack);
    // keep track of created object URLs so we can revoke them on unmount
    const createdUrlsRef = useRef([]);

    // Initialize audio element once
    useEffect(() => {
        const audio = new Audio();
        audioRef.current = audio;

        const onTimeUpdate = () => setProgress(audio.currentTime || 0);
        const onLoadedMeta = () => {
            setDuration(audio.duration || 0);
        };
        const onEnded = () => {
            // if repeat enabled, restart the same track
            if (isLoopRef.current) {
                const audio = audioRef.current;
                audio.currentTime = 0;
                audio.play().catch(() => { }); // swallow autoplay promise rejection
                setIsPlaying(true);
                return;
            }

            // autoplay next
            if (autoNextRef.current && tracksRef.current.length && currentTrackRef.current) {
                const currentIndex = tracksRef.current.findIndex(t => t.id === currentTrackRef.current.id);
                const next = tracksRef.current[currentIndex + 1];
                if (next) {
                    // set next track and attempt to play
                    setCurrentTrack(next);

                    // give React a tick to update src, then ask audio to play
                    setTimeout(() => {
                        try {
                            audioRef.current.play();
                            setIsPlaying(true);
                        } catch (e) {
                            setIsPlaying(false);
                        }
                    }, 50);

                    return;
                }
            }

            // nothing else — stop playing
            setIsPlaying(false);
        };

        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("loadedmetadata", onLoadedMeta);
        audio.addEventListener("ended", onEnded);

        return () => {
            audio.pause();
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("loadedmetadata", onLoadedMeta);
            audio.removeEventListener("ended", onEnded);
            audioRef.current = null;

            // revoke created object URLs
            createdUrlsRef.current.forEach((u) => {
                try {
                    URL.revokeObjectURL(u);
                } catch (e) { }
            });
            createdUrlsRef.current = [];
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // keep `duration` and `progress` in sync when currentTrack changes
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (currentTrack) {
            // if the audio element already has the same src and isPlaying we don't need to reset
            if (audio.src !== currentTrack.url) {
                audio.src = currentTrack.url;
            }

            // if track already playing in state, play the new src
            audio.play().catch(() => {
                /* autoplay might be blocked; user can click play */
            });
            setIsPlaying(!audio.paused);
        } else {
            audio.pause();
            setIsPlaying(false);
            setProgress(0);
            setDuration(0);
        }
    }, [currentTrack]);

    // Toggle play/pause for current track
    const togglePlayPause = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (!currentTrack) return; // nothing to play

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            try {
                await audio.play();
                setIsPlaying(true);
            } catch (e) {
                // autoplay blocked — user interaction required
                setIsPlaying(false);
            }
        }
    };

    // Play a specific track (from list or from table)
    const playTrack = (track) => {
        if (!track) return;

        // if already current track, toggle play/pause
        if (currentTrack?.id === track.id) {
            togglePlayPause();
            return;
        }

        setCurrentTrack(track);
        // audio src and play are handled in the effect that watches currentTrack
    };
    useEffect(() => { isLoopRef.current = isLoop; }, [isLoop]);
    useEffect(() => { autoNextRef.current = autoNext; }, [autoNext]);
    useEffect(() => { tracksRef.current = tracks; }, [tracks]);
    useEffect(() => { currentTrackRef.current = currentTrack; }, [currentTrack]);
    useEffect(() => {
        if (audioRef.current) audioRef.current.loop = isLoop;
    }, [isLoop]);
    const handleSeek = (e) => {
        const val = Number(e.target.value);
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = val;
        setProgress(val);
    };

    // Upload file and read duration
    const handleUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        createdUrlsRef.current.push(url);

        // create a temporary audio element to read duration metadata
        const temp = new Audio(url);
        temp.addEventListener("loadedmetadata", () => {
            const newTrack = {
                id: Date.now() + Math.random(),
                title: file.name,
                url,
                date: new Date().toLocaleString(),
                duration: Math.round(temp.duration || 0),
            };
            setTracks((prev) => [...prev, newTrack]);
            temp.remove();
        });

        // if metadata fails to load in a reasonable time, still add track with unknown duration
        setTimeout(() => {
            if (!tracks.find((t) => t.url === url)) {
                setTracks((prev) => [
                    ...prev,
                    {
                        id: Date.now() + Math.random(),
                        title: file.name,
                        url,
                        date: new Date().toLocaleString(),
                        duration: 0,
                    },
                ]);
            }
        }, 1500);

        // reset input
        e.currentTarget.value = null;
    };

    const formatTime = (time) => {
        if (!time && time !== 0) return "0:00";
        const min = Math.floor(time / 60 || 0);
        const sec = Math.floor(time % 60 || 0);
        return `${min}:${sec.toString().padStart(2, "0")}`;
    };

    const handleSkipForward = () => {
        if (!currentTrack) return;
        const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
        const next = tracks[currentIndex + 1];
        if (next) playTrack(next);
    };

    const handleSkipBack = () => {
        if (!currentTrack) return;
        const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
        const prev = tracks[currentIndex - 1];
        if (prev) playTrack(prev);
    };

    // Table select all
    const toggleSelectAll = (checked) => {
        setSelectedIds(checked ? tracks.map((t) => t.id) : []);
    };

    // Row click handler: play track
    const onRowClick = (track) => {
        playTrack(track);
    };

    return (
        <div className="flex gap-6 p-6 bg-[#F7F8FA] min-h-screen">
            {/* LEFT */}
            <div className="flex-1">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Samba Music</h2>

                    <label className="cursor-pointer bg-[#237FEA] text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <Upload size={16} />
                        Upload Music
                        <input type="file" accept="audio/*" hidden onChange={handleUpload} />
                    </label>
                </div>

                <div className="bg-white rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-600">
                               <tr className="bg-[#F5F5F5] border-b border-[#DBDBDB]">
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.length === tracks.length && tracks.length > 0}
                                        onChange={(e) => toggleSelectAll(e.target.checked)}
                                    />
                                    <span className="ml-2">Title</span>
                                </th>
                                <th className="text-left">Duration</th>
                                <th className="text-left">Date</th>
                                <th className="px-3 text-left">Play</th>
                                <th className="text-left"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {tracks.map((track) => (
                              
                                <tr
                                    key={track.id}
                                    className={`border-b bg-white border-[#EFEEF2]  cursor-pointer ${currentTrack?.id === track.id ? "bg-gray-50" : ""}`}
                                    onClick={() => onRowClick(track)}
                                >
                                    <td className="px-4 py-3">
                                        <input
                                            onClick={(e) => e.stopPropagation()}
                                            type="checkbox"
                                            checked={selectedIds.includes(track.id)}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setSelectedIds((prev) => (checked ? [...prev, track.id] : prev.filter((id) => id !== track.id)));
                                            }}
                                        />
                                        <span className="ml-2">{track.title}</span>
                                    </td>
                                    <td>{track.duration ? formatTime(track.duration) : "—"}</td>
                                    <td>{track.date}</td>
                                    <td>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                playTrack(track);
                                            }}
                                            className="p-2 rounded-full "
                                        >
                                            {currentTrack?.id === track.id && isPlaying ? <img src="/images/pausegray.png"  className="w-8" alt="" /> :<img src="/images/playgray.png" className="w-8"  alt="" />}
                                        </button>
                                    </td>
                                    <td>
                                        <MoreVertical size={16} className="text-gray-500" />
                                    </td>
                                </tr>
                            ))}

                            {tracks.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center text-gray-400">
                                        No music uploaded
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* RIGHT PLAYER */}
            <div className="w-[320px] bg-[#2F3640] rounded-2xl text-white p-6 flex flex-col">
                <h4 className="text-center mb-4 text-xl text-white">Now Playing</h4>

                <div className="w-full h-[180px] bg-gray-700 rounded-xl mb-4 flex items-center justify-center">
                    <span className="text-gray-400">Cover</span>
                </div>

                <h3 className="text-center text-base  font-semibold">{currentTrack?.title || "No Track"}</h3>
                <p className="text-center text-sm text-gray-400">Samba Soccer Schools</p>

                <div className="mt-4">
                    <input
                        type="range"
                        min="0"
                        max={Math.max(duration, currentTrack?.duration || 0)}
                        value={progress}
                        onChange={handleSeek}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>{formatTime(Math.floor(progress))}</span>
                        <span>{formatTime(Math.floor(Math.max(duration, currentTrack?.duration || 0)))}</span>
                    </div>
                </div>

                <div className="flex justify-center items-center gap-6 mt-6">
                    <button
                        onClick={() => {
                            setIsLoop((p) => !p);
                            setTimeout(() => {
                                // also set audio.loop for direct behaviour (not strictly necessary since onEnded handles logic)
                                if (audioRef.current) audioRef.current.loop = !isLoop;
                            }, 0);
                        }}
                        className={isLoop ? "text-blue-400" : "text-[#91939E]"}
                        title="Repeat"
                    >
                        <Repeat />
                    </button>

                    <button onClick={handleSkipBack} title="Previous">
                        <SkipBack />
                    </button>

                    <button className="bg-[#237FEA] p-4 rounded-full" onClick={togglePlayPause} title="Play / Pause">
                        {isPlaying ? <Pause /> : <Play />}
                    </button>

                    <button onClick={handleSkipForward} title="Next">
                        <SkipForward />
                    </button>

                    <button
                        onClick={() => setAutoNext((p) => !p)}
                        className={autoNext ? "text-blue-400 text-2xl" : "text-[#91939E] text-2xl"}
                        title="Auto play next"
                    >
                        ⏭
                    </button>
                </div>
            </div>
        </div>
    );
}
