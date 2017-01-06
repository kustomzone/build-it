import React from 'react'
import RequestShortener from 'webpack/lib/RequestShortener.js'
import Ansi from 'ansi-to-react'

const shortener = new RequestShortener(process.cwd())

export default function DetailView ({ data }) {
  if (data.content) {
    return data.content
  }
  const items = {}
  data.items.forEach((item) => {
    const key = item.origin.readableIdentifier(shortener)
    items[key] = (items[key] || []).concat(item.message.trim())
  })
  return <ul>
    {Object.keys(items).map((name, i) => <li key={i}>
      <strong>{name}</strong>
      {items[name].length > 1
        ? <ul>{items[name].map((msg, j) => <li key={j}><pre><Ansi>{msg}</Ansi></pre></li>)}</ul>
        : <pre><Ansi>{items[name][0]}</Ansi></pre>
      }
    </li>)}
  </ul>
}
