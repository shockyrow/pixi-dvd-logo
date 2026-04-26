import "./style.css";
import { Application, Graphics, Particle, ParticleContainer } from "pixi.js";
import Stats from "stats.js";
import { Walker } from "./Walker";
import type { Updatable } from "./interfaces";
import WalkerWorker from "./walker.worker?worker";
import { Pane } from "tweakpane";

const updatables: Updatable[] = [];
const stats = new Stats();
const app = new Application();

let container: ParticleContainer;
let worker: Worker | null = null;

const params = {
  walkerCount: 10000,
  reset: () => resetSimulation(),
};

function resetSimulation() {
  // 1. Cleanup existing state
  if (worker) worker.terminate();
  container.removeParticles();
  updatables.length = 0;

  const walkerVisual = new Graphics().circle(0, 0, 5).fill(0xffffff);
  const walkerTexture = app.renderer.generateTexture(walkerVisual);
  walkerVisual.destroy();

  // 3. Start Worker
  worker = new WalkerWorker();
  worker.postMessage({
    count: params.walkerCount,
    bounds: app.screen,
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

    if (type === "COMPLETE" && worker) {
      worker.terminate();
    }
  };
}

function setupUI() {
  const controlsPane = new Pane({ title: "Simulation controls" });

  controlsPane.addBinding(params, "walkerCount", {
    min: 100,
    max: 100000,
    step: 100,
    label: "Count",
  });

  controlsPane.addButton({ title: "Restart" }).on("click", () => {
    resetSimulation();
  });
}

async function init() {
  await app.init({
    background: "#1099bb",
    resizeTo: window,
  });

  document.body.appendChild(app.canvas);

  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  container = new ParticleContainer({
    dynamicProperties: { position: true },
  });

  app.stage.addChild(container);

  setupUI();
  resetSimulation();

  app.ticker.add(() => {
    stats.begin();

    updatables.forEach((updatable) => updatable.update());

    stats.end();
  });
}

init();
