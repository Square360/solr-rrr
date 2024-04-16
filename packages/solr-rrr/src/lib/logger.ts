
const logger = (...args: any[]) => {
  if (import.meta.env.VITE_PRINT_DEBUG) {
    console.log(args);
  }
}

export default logger;