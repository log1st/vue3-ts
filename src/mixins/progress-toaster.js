export const progress = {
  methods: {
    /**
     * Отслеживание прогресса загрузки статуса
     * @param promises - массив промисов
     * @param progressCallback - колбек вызываемый после резолва
     * @returns {Promise}
     */
    allProgress (promises, progressCallback) {
      let d = 0;
      progressCallback(0);
      for (const p of promises) {
        p.then(() => {
          d++;
          progressCallback((d * 100) / promises.length)
        })
      }
      return Promise.all(promises)
    },
  }
}
