const fetchJsonFromUrlAsync = async (url) => {
  console.log('fetch w/o timeout')
  const res = await fetch(url)
  const json = await res.json()
  return json
}

export { fetchJsonFromUrlAsync }

const fetchJsonFromUrlAsyncTimeout = async (url) => {
  let res = await Promise.race([fetch(url), new Promise((resolve, reject) =>
      setTimeout(() => reject(new Error(`Timeout waiting for ${url} to respond`)), 10000)
    )])
  const json = await res.json()
  return json
}

export { fetchJsonFromUrlAsyncTimeout }

const forEachAsync = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index])
  }
}
export { forEachAsync }
