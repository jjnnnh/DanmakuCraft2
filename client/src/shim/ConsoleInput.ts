import * as _ from 'lodash';
import { Channel255 } from '../data/channel';
import { Color, fromRgbNumbers } from '../data/color';
import { Buff } from '../data/entity';
import { ConsoleDisplayLevel, ViewName } from '../state';
import { Store } from './redux';

class ConsoleInput {
  constructor(private readonly store: Store) {}

  get chest() {
    const lootType = _.sample(['none', 'chromatic', 'hasty'] as const) || 'none';
    this.wantChest(lootType);

    return lootType;
  }

  set chest(lootType: Buff['type']) {
    this.wantChest(lootType);
  }

  get comment() {
    this.addComment(testText);
    return testText;
  }

  set comment(text: string) {
    this.addComment(text);
  }

  get chromaticComment() {
    this.addChromaticComment(testText);
    return testText;
  }

  set chromaticComment(text: string) {
    this.addChromaticComment(text);
  }

  get say() {
    const text = '测试 Test 123';
    this.pushNotification(text);

    return text;
  }

  get view() {
    this.store.dispatch({ type: '[ConsoleInput] view switched' });
    return this.store.getState().view;
  }

  set view(viewName: ViewName) {
    this.store.dispatch({ type: '[ConsoleInput] view set', viewName });
  }

  get fly() {
    const nextState = !this.store.getState().player.fly;
    this.store.dispatch({ type: '[ConsoleInput] player flying toggled', state: nextState });

    return nextState;
  }

  get info() {
    const level = switchDisplayLevel(this.store.getState().consoleDisplayLevel);
    this.store.dispatch({ type: '[ConsoleInput] display level set', level });

    return level;
  }

  private wantChest(lootType: Buff['type']) {
    this.store.dispatch({
      type: '[ConsoleInput] chest wanted',
      position: this.store.getState().cameraPosition,
      lootType,
    });
  }

  private addChromaticComment(text: string) {
    this.store.dispatch({
      type: '[ConsoleInput] chromatic comment wanted',
      position: this.store.getState().player.position,
      text,
    });
  }

  private addComment(text: string) {
    this.store.dispatch({
      type: '[ConsoleInput] comment wanted',
      position: this.store.getState().player.position,
      text,
      color: randomDevColor(),
    });
  }

  private pushNotification(text: string) {
    this.store.dispatch({
      type: '[ConsoleInput] notification pushed',
      text,
    });
  }
}

function randomDevColor(): Color {
  return fromRgbNumbers(randomDevColorChannel(), randomDevColorChannel(), randomDevColorChannel());
}

function randomDevColorChannel(): Channel255 {
  return Math.sqrt(Math.random() * 180 ** 2 + 64 ** 2);
}

const testText = '测试弹幕';

function switchDisplayLevel(level: ConsoleDisplayLevel): ConsoleDisplayLevel {
  switch (level) {
    case 'none':
      return 'info';
    case 'info':
      return 'none';
  }
}

export default ConsoleInput;
