import { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    const videoElem: any = document.getElementById('video');
    const startElem: any = document.getElementById('start');
    const stopElem: any = document.getElementById('stop');
    const downloadButton: any = document.getElementById('downloadButton');
    // const recording: any = document.getElementById('recording');

    const displayMediaOptions: any = {
      video: {
        displaySurface: 'window',
      },
      audio: true,
    };

    let recorder: any;
    let stopped: any;
    let data: any = [];

    function startRecording(stream: any) {
      recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event: any) => data.push(event.data);
      recorder.start();

      stopped = new Promise((resolve, reject) => {
        recorder.onstop = resolve;
        recorder.onerror = (event: any) => reject(event.name);
      });
    }

    async function startCapture() {
      try {
        downloadButton.classList.remove('active');

        // videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        // dumpOptionsInfo();

        navigator.mediaDevices
          // .getUserMedia({
          //   video: true,
          //   audio: true,
          // })
          .getDisplayMedia(displayMediaOptions)
          .then((stream) => {
            videoElem.srcObject = stream;
            downloadButton.href = stream;
            videoElem.captureStream = videoElem.captureStream || videoElem.mozCaptureStream;
            return new Promise((resolve) => (videoElem.onplaying = resolve));
          })
          .then(() => startRecording(videoElem.captureStream()));
      } catch (err) {
        console.error(err);
      }
    }

    async function stopCapture() {
      const recordedChunks = await Promise.all([stopped, recorder.stop()]).then(() => data);

      let recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
      downloadButton.href = URL.createObjectURL(recordedBlob);
      downloadButton.download = 'RecordedVideo.webm';
      downloadButton.classList.add('active');

      const tracks = videoElem.srcObject.getTracks();

      tracks.forEach((track: any) => track.stop());
      videoElem.srcObject = null;
    }

    // Set event listeners for the start and stop buttons
    startElem.addEventListener('click', startCapture, false);
    stopElem.addEventListener('click', stopCapture, false);

    return () => {
      startElem.removeEventListener('click', startCapture, false);
      stopElem.removeEventListener('click', startCapture, false);
    };
  }, []);

  return (
    <div className='App'>
      <p>
        <button id='start'>Start Capture</button>&nbsp;<button id='stop'>Stop Capture</button>
      </p>

      <video id='video' autoPlay></video>
      <br />

      {/* <video id='recording' width='160' height='120'></video> */}

      <a id='downloadButton'> Download </a>
    </div>
  );
}

export default App;
