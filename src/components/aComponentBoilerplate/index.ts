import * as PIXI from 'pixi.js';

export interface Component {
  container: PIXI.Container;
  reset: () => void;
  update: (delta: number) => void;
}

interface ComponentProps {
  pos?: { x: number; y: number };
}

/**
 * A component boiler plate for use when creating new components
 *
 * @param props - Standard component properties.
 *
 * @returns Interface object containing methods that can be called on this module
 */
export const component = (props: ComponentProps): Component => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  container.name = 'component name';

  let state = {};
  const initialState = { ...state };

  //   const texture = PIXI.Texture.from('./assets/coin.png');
  //   const sprite = new PIXI.Sprite(texture);
  //   sprite.anchor.set(0.5);
  //   container.addChild(sprite);

  // Reset called by play again and also on init
  const reset = (): void => {
    state = { ...initialState };
  };
  reset();

  const update = (delta): void => {
    // Update called by main
  };

  return { container, reset, update };
};
