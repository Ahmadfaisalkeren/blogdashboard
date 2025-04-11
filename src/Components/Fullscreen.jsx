import { useState, useEffect } from "react";

const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;
      setIsFullscreen(!!isCurrentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.() ||
        document.documentElement.webkitRequestFullscreen?.() ||
        document.documentElement.mozRequestFullScreen?.() ||
        document.documentElement.msRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() ||
        document.webkitExitFullscreen?.() ||
        document.mozCancelFullScreen?.() ||
        document.msExitFullscreen?.();
    }
  };

  return { isFullscreen, toggleFullscreen };
};

export default useFullscreen;
