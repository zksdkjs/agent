// Event system for Privacy SDK

import { ProviderEvent, EventCallback, EventData } from '../types';

/**
 * Simple event emitter implementation for privacy providers
 */
export class EventEmitter {
  private listeners: Map<ProviderEvent, Set<EventCallback>> = new Map();

  /**
   * Add an event listener
   */
  on(event: ProviderEvent, callback: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  /**
   * Remove an event listener
   */
  off(event: ProviderEvent, callback: EventCallback): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  /**
   * Add a one-time event listener
   */
  once(event: ProviderEvent, callback: EventCallback): void {
    const onceCallback: EventCallback = (data: EventData) => {
      this.off(event, onceCallback);
      callback(data);
    };
    this.on(event, onceCallback);
  }

  /**
   * Emit an event to all listeners
   */
  emit(event: ProviderEvent, data: EventData): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          // Log error but don't stop other listeners
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Remove all listeners for a specific event
   */
  removeAllListeners(event?: ProviderEvent): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Get all event names that have listeners
   */
  eventNames(): ProviderEvent[] {
    return Array.from(this.listeners.keys());
  }

  /**
   * Get the number of listeners for an event
   */
  listenerCount(event: ProviderEvent): number {
    const eventListeners = this.listeners.get(event);
    return eventListeners ? eventListeners.size : 0;
  }

  /**
   * Get all listeners for an event
   */
  getListeners(event: ProviderEvent): EventCallback[] {
    const eventListeners = this.listeners.get(event);
    return eventListeners ? Array.from(eventListeners) : [];
  }
}
