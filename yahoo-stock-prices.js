const baseUrl = "https://finance.yahoo.com/quote/";

/**
 * @param {number} startMonth
 * @param {number} startDay
 * @param {number} startYear
 * @param {number} endMonth
 * @param {number} endDay
 * @param {number} endYear
 * @param {string} ticker
 * @param {('1d','1wk','1mo')} frequency
 * @param {Function} [callback]
 *
 * @return {Promise<{date: number, open: number, high:number, low:number, close:number, volume:number, adjclose:number}[]>|undefined} Returns a promise if no callback was supplied.
 */
const getHistoricalPrices = function (
  startMonth,
  startDay,
  startYear,
  endMonth,
  endDay,
  endYear,
  ticker,
  frequency,
  callback,
  cors = "no-cors"
) {
  const startDate = Math.floor(
    Date.UTC(startYear, startMonth, startDay, 0, 0, 0) / 1000
  );
  const endDate = Math.floor(
    Date.UTC(endYear, endMonth, endDay, 0, 0, 0) / 1000
  );

  const promise = new Promise((resolve, reject) => {
    let requestOptions = {
      method: "GET",
      mode: cors
    };

    fetch(
      `${
        baseUrl + ticker
      }/history?period1=${startDate}&period2=${endDate}&interval=${frequency}&filter=history&frequency=${frequency}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((body) => {
        const prices = JSON.parse(
          body
            .split('HistoricalPriceStore":{"prices":')[1]
            .split(',"isPending')[0]
        );

        resolve(prices);
      })
      .catch((error) => {
        console.log("error", error);
        reject(error);
        return;
      });
  });

  // If a callback function was supplied return the result to the callback.
  // Otherwise return a promise.
  if (typeof callback === "function") {
    promise
      .then((price) => callback(null, price))
      .catch((err) => callback(err));
  } else {
    return promise;
  }
};

/**
 * @param {string} ticker
 *
 * @return {Promise<{price: number, currency: string}>}
 */
const getCurrentData = function (ticker, cors = "no-cors") {
  return new Promise((resolve, reject) => {
    let requestOptions = {
      method: "GET",
      mode: cors
    };

    fetch(`${baseUrl + ticker}/`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        let price = result
          .split(`"${ticker}":{"sourceInterval"`)[1]
          .split("regularMarketPrice")[1]
          .split('fmt":"')[1]
          .split('"')[0];
        price = parseFloat(price.replace(",", ""));
        const currencyMatch = result.match(/Currency in ([A-Za-z]{3})/);
        let currency = null;
        if (currencyMatch) {
          currency = currencyMatch[1];
        }
        resolve({
          currency,
          price
        });
      })
      .catch((error) => {
        console.log("error", error);
        reject(error);
        return;
      });
  });
};

/**
 * @param {string} ticker
 * @param {Function} [callback]
 *
 * @return {Promise<number>|undefined} Returns a promise if no callback was supplied.
 */
const getCurrentPrice = function (ticker, callback, cors = "no-cors") {
  if (callback) {
    getCurrentData(ticker, cors)
      .then((data) => callback(null, data.price))
      .catch((err) => callback(err));
  } else {
    return getCurrentData(ticker, cors).then((data) => data.price);
  }
};

module.exports = {
  getHistoricalPrices,
  getCurrentData,
  getCurrentPrice
};
