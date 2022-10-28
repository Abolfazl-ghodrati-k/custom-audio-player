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
    // console.log(audioPlayer?.current?.loadedmetadata);
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
    // console.log(progressBar.current.value);
    progressBar.current.value = audioPlayer.current.currentTime;
    // console.log(audioPlayer.current.currentTime);

    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
    if (audioPlayer.current.currentTime == audioPlayer.current.duration) {
      progressBar.current.value = 0
      setIsPlaying(false);
      progressBar.current.style.setProperty("--seek-before-width", `${0}px`);
      audioPlayer.current.currentTime = 0;
      setCurrentTime(t => t = 0)
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
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
    progressBar.current.value = Number(+progressBar.current.value - 30);
    changeRange();
  };

  const forwardThirty = () => {
    progressBar.current.value = Number(+progressBar.current.value + 30);
    if (+audioPlayer.current.duration - +audioPlayer.current.currentTime < 30) {
      progressBar.current.value = 0
      setIsPlaying(false);
      progressBar.current.style.setProperty("--seek-before-width", `${0}px`);
      audioPlayer.current.currentTime = 0;
      setCurrentTime(t => t = 0)
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    } else {
      changeRange();
    }
  };

  return (
    <div className={styles.audioPlayer}>
      <audio
        ref={audioPlayer}
        src="https://dl.dropbox.com/s/tal1ums8maoddw3/%C3%B3lafur%20arnalds%20%26%20shajarian%20mash.mp3"
        className="dropbox-embed"
        preload="metadata"
      ></audio>
      <div className={styles.cover}></div>
      <div className={styles.title}>
        <p>Title of music</p>
        {isPlaying && (
          <div className="now playing" ref={music}>
            <span className="bar n1">A</span>
            <span className="bar n2">B</span>
            <span className="bar n3">c</span>
            <span className="bar n4">D</span>
            <span className="bar n5">E</span>
            <span className="bar n6">F</span>
            <span className="bar n7">G</span>
            <span className="bar n8">H</span>
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
