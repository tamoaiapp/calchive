import type { ToolConfig } from './types'

export const lifestyleTools: ToolConfig[] = [
  {
    slug: 'age-calculator',
    title: 'Age Calculator',
    desc: 'Calculate exact age in years, months, days, and hours from any birthdate.',
    cat: 'lifestyle',
    icon: '🎂',
    toolType: 'estimator',
    fields: [
      { k: 'dob', l: 'Date of Birth', type: 'text', placeholder: '1990-01-15' },
    ],
    fn: (inputs) => {
      const dob = new Date(inputs.dob)
      if (isNaN(dob.getTime())) return [{ type: 'text', label: 'Error', content: 'Enter a valid date (YYYY-MM-DD).' }]
      const now = new Date()
      let years = now.getFullYear() - dob.getFullYear()
      let months = now.getMonth() - dob.getMonth()
      let days = now.getDate() - dob.getDate()
      if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate() }
      if (months < 0) { years--; months += 12 }
      const totalDays = Math.floor((now.getTime() - dob.getTime()) / 86400000)
      const nextBday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate())
      if (nextBday <= now) nextBday.setFullYear(now.getFullYear() + 1)
      const daysToNext = Math.ceil((nextBday.getTime() - now.getTime()) / 86400000)
      return [{
        type: 'table', label: 'Age Details', content: [
          { label: 'Age', value: `${years} years, ${months} months, ${days} days` },
          { label: 'Total days lived', value: totalDays.toLocaleString() },
          { label: 'Total weeks', value: Math.floor(totalDays / 7).toLocaleString() },
          { label: 'Total hours', value: (totalDays * 24).toLocaleString() },
          { label: 'Next birthday in', value: `${daysToNext} days` },
        ]
      }]
    },
    about: 'Age is typically expressed as the number of full years since birth. In medical and legal contexts, exact age in days or weeks can be critical — especially for newborns, pediatric dosing, and Social Security benefit calculations.',
    related: ['days-between-dates-calculator', 'countdown-timer', 'zodiac-sign-calculator'],
  },
  {
    slug: 'days-between-dates-calculator',
    title: 'Days Between Dates',
    desc: 'Calculate the exact number of days, weeks, and months between any two dates.',
    cat: 'lifestyle',
    icon: '📅',
    toolType: 'estimator',
    fields: [
      { k: 'start', l: 'Start Date', type: 'text', placeholder: '2025-01-01' },
      { k: 'end', l: 'End Date', type: 'text', placeholder: '2025-12-31' },
    ],
    fn: (inputs) => {
      const s = new Date(inputs.start), e = new Date(inputs.end)
      if (isNaN(s.getTime()) || isNaN(e.getTime())) return [{ type: 'text', label: 'Error', content: 'Enter valid dates (YYYY-MM-DD).' }]
      const diff = Math.abs(e.getTime() - s.getTime())
      const days = Math.floor(diff / 86400000)
      const direction = e >= s ? 'after start' : 'before start'
      return [{
        type: 'table', label: 'Date Difference', content: [
          { label: 'Calendar days', value: `${days} (${direction})` },
          { label: 'Weeks', value: `${Math.floor(days / 7)} weeks, ${days % 7} days` },
          { label: 'Months (approx)', value: (days / 30.44).toFixed(1) },
          { label: 'Years (approx)', value: (days / 365.25).toFixed(2) },
          { label: 'Hours', value: (days * 24).toLocaleString() },
        ]
      }]
    },
    about: 'Date arithmetic is trickier than it appears — months have different lengths and leap years add a day every 4 years (with exceptions). This calculator uses millisecond-precise JavaScript Date objects for exact results.',
    related: ['age-calculator', 'work-days-calculator', 'countdown-timer'],
  },
  {
    slug: 'day-of-week-calculator',
    title: 'Day of Week Calculator',
    desc: 'Find the day of the week for any date in history or the future.',
    cat: 'lifestyle',
    icon: '📆',
    toolType: 'estimator',
    fields: [
      { k: 'date', l: 'Date', type: 'text', placeholder: '2025-07-04' },
    ],
    fn: (inputs) => {
      const d = new Date(inputs.date)
      if (isNaN(d.getTime())) return [{ type: 'text', label: 'Error', content: 'Enter a valid date (YYYY-MM-DD).' }]
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
      return [{
        type: 'table', label: 'Date Info', content: [
          { label: 'Day of Week', value: days[d.getDay()] },
          { label: 'Full Date', value: `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}` },
          { label: 'Day of Year', value: Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000).toString() },
          { label: 'Week of Year', value: Math.ceil(Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000) / 7).toString() },
          { label: 'Leap year?', value: isLeap(d.getFullYear()) ? 'Yes' : 'No' },
        ]
      }]
    },
    about: 'The Gregorian calendar was adopted in 1582 to correct the Julian calendar\'s drift. The algorithm for day-of-week calculation (Zeller\'s congruence or Doomsday) can determine any day in the Gregorian calendar from 1582 to well beyond 9999.',
    related: ['days-between-dates-calculator', 'work-days-calculator', 'date-format-converter'],
  },
  {
    slug: 'countdown-timer',
    title: 'Days Until Date Countdown',
    desc: 'Calculate how many days, hours, and minutes until any future event.',
    cat: 'lifestyle',
    icon: '⏳',
    toolType: 'estimator',
    fields: [
      { k: 'target', l: 'Target Date', type: 'text', placeholder: '2025-12-25' },
      { k: 'event', l: 'Event Name (optional)', type: 'text', placeholder: 'Christmas 2025' },
    ],
    fn: (inputs) => {
      const target = new Date(inputs.target)
      if (isNaN(target.getTime())) return [{ type: 'text', label: 'Error', content: 'Enter a valid target date.' }]
      const now = new Date()
      const diff = target.getTime() - now.getTime()
      const label = inputs.event || 'Target Date'
      if (diff < 0) return [{ type: 'text', label: 'Past Date', content: `${label} was ${Math.floor(Math.abs(diff) / 86400000)} days ago.` }]
      const days = Math.floor(diff / 86400000)
      const hrs = Math.floor((diff % 86400000) / 3600000)
      const mins = Math.floor((diff % 3600000) / 60000)
      const months = Math.floor(days / 30.44)
      return [{
        type: 'table', label: `Countdown to ${label}`, content: [
          { label: 'Days remaining', value: days.toLocaleString() },
          { label: 'Hours remaining', value: `${hrs}h ${mins}m` },
          { label: 'Months remaining', value: months.toString() },
          { label: 'Weeks remaining', value: `${Math.floor(days / 7)} weeks, ${days % 7} days` },
          { label: 'Date', value: target.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
        ]
      }]
    },
    about: 'Countdown tools are useful for project deadlines, tax filing dates, and event planning. The US tax filing deadline is typically April 15; FAFSA deadlines and enrollment periods have strict cut-off dates that affect financial aid and insurance coverage.',
    related: ['days-between-dates-calculator', 'work-days-calculator', 'day-of-week-calculator'],
  },
  {
    slug: 'work-days-calculator',
    title: 'Work Days Calculator',
    desc: 'Count business days between two dates, excluding weekends (and optionally US holidays).',
    cat: 'lifestyle',
    icon: '💼',
    toolType: 'estimator',
    fields: [
      { k: 'start', l: 'Start Date', type: 'text', placeholder: '2025-01-01' },
      { k: 'end', l: 'End Date', type: 'text', placeholder: '2025-01-31' },
    ],
    fn: (inputs) => {
      const s = new Date(inputs.start), e = new Date(inputs.end)
      if (isNaN(s.getTime()) || isNaN(e.getTime())) return [{ type: 'text', label: 'Error', content: 'Enter valid dates.' }]
      const [start, end] = s <= e ? [s, e] : [e, s]
      let workDays = 0; const current = new Date(start)
      while (current <= end) { const d = current.getDay(); if (d !== 0 && d !== 6) workDays++; current.setDate(current.getDate() + 1) }
      const totalDays = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1
      const weekends = totalDays - workDays
      return [{
        type: 'table', label: 'Business Days', content: [
          { label: 'Work days (Mon–Fri)', value: workDays.toString() },
          { label: 'Weekend days', value: weekends.toString() },
          { label: 'Total calendar days', value: totalDays.toString() },
          { label: 'Note', value: 'Excludes US federal holidays — subtract manually' },
        ]
      }]
    },
    about: 'The US has 10 federal holidays per year. Many contracts, shipping estimates, and legal deadlines count only business days. A typical work year has 260 business days (52 weeks × 5 days), minus 10 holidays = 250 working days.',
    related: ['days-between-dates-calculator', 'day-of-week-calculator', 'countdown-timer'],
  },
  {
    slug: 'zodiac-sign-calculator',
    title: 'Zodiac Sign Calculator',
    desc: 'Find your Western zodiac sign and basic personality traits from your birth date.',
    cat: 'lifestyle',
    icon: '⭐',
    toolType: 'estimator',
    fields: [
      { k: 'date', l: 'Birth Date', type: 'text', placeholder: '1990-06-15' },
    ],
    fn: (inputs) => {
      const d = new Date(inputs.date)
      if (isNaN(d.getTime())) return [{ type: 'text', label: 'Error', content: 'Enter a valid birth date.' }]
      const m = d.getMonth() + 1, day = d.getDate()
      const signs: [number, number, string, string, string][] = [
        [3, 21, 'Aries', '♈', 'Fire — Courageous, energetic, impulsive'],
        [4, 20, 'Taurus', '♉', 'Earth — Reliable, patient, stubborn'],
        [5, 21, 'Gemini', '♊', 'Air — Adaptable, curious, inconsistent'],
        [6, 21, 'Cancer', '♋', 'Water — Loyal, emotional, moody'],
        [7, 23, 'Leo', '♌', 'Fire — Generous, creative, arrogant'],
        [8, 23, 'Virgo', '♍', 'Earth — Analytical, kind, critical'],
        [9, 23, 'Libra', '♎', 'Air — Diplomatic, fair, indecisive'],
        [10, 23, 'Scorpio', '♏', 'Water — Passionate, resourceful, secretive'],
        [11, 22, 'Sagittarius', '♐', 'Fire — Generous, idealistic, impatient'],
        [12, 22, 'Capricorn', '♑', 'Earth — Disciplined, responsible, pessimistic'],
        [1, 20, 'Aquarius', '♒', 'Air — Progressive, independent, aloof'],
        [2, 19, 'Pisces', '♓', 'Water — Compassionate, artistic, fearful'],
        [3, 20, 'Pisces', '♓', 'Water — Compassionate, artistic, fearful'],
      ]
      let sign: [number, number, string, string, string] = signs[signs.length - 1]
      for (const s of signs) { if (m < s[0] || (m === s[0] && day <= s[1])) { sign = s; break } }
      return [{
        type: 'table', label: 'Your Zodiac Sign', content: [
          { label: 'Sign', value: `${sign[3]} ${sign[2]}` },
          { label: 'Element & Traits', value: sign[4] },
          { label: 'Ruling Planet', value: sign[2] === 'Aries' ? 'Mars' : sign[2] === 'Taurus' ? 'Venus' : sign[2] === 'Gemini' ? 'Mercury' : sign[2] === 'Cancer' ? 'Moon' : sign[2] === 'Leo' ? 'Sun' : sign[2] === 'Virgo' ? 'Mercury' : sign[2] === 'Libra' ? 'Venus' : sign[2] === 'Scorpio' ? 'Pluto' : sign[2] === 'Sagittarius' ? 'Jupiter' : sign[2] === 'Capricorn' ? 'Saturn' : sign[2] === 'Aquarius' ? 'Uranus' : 'Neptune' },
        ]
      }]
    },
    about: 'Western astrology divides the year into 12 signs based on the sun\'s position at birth. The system dates back to ancient Babylon and was systematized by Greek astronomers around 400 BCE. No scientific evidence supports astrological predictions.',
    related: ['age-calculator', 'chinese-zodiac-calculator', 'day-of-week-calculator'],
  },
  {
    slug: 'chinese-zodiac-calculator',
    title: 'Chinese Zodiac Calculator',
    desc: 'Find your Chinese zodiac animal and element from your birth year.',
    cat: 'lifestyle',
    icon: '🐉',
    toolType: 'estimator',
    fields: [
      { k: 'year', l: 'Birth Year', type: 'number', placeholder: '1990' },
    ],
    fn: (inputs) => {
      const year = parseInt(inputs.year)
      if (isNaN(year)) return [{ type: 'text', label: 'Error', content: 'Enter a valid year.' }]
      const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig']
      const elements = ['Metal', 'Water', 'Wood', 'Fire', 'Earth']
      const icons = ['🐀', '🐂', '🐯', '🐰', '🐉', '🐍', '🐴', '🐑', '🐒', '🐓', '🐕', '🐷']
      const traits: Record<string, string> = { Rat: 'Quick-witted, resourceful, versatile', Ox: 'Diligent, dependable, strong', Tiger: 'Brave, confident, competitive', Rabbit: 'Quiet, elegant, kind', Dragon: 'Confident, intelligent, enthusiastic', Snake: 'Enigmatic, intelligent, wise', Horse: 'Animated, active, energetic', Goat: 'Calm, gentle, sympathetic', Monkey: 'Sharp, smart, curious', Rooster: 'Observant, hardworking, courageous', Dog: 'Loyal, honest, prudent', Pig: 'Compassionate, generous, diligent' }
      const animal = animals[(year - 4) % 12]
      const element = elements[Math.floor(((year - 4) % 10) / 2)]
      const icon = icons[(year - 4) % 12]
      return [{
        type: 'table', label: 'Chinese Zodiac', content: [
          { label: 'Animal', value: `${icon} ${animal}` },
          { label: 'Element (10-year cycle)', value: element },
          { label: 'Traits', value: traits[animal] },
          { label: 'Next year of the', value: `${animal}: ${year + 12}` },
        ]
      }]
    },
    about: 'The Chinese zodiac repeats on a 12-year cycle, with each year named after an animal. A 10-year element cycle overlays the animal cycle, creating a 60-year "sexagenary cycle." The cycle begins on Chinese New Year (late January or February), not January 1.',
    related: ['zodiac-sign-calculator', 'age-calculator'],
  },
  {
    slug: 'reading-time-estimator',
    title: 'Reading Time Estimator',
    desc: 'Estimate how long it takes to read any text based on word count and reading speed.',
    cat: 'lifestyle',
    icon: '📖',
    toolType: 'estimator',
    fields: [
      { k: 'words', l: 'Word Count', type: 'number', placeholder: '2000' },
      {
        k: 'speed',
        l: 'Reading Speed',
        type: 'select',
        options: [
          { value: '150', label: 'Slow (150 WPM)' },
          { value: '238', label: 'Average (238 WPM)' },
          { value: '300', label: 'Fast (300 WPM)' },
          { value: '400', label: 'Speed reader (400 WPM)' },
        ],
      },
    ],
    fn: (inputs) => {
      const words = parseFloat(inputs.words) || 0, wpm = parseFloat(inputs.speed) || 238
      const mins = words / wpm
      const hrs = Math.floor(mins / 60), remMins = Math.round(mins % 60)
      return [{
        type: 'table', label: 'Reading Time', content: [
          { label: 'Reading time', value: hrs > 0 ? `${hrs}h ${remMins}m` : `${Math.round(mins)} minutes` },
          { label: 'Words', value: words.toLocaleString() },
          { label: 'Pages (250 words/page)', value: Math.ceil(words / 250).toString() },
          { label: 'At 150 WPM', value: `${Math.round(words / 150)} min` },
          { label: 'At 400 WPM', value: `${Math.round(words / 400)} min` },
        ]
      }]
    },
    about: 'Research by Brysbaert (2019) found the average adult reads 238 words per minute silently. Blog posts average 1,500–2,500 words (6–10 minutes); the average nonfiction book is 70,000–80,000 words (4–5 hours at average speed).',
    related: ['words-counter', 'words-to-pages-converter', 'reading-speed-converter'],
  },
  {
    slug: 'words-counter',
    title: 'Word and Character Counter',
    desc: 'Count words, characters, sentences, and paragraphs in any text.',
    cat: 'lifestyle',
    icon: '🔢',
    toolType: 'checker',
    fields: [
      { k: 'text', l: 'Text', type: 'textarea', placeholder: 'Paste your text here...' },
    ],
    fn: (inputs) => {
      const text = inputs.text || ''
      const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
      const chars = text.length
      const charsNoSpace = text.replace(/\s/g, '').length
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
      const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length
      const readMins = Math.ceil(words / 238)
      return [{
        type: 'table', label: 'Text Statistics', content: [
          { label: 'Words', value: words.toLocaleString() },
          { label: 'Characters (with spaces)', value: chars.toLocaleString() },
          { label: 'Characters (no spaces)', value: charsNoSpace.toLocaleString() },
          { label: 'Sentences', value: sentences.toString() },
          { label: 'Paragraphs', value: paragraphs.toString() },
          { label: 'Reading time', value: `${readMins} min` },
          { label: 'Avg words per sentence', value: sentences > 0 ? (words / sentences).toFixed(1) : '0' },
        ]
      }]
    },
    about: 'Twitter/X character limits are 280 characters; SMS is 160 characters. LinkedIn posts perform best at 1,300–2,000 characters. Google meta descriptions should be 150–160 characters. Academic papers typically require 5–10% margin on word counts.',
    related: ['reading-time-estimator', 'words-to-pages-converter', 'seo-meta-length-checker'],
  },
  {
    slug: 'character-counter',
    title: 'Character Counter',
    desc: 'Count characters for Twitter, Instagram captions, SMS, and meta descriptions.',
    cat: 'lifestyle',
    icon: '✏️',
    toolType: 'checker',
    fields: [
      { k: 'text', l: 'Text', type: 'textarea', placeholder: 'Type or paste text here...' },
      {
        k: 'platform',
        l: 'Platform Limit',
        type: 'select',
        options: [
          { value: '0', label: 'No limit' },
          { value: '280', label: 'Twitter/X (280)' },
          { value: '2200', label: 'Instagram caption (2,200)' },
          { value: '160', label: 'SMS (160)' },
          { value: '160', label: 'Meta description (160)' },
          { value: '70', label: 'Email subject (70)' },
          { value: '150', label: 'Instagram bio (150)' },
        ],
      },
    ],
    fn: (inputs) => {
      const text = inputs.text || ''
      const chars = text.length
      const limit = parseInt(inputs.platform) || 0
      const rows: { label: string; value: string }[] = [
        { label: 'Characters', value: chars.toLocaleString() },
        { label: 'Words', value: (text.trim() === '' ? 0 : text.trim().split(/\s+/).length).toString() },
      ]
      if (limit > 0) {
        const remaining = limit - chars
        rows.push({ label: 'Limit', value: limit.toLocaleString() })
        rows.push({ label: 'Remaining', value: remaining >= 0 ? remaining.toString() : `Over by ${Math.abs(remaining)}` })
        rows.push({ label: 'Status', value: remaining >= 0 ? 'Within limit ✓' : 'Exceeds limit ✗' })
      }
      return [{ type: 'table', label: 'Character Count', content: rows }]
    },
    about: 'Character limits vary significantly by platform. Twitter counts URLs as 23 characters regardless of length. Instagram hashtags count toward the 2,200 caption limit. Email subject lines beyond 60–70 characters are truncated in most clients.',
    related: ['words-counter', 'seo-meta-length-checker', 'email-subject-line-length-checker'],
  },
  {
    slug: 'readability-score-checker',
    title: 'Readability Score Checker',
    desc: 'Calculate Flesch-Kincaid readability scores and grade level for any text.',
    cat: 'lifestyle',
    icon: '📝',
    toolType: 'checker',
    fields: [
      { k: 'text', l: 'Text (minimum 100 words)', type: 'textarea', placeholder: 'Paste your text here...' },
    ],
    fn: (inputs) => {
      const text = inputs.text || ''
      const words = text.trim().split(/\s+/).filter(w => w.length > 0)
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
      if (words.length < 10) return [{ type: 'text', label: 'Error', content: 'Enter at least 10 words for an accurate score.' }]
      const countSyllables = (word: string) => {
        word = word.toLowerCase().replace(/[^a-z]/g, '')
        if (word.length <= 3) return 1
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
        const matches = word.match(/[aeiouy]{1,2}/g)
        return Math.max(1, matches ? matches.length : 1)
      }
      const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0)
      const asl = words.length / Math.max(1, sentences.length)
      const asw = syllables / words.length
      const fkease = 206.835 - 1.015 * asl - 84.6 * asw
      const fkgrade = 0.39 * asl + 11.8 * asw - 15.59
      const easeLevel = fkease >= 90 ? 'Very Easy (5th grade)' : fkease >= 80 ? 'Easy (6th grade)' : fkease >= 70 ? 'Fairly Easy (7th grade)' : fkease >= 60 ? 'Standard (8th-9th grade)' : fkease >= 50 ? 'Fairly Difficult (10th-12th)' : fkease >= 30 ? 'Difficult (College level)' : 'Very Difficult (Professional)'
      return [{
        type: 'table', label: 'Readability Scores', content: [
          { label: 'Flesch Reading Ease', value: `${fkease.toFixed(1)} — ${easeLevel}` },
          { label: 'Flesch-Kincaid Grade Level', value: `Grade ${Math.max(0, fkgrade).toFixed(1)}` },
          { label: 'Avg sentence length', value: `${asl.toFixed(1)} words` },
          { label: 'Avg syllables per word', value: asw.toFixed(2) },
          { label: 'Word count', value: words.length.toString() },
          { label: 'Sentence count', value: sentences.length.toString() },
        ]
      }]
    },
    about: 'The Flesch Reading Ease score (0–100) measures how easy text is to read. Magazine articles target 60–70; academic papers often score 30–50. The US government recommends writing at an 8th-grade level (grade 8 FK score) for public communications.',
    related: ['words-counter', 'grade-level-estimator', 'reading-time-estimator'],
  },
  {
    slug: 'grade-level-estimator',
    title: 'Writing Grade Level Estimator',
    desc: 'Estimate the US grade level required to understand your writing using multiple formulas.',
    cat: 'lifestyle',
    icon: '🎓',
    toolType: 'checker',
    fields: [
      { k: 'text', l: 'Text', type: 'textarea', placeholder: 'Paste text to analyze...' },
    ],
    fn: (inputs) => {
      const text = inputs.text || ''
      const words = text.trim().split(/\s+/).filter(w => w.length > 0)
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
      if (words.length < 5) return [{ type: 'text', label: 'Error', content: 'Enter at least 5 words.' }]
      const countSyllables = (w: string) => { w = w.toLowerCase().replace(/[^a-z]/g, ''); if (w.length <= 3) return 1; const m = w.match(/[aeiouy]{1,2}/g); return Math.max(1, m ? m.length : 1) }
      const syllables = words.reduce((s, w) => s + countSyllables(w), 0)
      const asl = words.length / Math.max(1, sentences.length)
      const asw = syllables / words.length
      const fk = Math.max(0, 0.39 * asl + 11.8 * asw - 15.59)
      const ari = 4.71 * (words.join('').length / words.length) + 0.5 * asl - 21.43
      const colemanLiau = 5.88 * (words.join('').length / words.length) - 29.6 * (sentences.length / words.length) - 15.8
      const avg = (fk + Math.max(0, ari) + Math.max(0, colemanLiau)) / 3
      return [{
        type: 'table', label: 'Grade Level Estimates', content: [
          { label: 'Flesch-Kincaid Grade Level', value: `Grade ${fk.toFixed(1)}` },
          { label: 'Automated Readability Index', value: `Grade ${Math.max(0, ari).toFixed(1)}` },
          { label: 'Coleman-Liau Index', value: `Grade ${Math.max(0, colemanLiau).toFixed(1)}` },
          { label: 'Average grade level', value: `Grade ${avg.toFixed(1)}` },
          { label: 'Target for general public', value: 'Grade 7–8' },
        ]
      }]
    },
    about: 'Different readability formulas weight different factors. Flesch-Kincaid uses syllables and sentence length; Coleman-Liau uses character count. No single formula is definitive — average multiple scores for a more reliable estimate.',
    related: ['readability-score-checker', 'words-counter', 'reading-time-estimator'],
  },
  {
    slug: 'sleep-cycle-calculator',
    title: 'Sleep Cycle Calculator',
    desc: 'Calculate ideal wake-up or bedtimes based on 90-minute sleep cycles.',
    cat: 'lifestyle',
    icon: '😴',
    toolType: 'estimator',
    fields: [
      { k: 'time', l: 'Bedtime or Wake Time (HH:MM)', type: 'text', placeholder: '22:30' },
      {
        k: 'mode',
        l: 'Mode',
        type: 'select',
        options: [
          { value: 'wake', label: 'I\'m going to sleep — show wake times' },
          { value: 'bed', label: 'I need to wake at this time — show bedtimes' },
        ],
      },
    ],
    fn: (inputs) => {
      const [h, m] = inputs.time.split(':').map(Number)
      if (isNaN(h) || isNaN(m)) return [{ type: 'text', label: 'Error', content: 'Enter time as HH:MM (e.g., 22:30).' }]
      const baseMin = h * 60 + m + 14 // +14 min to fall asleep
      const rows: { label: string; value: string }[] = []
      if (inputs.mode === 'wake') {
        for (let i = 3; i <= 6; i++) {
          const wakeMin = (baseMin + i * 90) % (24 * 60)
          const wh = Math.floor(wakeMin / 60), wm = wakeMin % 60
          const period = wh < 12 ? 'AM' : 'PM'
          const displayH = wh % 12 || 12
          rows.push({ label: `${i} cycles (${i * 1.5} hrs)`, value: `${displayH}:${wm.toString().padStart(2, '0')} ${period}` })
        }
      } else {
        for (let i = 3; i <= 6; i++) {
          const wakeMin = (h * 60 + m)
          const bedMin = (wakeMin - i * 90 - 14 + 24 * 60) % (24 * 60)
          const bh = Math.floor(bedMin / 60), bm = bedMin % 60
          const period = bh < 12 ? 'AM' : 'PM'
          const displayH = bh % 12 || 12
          rows.push({ label: `${i} cycles (${i * 1.5} hrs of sleep)`, value: `Go to bed at ${displayH}:${bm.toString().padStart(2, '0')} ${period}` })
        }
      }
      return [{ type: 'table', label: 'Optimal Sleep Times', content: rows }]
    },
    about: 'Sleep cycles last approximately 90 minutes, cycling through light sleep, deep sleep, and REM sleep. Waking mid-cycle causes grogginess (sleep inertia); waking at cycle end feels natural. Adults typically need 5–6 cycles (7.5–9 hours) per night.',
    related: ['age-calculator', 'countdown-timer'],
  },
  {
    slug: 'tip-splitter',
    title: 'Tip Calculator and Bill Splitter',
    desc: 'Calculate tip amount and split a restaurant bill between any number of people.',
    cat: 'lifestyle',
    icon: '🍽️',
    toolType: 'estimator',
    fields: [
      { k: 'bill', l: 'Bill Amount', type: 'number', placeholder: '85.50', unit: '$' },
      { k: 'tip', l: 'Tip Percentage', type: 'number', placeholder: '20', unit: '%' },
      { k: 'people', l: 'Number of People', type: 'number', placeholder: '4' },
    ],
    fn: (inputs) => {
      const bill = parseFloat(inputs.bill) || 0, tip = (parseFloat(inputs.tip) || 20) / 100, people = parseFloat(inputs.people) || 1
      const tipAmt = bill * tip
      const total = bill + tipAmt
      const perPerson = total / people
      const tipPerPerson = tipAmt / people
      return [{
        type: 'table', label: 'Bill Summary', content: [
          { label: 'Subtotal', value: `$${bill.toFixed(2)}` },
          { label: 'Tip amount', value: `$${tipAmt.toFixed(2)}` },
          { label: 'Total', value: `$${total.toFixed(2)}` },
          { label: `Each person pays (${people})`, value: `$${perPerson.toFixed(2)}` },
          { label: 'Tip per person', value: `$${tipPerPerson.toFixed(2)}` },
        ]
      }]
    },
    about: 'US tip culture expects 18–20% at sit-down restaurants; 15% is considered minimum. Counter service and takeout have no expectation, though apps increasingly prompt for tips. NYC and other high-cost cities often see 20–25% as the norm.',
    related: ['bill-splitter', 'group-expense-tracker', 'streaming-cost-calculator'],
  },
  {
    slug: 'bill-splitter',
    title: 'Bill Splitter',
    desc: 'Split a bill unevenly between people with different items or percentages.',
    cat: 'lifestyle',
    icon: '🧾',
    toolType: 'estimator',
    fields: [
      { k: 'total', l: 'Total Bill', type: 'number', placeholder: '120', unit: '$' },
      { k: 'people', l: 'Number of People', type: 'number', placeholder: '3' },
      { k: 'tax', l: 'Tax Rate (optional)', type: 'number', placeholder: '8.875', unit: '%' },
    ],
    fn: (inputs) => {
      const total = parseFloat(inputs.total) || 0, people = parseFloat(inputs.people) || 1, taxRate = (parseFloat(inputs.tax) || 0) / 100
      const subtotal = total / (1 + taxRate)
      const tax = total - subtotal
      const perPerson = total / people
      const perPersonSubtotal = subtotal / people
      const perPersonTax = tax / people
      return [{
        type: 'table', label: 'Split Bill', content: [
          { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
          { label: 'Tax', value: `$${tax.toFixed(2)}` },
          { label: 'Total', value: `$${total.toFixed(2)}` },
          { label: `Per person (${people})`, value: `$${perPerson.toFixed(2)}` },
          { label: 'Per person subtotal', value: `$${perPersonSubtotal.toFixed(2)}` },
          { label: 'Per person tax', value: `$${perPersonTax.toFixed(2)}` },
        ]
      }]
    },
    about: 'New York City combined sales tax (city + state) is 8.875%. California varies by county, averaging ~9.5%. Most states exempt groceries from sales tax; restaurants always charge tax on prepared food.',
    related: ['tip-splitter', 'group-expense-tracker', 'gift-budget-calculator'],
  },
  {
    slug: 'gift-budget-calculator',
    title: 'Gift Budget Calculator',
    desc: 'Set a total gift budget and allocate amounts per person for holidays or events.',
    cat: 'lifestyle',
    icon: '🎁',
    toolType: 'estimator',
    fields: [
      { k: 'budget', l: 'Total Budget', type: 'number', placeholder: '500', unit: '$' },
      { k: 'people', l: 'Number of Recipients', type: 'number', placeholder: '10' },
      { k: 'priority', l: 'Priority Recipients (kids, close family)', type: 'number', placeholder: '3' },
      { k: 'ratio', l: 'Priority vs Regular Ratio', type: 'number', placeholder: '2' },
    ],
    fn: (inputs) => {
      const budget = parseFloat(inputs.budget) || 0, people = parseFloat(inputs.people) || 1, priority = parseFloat(inputs.priority) || 0, ratio = parseFloat(inputs.ratio) || 2
      const regular = people - priority
      const totalUnits = priority * ratio + regular
      const unitCost = budget / totalUnits
      const priorityCost = unitCost * ratio
      const regularCost = unitCost
      return [{
        type: 'table', label: 'Gift Budget Allocation', content: [
          { label: 'Total budget', value: `$${budget.toFixed(2)}` },
          { label: 'Priority recipients', value: `${priority} × $${priorityCost.toFixed(2)}` },
          { label: 'Regular recipients', value: `${regular} × $${regularCost.toFixed(2)}` },
          { label: 'Priority total', value: `$${(priority * priorityCost).toFixed(2)}` },
          { label: 'Regular total', value: `$${(regular * regularCost).toFixed(2)}` },
        ]
      }]
    },
    about: 'The average American spends about $900 on holiday gifts each year (NRF survey). Financial advisors recommend allocating 1–1.5% of annual income to holiday gifting. Setting a per-person cap before shopping prevents impulse overspending.',
    related: ['bill-splitter', 'group-expense-tracker', 'streaming-cost-calculator'],
  },
  {
    slug: 'recipe-scaler',
    title: 'Recipe Scaler',
    desc: 'Scale a recipe up or down by a factor to feed more or fewer people.',
    cat: 'lifestyle',
    icon: '🍳',
    toolType: 'estimator',
    fields: [
      { k: 'servings_orig', l: 'Original Servings', type: 'number', placeholder: '4' },
      { k: 'servings_new', l: 'Desired Servings', type: 'number', placeholder: '10' },
      { k: 'amount', l: 'Ingredient Amount', type: 'number', placeholder: '2' },
      {
        k: 'unit',
        l: 'Unit',
        type: 'select',
        options: [
          { value: 'cup', label: 'Cups' },
          { value: 'tbsp', label: 'Tablespoons' },
          { value: 'tsp', label: 'Teaspoons' },
          { value: 'oz', label: 'Ounces' },
          { value: 'g', label: 'Grams' },
          { value: 'lb', label: 'Pounds' },
          { value: 'unit', label: 'Units (items)' },
        ],
      },
    ],
    fn: (inputs) => {
      const orig = parseFloat(inputs.servings_orig) || 4, desired = parseFloat(inputs.servings_new) || 4, amount = parseFloat(inputs.amount) || 0
      const factor = desired / orig
      const newAmount = amount * factor
      const unit = inputs.unit
      const displayAmount = newAmount % 1 === 0 ? newAmount.toString() : newAmount.toFixed(2)
      return [{
        type: 'table', label: 'Scaled Recipe', content: [
          { label: 'Scale factor', value: `${factor.toFixed(2)}×` },
          { label: `New amount (${unit})`, value: displayAmount },
          { label: 'Original amount', value: `${amount} ${unit}` },
          { label: 'Note for large batches', value: 'Baking requires careful scaling; reduce leavening by 10–15%' },
        ]
      }]
    },
    about: 'Scaling savory recipes linearly works well; baking recipes require more care. Leavening agents (baking powder, yeast) shouldn\'t scale linearly for batches larger than 4×. Pan size also affects cooking time and temperature.',
    related: ['cooking-measurement-converter', 'flour-weight-converter', 'butter-converter'],
  },
  {
    slug: 'meal-prep-quantity-calculator',
    title: 'Meal Prep Quantity Calculator',
    desc: 'Calculate total ingredients needed for meal prep for a week of meals.',
    cat: 'lifestyle',
    icon: '🥗',
    toolType: 'estimator',
    fields: [
      { k: 'people', l: 'People to Feed', type: 'number', placeholder: '2' },
      { k: 'days', l: 'Days of Meal Prep', type: 'number', placeholder: '5' },
      { k: 'meals', l: 'Meals per Day', type: 'number', placeholder: '2' },
      { k: 'protein_oz', l: 'Protein per Meal (oz per person)', type: 'number', placeholder: '5' },
    ],
    fn: (inputs) => {
      const people = parseFloat(inputs.people) || 1, days = parseFloat(inputs.days) || 5, meals = parseFloat(inputs.meals) || 2, proteinOz = parseFloat(inputs.protein_oz) || 5
      const totalMeals = people * days * meals
      const totalProteinOz = totalMeals * proteinOz
      const totalProteinLb = totalProteinOz / 16
      const riceServings = totalMeals
      const vegCups = totalMeals * 1.5
      return [{
        type: 'table', label: 'Weekly Quantities', content: [
          { label: 'Total meals', value: totalMeals.toString() },
          { label: 'Protein needed', value: `${totalProteinOz.toFixed(0)} oz / ${totalProteinLb.toFixed(1)} lb` },
          { label: 'Grain (dry rice, ⅓ cup/meal)', value: `${(riceServings / 3).toFixed(1)} cups dry` },
          { label: 'Vegetables (1.5 cups/meal)', value: `${vegCups.toFixed(0)} cups` },
          { label: 'Approx. cooking time', value: `${(totalMeals * 10 / 60).toFixed(1)} hrs (10 min/meal active)` },
        ]
      }]
    },
    about: 'Batch cooking reduces weeknight cooking time by 60–80%. The USDA recommends 5–6 oz of protein per day. For meal prep efficiency, cook proteins in bulk, prepare grains once, and use a single sauce or seasoning across multiple meals.',
    related: ['recipe-scaler', 'cooking-measurement-converter', 'ingredient-substitution-guide'],
  },
  {
    slug: 'ingredient-substitution-guide',
    title: 'Ingredient Substitution Guide',
    desc: 'Common baking and cooking ingredient substitutions when you\'re out of something.',
    cat: 'lifestyle',
    icon: '🔄',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Common Ingredient Substitutions', content: [
        { label: '1 cup buttermilk', value: '1 cup milk + 1 tbsp lemon juice or white vinegar' },
        { label: '1 cup whole milk', value: '½ cup evaporated milk + ½ cup water' },
        { label: '1 large egg', value: '¼ cup unsweetened applesauce OR 3 tbsp aquafaba' },
        { label: '1 cup all-purpose flour', value: '1 cup + 2 tbsp cake flour OR ¾ cup whole wheat' },
        { label: '1 tsp baking powder', value: '¼ tsp baking soda + ½ tsp cream of tartar' },
        { label: '1 cup granulated sugar', value: '1 cup packed brown sugar OR ¾ cup honey' },
        { label: '1 cup butter', value: '1 cup margarine OR ⅞ cup vegetable oil' },
        { label: '1 oz unsweetened chocolate', value: '3 tbsp cocoa powder + 1 tbsp butter' },
        { label: '1 cup sour cream', value: '1 cup plain Greek yogurt' },
        { label: '1 cup heavy cream', value: '¾ cup milk + ¼ cup melted butter (for cooking)' },
        { label: '1 tbsp cornstarch (thickener)', value: '2 tbsp all-purpose flour' },
        { label: '1 cup breadcrumbs', value: '1 cup rolled oats OR crushed crackers' },
      ]
    }],
    about: 'Substitutions vary in effectiveness. Egg replacers work well in muffins and quick breads but not in custards. Oil-for-butter substitutions make baked goods moist but denser. Always test substitutions in non-critical recipes first.',
    related: ['recipe-scaler', 'cooking-measurement-converter', 'flour-weight-converter'],
  },
  {
    slug: 'coffee-strength-calculator',
    title: 'Coffee Strength Calculator',
    desc: 'Calculate coffee-to-water ratios for your preferred brew strength.',
    cat: 'lifestyle',
    icon: '☕',
    toolType: 'estimator',
    fields: [
      { k: 'water', l: 'Water Amount (oz)', type: 'number', placeholder: '12' },
      {
        k: 'strength',
        l: 'Preferred Strength',
        type: 'select',
        options: [
          { value: '15', label: 'Weak (1:17 ratio)' },
          { value: '16', label: 'Light (1:16 ratio)' },
          { value: '15.5', label: 'Standard (1:15.5 ratio)' },
          { value: '14', label: 'Strong (1:14 ratio)' },
          { value: '12', label: 'Very Strong (1:12 ratio)' },
        ],
      },
    ],
    fn: (inputs) => {
      const waterOz = parseFloat(inputs.water) || 12, ratio = parseFloat(inputs.strength) || 15.5
      const waterG = waterOz * 29.5735
      const coffeeG = waterG / ratio
      const coffeeOz = coffeeG / 28.35
      const coffeeTbsp = coffeeG / 6.25 // ~6.25g per tbsp
      return [{
        type: 'table', label: 'Coffee Measurement', content: [
          { label: 'Water', value: `${waterOz} oz / ${waterG.toFixed(0)} g` },
          { label: 'Ground coffee needed', value: `${coffeeG.toFixed(1)}g` },
          { label: 'Ground coffee (approx)', value: `${coffeeTbsp.toFixed(1)} tablespoons` },
          { label: 'Ground coffee', value: `${coffeeOz.toFixed(2)} oz` },
          { label: 'Ratio', value: `1:${ratio} (coffee:water)` },
          { label: 'SCA standard range', value: '1:14 to 1:17' },
        ]
      }]
    },
    about: 'The Specialty Coffee Association (SCA) recommends a brewing ratio of 1:15.5 to 1:17 (coffee to water by weight). Weighing coffee beans is significantly more consistent than using volume measures, as grind size affects density.',
    related: ['cooking-measurement-converter', 'recipe-scaler', 'water-usage-calculator'],
  },
  {
    slug: 'wine-pairing-guide',
    title: 'Wine Pairing Guide',
    desc: 'Quick reference for pairing wines with common food categories.',
    cat: 'lifestyle',
    icon: '🍷',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Wine and Food Pairings', content: [
        { label: 'Beef (grilled, steak)', value: 'Cabernet Sauvignon, Malbec, Syrah' },
        { label: 'Lamb', value: 'Cabernet Franc, Syrah, Rioja' },
        { label: 'Pork', value: 'Pinot Noir, Grenache, Riesling' },
        { label: 'Chicken (roasted)', value: 'Chardonnay, Pinot Gris, light Pinot Noir' },
        { label: 'Fish (delicate, white)', value: 'Sauvignon Blanc, Pinot Grigio, Chablis' },
        { label: 'Salmon', value: 'Chardonnay, Rosé, Pinot Noir' },
        { label: 'Shellfish / oysters', value: 'Muscadet, Champagne, Dry Riesling' },
        { label: 'Pasta (tomato sauce)', value: 'Chianti, Barbera, Sangiovese' },
        { label: 'Pasta (cream sauce)', value: 'Chardonnay, Pinot Grigio, Soave' },
        { label: 'Pizza', value: 'Chianti, Barbera, Nero d\'Avola' },
        { label: 'Hard cheese', value: 'Cabernet, Port, Sherry' },
        { label: 'Soft cheese / brie', value: 'Champagne, Sancerre, Chablis' },
        { label: 'Blue cheese', value: 'Sauternes, Port, Riesling (sweet)' },
        { label: 'Chocolate desserts', value: 'Port, Banyuls, Merlot' },
        { label: 'Spicy food', value: 'Off-dry Riesling, Gewürztraminer, Rosé' },
      ]
    }],
    about: 'The basic pairing principle — white with fish, red with meat — is an oversimplification but a useful starting point. Sauce weight matters as much as protein: a rich cream sauce can call for a fuller white over a light red. Regional pairings (Italian wine with Italian food) work reliably.',
    related: ['wine-bottle-size-converter', 'alcohol-abv-converter', 'tea-steeping-guide'],
  },
  {
    slug: 'tea-steeping-guide',
    title: 'Tea Steeping Guide',
    desc: 'Water temperatures and steep times for green, black, white, oolong, and herbal teas.',
    cat: 'lifestyle',
    icon: '🍵',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Tea Steeping Reference', content: [
        { label: 'White tea', value: '160–170°F (71–77°C) — 1–3 min' },
        { label: 'Green tea', value: '160–180°F (71–82°C) — 1–3 min' },
        { label: 'Yellow tea', value: '170–185°F (77–85°C) — 2–3 min' },
        { label: 'Oolong (light)', value: '180–195°F (82–90°C) — 2–3 min' },
        { label: 'Oolong (dark)', value: '190–205°F (88–96°C) — 3–5 min' },
        { label: 'Black tea', value: '200–212°F (93–100°C) — 3–5 min' },
        { label: 'Pu-erh', value: '200–212°F (93–100°C) — 2–4 min' },
        { label: 'Herbal / Tisane', value: '200–212°F (93–100°C) — 5–7 min' },
        { label: 'Chamomile', value: '200°F (93°C) — 5–10 min' },
        { label: 'Peppermint', value: '212°F (100°C) — 7–10 min' },
      ]
    }],
    about: 'Boiling water (212°F) scalds green and white teas, releasing bitter tannins. The lower temperatures preserve delicate catechins and provide a sweeter cup. Multiple steepings (gong fu style) are common with oolong and pu-erh; each subsequent steep gets 30 seconds longer.',
    related: ['temperature-converter', 'cooking-measurement-converter', 'wine-pairing-guide'],
  },
  {
    slug: 'subscription-audit-tool',
    title: 'Subscription Cost Audit',
    desc: 'Calculate total monthly and annual spending on subscriptions and streaming services.',
    cat: 'lifestyle',
    icon: '📺',
    toolType: 'estimator',
    fields: [
      { k: 'sub1', l: 'Subscription 1 Monthly Cost', type: 'number', placeholder: '15.99', unit: '$' },
      { k: 'sub2', l: 'Subscription 2 Monthly Cost', type: 'number', placeholder: '13.99', unit: '$' },
      { k: 'sub3', l: 'Subscription 3 Monthly Cost', type: 'number', placeholder: '9.99', unit: '$' },
      { k: 'sub4', l: 'Subscription 4 Monthly Cost', type: 'number', placeholder: '7.99', unit: '$' },
      { k: 'sub5', l: 'Subscription 5 Monthly Cost', type: 'number', placeholder: '0', unit: '$' },
    ],
    fn: (inputs) => {
      const costs = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5'].map(k => parseFloat(inputs[k]) || 0)
      const monthly = costs.reduce((a, b) => a + b, 0)
      const annual = monthly * 12
      const perDay = monthly / 30.44
      return [{
        type: 'table', label: 'Subscription Costs', content: [
          { label: 'Monthly total', value: `$${monthly.toFixed(2)}` },
          { label: 'Annual total', value: `$${annual.toFixed(2)}` },
          { label: 'Daily cost', value: `$${perDay.toFixed(2)}` },
          { label: 'Per-10-year cost', value: `$${(annual * 10).toFixed(0)}` },
          { label: 'Active subscriptions', value: costs.filter(c => c > 0).length.toString() },
        ]
      }]
    },
    about: 'Americans spend an average of $237 per month on subscriptions, according to a 2023 study — far more than they estimate. Subscription costs are often set just below key psychological thresholds ($9.99, $14.99) to minimize perceived cost.',
    related: ['streaming-cost-calculator', 'net-worth-snapshot', 'emergency-fund-checker'],
  },
  {
    slug: 'streaming-cost-calculator',
    title: 'Streaming Service Cost Calculator',
    desc: 'Compare streaming service costs per month and per hour of content you watch.',
    cat: 'lifestyle',
    icon: '📺',
    toolType: 'estimator',
    fields: [
      { k: 'cost', l: 'Monthly Cost', type: 'number', placeholder: '15.99', unit: '$' },
      { k: 'hours', l: 'Hours Watched per Week', type: 'number', placeholder: '10' },
    ],
    fn: (inputs) => {
      const cost = parseFloat(inputs.cost) || 0, hoursPerWeek = parseFloat(inputs.hours) || 1
      const hoursPerMonth = hoursPerWeek * 4.33
      const perHour = cost / hoursPerMonth
      const annual = cost * 12
      return [{
        type: 'table', label: 'Streaming Value', content: [
          { label: 'Monthly cost', value: `$${cost.toFixed(2)}` },
          { label: 'Annual cost', value: `$${annual.toFixed(2)}` },
          { label: 'Hours/month', value: hoursPerMonth.toFixed(1) },
          { label: 'Cost per hour', value: `$${perHour.toFixed(2)}` },
          { label: 'Value vs. movie tickets ($15)', value: perHour < 1.5 ? 'Good value' : perHour < 3 ? 'Moderate value' : 'Consider watching more or canceling' },
        ]
      }]
    },
    about: 'Netflix raised US prices to $15.49 (Standard) and $22.99 (4K) in 2023. Disney+, Max, Hulu, Paramount+, Peacock, and Apple TV+ each charge $7.99–$22.99/month. The average household subscribes to 3+ services, spending $40–$60/month on streaming.',
    related: ['subscription-audit-tool', 'phone-plan-calculator', 'net-worth-snapshot'],
  },
  {
    slug: 'emergency-fund-checker',
    title: 'Emergency Fund Checker',
    desc: 'Check if your emergency fund meets the recommended 3–6 months of expenses.',
    cat: 'lifestyle',
    icon: '🚨',
    toolType: 'estimator',
    fields: [
      { k: 'monthly', l: 'Monthly Essential Expenses', type: 'number', placeholder: '3000', unit: '$' },
      { k: 'saved', l: 'Current Emergency Fund', type: 'number', placeholder: '5000', unit: '$' },
    ],
    fn: (inputs) => {
      const monthly = parseFloat(inputs.monthly) || 0, saved = parseFloat(inputs.saved) || 0
      const months = saved / monthly
      const target3 = monthly * 3, target6 = monthly * 6
      const status = months >= 6 ? 'Fully funded (6+ months) ✓' : months >= 3 ? 'Adequately funded (3+ months)' : months >= 1 ? 'Underfunded — keep building' : 'Critical — prioritize this'
      return [{
        type: 'table', label: 'Emergency Fund Status', content: [
          { label: 'Months covered', value: `${months.toFixed(1)} months` },
          { label: 'Status', value: status },
          { label: '3-month target', value: `$${target3.toFixed(0)}` },
          { label: '6-month target', value: `$${target6.toFixed(0)}` },
          { label: 'Gap to 3 months', value: saved >= target3 ? 'Funded ✓' : `$${(target3 - saved).toFixed(0)}` },
          { label: 'Gap to 6 months', value: saved >= target6 ? 'Funded ✓' : `$${(target6 - saved).toFixed(0)}` },
        ]
      }]
    },
    about: 'Financial planners recommend 3 months of expenses for dual-income households and 6 months for single-income or variable-income earners. Self-employed individuals and those in volatile industries should target 9–12 months.',
    related: ['net-worth-snapshot', 'debt-payoff-estimator', 'savings-estimator'],
  },
  {
    slug: 'net-worth-snapshot',
    title: 'Net Worth Snapshot',
    desc: 'Calculate your net worth from assets and liabilities in 60 seconds.',
    cat: 'lifestyle',
    icon: '💎',
    toolType: 'estimator',
    fields: [
      { k: 'home', l: 'Home Value', type: 'number', placeholder: '400000', unit: '$' },
      { k: 'investments', l: 'Investment Accounts (401k, IRA, brokerage)', type: 'number', placeholder: '100000', unit: '$' },
      { k: 'cash', l: 'Cash and Savings', type: 'number', placeholder: '20000', unit: '$' },
      { k: 'other_assets', l: 'Other Assets (car, valuables)', type: 'number', placeholder: '15000', unit: '$' },
      { k: 'mortgage', l: 'Mortgage Balance', type: 'number', placeholder: '280000', unit: '$' },
      { k: 'other_debt', l: 'Other Debts (student loans, cards)', type: 'number', placeholder: '30000', unit: '$' },
    ],
    fn: (inputs) => {
      const assets = (parseFloat(inputs.home) || 0) + (parseFloat(inputs.investments) || 0) + (parseFloat(inputs.cash) || 0) + (parseFloat(inputs.other_assets) || 0)
      const liabilities = (parseFloat(inputs.mortgage) || 0) + (parseFloat(inputs.other_debt) || 0)
      const netWorth = assets - liabilities
      const debtRatio = liabilities / assets * 100
      return [{
        type: 'table', label: 'Net Worth', content: [
          { label: 'Total assets', value: `$${assets.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` },
          { label: 'Total liabilities', value: `$${liabilities.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` },
          { label: 'Net worth', value: `$${netWorth.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` },
          { label: 'Debt-to-asset ratio', value: `${debtRatio.toFixed(1)}%` },
          { label: 'Status', value: netWorth > 0 ? 'Positive net worth' : 'Negative net worth — focus on debt payoff' },
        ]
      }]
    },
    about: 'The median US household net worth was $192,700 in 2022 (Federal Reserve Survey of Consumer Finances). The mean was $1,063,700, skewed by ultra-wealthy households. Homeownership accounts for about 28% of median household wealth.',
    related: ['emergency-fund-checker', 'debt-payoff-estimator', 'financial-health-score'],
  },
  {
    slug: 'financial-health-score',
    title: 'Financial Health Score',
    desc: 'Score your financial health across savings, debt, emergency fund, and retirement readiness.',
    cat: 'lifestyle',
    icon: '💯',
    toolType: 'estimator',
    fields: [
      { k: 'income', l: 'Annual Income', type: 'number', placeholder: '75000', unit: '$' },
      { k: 'savings_rate', l: 'Monthly Savings Rate', type: 'number', placeholder: '15', unit: '%' },
      { k: 'emergency_months', l: 'Emergency Fund (months)', type: 'number', placeholder: '3' },
      { k: 'debt_pct', l: 'Monthly Debt Payments as % of Income', type: 'number', placeholder: '20', unit: '%' },
      { k: 'retirement_pct', l: 'Retirement Savings (% of Income)', type: 'number', placeholder: '10', unit: '%' },
    ],
    fn: (inputs) => {
      const savingsRate = parseFloat(inputs.savings_rate) || 0
      const emergencyMonths = parseFloat(inputs.emergency_months) || 0
      const debtPct = parseFloat(inputs.debt_pct) || 0
      const retirementPct = parseFloat(inputs.retirement_pct) || 0
      const savingsScore = Math.min(25, savingsRate * 1.25)
      const emergencyScore = Math.min(25, emergencyMonths / 6 * 25)
      const debtScore = Math.max(0, 25 - debtPct)
      const retirementScore = Math.min(25, retirementPct * 1.67)
      const total = savingsScore + emergencyScore + debtScore + retirementScore
      const grade = total >= 85 ? 'Excellent' : total >= 70 ? 'Good' : total >= 50 ? 'Fair' : total >= 30 ? 'Needs Work' : 'Poor'
      return [{
        type: 'table', label: 'Financial Health Score', content: [
          { label: 'Overall Score', value: `${total.toFixed(0)} / 100 — ${grade}` },
          { label: 'Savings Rate', value: `${savingsScore.toFixed(0)}/25` },
          { label: 'Emergency Fund', value: `${emergencyScore.toFixed(0)}/25` },
          { label: 'Debt Load', value: `${debtScore.toFixed(0)}/25` },
          { label: 'Retirement Readiness', value: `${retirementScore.toFixed(0)}/25` },
        ]
      }]
    },
    about: 'Financial planners recommend saving 20% of income (10% emergency/short-term + 10% retirement), keeping debt payments below 36% of gross income, maintaining a 6-month emergency fund, and contributing at least 10–15% to retirement.',
    related: ['net-worth-snapshot', 'emergency-fund-checker', 'debt-payoff-estimator'],
  },
  {
    slug: 'energy-usage-estimator',
    title: 'Home Energy Usage Estimator',
    desc: 'Estimate monthly electricity costs for common home appliances.',
    cat: 'lifestyle',
    icon: '⚡',
    toolType: 'estimator',
    fields: [
      { k: 'rate', l: 'Electricity Rate (¢/kWh)', type: 'number', placeholder: '16', unit: '¢' },
      { k: 'ac_hrs', l: 'AC Hours per Day (avg)', type: 'number', placeholder: '8' },
      { k: 'heat_hrs', l: 'Electric Heat Hours per Day', type: 'number', placeholder: '4' },
      { k: 'ev', l: 'EV Miles per Day (0 if none)', type: 'number', placeholder: '30' },
    ],
    fn: (inputs) => {
      const rate = (parseFloat(inputs.rate) || 16) / 100
      const acHrs = parseFloat(inputs.ac_hrs) || 0
      const heatHrs = parseFloat(inputs.heat_hrs) || 0
      const evMiles = parseFloat(inputs.ev) || 0
      const acKwh = acHrs * 3.5 * 30
      const heatKwh = heatHrs * 5 * 30
      const evKwh = evMiles / 4 * 30
      const baseKwh = 300 // baseline home usage
      const totalKwh = baseKwh + acKwh + heatKwh + evKwh
      const totalCost = totalKwh * rate
      return [{
        type: 'table', label: 'Monthly Energy Estimate', content: [
          { label: 'Baseline usage', value: `${baseKwh} kWh ($${(baseKwh * rate).toFixed(2)})` },
          { label: 'Air conditioning', value: `${acKwh.toFixed(0)} kWh ($${(acKwh * rate).toFixed(2)})` },
          { label: 'Electric heating', value: `${heatKwh.toFixed(0)} kWh ($${(heatKwh * rate).toFixed(2)})` },
          { label: 'EV charging', value: `${evKwh.toFixed(0)} kWh ($${(evKwh * rate).toFixed(2)})` },
          { label: 'Total monthly', value: `${totalKwh.toFixed(0)} kWh — $${totalCost.toFixed(2)}` },
        ]
      }]
    },
    about: 'The US average electricity rate is about 16¢/kWh, but rates vary from 9¢ (Louisiana) to 36¢ (Hawaii). Central air conditioning uses 3,000–5,000 watts; electric heat 3,500–7,000 watts. The US average home uses about 900 kWh per month.',
    related: ['solar-panel-savings-estimator', 'electric-vehicle-savings-calculator', 'water-usage-calculator'],
  },
  {
    slug: 'water-usage-calculator',
    title: 'Water Usage Calculator',
    desc: 'Estimate daily household water consumption and monthly utility costs.',
    cat: 'lifestyle',
    icon: '💧',
    toolType: 'estimator',
    fields: [
      { k: 'people', l: 'Household Members', type: 'number', placeholder: '3' },
      { k: 'showers', l: 'Showers per Day (total household)', type: 'number', placeholder: '3' },
      { k: 'shower_min', l: 'Average Shower Length (minutes)', type: 'number', placeholder: '8' },
      { k: 'rate', l: 'Water Rate ($/1,000 gallons)', type: 'number', placeholder: '4.00', unit: '$' },
    ],
    fn: (inputs) => {
      const people = parseFloat(inputs.people) || 1, showers = parseFloat(inputs.showers) || 1, showerMin = parseFloat(inputs.shower_min) || 8, rate = parseFloat(inputs.rate) || 4
      const showerGal = showers * showerMin * 2.1 // 2.1 gal/min standard showerhead
      const toiletGal = people * 5 * 1.6 // 5 flushes/day at 1.6 gal
      const faucetGal = people * 15 // 15 gal/day/person faucet use
      const dishGal = 6 // average dishwasher
      const totalDailyGal = showerGal + toiletGal + faucetGal + dishGal
      const monthlyGal = totalDailyGal * 30
      const monthlyCost = (monthlyGal / 1000) * rate
      return [{
        type: 'table', label: 'Monthly Water Usage', content: [
          { label: 'Showers', value: `${showerGal.toFixed(0)} gal/day` },
          { label: 'Toilets', value: `${toiletGal.toFixed(0)} gal/day` },
          { label: 'Faucet use', value: `${faucetGal.toFixed(0)} gal/day` },
          { label: 'Total daily', value: `${totalDailyGal.toFixed(0)} gallons` },
          { label: 'Total monthly', value: `${monthlyGal.toFixed(0)} gallons` },
          { label: 'Monthly water cost', value: `$${monthlyCost.toFixed(2)}` },
        ]
      }]
    },
    about: 'The average American uses 80–100 gallons of water per day indoors. Toilet flushing accounts for 24% of indoor use; showers 20%; faucets 19%. Low-flow showerheads (1.8 gal/min) vs standard (2.1–2.5 gal/min) can save 1,000+ gallons per person per year.',
    related: ['energy-usage-estimator', 'solar-panel-savings-estimator', 'carbon-footprint-estimator'],
  },
  {
    slug: 'solar-panel-savings-estimator',
    title: 'Solar Panel Savings Estimator',
    desc: 'Estimate solar panel savings, payback period, and 25-year ROI for your home.',
    cat: 'lifestyle',
    icon: '☀️',
    toolType: 'estimator',
    fields: [
      { k: 'monthly_bill', l: 'Current Monthly Electric Bill', type: 'number', placeholder: '150', unit: '$' },
      { k: 'system_cost', l: 'System Cost Before Incentives', type: 'number', placeholder: '18000', unit: '$' },
      { k: 'offset', l: 'Expected Offset (%)', type: 'number', placeholder: '90', unit: '%' },
    ],
    fn: (inputs) => {
      const monthlyBill = parseFloat(inputs.monthly_bill) || 0, systemCost = parseFloat(inputs.system_cost) || 0, offset = (parseFloat(inputs.offset) || 90) / 100
      const federalCredit = systemCost * 0.30
      const netCost = systemCost - federalCredit
      const annualSavings = monthlyBill * 12 * offset
      const payback = netCost / annualSavings
      const savings25yr = annualSavings * 25 - netCost
      return [{
        type: 'table', label: 'Solar Savings Estimate', content: [
          { label: 'Gross system cost', value: `$${systemCost.toLocaleString()}` },
          { label: 'Federal tax credit (30%)', value: `-$${federalCredit.toLocaleString()}` },
          { label: 'Net cost after credit', value: `$${netCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Annual savings', value: `$${annualSavings.toFixed(0)}` },
          { label: 'Payback period', value: `${payback.toFixed(1)} years` },
          { label: 'Net savings over 25 years', value: `$${savings25yr.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
        ]
      }]
    },
    about: 'The federal Investment Tax Credit (ITC) is 30% through 2032, dropping to 26% in 2033 and 22% in 2034. The average US solar system cost $2.95/watt in 2024 before incentives. Most systems break even in 6–12 years and produce power for 25–30 years.',
    related: ['energy-usage-estimator', 'electric-vehicle-savings-calculator', 'gas-vs-electric-car-calculator'],
  },
  {
    slug: 'electric-vehicle-savings-calculator',
    title: 'EV Savings Calculator',
    desc: 'Calculate fuel cost savings switching from a gas car to an electric vehicle.',
    cat: 'lifestyle',
    icon: '⚡',
    toolType: 'estimator',
    fields: [
      { k: 'miles', l: 'Annual Miles Driven', type: 'number', placeholder: '12000' },
      { k: 'mpg', l: 'Gas Car MPG', type: 'number', placeholder: '28' },
      { k: 'gas_price', l: 'Gas Price ($/gallon)', type: 'number', placeholder: '3.50', unit: '$' },
      { k: 'kwh_rate', l: 'Electricity Rate (¢/kWh)', type: 'number', placeholder: '16', unit: '¢' },
      { k: 'ev_mpge', l: 'EV MPGe', type: 'number', placeholder: '100' },
    ],
    fn: (inputs) => {
      const miles = parseFloat(inputs.miles) || 12000, mpg = parseFloat(inputs.mpg) || 28, gasPrice = parseFloat(inputs.gas_price) || 3.50, kwhRate = (parseFloat(inputs.kwh_rate) || 16) / 100, mpge = parseFloat(inputs.ev_mpge) || 100
      const gasCost = (miles / mpg) * gasPrice
      const evKwh = miles / mpge * 33.7 // 33.7 kWh per gallon equivalent
      const evCost = evKwh * kwhRate
      const annualSavings = gasCost - evCost
      const co2Saved = (miles / mpg) * 19.6 - (evKwh * 0.386) // lbs CO2
      return [{
        type: 'table', label: 'Annual Fuel Comparison', content: [
          { label: 'Gas car annual fuel cost', value: `$${gasCost.toFixed(0)}` },
          { label: 'EV annual electricity cost', value: `$${evCost.toFixed(0)}` },
          { label: 'Annual fuel savings', value: `$${annualSavings.toFixed(0)}` },
          { label: '5-year fuel savings', value: `$${(annualSavings * 5).toFixed(0)}` },
          { label: 'CO2 reduction (lbs/year)', value: `${Math.max(0, co2Saved).toFixed(0)} lbs` },
        ]
      }]
    },
    about: 'The EPA estimates EVs cost roughly half as much to fuel as comparable gas vehicles on a per-mile basis. At $3.50/gallon gas and 16¢/kWh electricity, driving 12,000 miles costs ~$1,500 in gas vs ~$640 in electricity for a comparable EV.',
    related: ['gas-vs-electric-car-calculator', 'fuel-efficiency-converter', 'energy-usage-estimator'],
  },
  {
    slug: 'gas-vs-electric-car-calculator',
    title: 'Gas vs Electric Car Cost Comparison',
    desc: 'Compare 5-year total cost of ownership between a gas car and an EV.',
    cat: 'lifestyle',
    icon: '🚗',
    toolType: 'estimator',
    fields: [
      { k: 'gas_price', l: 'Gas Vehicle Price', type: 'number', placeholder: '35000', unit: '$' },
      { k: 'ev_price', l: 'EV Price', type: 'number', placeholder: '42000', unit: '$' },
      { k: 'ev_credit', l: 'EV Tax Credit', type: 'number', placeholder: '7500', unit: '$' },
      { k: 'miles', l: 'Annual Miles', type: 'number', placeholder: '12000' },
      { k: 'mpg', l: 'Gas Car MPG', type: 'number', placeholder: '28' },
    ],
    fn: (inputs) => {
      const gasMsrp = parseFloat(inputs.gas_price) || 35000, evMsrp = parseFloat(inputs.ev_price) || 42000, credit = parseFloat(inputs.ev_credit) || 7500, miles = parseFloat(inputs.miles) || 12000, mpg = parseFloat(inputs.mpg) || 28
      const evNet = evMsrp - credit
      const gasFuel5 = (miles / mpg) * 3.50 * 5
      const evFuel5 = (miles / 100 * 33.7) * 0.16 * 5
      const gasMaint5 = 1200 * 5
      const evMaint5 = 600 * 5
      const gasTco5 = gasMsrp + gasFuel5 + gasMaint5
      const evTco5 = evNet + evFuel5 + evMaint5
      const evSavings = gasTco5 - evTco5
      return [{
        type: 'table', label: '5-Year Total Cost', content: [
          { label: 'Gas car TCO', value: `$${gasTco5.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'EV TCO (after credit)', value: `$${evTco5.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'EV savings over 5 years', value: `$${evSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Gas fuel cost (5yr)', value: `$${gasFuel5.toFixed(0)}` },
          { label: 'EV electricity cost (5yr)', value: `$${evFuel5.toFixed(0)}` },
        ]
      }]
    },
    about: 'The IRA (2022) provides a $7,500 tax credit for new EVs meeting income and price requirements, and a $4,000 credit for used EVs. EVs have significantly lower maintenance costs — no oil changes, fewer brake replacements (regenerative braking), simpler drivetrain.',
    related: ['electric-vehicle-savings-calculator', 'fuel-efficiency-converter', 'solar-panel-savings-estimator'],
  },
  {
    slug: 'carbon-footprint-estimator',
    title: 'Carbon Footprint Estimator',
    desc: 'Estimate your annual carbon footprint from transportation, home energy, and diet.',
    cat: 'lifestyle',
    icon: '🌱',
    toolType: 'estimator',
    fields: [
      { k: 'car_miles', l: 'Annual Car Miles', type: 'number', placeholder: '12000' },
      { k: 'mpg', l: 'Car MPG', type: 'number', placeholder: '28' },
      { k: 'flights', l: 'Short Flights per Year (<3 hrs)', type: 'number', placeholder: '2' },
      { k: 'electricity', l: 'Monthly Electricity (kWh)', type: 'number', placeholder: '900' },
      {
        k: 'diet',
        l: 'Diet Type',
        type: 'select',
        options: [
          { value: '3.3', label: 'Meat-heavy' },
          { value: '2.5', label: 'Average omnivore' },
          { value: '1.9', label: 'Vegetarian' },
          { value: '1.5', label: 'Vegan' },
        ],
      },
    ],
    fn: (inputs) => {
      const carMiles = parseFloat(inputs.car_miles) || 0, mpg = parseFloat(inputs.mpg) || 28, flights = parseFloat(inputs.flights) || 0, kwh = parseFloat(inputs.electricity) || 0, diet = parseFloat(inputs.diet) || 2.5
      const carTons = (carMiles / mpg) * 8.887 / 1000 // kg CO2 per gallon to tons
      const flightTons = flights * 0.255 // avg short flight ~0.255 tons
      const electricTons = kwh * 12 * 0.000386 // EPA grid average
      const dietTons = diet
      const total = carTons + flightTons + electricTons + dietTons
      const usAvg = 16 // tons CO2e per person per year
      return [{
        type: 'table', label: 'Annual Carbon Footprint', content: [
          { label: 'Driving', value: `${carTons.toFixed(1)} tons CO2` },
          { label: 'Flights', value: `${flightTons.toFixed(1)} tons CO2` },
          { label: 'Electricity', value: `${electricTons.toFixed(1)} tons CO2` },
          { label: 'Diet', value: `${dietTons.toFixed(1)} tons CO2` },
          { label: 'Total', value: `${total.toFixed(1)} tons CO2e/year` },
          { label: 'vs US average (16 tons)', value: total < usAvg ? `${(usAvg - total).toFixed(1)} tons below average` : `${(total - usAvg).toFixed(1)} tons above average` },
        ]
      }]
    },
    about: 'The average American emits about 16 metric tons of CO2-equivalent per year — more than twice the global average of 7 tons. Transportation (29%) and energy use (25%) are the largest personal footprint contributors. The Paris Agreement target implies a global average of under 2 tons by 2050.',
    related: ['electric-vehicle-savings-calculator', 'solar-panel-savings-estimator', 'energy-usage-estimator'],
  },
  {
    slug: 'phone-plan-calculator',
    title: 'Phone Plan Cost Calculator',
    desc: 'Compare total annual costs of different wireless plans and find the best value.',
    cat: 'lifestyle',
    icon: '📱',
    toolType: 'estimator',
    fields: [
      { k: 'plan1', l: 'Plan 1 Monthly Cost', type: 'number', placeholder: '80', unit: '$' },
      { k: 'plan2', l: 'Plan 2 Monthly Cost', type: 'number', placeholder: '55', unit: '$' },
      { k: 'lines', l: 'Number of Lines', type: 'number', placeholder: '1' },
    ],
    fn: (inputs) => {
      const p1 = parseFloat(inputs.plan1) || 0, p2 = parseFloat(inputs.plan2) || 0, lines = parseFloat(inputs.lines) || 1
      const p1Total = p1 * lines, p2Total = p2 * lines
      const annual1 = p1Total * 12, annual2 = p2Total * 12
      const diff = annual1 - annual2
      return [{
        type: 'table', label: 'Plan Comparison (Annual)', content: [
          { label: 'Plan 1 per month (all lines)', value: `$${p1Total.toFixed(2)}` },
          { label: 'Plan 1 per year', value: `$${annual1.toFixed(0)}` },
          { label: 'Plan 2 per month (all lines)', value: `$${p2Total.toFixed(2)}` },
          { label: 'Plan 2 per year', value: `$${annual2.toFixed(0)}` },
          { label: 'Difference per year', value: `$${Math.abs(diff).toFixed(0)} (Plan ${diff > 0 ? 2 : 1} is cheaper)` },
          { label: '5-year difference', value: `$${(Math.abs(diff) * 5).toFixed(0)}` },
        ]
      }]
    },
    about: 'Major carrier unlimited plans (Verizon, AT&T, T-Mobile) run $65–$80/month per line. MVNOs (TracFone, Mint Mobile, Cricket) use the same towers at $15–$45/month. Switching one line from a major carrier to an MVNO often saves $300–$500/year.',
    related: ['subscription-audit-tool', 'streaming-cost-calculator', 'internet-speed-checker-guide'],
  },
]
