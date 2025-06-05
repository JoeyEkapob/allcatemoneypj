// utils/loadingHelper.ts
export async function withMinimumLoading<T>(
  task: () => Promise<T>,
  showLoading: () => void,
  hideLoading: () => void,
  minTime = 1000 // default 1 วินาที
): Promise<T> {
  const start = Date.now();
  showLoading();

  try {
    const result = await task();
    return result;
  } finally {
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, minTime - elapsed);

    setTimeout(() => {
      hideLoading();
    }, remaining);
  }
}
