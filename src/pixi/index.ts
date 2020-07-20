import * as PIXI from 'pixi.js';

export interface PixiConfig {
  width: number;
  height: number;
  backgroundColor: number;
  antialias: boolean;
  resolution: number;
}

/**
 * Initializes the PIXI container and adds it to the DOM.
 *
 * @param pixiConfig - PIXI configuration object
 * @param baseElement - DOM element to add PIXI canvas to
 *
 */
const initPIXI = (
  pixiConfig: PixiConfig,
  baseElement: HTMLElement
): { pixiApp: PIXI.Application; mainContainer: PIXI.Container } => {
  const pixiApp = new PIXI.Application(pixiConfig);
  baseElement.appendChild(pixiApp.view);

  const container = new PIXI.Container();
  container.name = 'main';
  pixiApp.stage.addChild(container);

  return { pixiApp, mainContainer: container };
};

export default initPIXI;
