export const AppState = Object.freeze({
  BOOT: "BOOT",
  EMERGENCE: "EMERGENCE",
  MAP_INTRO: "MAP_INTRO",
  MAP_IDLE: "MAP_IDLE",
  ISLAND_ENTERING: "ISLAND_ENTERING",
  SECTION_OPEN: "SECTION_OPEN",
  ISLAND_EXITING: "ISLAND_EXITING",
});

let currentState = AppState.BOOT;
let animating = false;
const listeners = new Set();

function stateClassName(state) {
  return `state-${state.toLowerCase().replace(/_/g, "-")}`;
}

function canTransition(from, to) {
  switch (from) {
    case AppState.BOOT:
      return to === AppState.EMERGENCE;
    case AppState.EMERGENCE:
      return to === AppState.MAP_INTRO;
    case AppState.MAP_INTRO:
      return to === AppState.MAP_IDLE;
    case AppState.MAP_IDLE:
      return to === AppState.ISLAND_ENTERING;
    case AppState.ISLAND_ENTERING:
      return to === AppState.SECTION_OPEN;
    case AppState.SECTION_OPEN:
      return to === AppState.ISLAND_EXITING;
    case AppState.ISLAND_EXITING:
      return to === AppState.MAP_IDLE;
    default:
      return false;
  }
}

export function initState() {
  const body = document.body;
  body.classList.add(stateClassName(currentState));
}

export function getState() {
  return currentState;
}

export function isAnimating() {
  return animating;
}

export function setAnimating(next) {
  animating = Boolean(next);
  const body = document.body;
  body.classList.toggle("is-animating", animating);
}

export function transitionTo(nextState, { force = false } = {}) {
  if (!Object.values(AppState).includes(nextState)) {
    console.warn(`Unknown state: ${nextState}`);
    return false;
  }

  if (!force && !canTransition(currentState, nextState)) {
    console.warn(`Invalid state transition: ${currentState} -> ${nextState}`);
    return false;
  }

  const prevState = currentState;
  if (prevState === nextState) return true;

  currentState = nextState;

  const body = document.body;
  body.classList.remove(stateClassName(prevState));
  body.classList.add(stateClassName(currentState));

  for (const listener of listeners) {
    try {
      listener(currentState, prevState);
    } catch (err) {
      console.error("State listener error", err);
    }
  }

  return true;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

