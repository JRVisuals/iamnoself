import * as PIXI from 'pixi.js';
import { LINE_HEIGHT, FONT_SIZE } from '../../constants';
export interface TextBlock {
  container: PIXI.Container;
  reset: () => void;

  update: (delta: number) => void;
}

interface Props {
  pos?: { x: number; y: number };
  textString: string;
  index?: number;
}

/**
 * Text Block
 *
 * @param props - Standard component properties. **Plus** A reference to the Hero instance.
 *
 * @returns Interface object containing methods that can be called on this module
 */
export const textBlock = (props: Props): TextBlock => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const { textString } = props;
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  container.name = 'text block';

  let state = { currentTime: 0 };

  const initialState = { ...state };

  // Text
  const textStyle = new PIXI.TextStyle({
    fontFamily: 'Lato, Impact, Charcoal, sans-serif',
    fontSize: FONT_SIZE,
    fontWeight: '900',
    fill: ['#ccc'],
    //fillGradientType: 1,
    //fillGradientStops: [0.35],
    dropShadow: false,
    dropShadowColor: '#000000',
    dropShadowBlur: 10,
    dropShadowDistance: 5,
    align: 'left',
  });

  const text = new PIXI.Text(textString, textStyle);
  text.anchor.set(0, 0);

  container.addChild(text);

  // Reset called by play again and also on init
  const reset = (): void => {
    state = { ...initialState };
  };
  reset();

  let lastUpdateTime = Date.now();

  const update = (delta): void => {
    // Update called by main

    if (Date.now() > lastUpdateTime + 10) {
      state.currentTime += 0.01;

      lastUpdateTime = Date.now();
    }
  };

  return { container, reset, update };
};
