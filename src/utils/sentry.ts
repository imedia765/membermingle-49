import * as Sentry from "@sentry/react";

export const initSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: "https://dff484f8528f7e04247882609d9b8764@o4508490249601024.ingest.de.sentry.io/4508490266968144",
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of transactions in development
      tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
      
      // Session Replay
      replaysSessionSampleRate: 1.0, // Record 100% of sessions in development
      replaysOnErrorSampleRate: 1.0, // Record 100% of sessions with errors
      
      // Additional Configuration
      debug: true, // Enable debug mode to see what Sentry is doing
      environment: import.meta.env.MODE,
      
      beforeSend(event) {
        // Add additional context to all events
        event.tags = {
          ...event.tags,
          environment: import.meta.env.MODE,
          version: import.meta.env.VITE_APP_VERSION || 'development'
        };
        console.log('Sending event to Sentry:', event);
        return event;
      },
    });

    // Log successful initialization
    console.log('Sentry initialized successfully');
  } else {
    console.log('Sentry initialization skipped in development mode');
  }
};