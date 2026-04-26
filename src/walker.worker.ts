self.onmessage = (e) => {
  const { count, bounds, batchSize = 100 } = e.data;

  for (let i = 0; i < count; i += batchSize) {
    const batch = [];
    const currentBatchLimit = Math.min(batchSize, count - i);

    for (let j = 0; j < currentBatchLimit; j++) {
      batch.push({
        x: Math.random() * bounds.width,
        y: Math.random() * bounds.height,
      });
    }

    self.postMessage({ type: "BATCH", data: batch });
  }

  self.postMessage({ type: "COMPLETE" });
};
