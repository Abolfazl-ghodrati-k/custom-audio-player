import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/AudioPlayer.module.css";
import { BsArrowLeftShort } from "react-icons/bs";
import { BsArrowRightShort } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";

const AudioPlayer = () => {
  // state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // references
  const audioPlayer = useRef(); // reference our audio component
  const progressBar = useRef(); // reference our progress bar
  const animationRef = useRef(); // reference the animation
  const music = useRef(); // reference the playing animation

  useEffect(() => {
    console.log(audioPlayer?.current?.loadedmetadata);
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
    if (audioPlayer.current.currentTime == audioPlayer.current.duration) {
      setIsPlaying(false);
      progressBar.current.style.setProperty("--seek-before-width", `0%`);
      audioPlayer.current.currentTime = 0;
    }
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100 + 15}%`
    );
    setCurrentTime(progressBar.current.value);
  };

  const backThirty = () => {
    progressBar.current.value = Number(progressBar.current.value - 30);
    changeRange();
  };

  const forwardThirty = () => {
    progressBar.current.value = Number(progressBar.current.value + 30);
    changeRange();
  };

  return (
    <div className={styles.audioPlayer}>
      <audio
        ref={audioPlayer}
        src="https://cdn.simplecast.com/audio/cae8b0eb-d9a9-480d-a652-0defcbe047f4/episodes/af52a99b-88c0-4638-b120-d46e142d06d3/audio/500344fb-2e2b-48af-be86-af6ac341a6da/default_tc.mp3"
        preload="metadata"
      ></audio>
      <div className={styles.cover}></div>
      <div className={styles.title}>
        <p>Title of music</p>
        {isPlaying && (
          <div class="now playing" ref={music}>
            <span class="bar n1">A</span>
            <span class="bar n2">B</span>
            <span class="bar n3">c</span>
            <span class="bar n4">D</span>
            <span class="bar n5">E</span>
            <span class="bar n6">F</span>
            <span class="bar n7">G</span>
            <span class="bar n8">H</span>
          </div>
        )}
      </div>
      <div className={styles.controll}>
        <button className={styles.forwardBackward} onClick={backThirty}>
          <BsArrowLeftShort /> 30
        </button>
        <button onClick={togglePlayPause} className={styles.playPause}>
          {isPlaying ? <FaPause /> : <FaPlay className={styles.play} />}
        </button>
        <button className={styles.forwardBackward} onClick={forwardThirty}>
          30 <BsArrowRightShort />
        </button>
      </div>
      <div className={styles.playBar}>
        {/* current time */}
        <div className={styles.currentTime}>{calculateTime(currentTime)}</div>

        {/* progress bar */}
        <div>
          <input
            type="range"
            className={styles.progressBar}
            defaultValue="0"
            ref={progressBar}
            onChange={changeRange}
          />
        </div>

        {/* duration */}
        <div className={styles.duration}>
          {duration && !isNaN(duration) && calculateTime(duration)}
        </div>
      </div>
    </div>
  );
};

export { AudioPlayer };
