// Dummy contact base for the Media List page (100 contacts).
// The first 9 match the reference screenshots exactly; the rest are generated
// deterministically (no Math.random) so the list is stable across renders.

const COLORS = ['#8E7CC3', '#5C9CCC', '#C0873F', '#7E9B8A', '#B76BA3', '#4FA0A0', '#E0736F', '#6B8FB7', '#C79A4B', '#7B5AD6', '#E5397E', '#43A047', '#F2994A', '#5C6BC0', '#26A69A', '#EC407A', '#66BB6A', '#FF7043']

const FIRST = ['Oliver', 'Emma', 'Lucas', 'Mia', 'Ryan', 'Zoe', 'Diego', 'Nora', 'Owen', 'Lena', 'Theo', 'Ruby', 'Felix', 'Iris', 'Hugo', 'Clara', 'Milo', 'Elena', 'Jonas', 'Amara', 'Kai', 'Sara', 'Leon', 'Nina', 'Adrian', 'Talia', 'Victor', 'Grace', 'Samuel', 'Lucia', 'Oscar', 'Freya', 'Dylan', 'Aria', 'Ezra', 'Maya', 'Cyrus', 'Delia', 'Rowan', 'Petra', 'Silas', 'Yara', 'Beau', 'Ingrid', 'Marco', 'Simone', 'Dante', 'Wren', 'Colette', 'Anton']
const LAST = ['Harper', 'Vance', 'Okafor', 'Lindqvist', 'Moreau', 'Bianchi', 'Nakamura', 'Fischer', 'Costa', 'Petrov', 'Andersson', 'Reyes', 'Kowalski', 'Haddad', 'Silva', 'Novak', 'Larsen', 'Ferrari', 'Dubois', 'Romero', 'Schmidt', 'Ivanov', 'Mensah', 'Castellano', 'Bauer', 'Sorensen', 'Delacroix', 'Fontana', 'Ashford', 'Blackwood', 'Whitmore', 'Sinclair', 'Hartley', 'Ellison', 'Marlowe', 'Radcliffe', 'Sterling', 'Merchant', 'Calloway', 'Rosales']

const LISTS = ['Festival Lineup, Press Contacts, In…', 'Event Speakers, Panelists', 'Media Partners, Sponsors', 'Local Journalists, Bloggers', 'Social Media Influencers, Podc…', 'TV Reporters, Radio Hosts', 'Newsletter Writers, Columnists', 'Trade Press, Analysts', 'Regional Editors', 'Broadcast Producers, Anchors', 'Freelance Contributors', 'Wire Services, Agencies', 'Magazine Features, Editors', 'Digital Editors, Bloggers']
const BEATS = ['Climate & Energy', 'Sustainability', 'Renewable Energy', 'Environment, Policy', 'Food & Beverage', 'Criminal Justice', 'Pets, Wine, Travel & Tourismn', 'Technology', 'Health & Wellness', 'Business & Finance', 'Culture & Arts', 'Science', '---', '---']
const RATES = ['0%', '25%', '40%', '50%', '60%', '75%', '88%', '92%', '100%', '33%', '67%', '80%', '45%', '12%', '95%']
const LASTC = ['2d ago', '6d ago', 'Yesterday', '1 month ago', '3d ago', '1w ago', '2w ago', '5d ago', '3w ago', 'Today', '4d ago']
const NOTES_PATTERN = [0, 0, 0, 5, 0, 2, 0, 1, 0, 3, 0, 0]

// Filterable dimensions (fixed pools so counts of 0 still show in the dropdowns)
export const TITLES = ['Senior Editor', 'Staff Writer', 'Freelancer', 'Columnist', 'Contributor', 'Editor-in-Chief', 'Reporter', 'Correspondent', 'Producer', 'Blogger']
export const BEAT_CATEGORIES = ['News', 'Government & Politics', 'Regional & Local Interest', 'Entertainment', 'Finance & Economy', 'Technology', 'Health & Science', 'Lifestyle']
export const LOCATIONS = ['United States', 'United Kingdom', 'Germany', 'France', 'Spain', 'Canada', 'Australia', 'Netherlands', 'Sweden', 'Italy']
export const OUTLETS = ['MedPage Today', 'CNN', 'The Guardian', 'Reuters', 'TechCrunch', 'Bloomberg', 'BBC', 'Le Monde', 'Axios', 'The New York Times']

// List-level engagement stats shown as headers in the List Health panel
export const LIST_STATS = { openRate: '80%', clickRate: '12%', unsubRate: '0.5%', bounceRate: '0.2%' }
export const LAST_EMAILED = 'Jun 9, 2026'

// Hand-crafted rows that match the reference screenshots.
// Health fields: opened/clicked/unsubscribed/bounced (bool), lastResponseDays / lastPublishedDays (number),
// noReplyAttempts = how many consecutive outreach emails were sent with no reply (used by the
// "Hasn't replied after: N attempts" inactivity filter).
const BASE = [
  { name: 'Maya Thornton', private: true, color: '#8E7CC3', onList: 'Festival Lineup, Press Contacts, In…', beats: '---', notes: 5, openRate: '75%', last: '2d ago', title: 'Senior Editor', beatCategory: 'News', location: 'United States', outlet: 'The New York Times', opened: true, clicked: true, unsubscribed: false, bounced: false, lastResponseDays: 12, lastPublishedDays: 20, noReplyAttempts: 0 },
  { name: 'Liam Caldwell', color: '#5C9CCC', onList: 'Event Speakers, Panelists', beats: 'Criminal Justice', notes: 0, openRate: '0%', last: '6d ago', title: 'Reporter', beatCategory: 'Government & Politics', location: 'United Kingdom', outlet: 'The Guardian', opened: false, clicked: false, unsubscribed: false, bounced: true, lastResponseDays: 95, lastPublishedDays: 100, noReplyAttempts: 5 },
  { name: 'Sophie Delgado', color: '#C0873F', onList: 'Media Partners, Sponsors', beats: '---', notes: 0, openRate: '100%', last: '1 month ago', title: 'Freelancer', beatCategory: 'Entertainment', location: 'Spain', outlet: 'Le Monde', opened: true, clicked: true, unsubscribed: false, bounced: false, lastResponseDays: 32, lastPublishedDays: 8, noReplyAttempts: 1 },
  { name: 'Ethan Ramsey', private: true, color: '#7E9B8A', onList: 'Local Journalists, Bloggers', beats: 'Food & Beverage', notes: 0, openRate: '100%', last: 'Yesterday', title: 'Columnist', beatCategory: 'Lifestyle', location: 'United States', outlet: 'CNN', opened: true, clicked: false, unsubscribed: false, bounced: false, lastResponseDays: 40, lastPublishedDays: 15, noReplyAttempts: 2 },
  { name: 'Isla Montgomery', private: true, color: '#B76BA3', onList: 'Social Media Influencers, Podc…', beats: 'Pets, Wine, Travel & Tourismn', notes: 1, openRate: '50%', last: 'Yesterday', title: 'Blogger', beatCategory: 'Lifestyle', location: 'Australia', outlet: 'Axios', opened: true, clicked: false, unsubscribed: false, bounced: false, lastResponseDays: 70, lastPublishedDays: 65, noReplyAttempts: 4 },
  { name: 'Noah Bennett', color: '#4FA0A0', onList: 'TV Reporters, Radio Hosts', beats: 'Climate & Energy', notes: 0, openRate: '60%', last: '3d ago', title: 'Correspondent', beatCategory: 'News', location: 'Germany', outlet: 'BBC', opened: true, clicked: false, unsubscribed: false, bounced: false, lastResponseDays: 25, lastPublishedDays: 95, noReplyAttempts: 1 },
  { name: 'Ava Sinclair', color: '#E0736F', onList: 'Newsletter Writers, Columnists', beats: 'Sustainability', notes: 2, openRate: '88%', last: '1w ago', title: 'Contributor', beatCategory: 'Finance & Economy', location: 'Canada', outlet: 'Bloomberg', opened: true, clicked: true, unsubscribed: false, bounced: false, lastResponseDays: 8, lastPublishedDays: 3, noReplyAttempts: 0 },
  { name: 'Marcus Webb', private: true, color: '#6B8FB7', onList: 'Trade Press, Analysts', beats: 'Renewable Energy', notes: 0, openRate: '40%', last: '2w ago', title: 'Editor-in-Chief', beatCategory: 'Technology', location: 'United States', outlet: 'Reuters', opened: true, clicked: false, unsubscribed: false, bounced: false, lastResponseDays: 100, lastPublishedDays: 50, noReplyAttempts: 3 },
  { name: 'Priya Nair', color: '#C79A4B', onList: 'Regional Editors', beats: 'Environment, Policy', notes: 0, openRate: '92%', last: 'Yesterday', title: 'Staff Writer', beatCategory: 'Health & Science', location: 'France', outlet: 'MedPage Today', opened: true, clicked: false, unsubscribed: true, bounced: false, lastResponseDays: 55, lastPublishedDays: 110, noReplyAttempts: 3 },
]

function generate(i) {
  const first = FIRST[(i * 13) % FIRST.length]
  const last = LAST[(i * 7) % LAST.length]
  const bounced = i % 45 === 12          // ~2
  const unsubscribed = i % 34 === 3      // ~2
  const opened = !bounced && (i % 5 !== 0) // ~80% open
  const clicked = opened && i % 8 === 0    // ~12% click
  return {
    name: `${first} ${last}`,
    private: i % 3 === 0,
    color: COLORS[(i * 5) % COLORS.length],
    onList: LISTS[(i * 11) % LISTS.length],
    beats: BEATS[(i * 17) % BEATS.length],
    notes: NOTES_PATTERN[i % NOTES_PATTERN.length],
    openRate: RATES[(i * 19) % RATES.length],
    last: LASTC[(i * 23) % LASTC.length],
    title: TITLES[(i * 3) % TITLES.length],
    beatCategory: BEAT_CATEGORIES[(i * 29) % BEAT_CATEGORIES.length],
    location: LOCATIONS[(i * 31) % LOCATIONS.length],
    outlet: OUTLETS[(i * 37) % OUTLETS.length],
    opened, clicked, unsubscribed, bounced,
    lastResponseDays: (i * 23) % 130,
    lastPublishedDays: (i * 31) % 130,
    noReplyAttempts: (i * 7) % 6,
  }
}

export const MEDIA_CONTACTS = [
  ...BASE,
  ...Array.from({ length: 100 - BASE.length }, (_, k) => generate(k + BASE.length)),
].map((c, id) => ({ id, ...c }))

// Newsdesk (outlet-level) contacts for the "Newsdesks" sub-tab in Media List. Same shape as
// MEDIA_CONTACTS so the same List Health / column filters apply uniformly. IDs offset by 100000
// so they never collide with journalist ids when both pools coexist in selection state.
export const NEWSDESK_CONTACTS = OUTLETS.map((outlet, i) => {
  const bounced = i === 7
  const unsubscribed = i === 4
  const opened = !bounced && i % 4 !== 0
  const clicked = opened && i % 3 === 0
  return {
    id: 100000 + i,
    name: outlet,
    private: false,
    color: COLORS[(i * 5) % COLORS.length],
    onList: LISTS[(i * 11) % LISTS.length],
    beats: BEATS[(i * 17) % BEATS.length],
    notes: NOTES_PATTERN[i % NOTES_PATTERN.length],
    openRate: RATES[(i * 19) % RATES.length],
    last: LASTC[(i * 23) % LASTC.length],
    title: TITLES[(i * 3) % TITLES.length],
    beatCategory: BEAT_CATEGORIES[(i * 29) % BEAT_CATEGORIES.length],
    location: LOCATIONS[(i * 31) % LOCATIONS.length],
    outlet,
    opened, clicked, unsubscribed, bounced,
    lastResponseDays: (i * 23) % 130,
    lastPublishedDays: (i * 31) % 130,
    noReplyAttempts: (i * 7) % 6,
  }
})

// Searchable journalist directory for the "Add a Journalist" search bar (not on the list yet).
// Search any of these first names: Samantha, James, Sofia, Chen, Aisha, Carlos, Emma, Liam,
// Olivia, Ethan, Ava, Lucas, Mia, Daniel, Grace, Noah, Hannah, Marcus.
export const SEARCHABLE_JOURNALISTS = [
  { name: 'Samantha Smith', email: 'ssmith@ap.com', city: 'Atlanta, Georgia', country: 'United States', outlet: 'AP', color: '#C0873F', title: 'Correspondent', beatCategory: 'News' },
  { name: 'Samantha Smith', email: 'samantha123@gmail.com', city: 'Miami, Florida', country: 'United States', outlet: 'Boston Globe', color: '#B76BA3', title: 'Freelancer', beatCategory: 'Lifestyle', lists: ['List name 1', 'List Name 2'] },
  { name: 'Samantha Smith', email: 'smith56@nytimes.com', city: 'New York, New York', country: 'United States', outlet: 'New York Times', color: '#5C9CCC', title: 'Staff Writer', beatCategory: 'Government & Politics' },
  { name: 'James Carter', email: 'jcarter@reuters.com', city: 'London', country: 'United Kingdom', outlet: 'Reuters', color: '#4FA0A0', title: 'Reporter', beatCategory: 'Finance & Economy' },
  { name: 'James Whitfield', email: 'jwhitfield@bbc.co.uk', city: 'Manchester', country: 'United Kingdom', outlet: 'BBC', color: '#6B8FB7', title: 'Producer', beatCategory: 'News' },
  { name: 'Sofia Marchetti', email: 'smarchetti@lastampa.it', city: 'Milan', country: 'Italy', outlet: 'La Stampa', color: '#E0736F', title: 'Columnist', beatCategory: 'Culture & Arts' },
  { name: 'Chen Wei', email: 'chen.wei@scmp.com', city: 'Hong Kong', country: 'China', outlet: 'SCMP', color: '#7B5AD6', title: 'Correspondent', beatCategory: 'Technology' },
  { name: 'Aisha Khan', email: 'akhan@thenational.ae', city: 'Dubai', country: 'UAE', outlet: 'The National', color: '#43A047', title: 'Editor', beatCategory: 'Regional & Local Interest' },
  { name: 'Carlos Mendes', email: 'cmendes@globo.com', city: 'São Paulo', country: 'Brazil', outlet: 'Globo', color: '#F2994A', title: 'Reporter', beatCategory: 'News' },
  { name: 'Emma Larsson', email: 'emma.larsson@dn.se', city: 'Stockholm', country: 'Sweden', outlet: 'Dagens Nyheter', color: '#26A69A', title: 'Staff Writer', beatCategory: 'Health & Science' },
  { name: 'Liam O’Brien', email: 'lobrien@irishtimes.com', city: 'Dublin', country: 'Ireland', outlet: 'The Irish Times', color: '#5C6BC0', title: 'Columnist', beatCategory: 'Entertainment' },
  { name: 'Olivia Bennett', email: 'obennett@guardian.co.uk', city: 'Leeds', country: 'United Kingdom', outlet: 'The Guardian', color: '#EC407A', title: 'Freelancer', beatCategory: 'Lifestyle' },
  { name: 'Ethan Cole', email: 'ecole@wsj.com', city: 'Chicago, Illinois', country: 'United States', outlet: 'WSJ', color: '#66BB6A', title: 'Reporter', beatCategory: 'Finance & Economy' },
  { name: 'Ava Nguyen', email: 'anguyen@smh.com.au', city: 'Sydney', country: 'Australia', outlet: 'Sydney Morning Herald', color: '#8E7CC3', title: 'Correspondent', beatCategory: 'News' },
  { name: 'Lucas Fernandez', email: 'lfernandez@elpais.es', city: 'Madrid', country: 'Spain', outlet: 'El País', color: '#FF7043', title: 'Editor', beatCategory: 'Government & Politics' },
  { name: 'Mia Anderson', email: 'manderson@cbc.ca', city: 'Toronto', country: 'Canada', outlet: 'CBC', color: '#C79A4B', title: 'Producer', beatCategory: 'Regional & Local Interest' },
  { name: 'Daniel Weber', email: 'dweber@spiegel.de', city: 'Berlin', country: 'Germany', outlet: 'Der Spiegel', color: '#7E9B8A', title: 'Staff Writer', beatCategory: 'Technology' },
  { name: 'Grace Kim', email: 'gkim@koreaherald.com', city: 'Seoul', country: 'South Korea', outlet: 'Korea Herald', color: '#E5397E', title: 'Reporter', beatCategory: 'Entertainment' },
  { name: 'Noah Patel', email: 'npatel@thehindu.com', city: 'Mumbai', country: 'India', outlet: 'The Hindu', color: '#5C9CCC', title: 'Correspondent', beatCategory: 'Health & Science' },
  { name: 'Hannah Meyer', email: 'hmeyer@axios.com', city: 'Washington, DC', country: 'United States', outlet: 'Axios', color: '#B76BA3', title: 'Columnist', beatCategory: 'Government & Politics' },
]
