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
    dash: 'https://cdn.bitmovin.com/content/assets/art-of-motion_drm/mpds/11331.mpd',
    hls: 'https://cdn.bitmovin.com/content/assets/art-of-motion_drm/m3u8s/11331.m3u8',
    smooth:
      'https://test.playready.microsoft.com/smoothstreaming/SSWSS720H264/SuperSpeedway_720.ism/manifest',
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
