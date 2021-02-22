"use strict";
var baseUrl = "https://finance.yahoo.com/quote/";
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
var getHistoricalPrices = function (startMonth, startDay, startYear, endMonth, endDay, endYear, ticker, frequency, callback, cors) {
    if (cors === void 0) { cors = "no-cors"; }
    var startDate = Math.floor(Date.UTC(startYear, startMonth, startDay, 0, 0, 0) / 1000);
    var endDate = Math.floor(Date.UTC(endYear, endMonth, endDay, 0, 0, 0) / 1000);
    var promise = new Promise(function (resolve, reject) {
        var requestOptions = {
            method: "GET",
            mode: cors
        };
        fetch(baseUrl + ticker + "/history?period1=" + startDate + "&period2=" + endDate + "&interval=" + frequency + "&filter=history&frequency=" + frequency, requestOptions)
            .then(function (response) { return response.text(); })
            .then(function (body) {
            var prices = JSON.parse(body
                .split('HistoricalPriceStore":{"prices":')[1]
                .split(',"isPending')[0]);
            resolve(prices);
        })
            .catch(function (error) {
            console.log("error", error);
            reject(error);
            return;
        });
    });
    // If a callback function was supplied return the result to the callback.
    // Otherwise return a promise.
    if (typeof callback === "function") {
        promise
            .then(function (price) { return callback(null, price); })
            .catch(function (err) { return callback(err); });
    }
    else {
        return promise;
    }
};
/**
 * @param {string} ticker
 *
 * @return {Promise<{price: number, currency: string}>}
 */
var getCurrentData = function (ticker, cors) {
    if (cors === void 0) { cors = "no-cors"; }
    return new Promise(function (resolve, reject) {
        var requestOptions = {
            method: "GET",
            mode: cors
        };
        fetch(baseUrl + ticker + "/", requestOptions)
            .then(function (response) { return response.text(); })
            .then(function (result) {
            console.log(result);
            var priceText = result
                .split("\"" + ticker + "\":{\"sourceInterval\"")[1]
                .split("regularMarketPrice")[1]
                .split('fmt":"')[1]
                .split('"')[0];
            var price = parseFloat(priceText.replace(",", ""));
            var currencyMatch = result.match(/Currency in ([A-Za-z]{3})/);
            var currency = null;
            if (currencyMatch) {
                currency = currencyMatch[1];
            }
            resolve({
                currency: currency,
                price: price
            });
        })
            .catch(function (error) {
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
var getCurrentPrice = function (ticker, callback, cors) {
    if (cors === void 0) { cors = "no-cors"; }
    if (callback) {
        getCurrentData(ticker, cors)
            .then(function (data) { return callback(null, data.price); })
            .catch(function (err) { return callback(err); });
    }
    else {
        return getCurrentData(ticker, cors).then(function (data) { return data.price; });
    }
};
module.exports = {
    getHistoricalPrices: getHistoricalPrices,
    getCurrentData: getCurrentData,
    getCurrentPrice: getCurrentPrice
};
