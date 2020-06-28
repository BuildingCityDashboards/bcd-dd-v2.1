
/**
 * Get the colour for a particular Local Authority
 *
 *
 * @param { string } la  can be the name or initials
 * @return { string }
 *
 *
 */
const getColourForLA = (la) => {
  // Allows color get by name when data order is not guaranteed
  const CHART_COLORS_BY_LA = {
    // --la-colour-dcc: #5680b4;
    'Dublin City': '#5680b4',
    // --la-colour-dlr: #52be7f;
    'Dún Laoghaire-Rathdown': '#52be7f',
    // --la-colour-f: #af7ac4;
    'Fingal': '#af7ac4',
    // --la-colour-sdc: #fa9b57;
    'South Dublin': '#fa9b57',
    // --la-colour-dcc: #5680b4;
    'dcc': '#5680b4',
    // --la-colour-dlr: #52be7f;
    'dlr': '#52be7f',
    // --la-colour-f: #af7ac4;
    'f': '#af7ac4',
    // --la-colour-sdc: #fa9b57;
    'sdcc': '#fa9b57',
    'Dublin': '#5680b4',
    'State': 'grey'
  }

  return CHART_COLORS_BY_LA[la] || 'grey'
}

export { getColourForLA }
