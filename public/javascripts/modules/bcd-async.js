const fetchJsonFromUrlAsync = async (url) => {
  const res = await fetch(url)
  const json = await res.json()
  return json
}

export { fetchJsonFromUrlAsync }

const fetchJsonFromUrlAsyncTimeout = async (url) => {
  let res = await Promise.race([fetch(url), new Promise((resolve, reject) =>
      setTimeout(() => reject(new Error(`Timeout waiting for <b>${url.split('://')[1].split('/')[0]}</b> to respond to our request for data`)), 1000)
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
