const getDateShiftedByNDays = n => {
  const d = new Date()
  d.setDate(d.getDate() + parseInt(n)) 
  return d

}

export { getDateShiftedByNDays }
