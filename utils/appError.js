export const appError = (message, statusCdoe) => {
  let error = new Error(message);
  error.statusCdoe = statusCdoe ? statusCdoe : 500;
  error.stack = error.stack;

  return error;
};
