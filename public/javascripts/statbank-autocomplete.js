(function autocomp () {
  const index = new FlexSearch({
    encode: 'advanced',
    tokenize: 'reverse',
    suggest: true,
    cache: true,
    depth: 3,
    doc: {
      id: 'id',
      field: ['title', 'subtitle', 'content']
    }
  })

  fetch('/api/data/')
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      // console.log('docs \n')
      // console.log(data)
      index.add(data)
      // for (let i = 0; i < docs.length; i++) {
      //   index.add(i, docs[i]) //this doesn't appear to work???
      // }
      const suggestions = document.getElementById('statbank-suggestions')
      // const autocomplete = document.getElementById('autocomplete')
      const userinput = document.getElementById('statbank-userinput')

      userinput.addEventListener('input', showResults, true)
      // userinput.addEventListener('keyup', acceptAutocomplete, true)
      // suggestions.addEventListener('click', acceptSuggestion, true)

      function showResults () {
        const value = this.value
        const results = index.search(value, 8)
        // console.log('results: \n')
        // console.log(results)
        let suggestion
        let childs = suggestions.childNodes
        let i = 0
        const len = results.length

        for (; i < len; i++) {
          suggestion = childs[i]

          if (!suggestion) {
            suggestion = document.createElement('div')
            suggestions.appendChild(suggestion)
          }
          suggestion.innerHTML = `<a href = '${results[i].link}'> ${results[i]['section-name']} ${results[i].title}</a>`

          // console.log(results[i])
        }

        while (childs.length > len) {
          suggestions.removeChild(childs[i])
        }
      //
      // //   const firstResult = results[0].content
      // //   const match = firstResult && firstResult.toLowerCase().indexOf(value.toLowerCase())
      // //
      // //   if (firstResult && (match !== -1)) {
      // //     autocomplete.value = value + firstResult.substring(match + value.length)
      // //     autocomplete.current = firstResult
      // //   } else {
      // //     autocomplete.value = autocomplete.current = value
      // //   }
      }

      function acceptAutocomplete (event) {
        if ((event || window.event).keyCode === 13) {
          console.log('acceptAutocomplete ')
          console.log(event)
          this.value = autocomplete.value = autocomplete.current
        }
      }

      function acceptSuggestion (event) {
        const target = (event || window.event).target

        userinput.value = autocomplete.value = target.textContent

        while (suggestions.lastChild) {
          suggestions.removeChild(suggestions.lastChild)
        }

        return false
      }
    })
}())
