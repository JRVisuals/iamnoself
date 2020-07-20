import * as PIXI from 'pixi.js';
import gsap, { Power0 } from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';

import jrvascii from './util/jrvascii';
import { browserVisibility } from './util/browserVisibility';
import { shuffleArray } from './util/shuffleArray';

import initPIXI, { PixiConfig } from './pixi';
import {
  APP_HEIGHT,
  APP_WIDTH,
  LINE_HEIGHT,
  SCROLL_RATE,
  DELAY_BEFORE_FADE,
  TWEET_COUNT,
  STATIC_TWEETS_BACKUP,
} from './constants';
import './index.scss';

import * as COMP from './components';

const hostDiv = document.getElementById('canvas');
const hostWidth = APP_WIDTH;
const hostHeight = APP_WIDTH * (APP_HEIGHT / APP_WIDTH);
const pixiConfig: PixiConfig = {
  width: hostWidth,
  height: hostHeight,
  backgroundColor: 0x000000,
  antialias: false,
  resolution: window.devicePixelRatio || 1,
};
// No anti-alias
// PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

type TwitterData = Array<string>;
interface BootstrapApp {
  app: PIXI.Application;
}

const onAssetsLoaded = (loader, resources): void => {
  //console.log(resources.twitterData.data);
  const reflectionJSON = JSON.parse(resources.twitterData.data);
  //console.log(reflectionJSON);
  // Use static tweets back up (set in constants) if we doin't have any coming in
  const twitterData = reflectionJSON?.tweets || STATIC_TWEETS_BACKUP;
  // Boostrap the app once assets are loaded
  bootstrapApp({ twitterData });
};

const preloader = PIXI.Loader.shared;
// Load realtime tweet data from express server dunning on node port
preloader.add('twitterData', `http://localhost:3003/reflecting`);
preloader.load(onAssetsLoaded);

// preloader.onProgress.add((e, f) =>
//   console.log(`Progress ${Math.floor(e.progress)} (${f.name}.${f.extension})`)
// );

/**
 * Kicks off the application proper by instantiating the various components and wiring up their update methods to the update loop of the main application.
 *
 * @param props - Preloaded assets ({@link TwitterData)}) are passed in via props
 *
 */
const bootstrapApp = (props: { twitterData: TwitterData }): BootstrapApp => {
  // Throw down ye olde ASCII tag
  jrvascii();

  // Instantiate PIXI
  PixiPlugin.registerPIXI(PIXI);
  gsap.registerPlugin(PixiPlugin);
  const { pixiApp, mainContainer } = initPIXI(pixiConfig, hostDiv);
  pixiApp.renderer.autoDensity = true;

  let twitterData = shuffleArray(props.twitterData);

  // Declare component variables in advance when needed
  const contentContainer = mainContainer.addChild(new PIXI.Container());
  let textBlocksContainer = null;

  // Events --------------------------------------------------

  // Handle Browser visibility changes
  const handleBrowserVisibility = (isHidden: boolean): void => {
    if (isHidden) {
      pixiApp.stop();
    } else {
      pixiApp.start();
    }
  };
  browserVisibility(handleBrowserVisibility);

  // I AM NO SELF ---------------------------------------------
  const kickItOff = () => {
    // need to rejigger things so that we can reload the twitter data every now and again
    // preloader.reset() then load again should work - just need to move some things around
    if (textBlocksContainer) textBlocksContainer.destroy({ children: true });
    textBlocksContainer = contentContainer.addChild(new PIXI.Container());
    textBlocksContainer.y = -5;
    // Shuffle for freshness
    twitterData = shuffleArray(props.twitterData);
    // Pad the rear end
    twitterData.push(twitterData[0]);
    twitterData.push(twitterData[1]);
    twitterData.push(twitterData[2]);
    twitterData.push(twitterData[3]);
    twitterData.push(twitterData[4]);
    buildTextBlocks();
  };

  // TextBlock
  const buildTextBlocks = () => {
    let blockX = 0;
    let blockY = 0;
    let offsetX = 0;
    const totalBlocks = twitterData.length;
    let blocksFaded = 0;

    twitterData.forEach((element, index) => {
      const textblock = COMP.textBlock({
        pos: { x: blockX + offsetX, y: blockY },
        textString: element + ' ',
        index,
      });
      const tContainer = textblock.container;
      tContainer.alpha = 0;
      textBlocksContainer.addChild(tContainer);
      // Fade in
      gsap.to(tContainer, 3, {
        delay: 0.1 * index,
        alpha: 1,
        ease: Power0.easeOut,
        onComplete: () => {
          // wait
          setTimeout(() => {
            // then Fade out
            gsap.to(tContainer, 3, {
              delay: 0.1 * index,
              alpha: 0,
              ease: Power0.easeIn,
              onComplete: () => {
                blocksFaded++;
                if (blocksFaded === totalBlocks) {
                  kickItOff();
                }
              },
            });
          }, DELAY_BEFORE_FADE + 100 * index);
        },
      });

      blockX += textblock.container.width;
      if (blockX > APP_WIDTH - offsetX) {
        offsetX = (-1 * blockX) / 2;
        blockX = 0;
        blockY += LINE_HEIGHT;
      }
    });
  };

  kickItOff();

  // Vignette --------------------------------------------------
  const vigTex = PIXI.Texture.from('assets/vignet_4000x100.png');
  // top
  const vigSpriteTop = new PIXI.Sprite(vigTex);
  vigSpriteTop.y = -25;
  // bottom
  const vigSpriteBot = new PIXI.Sprite(vigTex);
  vigSpriteBot.anchor.set(0.5);
  vigSpriteBot.y = APP_HEIGHT - 25;
  vigSpriteBot.rotation = 3.14159;
  // right
  const vigSpriteRight = new PIXI.Sprite(vigTex);
  vigSpriteRight.anchor.set(0.5);
  vigSpriteRight.x = APP_WIDTH - 15;
  vigSpriteRight.rotation = 1.5708;
  // left
  const vigSpriteLeft = new PIXI.Sprite(vigTex);
  vigSpriteLeft.anchor.set(0.5);
  vigSpriteLeft.x = 25;
  vigSpriteLeft.rotation = 4.71239;
  // boom
  mainContainer.addChild(vigSpriteTop);
  mainContainer.addChild(vigSpriteBot);
  mainContainer.addChild(vigSpriteRight);
  mainContainer.addChild(vigSpriteLeft);

  // Register component UPDATE routines
  // ------------------------------------
  pixiApp.ticker.add((delta) => {
    textBlocksContainer.y -= SCROLL_RATE;
    // Update All The Things
    // textblock.update(delta);
  });

  return { app: pixiApp };
};
