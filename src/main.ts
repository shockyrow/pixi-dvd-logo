import "./style.css";
import dvdLogo from "./assets/dvd-logo.svg";
import { Application, Assets, Sprite } from "pixi.js";
import { Logo } from "./Logo";
import type { Updatable } from "./interfaces";
import { Pane } from "tweakpane";

const updatables: Updatable[] = [];
const app = new Application();

const visual = new Sprite(await Assets.load(dvdLogo));
visual.scale.set(0.5);
visual.tint = "gold";
visual.eventMode = "dynamic";

let logo: Logo | null = null;
let lastX = 0;
let lastY = 0;

visual.on("pointerdown", () => {
  if (logo) logo.startDragging();
});

const pointerUpHandler = () => {
  if (logo) logo.stopDragging();
};

visual.on("pointerup", pointerUpHandler);
visual.on("pointerupoutside", pointerUpHandler);

visual.on("globalpointermove", (e) => {
  if (logo && logo.isDragging())
    logo.moveBy(e.clientX - lastX, e.clientY - lastY);

  lastX = e.clientX;
  lastY = e.clientY;
});

const params = {
  background: "#161616",
  tint: "#ff0",
  stepSize: 2,
};

function setupUI() {
  const controlsPane = new Pane({ title: "Simulation controls" });

  controlsPane
    .addBinding(params, "background", {
      label: "Background",
    })
    .on("change", (e) => {
      app.renderer.background.color = e.value;
    });

  controlsPane
    .addBinding(params, "tint", {
      label: "Tint",
    })
    .on("change", (e) => {
      visual.tint = e.value;
    });

  controlsPane
    .addBinding(params, "stepSize", {
      label: "Step Size",
      min: 0.1,
      max: 10,
    })
    .on("change", (e) => {
      if (logo) logo.setStepSize(e.value);
    });
}

async function init() {
  await app.init({
    background: "#161616",
    resizeTo: window,
  });

  document.body.appendChild(app.canvas);

  setupUI();

  app.stage.addChild(visual);

  logo = new Logo(
    Math.random() * (app.screen.width - visual.width),
    Math.random() * (app.screen.height - visual.height),
    visual.width,
    visual.height,
    app.screen,
    visual,
  );
  updatables.push(logo);

  app.ticker.add(() => {
    updatables.forEach((updatable) => updatable.update());
  });
}

init();
