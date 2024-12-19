import * as Sentry from "@sentry/react";

export const initSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: "https://dff484f8528f7e04247882609d9b8764@o4508490249601024.ingest.de.sentry.io/4508490266968144",
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      // Enable tracing
      tracesSampleRate: 1.0,
      tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
      // Session Replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      // Additional configuration
      beforeSend(event) {
        // Add additional context to all events
        event.tags = {
          ...event.tags,
          environment: import.meta.env.MODE
        };
        return event;
      },
      debug: import.meta.env.DEV, // Enable debug in development
    });
  }
};