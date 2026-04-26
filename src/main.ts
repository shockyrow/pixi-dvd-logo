import "./style.css";
import { Application, Graphics, Particle, ParticleContainer } from "pixi.js";
import Stats from "stats.js";
import { Walker } from "./Walker";
import type { Updatable } from "./interfaces";
import WalkerWorker from "./walker.worker?worker";

const stats = new Stats();
const app = new Application();

async function init() {
  await app.init({
    background: "#1099bb",
    resizeTo: window,
  });

  document.body.appendChild(app.canvas);

  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  const container = new ParticleContainer({
    dynamicProperties: {
      position: true,
      vertices: false,
      rotation: false,
      uvs: false,
      tint: false,
      sclae: false,
    },
  });

  app.stage.addChild(container);

  const walkerVisual = new Graphics().circle(0, 0, 5).fill(0xffffff);
  const walkerTexture = app.renderer.generateTexture(walkerVisual);
  walkerVisual.destroy();

  const updatables: Updatable[] = [];

  const walkerCount = 10000;
  const worker = new WalkerWorker();

  worker.postMessage({
    count: walkerCount,
    bounds: app.screen,
  });

  app.ticker.add(() => {
    stats.begin();

    updatables.forEach((updatable) => updatable.update());

    stats.end();
  });

  worker.onmessage = (e: MessageEvent) => {
    const { type, data } = e.data;

    if (type === "BATCH") {
      data.forEach((datum: { x: number; y: number }) => {
        const visual = new Particle(walkerTexture);
        container.addParticle(visual);

        const walker = new Walker(datum.x, datum.y, app.screen, visual);
        updatables.push(walker);
      });
    }

    if (type === "COMPLETE") {
      worker.terminate();
    }
  };
}

init();
