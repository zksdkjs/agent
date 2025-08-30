/**
 * Event emitter implementation for the SDK
 */

import { EventEmitter as BaseEventEmitter } from 'events';
import { ProviderEvent, EventData } from '../types';

export class EventEmitter {
  private emitter = new BaseEventEmitter();

  on(event: ProviderEvent, callback: (data: EventData) => void): void {
    this.emitter.on(event, callback);
  }

  off(event: ProviderEvent, callback: (data: EventData) => void): void {
    this.emitter.off(event, callback);
  }

  emit(event: ProviderEvent, data: EventData): void {
    this.emitter.emit(event, data);
  }

  removeAllListeners(event?: ProviderEvent): void {
    this.emitter.removeAllListeners(event);
  }

  listenerCount(event: ProviderEvent): number {
    return this.emitter.listenerCount(event);
  }

  eventNames(): ProviderEvent[] {
    return this.emitter.eventNames() as ProviderEvent[];
  }

  setMaxListeners(n: number): void {
    this.emitter.setMaxListeners(n);
  }

  getMaxListeners(): number {
    return this.emitter.getMaxListeners();
  }
}