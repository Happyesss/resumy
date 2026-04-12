export async function register() {
  // Server-side instrumentation for error tracking and stability
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Catch unhandled promise rejections to prevent server crashes
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason)
    })

    // Catch uncaught exceptions - log them and let the process manager handle restart
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error.message, error.stack)
    })
  }
}
