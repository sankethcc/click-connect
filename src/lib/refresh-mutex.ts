type RefreshState = "idle" | "refreshing" | "failed";

class RefreshMutex {
  private refreshPromise: Promise<unknown> | null = null;
  private state: RefreshState = "idle";
  private broadcastChannel: BroadcastChannel | null = null;

  constructor() {
    try {
      this.broadcastChannel = new BroadcastChannel("token-refresh");
      this.broadcastChannel.onmessage = (event: MessageEvent) => {
        const { type, payload } = event.data;

        if (type === "REFRESH_START") {
          this.state = "refreshing";
        } else if (type === "REFRESH_SUCCESS") {
          // Another tab successfully refreshed, save the new token
          this.state = "idle";
          this.refreshPromise = Promise.resolve(payload.accessToken);
        } else if (type === "REFRESH_FAILED") {
          this.state = "failed";
          this.refreshPromise = Promise.resolve(null);
        }
      };
    } catch {
      console.warn("BroadcastChannel not supported, multi-tab sync disabled");
    }
  }

  /**
   * Acquire lock and execute refresh operation
   * Only one refresh happens at a time; others wait for the result
   */
  async acquire<T>(refreshFn: () => Promise<T>): Promise<T | null> {
    // If already refreshing, return the same promise
    if (this.refreshPromise) {
      try {
        await this.refreshPromise;
      } catch {
        // Ignore errors from previous attempt
      }
    }

    // Prevent race condition: double-check after await
    if (this.refreshPromise && this.state !== "failed") {
      return this.refreshPromise as Promise<T | null>;
    }

    // Acquire the lock
    this.state = "refreshing";
    this.broadcastChannel?.postMessage({ type: "REFRESH_START" });

    this.refreshPromise = (async () => {
      try {
        const result = await refreshFn();
        this.state = "idle";

        // Notify other tabs of success
        if (result) {
          this.broadcastChannel?.postMessage({
            type: "REFRESH_SUCCESS",
            payload: result,
          });
        }

        return result;
      } catch (error) {
        this.state = "failed";
        this.broadcastChannel?.postMessage({
          type: "REFRESH_FAILED",
          payload: { error: String(error) },
        });
        throw error;
      } finally {
        // Release the lock
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise as Promise<T | null>;
  }

  /**
   * Reset mutex state (e.g., on logout)
   */
  reset(): void {
    this.refreshPromise = null;
    this.state = "idle";
  }

  /**
   * Cleanup on unmount or app close
   */
  destroy(): void {
    this.reset();
    this.broadcastChannel?.close();
  }
}

export const refreshMutex = new RefreshMutex();
