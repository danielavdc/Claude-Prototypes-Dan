export function generateRelatedTerms(brandName) {
  const n = brandName.toLowerCase()
  if (n.includes('coffee') || n.includes('cafe') || n.includes('brew') || n.includes('roast'))
    return ['specialty coffee', 'coffee shop', 'espresso', 'barista', 'pour over', 'single origin', 'cold brew']
  if (n.includes('tech') || n.includes('software') || n.includes('app') || n.includes('ai'))
    return ['product launch', 'software update', 'user experience', 'SaaS', 'cloud platform', 'mobile app', 'API']
  const w = brandName.split(/\s+/)[0]
  return [`${w} review`, `${w} news`, `${w} CEO`, `${w} earnings`, `${w} partnership`, `${w} launch`, `${w} product`]
}

export function generateMoreRelatedTerms(brandName) {
  const n = brandName.toLowerCase()
  if (n.includes('coffee') || n.includes('cafe') || n.includes('brew') || n.includes('roast'))
    return ['third wave coffee', 'coffee roaster', 'latte', 'cappuccino', 'drip coffee', 'french press', 'coffee beans', 'arabica', 'robusta', 'coffee culture']
  if (n.includes('tech') || n.includes('software') || n.includes('app') || n.includes('ai'))
    return ['funding round', 'IPO', 'acquisition', 'venture capital', 'startup', 'innovation', 'digital transformation', 'cybersecurity', 'data privacy', 'open source']
  const w = brandName.split(/\s+/)[0]
  return [`${w} stock`, `${w} IPO`, `${w} acquisition`, `${w} funding`, `${w} layoffs`, `${w} expansion`, `${w} competitor`, `${w} market share`, `${w} revenue`, `${w} growth`]
}

export function generateAltNames(brandName) {
  const name = brandName.trim()
  const words = name.split(/\s+/)
  const handle = '@' + name.toLowerCase().replace(/\s+/g, '')
  const candidates = []
  if (words.length > 2) candidates.push(words.slice(0, -1).join(' '))
  if (words.length > 1) candidates.push(words[0])
  candidates.push((words.length > 1 ? words.slice(0, 2).join(' ') : name) + 's')
  candidates.push(handle)
  if (words.length > 1) candidates.push(name + ' Inc')
  return [...new Set(candidates)]
    .filter(c => c !== name && c.length > 1)
    .slice(0, 5)
    .map(label => ({ label, checked: true }))
}

export function generateKeywordExclusions(brandName) {
  const n = brandName.toLowerCase()
  const result = []
  if (n.includes('saint') || n.includes(' st ') || n.startsWith('st ') || n.includes('angel') || n.includes('holy') || n.includes('cross')) {
    result.push('Church', 'Religion', 'St. Peter', 'Angel')
  }
  if (n.includes('frank')) {
    result.push('Frankenstein', 'Frankfurter')
  }
  if (n.includes('coffee') || n.includes('cafe') || n.includes('brew')) {
    result.push('Coffee Table', 'Coffee Machine')
  }
  if (n.includes('tech') || n.includes('software') || n.includes('app') || n.includes('ai')) {
    result.push('Technical College', 'Tech Support', 'Software Piracy')
  }
  if (n.includes('apple')) {
    result.push('Apple Pie', 'Apple Tree', 'Apple Cider', 'Apple Records')
  }
  if (!result.length) {
    const w = brandName.split(/\s+/)[0]
    result.push(`${w} movie`, `${w} song`, `${w} book`, `${w} game`)
  }
  return result.slice(0, 6).map(label => ({ label, excluded: true }))
}

export function generateBooleanQuery(version, brandName, altNames = [], relatedTerms = [], keywordExclusions = []) {
  const noiseTerms = ['Press Release', 'NSFW', 'Market Research', 'News Aggregator', 'Stock Market News']

  if (version === 1) {
    const excl = noiseTerms.map(n => `"${n}"`).join(' OR ')
    return `"${brandName}" AND NOT (${excl})`
  }

  const checkedAlts = altNames.filter(a => a.checked)
  const brandPart = checkedAlts.length > 0
    ? `("${brandName}" OR ${checkedAlts.map(a => `"${a.label}"`).join(' OR ')})`
    : `"${brandName}"`

  if (version === 2) {
    const excl = noiseTerms.map(n => `"${n}"`).join(' OR ')
    return `${brandPart} AND NOT (${excl})`
  }

  const checkedTerms = relatedTerms.filter(t => t.checked)
  const relevantPart = checkedTerms.length > 0
    ? ` AND (${checkedTerms.map(t => `"${t.label}"`).join(' OR ')})`
    : ''
  const excludedKw = keywordExclusions.filter(e => e.excluded)
  const exclTerms = excludedKw.length > 0
    ? excludedKw.map(e => `"${e.label}"`).join(' OR ')
    : noiseTerms.map(n => `"${n}"`).join(' OR ')
  return `${brandPart}${relevantPart} AND NOT (${exclTerms})`
}

export function generateMeltwaterQuery(brandName, altNames = [], relatedTerms = [], keywordExclusions = []) {
  const noiseExclusions = 'NOT contentCategory:press_releases NOT nsfw:true NOT contentCategory:market_research_reports NOT contentCategory:aggregator NOT contentCategory:stock_market_news'
  const checkedAlts = altNames.filter(a => a.checked)
  const brandPart = checkedAlts.length > 0
    ? `("${brandName}" OR ${checkedAlts.map(a => `"${a.label}"`).join(' OR ')})`
    : `"${brandName}"`
  const checkedTerms = relatedTerms.filter(t => t.checked)
  const termsPart = checkedTerms.length > 0
    ? ` AND (${checkedTerms.map(t => `"${t.label}"`).join(' OR ')})`
    : ''
  const excludedKw = keywordExclusions.filter(e => e.excluded)
  const kwExclPart = excludedKw.length > 0
    ? ` NOT (${excludedKw.map(e => `"${e.label}"`).join(' OR ')})`
    : ''
  return `${brandPart}${termsPart} ${noiseExclusions}${kwExclPart}`
}

export function formatMentions(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return Math.round(n).toLocaleString()
}
