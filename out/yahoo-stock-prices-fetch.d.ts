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
export declare const getHistoricalPrices: (startMonth: number, startDay: number, startYear: number, endMonth: number, endDay: number, endYear: number, ticker: string, frequency: "1d" | "1wk" | "1mo", callback: Function, cors?: "no-cors" | "cors" | "navigate" | "same-origin" | undefined) => Promise<unknown> | undefined;
/**
 * @param {string} ticker
 *
 * @return {Promise<{price: number, currency: string}>}
 */
export declare const getCurrentData: (ticker: string, cors?: "no-cors" | "cors" | "navigate" | "same-origin" | undefined) => Promise<unknown>;
/**
 * @param {string} ticker
 * @param {Function} [callback]
 *
 * @return {Promise<number>|undefined} Returns a promise if no callback was supplied.
 */
export declare const getCurrentPrice: (ticker: string, callback: Function, cors?: "no-cors" | "cors" | "navigate" | "same-origin" | undefined) => Promise<any> | undefined;
