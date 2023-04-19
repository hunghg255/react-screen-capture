import React, { useEffect, useRef, useState } from 'react';
import { Player } from 'bitmovin-player';
//@ts-ignore
import { UIFactory } from 'bitmovin-player/bitmovinplayer-ui';
import 'bitmovin-player/bitmovinplayer-ui.css';

function BitmovinPlayer() {
  const [player, setPlayer] = useState<any>(null);

  const playerConfig = {
    key: 'f943c39d-ca1d-4fcf-958a-6a98d0848d06',
    ui: false,
    cast: {
      enable: true,
    },
  };

  const playerSource = {
    dash: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd',
    hls: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
    poster: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/poster.jpg',
    drm: {
      widevine: {
        LA_URL: 'https://cwip-shaka-proxy.appspot.com/no_auth',
      },
      playready: {
        LA_URL:
          'https://test.playready.microsoft.com/service/rightsmanager.asmx?PlayRight=1&ContentKey=EAtsIJQPd5pFiRUrV9Layw==',
      },
    },
  };
  const playerDiv: any = useRef();

  useEffect(() => {
    function setupPlayer() {
      const playerInstance: any = new Player(playerDiv.current, playerConfig);
      UIFactory.buildDefaultUI(playerInstance);
      playerInstance.load(playerSource).then(
        () => {
          setPlayer(playerInstance);
          console.log('Successfully loaded source');
        },
        () => {
          console.log('Error while loading source');
        },
      );
    }

    setupPlayer();

    return () => {
      function destroyPlayer() {
        if (player != null) {
          player.destroy();
          setPlayer(null);
        }
      }

      destroyPlayer();
    };
  }, []);

  return <div id='player' ref={playerDiv} />;
}

export default BitmovinPlayer;
