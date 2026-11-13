import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Icon } from './icons';

/*
 * "Send" simulation: the composed email as a recipient would open it in Gmail, Outlook and Yahoo
 * (web on desktop, app on mobile). The email body is fluid with a max width (--te-email-w), the
 * same constraint as the composer, so we can judge whether that width reads like a normal message
 * or like an email-marketing layout. Client chrome is a simplified mock, not the real product UI.
 */

export const EMAIL_WIDTHS = [640, 800]; // compared with the header switch; the page sets --te-email-w

const CLIENTS = [
  { key: 'gmail', label: 'Gmail' },
  { key: 'outlook', label: 'Outlook' },
  { key: 'yahoo', label: 'Yahoo' },
];

// Desktop screen widths to simulate; "fit" uses whatever room the window has.
const SCREENS = [
  { key: 'fit', label: 'Fit window' },
  { key: 1280, label: '1280px' },
  { key: 1440, label: '1440px' },
  { key: 1920, label: '1920px' },
];

const RECIPIENT = { name: 'Alex Morgan', email: 'alex.morgan@example.com' };

const emailOf = (name) => `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@example.com`;
const initials = (name) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/* ---------- Shared pieces ---------- */

// The email itself: fluid up to the email max width (--te-email-w). Reports its rendered width for the readout.
function EmailBody({ html, mobile, onMeasure }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !onMeasure) return undefined;
    const measure = () => onMeasure({ email: el.offsetWidth, pane: el.parentElement.clientWidth });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, [onMeasure]);
  return (
    <div
      ref={ref}
      className={`te-mail-email te-preview${mobile ? ' is-mobile' : ''}`}
      style={{ maxWidth: 'var(--te-email-w, 800px)' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function Avatar({ name, color, size = 40 }) {
  return (
    <span className="te-mail-avatar" style={{ width: size, height: size, background: color, fontSize: size * 0.4 }}>
      {initials(name)}
    </span>
  );
}

// Plain placeholder bars for icons/nav we don't need to spell out.
const Bar = ({ w, h = 10, r = 5, c = '#dadce0' }) => (
  <span className="te-mail-bar" style={{ width: w, height: h, borderRadius: r, background: c }} />
);

function NavList({ items, activeClass }) {
  return (
    <ul className="te-mail-nav">
      {items.map((item, i) => (
        <li key={item} className={i === 0 ? activeClass : ''}>
          <Bar w={16} h={16} r={4} c={i === 0 ? 'currentColor' : '#c4c7c5'} />
          {item}
          {i === 0 && <b>1</b>}
        </li>
      ))}
    </ul>
  );
}

/* ---------- Desktop clients ---------- */

function GmailDesktop({ mail, html, onMeasure }) {
  return (
    <div className="te-mail te-gmail">
      <header className="te-gmail-top">
        <Bar w={20} h={14} r={2} c="#5f6368" />
        <span className="te-gmail-logo">
          <span className="te-gmail-m">M</span> Gmail
        </span>
        <span className="te-gmail-search">Search mail</span>
        <Avatar name={RECIPIENT.name} color="#1a73e8" size={32} />
      </header>
      <div className="te-mail-cols">
        <aside className="te-gmail-side">
          <span className="te-gmail-compose">Compose</span>
          <NavList items={['Inbox', 'Starred', 'Snoozed', 'Sent', 'Drafts', 'More']} activeClass="is-active" />
        </aside>
        <section className="te-gmail-main">
          <div className="te-mail-toolbar">
            {[0, 1, 2, 3, 4].map((i) => (
              <Bar key={i} w={18} h={18} r={4} c="#c4c7c5" />
            ))}
          </div>
          <div className="te-gmail-read">
            <h1 className="te-gmail-subject">
              {mail.subject} <span className="te-gmail-chip">Inbox</span>
            </h1>
            <div className="te-gmail-msg">
              <Avatar name={mail.sender} color="#7b1fa2" />
              <div className="te-gmail-msg-main">
                <div className="te-mail-from">
                  <span>
                    <b>{mail.sender}</b> <span className="te-mail-muted">&lt;{mail.senderEmail}&gt;</span>
                  </span>
                  <span className="te-mail-muted te-mail-date">10:24 AM (0 minutes ago)</span>
                </div>
                <div className="te-mail-muted te-mail-to">to me ▾</div>
                <div className="te-mail-body-wrap">
                  <EmailBody html={html} onMeasure={onMeasure} />
                </div>
                <div className="te-mail-replies">
                  <span>↩ Reply</span>
                  <span>↪ Forward</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function OutlookDesktop({ mail, html, onMeasure }) {
  return (
    <div className="te-mail te-outlook">
      <header className="te-outlook-top">
        <Bar w={16} h={16} r={2} c="rgba(255,255,255,.85)" />
        <b>Outlook</b>
        <span className="te-outlook-search">Search</span>
        <Avatar name={RECIPIENT.name} color="#8764b8" size={30} />
      </header>
      <div className="te-mail-cols">
        <aside className="te-outlook-side">
          <span className="te-outlook-new">New mail</span>
          <NavList items={['Inbox', 'Drafts', 'Sent Items', 'Deleted Items', 'Archive']} activeClass="is-active" />
        </aside>
        {/* Default Outlook layout: message list + reading pane on the right */}
        <section className="te-outlook-list">
          <div className="te-outlook-list-head">
            <b>Inbox</b>
            <span className="te-mail-muted">Focused · Other</span>
          </div>
          <div className="te-outlook-item is-active">
            <b>{mail.sender}</b>
            <span>{mail.subject}</span>
            <span className="te-mail-muted">{mail.snippet}</span>
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div className="te-outlook-item" key={i}>
              <Bar w={110} />
              <Bar w={180} />
              <Bar w={220} c="#ededed" />
            </div>
          ))}
        </section>
        <section className="te-outlook-read">
          <h1 className="te-outlook-subject">{mail.subject}</h1>
          <div className="te-outlook-card">
            <div className="te-outlook-msg-head">
              <Avatar name={mail.sender} color="#c239b3" />
              <div>
                <b>{mail.sender}</b> <span className="te-mail-muted">&lt;{mail.senderEmail}&gt;</span>
                <div className="te-mail-muted te-mail-to">To: {RECIPIENT.name}</div>
              </div>
              <span className="te-mail-muted te-mail-date">Thu 10:24 AM</span>
            </div>
            <div className="te-mail-body-wrap">
              <EmailBody html={html} onMeasure={onMeasure} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function YahooDesktop({ mail, html, onMeasure }) {
  return (
    <div className="te-mail te-yahoo">
      <header className="te-yahoo-top">
        <span className="te-yahoo-logo">yahoo!mail</span>
        <span className="te-yahoo-search">Search email, contacts, files…</span>
        <Avatar name={RECIPIENT.name} color="#6001d2" size={32} />
      </header>
      <div className="te-mail-cols">
        <aside className="te-yahoo-side">
          <span className="te-yahoo-compose">Compose</span>
          <NavList items={['Inbox', 'Unread', 'Starred', 'Drafts', 'Sent', 'Archive']} activeClass="is-active" />
        </aside>
        <section className="te-yahoo-main">
          <div className="te-mail-toolbar">
            {[0, 1, 2, 3, 4].map((i) => (
              <Bar key={i} w={18} h={18} r={4} c="#c4c7c5" />
            ))}
          </div>
          <h1 className="te-yahoo-subject">{mail.subject}</h1>
          <div className="te-yahoo-msg">
            <div className="te-yahoo-msg-head">
              <Avatar name={mail.sender} color="#0f69ff" />
              <div>
                <b>{mail.sender}</b> <span className="te-mail-muted">{mail.senderEmail}</span>
                <div className="te-mail-muted te-mail-to">To: {RECIPIENT.email}</div>
              </div>
              <span className="te-mail-muted te-mail-date">Thu, Nov 12 at 10:24 AM</span>
            </div>
            <div className="te-mail-body-wrap">
              <EmailBody html={html} onMeasure={onMeasure} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------- Mobile apps (375px) ---------- */

function MobileApp({ client, mail, html, onMeasure }) {
  const accent = { gmail: '#1a73e8', outlook: '#0f6cbd', yahoo: '#6001d2' }[client];
  const avatar = { gmail: '#7b1fa2', outlook: '#c239b3', yahoo: '#0f69ff' }[client];
  return (
    <div className={`te-phone te-phone-${client}`}>
      <div className="te-phone-status">
        <b>9:41</b>
        <span>▮▮▮ ◔</span>
      </div>
      <div className="te-phone-bar" style={client === 'outlook' ? { background: accent, color: '#fff' } : undefined}>
        <span className="te-phone-back">‹</span>
        {client === 'yahoo' && <span className="te-yahoo-logo te-phone-logo">yahoo!mail</span>}
        <span className="te-phone-actions">
          <Bar w={16} h={16} r={3} c={client === 'outlook' ? 'rgba(255,255,255,.8)' : '#80868b'} />
          <Bar w={16} h={16} r={3} c={client === 'outlook' ? 'rgba(255,255,255,.8)' : '#80868b'} />
          <Bar w={4} h={16} r={2} c={client === 'outlook' ? 'rgba(255,255,255,.8)' : '#80868b'} />
        </span>
      </div>
      <div className="te-phone-scroll">
        <h1 className="te-phone-subject">
          {mail.subject} {client === 'gmail' && <span className="te-gmail-chip">Inbox</span>}
        </h1>
        <div className="te-phone-from">
          <Avatar name={mail.sender} color={avatar} size={36} />
          <div>
            <b>{mail.sender}</b> <span className="te-mail-muted">10:24 AM</span>
            <div className="te-mail-muted te-mail-to">{client === 'gmail' ? 'to me ▾' : `To: ${RECIPIENT.name}`}</div>
          </div>
        </div>
        <div className="te-mail-body-wrap">
          <EmailBody html={html} mobile onMeasure={onMeasure} />
        </div>
      </div>
    </div>
  );
}

const DESKTOP = { gmail: GmailDesktop, outlook: OutlookDesktop, yahoo: YahooDesktop };

/* ---------- Simulator ---------- */

export default function InboxSimulator({ html, sender, subject, maxWidth, onBack }) {
  const [client, setClient] = useState('gmail');
  const [device, setDevice] = useState('desktop');
  const [screen, setScreen] = useState('fit');
  const [align, setAlign] = useState('center'); // email block: centred or left-aligned in the reading pane
  const [sizes, setSizes] = useState(null);
  const [stageWidth, setStageWidth] = useState(0);
  const stageRef = useRef(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setStageWidth(el.clientWidth));
    ro.observe(el);
    setStageWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const name = sender || 'Press Team';
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const mail = {
    sender: name,
    senderEmail: emailOf(name),
    subject: subject.trim() || 'Story pitch for The Daily Tech',
    snippet: text.slice(0, 80),
  };

  // A fixed screen width is drawn at full size and scaled down to fit the stage.
  const fixed = device === 'desktop' && screen !== 'fit';
  const scale = fixed && stageWidth ? Math.min(1, stageWidth / screen) : 1;
  const Desktop = DESKTOP[client];

  return (
    <div className="te-sim">
      <div className="te-sim-bar">
        <button type="button" className="te-text-btn" onClick={onBack}>
          <Icon name="back" size={18} /> Back to editor
        </button>
        <div className="te-variant" role="group" aria-label="Email client">
          {CLIENTS.map((c) => (
            <button key={c.key} type="button" aria-pressed={client === c.key} className={client === c.key ? 'is-active' : ''} onClick={() => setClient(c.key)}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="te-toggle te-toggle-icon" role="tablist" aria-label="Device">
          {['desktop', 'mobile'].map((d) => (
            <button key={d} type="button" role="tab" aria-selected={device === d} aria-label={d === 'desktop' ? 'Desktop' : 'Mobile'} className={device === d ? 'is-active' : ''} onClick={() => setDevice(d)}>
              <Icon name={d} size={18} />
            </button>
          ))}
        </div>
        <div className="te-variant" role="group" aria-label="Email alignment">
          {[
            { key: 'left', label: 'Left' },
            { key: 'center', label: 'Centered' },
          ].map((a) => (
            <button key={a.key} type="button" aria-pressed={align === a.key} className={align === a.key ? 'is-active' : ''} onClick={() => setAlign(a.key)}>
              {a.label}
            </button>
          ))}
        </div>
        {device === 'desktop' && (
          <label className="te-sim-screen">
            Screen
            <select value={screen} onChange={(e) => setScreen(e.target.value === 'fit' ? 'fit' : Number(e.target.value))}>
              {SCREENS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        )}
        {sizes && (
          <span className="te-sim-readout">
            Email {Math.round(sizes.email)}px <span>·</span> max {maxWidth}px <span>·</span> reading area{' '}
            {Math.round(sizes.pane)}px
          </span>
        )}
      </div>

      <div className={`te-sim-stage is-${align}`} ref={stageRef}>
        {device === 'mobile' ? (
          <MobileApp key={client} client={client} mail={mail} html={html} onMeasure={setSizes} />
        ) : (
          <div
            className="te-sim-screen-box"
            style={
              fixed
                ? {
                    width: screen,
                    height: `${100 / scale}%`,
                    left: Math.max(0, (stageWidth - screen) / 2),
                    transform: `scale(${scale})`,
                  }
                : undefined
            }
          >
            <Desktop key={client} mail={mail} html={html} onMeasure={setSizes} />
          </div>
        )}
      </div>
    </div>
  );
}
