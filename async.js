'use strict';

exports.isStar = true;
exports.runParallel = runParallel;

/** Функция паралелльно запускает указанное число промисов
 * @param {Array} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise}
 */

function runParallel(jobs, parallelNum, timeout = 1000) {
    // асинхронная магия
    return new Promise(resolve => {
        if (jobs === []) {
            resolve([]);
        }

        let jobsDone = 0;
        let results = [];

        function doJob(job, num) {
            let current = result => addResult(result, num);
            Promise.race([
                job(),
                new Promise(reject => setTimeout(reject, timeout, new Error('Promise timeout')))])
                .then(current);
        }

        function addResult(result, num) {
            results[num] = result;

            if (results.length === jobs.length) {
                resolve(results);
            }
            if (jobsDone < jobs.length) {
                doJob(jobs[jobsDone], jobsDone++);
            }
        }

        jobs
            .slice(0, parallelNum)
            .map(job => doJob(job, jobsDone++));
    });
}
