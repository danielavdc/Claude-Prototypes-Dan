export const BRAND_STEPS = ['Brand to Monitor', 'Add Alternative names', 'Add Relevant Terms', 'Remove Noise']
export const INDUSTRY_STEPS = ['Industry', 'Key topics', 'Source types', 'Your search']
export const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian', 'Japanese', 'Chinese']
export const SOURCE_TYPES = ['Online News', 'Print', 'Broadcast', 'Blogs', 'Forums', 'Twitter / X', 'Instagram']
export const TABS = [
  { label: 'Overview',         description: "What's Happening?" },
  { label: 'Coverage',         description: 'How Much and Where?' },
  { label: 'Narrative',        description: "What's the Story?" },
  { label: 'Sentiment',        description: "What's the Tone?" },
  { label: 'Audience',         description: "Who's Driving It?" },
]

export const MIRA_MESSAGES = {
  brand: [
    "Hi, I'm Mira Companion and I will help you set up your search to monitor your brand.\n\nI'll walk you through 4 quick steps. You'll review and adjust everything before applying.",
    "Nice! Want to add related terms — product names, hashtags, or common misspellings? (optional)",
    "Almost done — which languages should I monitor?",
    "Here's the Boolean query I built. Review it before applying.",
  ],
  industry: [
    "Let's set up an industry search.\n\nI'll walk you through 4 quick steps. What industry or sector do you want to monitor?",
    "Great! Add specific topics or subtopics within that space. (optional)",
    "Which source types matter most for this industry?",
    "Here's the Boolean query I built. Review it before applying.",
  ],
  general: ["Angelica, how can I help you?"],
  'widget-insight': [""],
}

export const WIDGET_INSIGHTS = {
  'Mentions Trend': "Mention volume increased 34% over the last 7 days, peaking on Tuesday following a viral post on X that drove a wave of secondary coverage across online news and blogs.\n\nWeekend volume dropped 18% below baseline, consistent with historical patterns for this brand. Broadcast sources contributed disproportionately to the Tuesday spike, accounting for 41% of that day's mentions despite representing only 22% of the weekly total.\n\n**What's driving the trend**\n\n- **Tuesday spike tied to earned media.** A single viral X post generated 3x the usual repost rate, amplifying reach beyond the brand's owned channels and pulling in broadcast pickups within 6 hours.\n- **Weekend dip is structural, not sentiment-driven.** Negative sentiment did not increase — volume simply follows the brand's typical weekday-heavy pattern.\n- **Recovery on Thursday suggests sustained interest.** A secondary bump on Thursday indicates the story had longevity beyond the initial spike, likely driven by follow-up analysis pieces.",
  'Topic Clusters': "Conversation is concentrated in three dominant clusters this week: product quality (38%), customer experience (29%), and sustainability (18%). The remaining 15% is distributed across pricing, partnerships, and miscellaneous mentions.\n\nThe sustainability cluster has grown 22% week-over-week, driven by coverage of the brand's new sourcing initiative. Product quality remains the largest cluster but declined 8% compared to last week.\n\n**What's shaping the clusters**\n\n- **Sustainability momentum is building.** The sourcing initiative announcement drove a sustained lift in this cluster rather than a one-day spike, suggesting genuine audience interest.\n- **Customer experience mentions skew positive.** 71% of CX cluster mentions carry positive sentiment — above the brand's overall average of 58%.\n- **Pricing cluster is emerging.** A small but growing cluster around pricing (6%) warrants monitoring as competitor promotions may be pulling attention.",
  'Top Keywords': "\"Quality\" and \"local\" are the top two keywords this week, appearing in 43% and 38% of mentions respectively. Both are consistent with prior weeks. The term \"overpriced\" has entered the top 10 for the first time, appearing in 9% of mentions — up from 3% last week.\n\nBrand-adjacent terms like \"Hayes Valley\" and \"Inner Sunset\" continue to anchor geographic conversation, reflecting the brand's strong neighborhood identity.\n\n**Notable keyword shifts**\n\n- **\"Overpriced\" emergence warrants attention.** The jump from 3% to 9% in one week is statistically significant. It correlates with a price increase that took effect Monday and is appearing primarily in review platforms.\n- **\"New location\" is trending up.** Mentions of a new location opening are appearing in 14% of this week's posts, creating a positive volume driver that is partially offsetting the pricing conversation.\n- **Competitor brand names are absent from top keywords.** No direct competitor terms appear in the top 20, suggesting the brand is being discussed on its own terms rather than in comparison.",
  'Locations': "US coverage dominates at 67% of total mentions, with California alone accounting for 31% of all global mentions. Australia and the UK are the second and third largest markets, together contributing 19% of volume.\n\nThe geographic spread is narrower than industry benchmarks — 80% of mentions come from just 4 markets, indicating the brand's media presence is highly concentrated in its core regions.\n\n**Geographic insights**\n\n- **San Francisco Bay Area drives outsized influence.** Despite representing a small share of total volume, Bay Area mentions carry high reach scores and frequently seed coverage that spreads to national outlets.\n- **Australian mentions are growing.** A 28% week-over-week increase in Australian volume, primarily from Melbourne and Sydney, suggests emerging market traction worth monitoring.\n- **European presence is minimal.** Less than 4% of mentions originate in Europe, presenting a visibility gap if the brand has expansion plans in that region.",
  'Sentiment': "Overall sentiment is 58% positive, 24% neutral, and 18% negative this week — consistent with the prior 4-week average. Positive sentiment is anchored by product and experience mentions, while negative sentiment is concentrated in price and wait-time conversations.\n\nSentiment has been stable with no significant swings, suggesting no reputational events occurred in the period.\n\n**Sentiment drivers**\n\n- **Price is the primary negative driver.** 61% of negative mentions reference price, with the term \"worth it\" appearing frequently in both positive and negative contexts — indicating the brand sits at a perceived value threshold.\n- **Staff and service are consistent positives.** Mentions of staff, baristas, and service carry 79% positive sentiment, providing a strong reputational floor.\n- **Neutral mentions are informational.** The majority of neutral mentions are news articles or event listings rather than opinion — they represent reach without sentiment risk.",
}
