/**
 * Get a date shifted n days from today
 *
 * @param {number} n - Number of days to shift from today's date
 * @return {Date} A Date
 *
 * @example
 *
 *     getDateFromToday(-1) //yesterday's date
 */
const getDateFromToday = n => {
  let d = new Date()
  d.setDate(d.getDate() + parseInt(n))
  return d
}

export { getDateFromToday }

/**
 * This is a function.
 *
 * @param {string} n - A string param
 * @return {string} A good string
 *
 * @example
 *
 *     foo('hello')
 */

const formatDate = () =>{


}
