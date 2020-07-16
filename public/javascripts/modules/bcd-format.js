
/**
 * Get the short version of a string for labels etc
 *
 *
 * @param { string } la  can be the name or initials
 * @return { string }
 *
 *
 */
const getShortLabel = function (s) {
  // Allows color get by name when data order is not guaranteed
  const SHORTS = {
    // --la-colour-dcc: #5680b4;
    'Dublin City': 'dcc',
    'Dún Laoghaire-Rathdown': 'dlr',
    'Fingal': 'f',
    'South Dublin': 'sdcc'
  }

  return SHORTS[s] || s
}

export { getShortLabel }
