
const logger = (...args: any[]) => {
  if (process.env.REACT_APP_PRINT_DEBUG || false) {
    console.log(args);
  }
}

export default logger;