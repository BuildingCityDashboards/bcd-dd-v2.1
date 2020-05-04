const fetchJsonFromUrlAsync = async (url) => {
  const res = await fetch(url)
  const json = await res.json()
  return json
}

export { fetchJsonFromUrlAsync }

const forEachAsync = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index])
  }
}
export { forEachAsync }
