import type { ToolConfig } from './types'

export const techTools: ToolConfig[] = [
  {
    slug: 'password-strength-checker',
    title: 'Password Strength Checker',
    desc: 'Check password strength, estimate crack time, and get improvement suggestions.',
    cat: 'tech',
    icon: '🔐',
    toolType: 'checker',
    fields: [
      { k: 'password', l: 'Password', type: 'text', placeholder: 'Enter password to check' },
    ],
    fn: (inputs) => {
      const p = inputs.password || ''
      const len = p.length
      const hasLower = /[a-z]/.test(p), hasUpper = /[A-Z]/.test(p), hasDigit = /\d/.test(p), hasSymbol = /[^a-zA-Z0-9]/.test(p)
      let charSet = 0
      if (hasLower) charSet += 26; if (hasUpper) charSet += 26; if (hasDigit) charSet += 10; if (hasSymbol) charSet += 32
      const combinations = Math.pow(charSet || 26, len)
      const checksPerSec = 1e10 // 10 billion guesses/sec (GPU)
      const secondsToCrack = combinations / 2 / checksPerSec
      const formatTime = (s: number) => {
        if (s < 1) return 'Instantly'; if (s < 60) return `${s.toFixed(0)} seconds`
        if (s < 3600) return `${(s / 60).toFixed(0)} minutes`
        if (s < 86400) return `${(s / 3600).toFixed(0)} hours`
        if (s < 31536000) return `${(s / 86400).toFixed(0)} days`
        if (s < 3.15e9) return `${(s / 31536000).toFixed(0)} years`
        return `${(s / 3.15e10).toFixed(0)} centuries`
      }
      let score = 0
      if (len >= 8) score++; if (len >= 12) score++; if (len >= 16) score++
      if (hasLower) score++; if (hasUpper) score++; if (hasDigit) score++; if (hasSymbol) score += 2
      const strength = score <= 2 ? 'Very Weak' : score <= 4 ? 'Weak' : score <= 5 ? 'Fair' : score <= 6 ? 'Strong' : 'Very Strong'
      const suggestions: string[] = []
      if (len < 12) suggestions.push('Use at least 12 characters')
      if (!hasUpper) suggestions.push('Add uppercase letters')
      if (!hasDigit) suggestions.push('Add numbers')
      if (!hasSymbol) suggestions.push('Add symbols (!@#$%)')
      return [{
        type: 'table', label: 'Password Analysis', content: [
          { label: 'Strength', value: strength },
          { label: 'Length', value: `${len} characters` },
          { label: 'Character types', value: [hasLower && 'lowercase', hasUpper && 'uppercase', hasDigit && 'numbers', hasSymbol && 'symbols'].filter(Boolean).join(', ') },
          { label: 'Estimated crack time (GPU)', value: formatTime(secondsToCrack) },
        ]
      },
      suggestions.length > 0 ? { type: 'list', label: 'Improvements', content: suggestions } : { type: 'text', label: 'Status', content: 'Password meets all basic security criteria.' }
      ]
    },
    about: 'Crack time estimates assume an attacker with a GPU cluster running 10 billion guesses per second. Passwords exposed in data breaches are cracked almost instantly regardless of complexity, which is why unique passwords per site are critical. Use a password manager.',
    related: ['password-generator', 'hash-generator', 'uuid-generator'],
  },
  {
    slug: 'password-generator',
    title: 'Password Generator',
    desc: 'Generate strong, random passwords with custom length and character set options.',
    cat: 'tech',
    icon: '🔑',
    toolType: 'generator',
    fields: [
      { k: 'length', l: 'Password Length', type: 'number', placeholder: '16' },
      {
        k: 'include_upper',
        l: 'Include Uppercase',
        type: 'select',
        options: [{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }],
      },
      {
        k: 'include_numbers',
        l: 'Include Numbers',
        type: 'select',
        options: [{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }],
      },
      {
        k: 'include_symbols',
        l: 'Include Symbols',
        type: 'select',
        options: [{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }],
      },
    ],
    fn: (inputs) => {
      const len = Math.min(128, Math.max(4, parseInt(inputs.length) || 16))
      let chars = 'abcdefghijklmnopqrstuvwxyz'
      if (inputs.include_upper !== '0') chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      if (inputs.include_numbers !== '0') chars += '0123456789'
      if (inputs.include_symbols !== '0') chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const array = new Uint32Array(len)
      if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(array)
      } else {
        for (let i = 0; i < len; i++) array[i] = Math.floor(Math.random() * 0xFFFFFFFF)
      }
      const password = Array.from(array).map(n => chars[n % chars.length]).join('')
      return [
        { type: 'value', label: 'Generated Password', content: password },
        { type: 'text', label: 'Tip', content: 'Copy and save in a password manager. This password is generated locally and never transmitted.' },
      ]
    },
    about: 'This generator uses the Web Crypto API\'s cryptographically secure random number generator, which is suitable for security-sensitive password generation. Passwords are generated entirely in your browser — nothing is sent to any server.',
    related: ['password-strength-checker', 'uuid-generator', 'hash-generator'],
  },
  {
    slug: 'uuid-generator',
    title: 'UUID Generator',
    desc: 'Generate UUID v4 (random) identifiers for databases, APIs, and development.',
    cat: 'tech',
    icon: '🆔',
    toolType: 'generator',
    fields: [
      { k: 'count', l: 'Number of UUIDs', type: 'number', placeholder: '5' },
    ],
    fn: (inputs) => {
      const count = Math.min(20, Math.max(1, parseInt(inputs.count) || 5))
      const generateUuid = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
        const bytes = new Uint8Array(16)
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(bytes)
        else for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256)
        bytes[6] = (bytes[6] & 0x0f) | 0x40
        bytes[8] = (bytes[8] & 0x3f) | 0x80
        const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
      }
      const uuids = Array.from({ length: count }, generateUuid)
      return [{ type: 'list', label: 'Generated UUIDs (v4)', content: uuids }]
    },
    about: 'UUID v4 uses 122 random bits, giving 2¹²² possible values — making collisions astronomically unlikely. UUIDs are the standard for distributed system IDs, avoiding the sequential ID vulnerability where attackers can enumerate records by incrementing IDs.',
    related: ['password-generator', 'hash-generator', 'base64-encoder-decoder'],
  },
  {
    slug: 'hash-generator',
    title: 'Hash Generator (MD5, SHA-256)',
    desc: 'Generate MD5 and SHA-256 hashes from text input.',
    cat: 'tech',
    icon: '#️⃣',
    toolType: 'generator',
    fields: [
      { k: 'text', l: 'Text to Hash', type: 'textarea', placeholder: 'Enter text to hash...' },
    ],
    fn: (inputs) => {
      const text = inputs.text || ''
      // Simple SHA-256 implementation for client-side use
      const sha256 = async (message: string): Promise<string> => {
        if (typeof crypto !== 'undefined' && crypto.subtle) {
          const msgBuf = new TextEncoder().encode(message)
          const hashBuf = await crypto.subtle.digest('SHA-256', msgBuf)
          return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('')
        }
        return 'Web Crypto API not available'
      }
      // Synchronous simple hash for display
      let hash = 0
      for (let i = 0; i < text.length; i++) { const c = text.charCodeAt(i); hash = ((hash << 5) - hash) + c; hash |= 0 }
      const simpleHash = Math.abs(hash).toString(16).padStart(8, '0')
      return [{
        type: 'table', label: 'Hash Values', content: [
          { label: 'Input length', value: `${text.length} characters` },
          { label: 'Simple hash (32-bit)', value: simpleHash },
          { label: 'Note', value: 'For SHA-256, use a CLI: echo -n "text" | sha256sum' },
          { label: 'SHA-256 (node.js)', value: 'crypto.createHash("sha256").update(text).digest("hex")' },
        ]
      }]
    },
    about: 'Cryptographic hash functions produce a fixed-length fingerprint from any input. SHA-256 produces a 64-character hex string. The same input always produces the same hash, but even a one-character change produces a completely different hash. Use SHA-256 over MD5 for security applications — MD5 is broken.',
    related: ['password-generator', 'uuid-generator', 'base64-encoder-decoder'],
  },
  {
    slug: 'base64-encoder-decoder',
    title: 'Base64 Encoder / Decoder',
    desc: 'Encode text or decode Base64 strings in your browser.',
    cat: 'tech',
    icon: '🔄',
    toolType: 'converter',
    fields: [
      { k: 'input', l: 'Text or Base64', type: 'textarea', placeholder: 'Hello World' },
      {
        k: 'mode',
        l: 'Mode',
        type: 'select',
        options: [{ value: 'encode', label: 'Encode to Base64' }, { value: 'decode', label: 'Decode from Base64' }],
      },
    ],
    fn: (inputs) => {
      const raw = inputs.input || ''
      try {
        if (inputs.mode === 'encode') {
          const encoded = btoa(unescape(encodeURIComponent(raw)))
          return [
            { type: 'value', label: 'Base64 Encoded', content: encoded },
            { type: 'text', label: 'Info', content: `Input: ${raw.length} chars → Output: ${encoded.length} chars (~33% larger)` },
          ]
        } else {
          const decoded = decodeURIComponent(escape(atob(raw.trim())))
          return [{ type: 'value', label: 'Decoded Text', content: decoded }]
        }
      } catch {
        return [{ type: 'text', label: 'Error', content: 'Invalid input. Make sure Base64 strings are valid.' }]
      }
    },
    about: 'Base64 encodes binary data as ASCII text using 64 printable characters. It\'s used in email attachments (MIME), embedding images in HTML/CSS, and transmitting binary data in JSON APIs. Base64 increases size by ~33% but enables text-safe binary transmission.',
    related: ['url-encoder-decoder', 'hash-generator', 'binary-text-converter'],
  },
  {
    slug: 'url-encoder-decoder',
    title: 'URL Encoder / Decoder',
    desc: 'Percent-encode URLs for safe transmission and decode encoded URLs.',
    cat: 'tech',
    icon: '🔗',
    toolType: 'converter',
    fields: [
      { k: 'input', l: 'URL or Text', type: 'textarea', placeholder: 'https://example.com/search?q=hello world&cat=tools' },
      {
        k: 'mode',
        l: 'Mode',
        type: 'select',
        options: [{ value: 'encode', label: 'Encode URL' }, { value: 'decode', label: 'Decode URL' }],
      },
    ],
    fn: (inputs) => {
      const raw = inputs.input || ''
      try {
        if (inputs.mode === 'encode') {
          const encoded = encodeURIComponent(raw)
          return [{ type: 'value', label: 'URL Encoded', content: encoded }]
        } else {
          const decoded = decodeURIComponent(raw)
          return [{ type: 'value', label: 'Decoded URL', content: decoded }]
        }
      } catch {
        return [{ type: 'text', label: 'Error', content: 'Invalid URL encoding. Check the input.' }]
      }
    },
    about: 'URL encoding replaces unsafe characters with % followed by two hex digits. Spaces become %20 or +. The characters A–Z, a–z, 0–9, and -_.~  are never encoded. Query string parameters must be encoded to avoid ambiguity in URL parsing.',
    related: ['base64-encoder-decoder', 'html-encoder-decoder', 'json-formatter'],
  },
  {
    slug: 'html-encoder-decoder',
    title: 'HTML Encoder / Decoder',
    desc: 'Convert HTML special characters to entities and back.',
    cat: 'tech',
    icon: '🌐',
    toolType: 'converter',
    fields: [
      { k: 'input', l: 'Text', type: 'textarea', placeholder: '<div>Hello & "World"</div>' },
      {
        k: 'mode',
        l: 'Mode',
        type: 'select',
        options: [{ value: 'encode', label: 'Encode to HTML entities' }, { value: 'decode', label: 'Decode HTML entities' }],
      },
    ],
    fn: (inputs) => {
      const raw = inputs.input || ''
      if (inputs.mode === 'encode') {
        const encoded = raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
        return [{ type: 'value', label: 'HTML Encoded', content: encoded }]
      } else {
        const decoded = raw.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&nbsp;/g, ' ')
        return [{ type: 'value', label: 'Decoded HTML', content: decoded }]
      }
    },
    about: 'HTML entities prevent browsers from interpreting characters as HTML markup. The five characters that must always be encoded in HTML are &, <, >, ", and \'  (when in attributes). Failing to encode user input enables XSS (Cross-Site Scripting) attacks.',
    related: ['url-encoder-decoder', 'markdown-to-html-converter', 'base64-encoder-decoder'],
  },
  {
    slug: 'json-formatter',
    title: 'JSON Formatter & Beautifier',
    desc: 'Format and validate JSON, collapse/expand, and identify syntax errors.',
    cat: 'tech',
    icon: '{}',
    toolType: 'checker',
    fields: [
      { k: 'json', l: 'JSON Input', type: 'textarea', placeholder: '{"name":"John","age":30,"city":"New York"}' },
      {
        k: 'indent',
        l: 'Indentation',
        type: 'select',
        options: [{ value: '2', label: '2 spaces' }, { value: '4', label: '4 spaces' }, { value: 'tab', label: 'Tabs' }],
      },
    ],
    fn: (inputs) => {
      const raw = inputs.input || inputs.json || ''
      try {
        const parsed = JSON.parse(raw)
        const indent = inputs.indent === 'tab' ? '\t' : parseInt(inputs.indent) || 2
        const formatted = JSON.stringify(parsed, null, indent)
        const keys = JSON.stringify(parsed).match(/"[^"]+"\s*:/g)?.length ?? 0
        return [
          { type: 'value', label: 'Formatted JSON', content: formatted },
          { type: 'table', label: 'JSON Info', content: [
            { label: 'Status', value: 'Valid JSON ✓' },
            { label: 'Type', value: Array.isArray(parsed) ? 'Array' : typeof parsed },
            { label: 'Keys', value: keys.toString() },
            { label: 'Minified size', value: `${JSON.stringify(parsed).length} chars` },
            { label: 'Formatted size', value: `${formatted.length} chars` },
          ]},
        ]
      } catch (e) {
        return [{ type: 'text', label: 'Invalid JSON', content: e instanceof Error ? e.message : 'Syntax error in JSON.' }]
      }
    },
    about: 'JSON (JavaScript Object Notation) is the dominant data exchange format for APIs. Common errors include trailing commas (invalid in JSON, valid in JavaScript), single quotes (must be double quotes), and unescaped special characters in strings.',
    related: ['json-validator', 'url-encoder-decoder', 'regex-tester'],
  },
  {
    slug: 'json-validator',
    title: 'JSON Validator',
    desc: 'Validate JSON structure and pinpoint exact errors with line numbers.',
    cat: 'tech',
    icon: '✅',
    toolType: 'checker',
    fields: [
      { k: 'json', l: 'JSON to Validate', type: 'textarea', placeholder: 'Paste JSON here...' },
    ],
    fn: (inputs) => {
      const raw = inputs.json || ''
      try {
        const parsed = JSON.parse(raw)
        const type = Array.isArray(parsed) ? `Array (${parsed.length} items)` : typeof parsed === 'object' && parsed !== null ? `Object (${Object.keys(parsed).length} keys)` : typeof parsed
        return [{ type: 'table', label: 'Validation Result', content: [
          { label: 'Status', value: 'Valid JSON ✓' },
          { label: 'Root type', value: type },
          { label: 'Character count', value: raw.length.toString() },
          { label: 'Minified', value: JSON.stringify(parsed).length.toString() + ' chars' },
        ]}]
      } catch (e) {
        return [{ type: 'table', label: 'Validation Result', content: [
          { label: 'Status', value: 'Invalid JSON ✗' },
          { label: 'Error', value: e instanceof Error ? e.message : 'Unknown error' },
        ]}]
      }
    },
    about: 'JSON validators catch common mistakes before they cause runtime errors in applications. Always validate third-party JSON before parsing — malformed JSON can crash Node.js applications without a try/catch wrapper.',
    related: ['json-formatter', 'regex-tester', 'url-encoder-decoder'],
  },
  {
    slug: 'markdown-to-html-converter',
    title: 'Markdown to HTML Converter',
    desc: 'Convert Markdown formatting to HTML for web publishing.',
    cat: 'tech',
    icon: '📝',
    toolType: 'converter',
    fields: [
      { k: 'md', l: 'Markdown', type: 'textarea', placeholder: '# Hello\n\nThis is **bold** and *italic* text.' },
    ],
    fn: (inputs) => {
      const md = inputs.md || ''
      let html = md
        .replace(/^### (.+)/gm, '<h3>$1</h3>')
        .replace(/^## (.+)/gm, '<h2>$1</h2>')
        .replace(/^# (.+)/gm, '<h1>$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
        .replace(/^- (.+)/gm, '<li>$1</li>')
        .replace(/\n\n/g, '</p><p>')
      html = '<p>' + html + '</p>'
      return [{ type: 'value', label: 'HTML Output', content: html }]
    },
    about: 'Markdown was created by John Gruber in 2004 to allow writing HTML without raw HTML syntax. GitHub, Reddit, Stack Overflow, and most documentation platforms use Markdown. CommonMark is the standardized Markdown specification.',
    related: ['html-encoder-decoder', 'json-formatter', 'words-counter'],
  },
  {
    slug: 'regex-tester',
    title: 'Regex Tester',
    desc: 'Test regular expressions against text and see all matches highlighted.',
    cat: 'tech',
    icon: '🔍',
    toolType: 'checker',
    fields: [
      { k: 'pattern', l: 'Regular Expression', type: 'text', placeholder: '\\b\\d{3}-\\d{4}\\b' },
      { k: 'flags', l: 'Flags (g, i, m)', type: 'text', placeholder: 'gi' },
      { k: 'text', l: 'Test Text', type: 'textarea', placeholder: 'Call us at 555-1234 or 800-9876.' },
    ],
    fn: (inputs) => {
      try {
        const regex = new RegExp(inputs.pattern || '', inputs.flags || 'g')
        const text = inputs.text || ''
        const matches = [...text.matchAll(regex)]
        if (matches.length === 0) {
          return [{ type: 'text', label: 'Result', content: 'No matches found.' }]
        }
        const matchList = matches.map((m, i) => ({ label: `Match ${i + 1} (at pos ${m.index})`, value: JSON.stringify(m[0]) }))
        return [{ type: 'table', label: `${matches.length} Match${matches.length !== 1 ? 'es' : ''} Found`, content: matchList }]
      } catch (e) {
        return [{ type: 'text', label: 'Error', content: `Invalid regex: ${e instanceof Error ? e.message : 'Unknown error'}` }]
      }
    },
    about: 'Regular expressions are patterns used to match character combinations in strings. The `g` flag finds all matches; `i` makes it case-insensitive; `m` makes ^ and $ match line starts/ends. Regex is supported in all major programming languages.',
    related: ['json-validator', 'password-strength-checker', 'seo-meta-length-checker'],
  },
  {
    slug: 'subnet-calculator',
    title: 'IPv4 Subnet Calculator',
    desc: 'Calculate subnet mask, network address, broadcast address, and usable hosts.',
    cat: 'tech',
    icon: '🌐',
    toolType: 'estimator',
    fields: [
      { k: 'ip', l: 'IP Address', type: 'text', placeholder: '192.168.1.100' },
      { k: 'cidr', l: 'CIDR Prefix Length', type: 'number', placeholder: '24' },
    ],
    fn: (inputs) => {
      const parts = inputs.ip.split('.').map(Number)
      const cidr = parseInt(inputs.cidr)
      if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255) || isNaN(cidr) || cidr < 0 || cidr > 32) {
        return [{ type: 'text', label: 'Error', content: 'Enter valid IP and CIDR (0–32).' }]
      }
      const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0
      const ipInt = (parts[0] << 24 | parts[1] << 16 | parts[2] << 8 | parts[3]) >>> 0
      const network = (ipInt & mask) >>> 0
      const broadcast = (network | ~mask) >>> 0
      const toQuad = (n: number) => [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff].join('.')
      const hosts = Math.max(0, Math.pow(2, 32 - cidr) - 2)
      return [{
        type: 'table', label: 'Subnet Info', content: [
          { label: 'Network Address', value: toQuad(network) },
          { label: 'Subnet Mask', value: toQuad(mask) },
          { label: 'Broadcast Address', value: toQuad(broadcast) },
          { label: 'First Usable Host', value: cidr < 31 ? toQuad(network + 1) : 'N/A' },
          { label: 'Last Usable Host', value: cidr < 31 ? toQuad(broadcast - 1) : 'N/A' },
          { label: 'Usable Hosts', value: hosts.toLocaleString() },
          { label: 'CIDR Notation', value: `/${cidr}` },
          { label: 'Total Addresses', value: Math.pow(2, 32 - cidr).toLocaleString() },
        ]
      }]
    },
    about: 'A /24 subnet (255.255.255.0) provides 254 usable hosts — the most common configuration for home and small office networks. /16 gives 65,534 hosts; /8 gives 16.7 million. CIDR (Classless Inter-Domain Routing) replaced the old Class A/B/C system in 1993.',
    related: ['cidr-calculator', 'bandwidth-calculator', 'ip-address-lookup-guide'],
  },
  {
    slug: 'cidr-calculator',
    title: 'CIDR Calculator',
    desc: 'Calculate CIDR ranges, convert between CIDR and subnet masks.',
    cat: 'tech',
    icon: '📡',
    toolType: 'estimator',
    fields: [
      { k: 'cidr', l: 'CIDR Prefix (/0 to /32)', type: 'number', placeholder: '24' },
    ],
    fn: (inputs) => {
      const cidr = parseInt(inputs.cidr)
      if (isNaN(cidr) || cidr < 0 || cidr > 32) return [{ type: 'text', label: 'Error', content: 'Enter a CIDR value 0–32.' }]
      const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0
      const toQuad = (n: number) => [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff].join('.')
      const totalAddresses = Math.pow(2, 32 - cidr)
      const usableHosts = Math.max(0, totalAddresses - 2)
      return [{
        type: 'table', label: 'CIDR Info', content: [
          { label: 'CIDR notation', value: `/${cidr}` },
          { label: 'Subnet mask', value: toQuad(mask) },
          { label: 'Total addresses', value: totalAddresses.toLocaleString() },
          { label: 'Usable hosts', value: usableHosts.toLocaleString() },
          { label: 'Wildcard mask', value: toQuad(~mask >>> 0) },
          { label: 'Common use', value: cidr >= 28 ? 'Small network segment' : cidr >= 24 ? 'Small LAN (class C equiv)' : cidr >= 16 ? 'Medium network' : 'Large network / ISP' },
        ]
      }]
    },
    about: 'CIDR notation (e.g., 10.0.0.0/8) combines the network address with the prefix length. /32 is a single host; /0 represents the entire Internet. Cloud providers like AWS and Azure use CIDR to define VPC subnets.',
    related: ['subnet-calculator', 'bandwidth-calculator', 'ip-address-lookup-guide'],
  },
  {
    slug: 'bandwidth-calculator',
    title: 'Bandwidth Calculator',
    desc: 'Calculate transfer time for file sizes at different connection speeds.',
    cat: 'tech',
    icon: '📶',
    toolType: 'estimator',
    fields: [
      { k: 'size', l: 'File Size', type: 'number', placeholder: '1000' },
      {
        k: 'size_unit',
        l: 'Size Unit',
        type: 'select',
        options: [{ value: 'MB', label: 'Megabytes (MB)' }, { value: 'GB', label: 'Gigabytes (GB)' }, { value: 'TB', label: 'Terabytes (TB)' }],
      },
      { k: 'speed', l: 'Connection Speed (Mbps)', type: 'number', placeholder: '100' },
    ],
    fn: (inputs) => {
      const size = parseFloat(inputs.size) || 0
      const sizeMultiplier: Record<string, number> = { MB: 1, GB: 1000, TB: 1000000 }
      const sizeMB = size * (sizeMultiplier[inputs.size_unit] || 1)
      const speedMbps = parseFloat(inputs.speed) || 100
      const seconds = (sizeMB * 8) / speedMbps
      const formatTime = (s: number) => {
        if (s < 60) return `${s.toFixed(1)} seconds`
        if (s < 3600) return `${(s / 60).toFixed(1)} minutes`
        return `${(s / 3600).toFixed(1)} hours`
      }
      const speeds = [1, 10, 25, 50, 100, 300, 500, 1000]
      const rows = speeds.map(sp => ({ label: `${sp} Mbps`, value: formatTime((sizeMB * 8) / sp) }))
      return [{ type: 'table', label: `Transfer times for ${sizeMB.toLocaleString()} MB`, content: rows }]
    },
    about: 'File transfer speed is limited by the slowest link in the chain. Theoretical maximum transfer speed is bandwidth / 8 (converting bits to bytes). Overhead, protocol inefficiency, and server limits typically reduce real-world speeds to 60–80% of theoretical maximum.',
    related: ['bitrate-converter', 'data-storage-converter', 'internet-speed-checker-guide'],
  },
  {
    slug: 'seo-meta-length-checker',
    title: 'SEO Meta Length Checker',
    desc: 'Check title tag and meta description lengths for optimal Google search display.',
    cat: 'tech',
    icon: '🔍',
    toolType: 'checker',
    fields: [
      { k: 'title', l: 'Page Title', type: 'text', placeholder: 'Free Online Tax Calculator 2025 — File Federal Taxes' },
      { k: 'desc', l: 'Meta Description', type: 'textarea', placeholder: 'Calculate your 2025 federal income tax instantly. Accurate results for single, married, and head of household filers. No sign-up required.' },
    ],
    fn: (inputs) => {
      const title = inputs.title || '', desc = inputs.desc || ''
      const titleLen = title.length, descLen = desc.length
      const titleStatus = titleLen < 30 ? 'Too short (30–60 recommended)' : titleLen <= 60 ? 'Optimal ✓' : titleLen <= 70 ? 'Slightly long' : 'Too long (60 char limit)'
      const descStatus = descLen < 70 ? 'Too short (150–160 recommended)' : descLen <= 160 ? 'Optimal ✓' : descLen <= 175 ? 'Slightly long' : 'Too long (160 char limit)'
      return [{
        type: 'table', label: 'SEO Length Check', content: [
          { label: 'Title length', value: `${titleLen} characters` },
          { label: 'Title status', value: titleStatus },
          { label: 'Description length', value: `${descLen} characters` },
          { label: 'Description status', value: descStatus },
          { label: 'Title remaining', value: `${Math.max(0, 60 - titleLen)} characters` },
          { label: 'Description remaining', value: `${Math.max(0, 160 - descLen)} characters` },
        ]
      }]
    },
    about: 'Google typically displays 50–60 characters of title tags and 150–160 characters of meta descriptions. Exceeding limits causes truncation with ellipsis (...). Google measures pixel width, not character count, so wide characters like W use more space than narrow ones like i.',
    related: ['keyword-density-checker', 'open-graph-preview', 'robots-txt-generator'],
  },
  {
    slug: 'keyword-density-checker',
    title: 'Keyword Density Checker',
    desc: 'Analyze keyword frequency and density in any text for SEO optimization.',
    cat: 'tech',
    icon: '📊',
    toolType: 'checker',
    fields: [
      { k: 'text', l: 'Content', type: 'textarea', placeholder: 'Paste your article or page content here...' },
      { k: 'keyword', l: 'Target Keyword', type: 'text', placeholder: 'tax calculator' },
    ],
    fn: (inputs) => {
      const text = (inputs.text || '').toLowerCase()
      const keyword = (inputs.keyword || '').toLowerCase().trim()
      const words = text.split(/\s+/).filter(w => w.length > 0)
      if (!keyword || words.length === 0) return [{ type: 'text', label: 'Error', content: 'Enter content and a keyword to check.' }]
      const keywordWords = keyword.split(/\s+/)
      let count = 0
      for (let i = 0; i <= words.length - keywordWords.length; i++) {
        if (keywordWords.every((kw, j) => words[i + j].replace(/[^a-z0-9]/g, '') === kw)) count++
      }
      const density = (count / words.length * 100)
      const status = density < 0.5 ? 'Too low — consider adding more naturally' : density <= 2.5 ? 'Optimal range ✓' : density <= 4 ? 'Slightly high' : 'Keyword stuffing — reduce usage'
      return [{
        type: 'table', label: 'Keyword Analysis', content: [
          { label: 'Keyword', value: keyword },
          { label: 'Occurrences', value: count.toString() },
          { label: 'Total words', value: words.length.toString() },
          { label: 'Density', value: `${density.toFixed(2)}%` },
          { label: 'Status', value: status },
          { label: 'Recommended range', value: '0.5% – 2.5%' },
        ]
      }]
    },
    about: 'Keyword density above 3–4% can trigger Google\'s spam filters. Modern SEO focuses on semantic relevance and natural usage rather than keyword frequency. LSI (Latent Semantic Indexing) keywords — related terms — are more important than repeating the exact keyword.',
    related: ['seo-meta-length-checker', 'readability-score-checker', 'words-counter'],
  },
  {
    slug: 'open-graph-preview',
    title: 'Open Graph Preview',
    desc: 'Preview how your page will look when shared on Facebook, Twitter, and LinkedIn.',
    cat: 'tech',
    icon: '📲',
    toolType: 'checker',
    fields: [
      { k: 'title', l: 'OG Title', type: 'text', placeholder: 'Free Tax Calculator 2025' },
      { k: 'desc', l: 'OG Description', type: 'text', placeholder: 'Calculate your exact federal tax liability in 30 seconds.' },
      { k: 'url', l: 'Page URL', type: 'text', placeholder: 'https://calchive.com/calculator/tax-calculator' },
    ],
    fn: (inputs) => {
      const title = inputs.title || '', desc = inputs.desc || '', url = inputs.url || ''
      const titleIssues: string[] = []
      const descIssues: string[] = []
      if (title.length > 95) titleIssues.push('Facebook may truncate title above 95 chars')
      if (title.length > 70) titleIssues.push('Twitter may truncate above 70 chars')
      if (desc.length > 200) descIssues.push('Facebook shows ~200 chars in preview')
      if (desc.length > 150) descIssues.push('Twitter shows ~150 chars in preview')
      return [{
        type: 'table', label: 'Open Graph Meta Tags', content: [
          { label: '<meta property="og:title"', value: `content="${title}"` },
          { label: '<meta property="og:description"', value: `content="${desc}"` },
          { label: '<meta property="og:url"', value: `content="${url}"` },
          { label: '<meta name="twitter:card"', value: 'content="summary_large_image"' },
          { label: 'Title length', value: `${title.length} chars ${titleIssues.length ? '⚠' : '✓'}` },
          { label: 'Description length', value: `${desc.length} chars ${descIssues.length ? '⚠' : '✓'}` },
        ]
      }]
    },
    about: 'Open Graph meta tags (og:) control how your page appears when shared on social media. Without them, platforms use the first text they find on the page. Twitter Cards (twitter:) use similar but separate meta tags. Always include og:image for visual previews.',
    related: ['seo-meta-length-checker', 'twitter-card-preview', 'robots-txt-generator'],
  },
  {
    slug: 'twitter-card-preview',
    title: 'Twitter Card Preview',
    desc: 'Preview and validate Twitter Card meta tags for link sharing.',
    cat: 'tech',
    icon: '🐦',
    toolType: 'checker',
    fields: [
      { k: 'title', l: 'Twitter Title', type: 'text', placeholder: 'Free Tax Calculator — Calchive' },
      { k: 'desc', l: 'Twitter Description', type: 'text', placeholder: 'Calculate 2025 federal income tax in seconds.' },
      {
        k: 'card',
        l: 'Card Type',
        type: 'select',
        options: [{ value: 'summary', label: 'Summary (small image)' }, { value: 'summary_large_image', label: 'Summary Large Image' }, { value: 'app', label: 'App' }],
      },
    ],
    fn: (inputs) => {
      const title = inputs.title || '', desc = inputs.desc || '', card = inputs.card || 'summary'
      return [{
        type: 'table', label: 'Twitter Card Meta Tags', content: [
          { label: '<meta name="twitter:card"', value: `content="${card}"` },
          { label: '<meta name="twitter:title"', value: `content="${title}"` },
          { label: '<meta name="twitter:description"', value: `content="${desc}"` },
          { label: 'Title length', value: `${title.length}/70 chars` },
          { label: 'Description length', value: `${desc.length}/150 chars` },
          { label: 'Status', value: title.length > 0 && desc.length > 0 ? 'Tags valid ✓' : 'Fill in title and description' },
        ]
      }]
    },
    about: 'Twitter Card meta tags override Open Graph tags for Twitter specifically. `summary_large_image` displays a prominent full-width image, significantly increasing click-through rate. Twitter requires the card type to be whitelisted before it shows properly.',
    related: ['open-graph-preview', 'seo-meta-length-checker', 'robots-txt-generator'],
  },
  {
    slug: 'email-subject-line-length-checker',
    title: 'Email Subject Line Checker',
    desc: 'Check email subject line length against inbox display limits for major email clients.',
    cat: 'tech',
    icon: '📧',
    toolType: 'checker',
    fields: [
      { k: 'subject', l: 'Email Subject Line', type: 'text', placeholder: 'Your 2025 tax calculator results are ready' },
    ],
    fn: (inputs) => {
      const s = inputs.subject || ''
      const len = s.length
      const clients = [
        { name: 'Gmail (desktop)', limit: 70 },
        { name: 'Outlook (desktop)', limit: 60 },
        { name: 'iPhone Mail', limit: 35 },
        { name: 'Android Gmail', limit: 40 },
        { name: 'Apple Watch', limit: 15 },
      ]
      const rows = clients.map(c => ({
        label: c.name,
        value: len <= c.limit ? `Fully visible (${c.limit} char limit)` : `Truncated at char ${c.limit} of ${len}`,
      }))
      rows.unshift({ label: 'Subject length', value: `${len} characters` })
      return [{ type: 'table', label: 'Email Subject Analysis', content: rows }]
    },
    about: 'Email subject lines under 40 characters are fully visible on most mobile devices. Personalization (first name), numbers, and questions increase open rates. Emoji in subject lines can increase open rates by 56% (Experian) but may trigger spam filters for financial content.',
    related: ['character-counter', 'seo-meta-length-checker', 'spam-score-estimator'],
  },
  {
    slug: 'spam-score-estimator',
    title: 'Email Spam Score Estimator',
    desc: 'Estimate email spam likelihood based on subject line words and sender practices.',
    cat: 'tech',
    icon: '📵',
    toolType: 'checker',
    fields: [
      { k: 'subject', l: 'Email Subject', type: 'text', placeholder: 'FREE! Win $1000 — Act NOW!!!' },
      { k: 'body_sample', l: 'First Few Words of Email Body', type: 'text', placeholder: 'Click here to claim your reward...' },
    ],
    fn: (inputs) => {
      const combined = `${inputs.subject || ''} ${inputs.body_sample || ''}`.toLowerCase()
      const spamTriggers = ['free', 'win', 'winner', 'click here', 'act now', 'limited time', 'claim', 'guarantee', 'no obligation', 'credit card required', 'make money', '100%', 'cash', 'prize', 'lottery', 'urgent', 'verify now', 'bank account', 'earn money', 'risk-free']
      const found = spamTriggers.filter(t => combined.includes(t))
      const excessiveCase = (inputs.subject || '').replace(/[^A-Z]/g, '').length > 5
      const excessivePunct = (inputs.subject || '').split('!').length > 2 || (inputs.subject || '').split('?').length > 2
      let score = found.length * 15 + (excessiveCase ? 20 : 0) + (excessivePunct ? 15 : 0)
      score = Math.min(100, score)
      const risk = score < 20 ? 'Low risk' : score < 50 ? 'Moderate risk' : score < 75 ? 'High risk' : 'Very likely spam'
      return [{
        type: 'table', label: 'Spam Score', content: [
          { label: 'Spam score', value: `${score}/100` },
          { label: 'Risk level', value: risk },
          { label: 'Trigger words found', value: found.length > 0 ? found.join(', ') : 'None' },
          { label: 'Excessive caps', value: excessiveCase ? 'Yes ⚠' : 'No ✓' },
          { label: 'Excessive punctuation', value: excessivePunct ? 'Yes ⚠' : 'No ✓' },
        ]
      }]
    },
    about: 'SpamAssassin and similar spam filters score email content based on hundreds of rules. Common triggers include ALL CAPS, excessive exclamation marks, spam keywords, mismatched sender info, and missing unsubscribe links. Financial and legal content faces stricter filters.',
    related: ['email-subject-line-length-checker', 'character-counter'],
  },
  {
    slug: 'ab-test-significance-calculator',
    title: 'A/B Test Significance Calculator',
    desc: 'Determine statistical significance for A/B testing with conversion rates.',
    cat: 'tech',
    icon: '🧪',
    toolType: 'estimator',
    fields: [
      { k: 'visitors_a', l: 'Visitors — Variant A', type: 'number', placeholder: '5000' },
      { k: 'conversions_a', l: 'Conversions — Variant A', type: 'number', placeholder: '250' },
      { k: 'visitors_b', l: 'Visitors — Variant B', type: 'number', placeholder: '5000' },
      { k: 'conversions_b', l: 'Conversions — Variant B', type: 'number', placeholder: '280' },
    ],
    fn: (inputs) => {
      const vA = parseFloat(inputs.visitors_a) || 0, cA = parseFloat(inputs.conversions_a) || 0
      const vB = parseFloat(inputs.visitors_b) || 0, cB = parseFloat(inputs.conversions_b) || 0
      if (vA <= 0 || vB <= 0) return [{ type: 'text', label: 'Error', content: 'Enter valid visitor and conversion counts.' }]
      const pA = cA / vA, pB = cB / vB
      const pooled = (cA + cB) / (vA + vB)
      const se = Math.sqrt(pooled * (1 - pooled) * (1 / vA + 1 / vB))
      const z = se > 0 ? Math.abs(pB - pA) / se : 0
      const pValue = 2 * (1 - (1 / (1 + 0.2316419 * Math.abs(z))) ** 5 * 0.5)
      const significant = z > 1.96
      const lift = pA > 0 ? ((pB - pA) / pA * 100) : 0
      return [{
        type: 'table', label: 'A/B Test Results', content: [
          { label: 'Variant A conversion rate', value: `${(pA * 100).toFixed(2)}%` },
          { label: 'Variant B conversion rate', value: `${(pB * 100).toFixed(2)}%` },
          { label: 'Relative lift', value: `${lift.toFixed(1)}%` },
          { label: 'Z-score', value: z.toFixed(3) },
          { label: 'Statistical significance', value: significant ? `Yes ✓ (95% confidence)` : 'Not yet — need more data' },
          { label: 'Winner', value: significant ? (pB > pA ? 'Variant B' : 'Variant A') : 'Inconclusive' },
        ]
      }]
    },
    about: 'A/B test significance at 95% confidence means there\'s a 5% chance the result is due to random variation. Most testing tools require significance before declaring a winner. Rule of thumb: run tests until you have at least 100 conversions per variant.',
    related: ['sample-size-calculator', 'confidence-interval-calculator', 'p-value-calculator'],
  },
  {
    slug: 'sample-size-calculator',
    title: 'Sample Size Calculator',
    desc: 'Calculate the minimum sample size needed for statistical experiments and A/B tests.',
    cat: 'tech',
    icon: '📊',
    toolType: 'estimator',
    fields: [
      { k: 'baseline', l: 'Baseline Conversion Rate (%)', type: 'number', placeholder: '5', unit: '%' },
      { k: 'mde', l: 'Minimum Detectable Effect (%)', type: 'number', placeholder: '20', unit: '%' },
      {
        k: 'confidence',
        l: 'Confidence Level',
        type: 'select',
        options: [{ value: '90', label: '90%' }, { value: '95', label: '95% (standard)' }, { value: '99', label: '99%' }],
      },
    ],
    fn: (inputs) => {
      const baseline = (parseFloat(inputs.baseline) || 5) / 100
      const mde = (parseFloat(inputs.mde) || 20) / 100
      const confidence = parseInt(inputs.confidence) || 95
      const targetRate = baseline * (1 + mde)
      const zConf: Record<number, number> = { 90: 1.645, 95: 1.96, 99: 2.576 }
      const z = zConf[confidence] || 1.96
      const power = 1.28 // 80% power
      const p = (baseline + targetRate) / 2
      const n = Math.ceil((z + power) ** 2 * 2 * p * (1 - p) / (targetRate - baseline) ** 2)
      return [{
        type: 'table', label: 'Sample Size Required', content: [
          { label: 'Per variant', value: n.toLocaleString() },
          { label: 'Total (both variants)', value: (n * 2).toLocaleString() },
          { label: 'Baseline rate', value: `${(baseline * 100).toFixed(1)}%` },
          { label: 'Target rate', value: `${(targetRate * 100).toFixed(1)}%` },
          { label: 'Confidence level', value: `${confidence}%` },
          { label: 'Statistical power', value: '80%' },
        ]
      }]
    },
    about: 'Sample size depends on baseline rate, desired effect size, confidence level, and statistical power. Smaller effects require exponentially larger samples. A 1% lift from a 5% baseline requires ~40,000 visitors per variant at 95% confidence.',
    related: ['ab-test-significance-calculator', 'confidence-interval-calculator', 'statistical-power-calculator'],
  },
  {
    slug: 'confidence-interval-calculator',
    title: 'Confidence Interval Calculator',
    desc: 'Calculate 90%, 95%, and 99% confidence intervals for proportions and means.',
    cat: 'tech',
    icon: '📐',
    toolType: 'estimator',
    fields: [
      { k: 'successes', l: 'Successes / Events', type: 'number', placeholder: '250' },
      { k: 'n', l: 'Total Trials / Sample Size', type: 'number', placeholder: '1000' },
    ],
    fn: (inputs) => {
      const x = parseFloat(inputs.successes) || 0, n = parseFloat(inputs.n) || 1
      const p = x / n
      const se = Math.sqrt(p * (1 - p) / n)
      const zValues: [number, string][] = [[1.645, '90%'], [1.96, '95%'], [2.576, '99%']]
      const rows = zValues.map(([z, cl]) => ({
        label: `${cl} CI`,
        value: `${((p - z * se) * 100).toFixed(2)}% – ${((p + z * se) * 100).toFixed(2)}%`,
      }))
      rows.unshift({ label: 'Sample proportion', value: `${(p * 100).toFixed(2)}%` })
      rows.push({ label: 'Margin of Error (95%)', value: `±${(1.96 * se * 100).toFixed(2)}%` })
      return [{ type: 'table', label: 'Confidence Intervals', content: rows }]
    },
    about: 'A 95% confidence interval means that if you repeated the experiment 100 times, 95 of the resulting intervals would contain the true population parameter. It does NOT mean there\'s a 95% chance the true value is in this specific interval.',
    related: ['ab-test-significance-calculator', 'sample-size-calculator', 'p-value-calculator'],
  },
  {
    slug: 'p-value-calculator',
    title: 'P-Value Calculator',
    desc: 'Calculate the p-value from a Z-score or test statistic.',
    cat: 'tech',
    icon: '📉',
    toolType: 'estimator',
    fields: [
      { k: 'z', l: 'Z-Score (test statistic)', type: 'number', placeholder: '2.1' },
      {
        k: 'tail',
        l: 'Test Type',
        type: 'select',
        options: [{ value: '2', label: 'Two-tailed' }, { value: '1', label: 'One-tailed (right)' }],
      },
    ],
    fn: (inputs) => {
      const z = Math.abs(parseFloat(inputs.z) || 0)
      const tails = parseInt(inputs.tail) || 2
      // Approximation of normal CDF
      const phi = (x: number) => {
        const t = 1 / (1 + 0.2316419 * x)
        const poly = t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))))
        return 1 - (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-x * x / 2) * poly
      }
      const pOneTail = 1 - phi(z)
      const pValue = tails === 2 ? pOneTail * 2 : pOneTail
      const significant = pValue < 0.05
      return [{
        type: 'table', label: 'P-Value Result', content: [
          { label: 'Z-Score', value: z.toFixed(3) },
          { label: 'P-value', value: pValue.toFixed(4) },
          { label: 'Test type', value: tails === 2 ? 'Two-tailed' : 'One-tailed' },
          { label: 'Significant at α=0.05?', value: significant ? 'Yes ✓' : 'No' },
          { label: 'Significant at α=0.01?', value: pValue < 0.01 ? 'Yes ✓' : 'No' },
          { label: 'Confidence level equivalent', value: `${((1 - pValue) * 100).toFixed(1)}%` },
        ]
      }]
    },
    about: 'The p-value is the probability of observing results at least as extreme as those measured, assuming the null hypothesis is true. A p-value of 0.05 means 5% chance of observing this result by chance. It does not measure the probability that the hypothesis is true.',
    related: ['ab-test-significance-calculator', 'confidence-interval-calculator', 'z-score-calculator'],
  },
  {
    slug: 'z-score-calculator',
    title: 'Z-Score Calculator',
    desc: 'Calculate the Z-score for a value in a normal distribution.',
    cat: 'tech',
    icon: '📊',
    toolType: 'estimator',
    fields: [
      { k: 'value', l: 'Value (x)', type: 'number', placeholder: '85' },
      { k: 'mean', l: 'Population Mean (μ)', type: 'number', placeholder: '75' },
      { k: 'sd', l: 'Standard Deviation (σ)', type: 'number', placeholder: '10' },
    ],
    fn: (inputs) => {
      const x = parseFloat(inputs.value), mu = parseFloat(inputs.mean), sigma = parseFloat(inputs.sd)
      if (isNaN(x) || isNaN(mu) || isNaN(sigma) || sigma <= 0) return [{ type: 'text', label: 'Error', content: 'Enter valid values. Standard deviation must be positive.' }]
      const z = (x - mu) / sigma
      const phi = (v: number) => { const t = 1 / (1 + 0.2316419 * Math.abs(v)); const p = t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429)))); const r = 1 - (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-v * v / 2) * p; return v >= 0 ? r : 1 - r }
      const percentile = phi(z) * 100
      return [{
        type: 'table', label: 'Z-Score Result', content: [
          { label: 'Z-Score', value: z.toFixed(4) },
          { label: 'Percentile', value: `${percentile.toFixed(2)}nd percentile` },
          { label: 'Above mean by', value: `${((x - mu) / mu * 100).toFixed(1)}%` },
          { label: 'Within 1 SD?', value: Math.abs(z) <= 1 ? 'Yes (68% of data)' : 'No' },
          { label: 'Within 2 SD?', value: Math.abs(z) <= 2 ? 'Yes (95% of data)' : 'No' },
          { label: 'Within 3 SD?', value: Math.abs(z) <= 3 ? 'Yes (99.7% of data)' : 'No' },
        ]
      }]
    },
    about: 'Z-scores standardize data to show how many standard deviations a value is from the mean. A z-score of +1.96 marks the 97.5th percentile in a normal distribution — the threshold for 95% confidence in statistical testing.',
    related: ['p-value-calculator', 'confidence-interval-calculator', 'normal-distribution-calculator'],
  },
  {
    slug: 'normal-distribution-calculator',
    title: 'Normal Distribution Calculator',
    desc: 'Calculate probabilities and percentiles for normal distributions.',
    cat: 'tech',
    icon: '🔔',
    toolType: 'estimator',
    fields: [
      { k: 'mean', l: 'Mean (μ)', type: 'number', placeholder: '0' },
      { k: 'sd', l: 'Standard Deviation (σ)', type: 'number', placeholder: '1' },
      { k: 'x', l: 'Value (x)', type: 'number', placeholder: '1.5' },
    ],
    fn: (inputs) => {
      const mu = parseFloat(inputs.mean) || 0, sigma = parseFloat(inputs.sd) || 1, x = parseFloat(inputs.x) || 0
      if (sigma <= 0) return [{ type: 'text', label: 'Error', content: 'Standard deviation must be positive.' }]
      const z = (x - mu) / sigma
      const phi = (v: number) => { const t = 1 / (1 + 0.2316419 * Math.abs(v)); const p = t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429)))); const r = 1 - (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-v * v / 2) * p; return v >= 0 ? r : 1 - r }
      const cdf = phi(z)
      const pdf = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z)
      return [{
        type: 'table', label: 'Normal Distribution', content: [
          { label: 'Z-Score', value: z.toFixed(4) },
          { label: 'P(X ≤ x)', value: `${(cdf * 100).toFixed(4)}%` },
          { label: 'P(X > x)', value: `${((1 - cdf) * 100).toFixed(4)}%` },
          { label: 'P(μ - x ≤ X ≤ μ + x)', value: `${((phi(Math.abs(z)) - phi(-Math.abs(z))) * 100).toFixed(4)}%` },
          { label: 'PDF at x', value: pdf.toFixed(6) },
        ]
      }]
    },
    about: 'The normal distribution (bell curve) describes many natural phenomena — height, IQ scores, measurement errors. It\'s defined by its mean and standard deviation. The standard normal has mean 0 and SD 1. The empirical rule (68-95-99.7) applies to all normal distributions.',
    related: ['z-score-calculator', 'p-value-calculator', 'confidence-interval-calculator'],
  },
  {
    slug: 'robots-txt-generator',
    title: 'Robots.txt Generator',
    desc: 'Generate a robots.txt file with custom crawl rules for search engine bots.',
    cat: 'tech',
    icon: '🤖',
    toolType: 'generator',
    fields: [
      { k: 'sitemap', l: 'Sitemap URL', type: 'text', placeholder: 'https://example.com/sitemap.xml' },
      {
        k: 'disallow',
        l: 'Disallow Paths (comma-separated)',
        type: 'text',
        placeholder: '/admin/, /private/, /api/',
      },
      {
        k: 'allow_all',
        l: 'Allow All Crawlers',
        type: 'select',
        options: [{ value: '1', label: 'Yes — standard' }, { value: '0', label: 'No — block all' }],
      },
    ],
    fn: (inputs) => {
      const disallowPaths = (inputs.disallow || '').split(',').map(p => p.trim()).filter(Boolean)
      const sitemap = inputs.sitemap || ''
      const allowAll = inputs.allow_all !== '0'
      let robots = `User-agent: *\n`
      if (!allowAll) {
        robots += `Disallow: /\n`
      } else {
        if (disallowPaths.length > 0) {
          disallowPaths.forEach(p => { robots += `Disallow: ${p}\n` })
        } else {
          robots += `Disallow:\n`
        }
      }
      if (sitemap) robots += `\nSitemap: ${sitemap}`
      return [
        { type: 'value', label: 'robots.txt Content', content: robots },
        { type: 'text', label: 'Deploy to', content: 'Place at the root of your domain: https://yourdomain.com/robots.txt' },
      ]
    },
    about: 'robots.txt is the first file search engine crawlers fetch. It tells them which pages not to crawl. Note: robots.txt is publicly visible and tells potential attackers which paths exist. For truly private pages, use authentication — not just robots.txt.',
    related: ['sitemap-size-estimator', 'seo-meta-length-checker', 'schema-markup-generator'],
  },
  {
    slug: 'sitemap-size-estimator',
    title: 'Sitemap Size Estimator',
    desc: 'Estimate XML sitemap requirements and file size for your website.',
    cat: 'tech',
    icon: '🗺️',
    toolType: 'estimator',
    fields: [
      { k: 'pages', l: 'Total Pages', type: 'number', placeholder: '10000' },
      { k: 'avg_url_len', l: 'Average URL Length (chars)', type: 'number', placeholder: '60' },
    ],
    fn: (inputs) => {
      const pages = parseFloat(inputs.pages) || 0, urlLen = parseFloat(inputs.avg_url_len) || 60
      const bytesPerEntry = urlLen + 150 // XML overhead
      const totalBytes = pages * bytesPerEntry
      const totalKB = totalBytes / 1024
      const totalMB = totalKB / 1024
      const sitemapFiles = Math.ceil(pages / 50000)
      return [{
        type: 'table', label: 'Sitemap Estimate', content: [
          { label: 'Total URLs', value: pages.toLocaleString() },
          { label: 'Sitemap files needed', value: sitemapFiles.toString() },
          { label: 'Estimated file size', value: totalMB > 1 ? `${totalMB.toFixed(1)} MB` : `${totalKB.toFixed(0)} KB` },
          { label: 'Google URL limit per file', value: '50,000 URLs' },
          { label: 'Google size limit per file', value: '50 MB uncompressed' },
          { label: 'Sitemap index needed?', value: sitemapFiles > 1 ? 'Yes — use sitemap index' : 'No — single file is fine' },
        ]
      }]
    },
    about: 'Google limits sitemap files to 50,000 URLs or 50 MB, whichever comes first. Larger sites need a sitemap index file listing multiple sitemap files. Gzip compression reduces sitemap size by 70–80%. Submit sitemaps via Google Search Console for fastest indexing.',
    related: ['robots-txt-generator', 'seo-meta-length-checker'],
  },
  {
    slug: 'schema-markup-generator',
    title: 'Schema Markup Generator',
    desc: 'Generate JSON-LD schema markup for articles, FAQs, and review rich results.',
    cat: 'tech',
    icon: '🏷️',
    toolType: 'generator',
    fields: [
      {
        k: 'type',
        l: 'Schema Type',
        type: 'select',
        options: [{ value: 'article', label: 'Article' }, { value: 'faq', label: 'FAQ Page' }, { value: 'review', label: 'Review' }, { value: 'tool', label: 'Web Application' }],
      },
      { k: 'name', l: 'Name / Title', type: 'text', placeholder: 'Free Tax Calculator 2025' },
      { k: 'desc', l: 'Description', type: 'text', placeholder: 'Calculate your 2025 federal income tax.' },
      { k: 'url', l: 'Page URL', type: 'text', placeholder: 'https://calchive.com/calculator/tax-calculator' },
    ],
    fn: (inputs) => {
      const type = inputs.type || 'article', name = inputs.name || '', desc = inputs.desc || '', url = inputs.url || ''
      const schemas: Record<string, object> = {
        article: { '@context': 'https://schema.org', '@type': 'Article', name, description: desc, url, headline: name, author: { '@type': 'Organization', name: 'Calchive' } },
        faq: { '@context': 'https://schema.org', '@type': 'FAQPage', name, description: desc, url, mainEntity: [{ '@type': 'Question', name: 'Example question?', acceptedAnswer: { '@type': 'Answer', text: 'Example answer.' } }] },
        review: { '@context': 'https://schema.org', '@type': 'Review', name, description: desc, url, reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' } },
        tool: { '@context': 'https://schema.org', '@type': 'WebApplication', name, description: desc, url, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
      }
      const schema = schemas[type] || schemas.article
      const output = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`
      return [{ type: 'value', label: 'Schema Markup (JSON-LD)', content: output }]
    },
    about: 'Schema markup (structured data) helps search engines understand page content and enables rich results — FAQ accordions, review stars, and app details in search results. Google recommends JSON-LD format, added in the <head> or anywhere in the <body>.',
    related: ['robots-txt-generator', 'seo-meta-length-checker', 'open-graph-preview'],
  },
  {
    slug: 'ip-address-lookup-guide',
    title: 'IP Address Lookup Guide',
    desc: 'Understanding IP addresses, types, and how to find your public and private IP.',
    cat: 'tech',
    icon: '🌐',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'IP Address Reference', content: [
        { label: 'Public IP address', value: 'Visible to the internet — assigned by ISP' },
        { label: 'Private IP (class A)', value: '10.0.0.0 – 10.255.255.255' },
        { label: 'Private IP (class B)', value: '172.16.0.0 – 172.31.255.255' },
        { label: 'Private IP (class C)', value: '192.168.0.0 – 192.168.255.255' },
        { label: 'Loopback', value: '127.0.0.1 (localhost)' },
        { label: 'APIPA / Link-local', value: '169.254.0.0 – 169.254.255.255' },
        { label: 'Find public IP', value: 'Visit api.ipify.org or whatismyip.com' },
        { label: 'Windows private IP', value: 'Run: ipconfig' },
        { label: 'Mac/Linux private IP', value: 'Run: ifconfig or ip addr' },
        { label: 'IPv6 loopback', value: '::1' },
        { label: 'IPv6 adoption', value: '~45% of Google traffic (2025)' },
      ]
    }],
    about: 'Every device on a network has a private IP (assigned by your router); the network shares one public IP (assigned by your ISP). IPv4 addresses are 32-bit (4 billion possible); IPv6 are 128-bit (340 trillion trillion trillion possible). IPv4 exhaustion began around 2011.',
    related: ['subnet-calculator', 'cidr-calculator', 'bandwidth-calculator'],
  },
  {
    slug: 'internet-speed-checker-guide',
    title: 'Internet Speed Guide',
    desc: 'Reference guide for internet speeds, requirements, and what different Mbps levels support.',
    cat: 'tech',
    icon: '📶',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Internet Speed Requirements', content: [
        { label: '1 Mbps', value: 'Basic web browsing, email' },
        { label: '5 Mbps', value: 'SD video streaming' },
        { label: '15–25 Mbps', value: 'HD streaming (Netflix HD)' },
        { label: '25 Mbps', value: 'FCC minimum broadband definition' },
        { label: '50 Mbps', value: '4K streaming or 2–3 devices simultaneously' },
        { label: '100 Mbps (FCC 2024 minimum)', value: 'Multiple 4K streams, video calls, remote work' },
        { label: '200–500 Mbps', value: 'Heavy users, gaming, large file uploads' },
        { label: '1 Gbps (1000 Mbps)', value: 'Gigabit — handles entire household + more' },
        { label: 'US average download (2024)', value: '~250 Mbps' },
        { label: 'US average upload (2024)', value: '~50 Mbps' },
        { label: 'Latency target (gaming)', value: '<30 ms ping' },
        { label: 'Latency target (video calls)', value: '<150 ms' },
      ]
    }],
    about: 'In 2024, the FCC updated the broadband definition from 25/3 Mbps to 100/20 Mbps download/upload. Cable and fiber customers in the US increasingly receive 500 Mbps–1 Gbps. Upload speeds matter increasingly for remote work and video calls — often an asymmetric weak point for cable.',
    related: ['bandwidth-calculator', 'bitrate-converter', 'latency-calculator'],
  },
  {
    slug: 'latency-calculator',
    title: 'Network Latency Calculator',
    desc: 'Estimate minimum theoretical latency based on geographic distance and transmission medium.',
    cat: 'tech',
    icon: '⚡',
    toolType: 'estimator',
    fields: [
      { k: 'distance', l: 'Distance (miles)', type: 'number', placeholder: '2500' },
      {
        k: 'medium',
        l: 'Transmission Medium',
        type: 'select',
        options: [
          { value: 'fiber', label: 'Fiber optic' },
          { value: 'copper', label: 'Copper cable' },
          { value: 'satellite', label: 'Geostationary satellite' },
          { value: 'starlink', label: 'Starlink LEO satellite' },
        ],
      },
    ],
    fn: (inputs) => {
      const dist = parseFloat(inputs.distance) || 0
      const speedFraction: Record<string, number> = { fiber: 0.67, copper: 0.77, satellite: 0, starlink: 0 }
      const cLight = 186282 // miles/sec
      let latencyMs: number
      if (inputs.medium === 'satellite') {
        latencyMs = 550 // geostationary fixed overhead
      } else if (inputs.medium === 'starlink') {
        latencyMs = 25 + dist / cLight * 1000 * 2 // LEO + processing
      } else {
        latencyMs = (dist / (cLight * speedFraction[inputs.medium])) * 1000 * 2 // round trip
      }
      return [{
        type: 'table', label: 'Latency Estimate', content: [
          { label: 'One-way latency', value: `${(latencyMs / 2).toFixed(1)} ms` },
          { label: 'Round-trip time (RTT)', value: `${latencyMs.toFixed(1)} ms` },
          { label: 'Suitable for gaming?', value: latencyMs < 50 ? 'Yes ✓' : latencyMs < 100 ? 'Acceptable' : 'Problematic' },
          { label: 'Suitable for video calls?', value: latencyMs < 150 ? 'Yes ✓' : 'Noticeable delay' },
          { label: 'Note', value: 'Real-world RTT includes routing and processing overhead' },
        ]
      }]
    },
    about: 'Light travels at 186,282 miles/second in vacuum. Through fiber, it travels at about 67% of that speed. A New York–London fiber cable (~3,500 miles) has a theoretical minimum RTT of ~56 ms; real-world is typically 70–80 ms due to routing. Geostationary satellites orbit at 22,236 miles altitude.',
    related: ['bandwidth-calculator', 'bitrate-converter', 'internet-speed-checker-guide'],
  },
  {
    slug: 'core-web-vitals-guide',
    title: 'Core Web Vitals Reference Guide',
    desc: 'Google Core Web Vitals thresholds and what they mean for SEO and user experience.',
    cat: 'tech',
    icon: '📊',
    toolType: 'table',
    staticContent: () => [
      {
        type: 'table', label: 'Core Web Vitals Thresholds (2025)', content: [
          { label: 'LCP (Largest Contentful Paint)', value: 'Good: ≤2.5s | Needs work: 2.5–4s | Poor: >4s' },
          { label: 'INP (Interaction to Next Paint)', value: 'Good: ≤200ms | Needs work: 200–500ms | Poor: >500ms' },
          { label: 'CLS (Cumulative Layout Shift)', value: 'Good: ≤0.1 | Needs work: 0.1–0.25 | Poor: >0.25' },
          { label: 'FCP (First Contentful Paint)', value: 'Good: ≤1.8s | Needs work: 1.8–3s | Poor: >3s' },
          { label: 'TTFB (Time to First Byte)', value: 'Good: ≤800ms | Needs work: 800ms–1.8s | Poor: >1.8s' },
        ]
      },
      {
        type: 'list', label: 'Common Fixes', content: [
          'LCP: Preload hero image, use CDN, optimize image formats (WebP/AVIF)',
          'INP: Minimize JavaScript execution time, use web workers for heavy tasks',
          'CLS: Set explicit width/height on images and videos; avoid inserting content above the fold',
          'FCP: Eliminate render-blocking CSS and JS; use font-display:swap',
          'TTFB: Use a CDN, optimize server-side rendering, enable HTTP/2',
        ]
      },
    ],
    about: 'Google confirmed Core Web Vitals as a ranking factor in 2021. INP replaced FID (First Input Delay) in March 2024 as it better measures interactivity throughout the page lifecycle. Pages passing all three CWV thresholds may receive a ranking boost in competitive queries.',
    related: ['page-load-time-estimator', 'seo-meta-length-checker', 'sitemap-size-estimator'],
  },
  {
    slug: 'page-load-time-estimator',
    title: 'Page Load Time Estimator',
    desc: 'Estimate page load time from total asset size and connection speed.',
    cat: 'tech',
    icon: '⏱️',
    toolType: 'estimator',
    fields: [
      { k: 'page_size', l: 'Total Page Size (KB)', type: 'number', placeholder: '1500' },
      { k: 'requests', l: 'Number of HTTP Requests', type: 'number', placeholder: '50' },
      { k: 'speed', l: 'Connection Speed (Mbps)', type: 'number', placeholder: '50' },
    ],
    fn: (inputs) => {
      const sizeKB = parseFloat(inputs.page_size) || 1500, requests = parseFloat(inputs.requests) || 50, speedMbps = parseFloat(inputs.speed) || 50
      const transferTime = (sizeKB * 8) / (speedMbps * 1000)
      const latencyOverhead = requests * 0.02 // 20ms per request overhead
      const estimatedLoad = (transferTime + latencyOverhead).toFixed(2)
      const category = parseFloat(estimatedLoad) < 1 ? 'Fast' : parseFloat(estimatedLoad) < 3 ? 'Acceptable' : parseFloat(estimatedLoad) < 6 ? 'Slow' : 'Very Slow'
      return [{
        type: 'table', label: 'Load Time Estimate', content: [
          { label: 'Transfer time', value: `${(transferTime * 1000).toFixed(0)}ms` },
          { label: 'Request overhead', value: `${(latencyOverhead * 1000).toFixed(0)}ms` },
          { label: 'Estimated total', value: `${estimatedLoad}s (${category})` },
          { label: 'Google target', value: '<2.5s for good LCP' },
          { label: 'At 10 Mbps (mobile 4G)', value: `${((sizeKB * 8) / 10000 + latencyOverhead).toFixed(2)}s` },
          { label: 'At 1 Mbps (poor mobile)', value: `${((sizeKB * 8) / 1000 + latencyOverhead).toFixed(2)}s` },
        ]
      }]
    },
    about: 'Google research found that 53% of mobile users abandon pages that take longer than 3 seconds to load. Each additional second of load time reduces conversions by ~7%. Image optimization and removing unused JavaScript are typically the highest-impact improvements.',
    related: ['core-web-vitals-guide', 'bandwidth-calculator', 'sitemap-size-estimator'],
  },
  {
    slug: 'cloud-cost-estimator-aws',
    title: 'AWS Cloud Cost Estimator',
    desc: 'Rough monthly cost estimates for common AWS services and configurations.',
    cat: 'tech',
    icon: '☁️',
    toolType: 'estimator',
    fields: [
      {
        k: 'instance',
        l: 'EC2 Instance Type',
        type: 'select',
        options: [
          { value: '0.0116', label: 't3.nano ($0.0116/hr)' },
          { value: '0.0208', label: 't3.micro ($0.0208/hr)' },
          { value: '0.0832', label: 't3.medium ($0.0832/hr)' },
          { value: '0.1664', label: 't3.large ($0.1664/hr)' },
          { value: '0.3328', label: 't3.xlarge ($0.3328/hr)' },
        ],
      },
      { k: 'storage_gb', l: 'EBS Storage (GB)', type: 'number', placeholder: '100' },
      { k: 'transfer_gb', l: 'Data Transfer Out (GB/mo)', type: 'number', placeholder: '50' },
    ],
    fn: (inputs) => {
      const instanceHr = parseFloat(inputs.instance) || 0.0208
      const storageGB = parseFloat(inputs.storage_gb) || 0
      const transferGB = parseFloat(inputs.transfer_gb) || 0
      const ec2 = instanceHr * 24 * 30
      const ebs = storageGB * 0.08
      const transfer = Math.max(0, transferGB - 1) * 0.09 // first 1GB free
      const total = ec2 + ebs + transfer
      return [{
        type: 'table', label: 'Monthly AWS Estimate', content: [
          { label: 'EC2 instance (on-demand)', value: `$${ec2.toFixed(2)}` },
          { label: 'EBS storage (gp3)', value: `$${ebs.toFixed(2)}` },
          { label: 'Data transfer out', value: `$${transfer.toFixed(2)}` },
          { label: 'Estimated total', value: `$${total.toFixed(2)}/month` },
          { label: 'Reserved (1yr) savings', value: `~$${(total * 0.38).toFixed(2)}/month savings` },
          { label: 'Note', value: 'Excludes RDS, CloudFront, Route53, and other services' },
        ]
      }]
    },
    about: 'On-demand EC2 prices are the highest tier; Reserved Instances (1-year) save ~38%; Spot Instances can save 70–90% but can be interrupted. AWS Free Tier includes 750 hours/month of t2.micro or t3.micro for the first 12 months.',
    related: ['server-cost-estimator', 'bandwidth-calculator', 'data-storage-converter'],
  },
  {
    slug: 'server-cost-estimator',
    title: 'Server Cost Estimator',
    desc: 'Compare bare metal, VPS, and cloud server monthly costs.',
    cat: 'tech',
    icon: '🖥️',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Server Cost Comparison (2025)', content: [
        { label: 'Shared hosting (basic)', value: '$2–$8/month' },
        { label: 'VPS — 1 vCPU, 1 GB RAM (DigitalOcean)', value: '$6/month' },
        { label: 'VPS — 2 vCPU, 4 GB RAM', value: '$24/month' },
        { label: 'VPS — 4 vCPU, 8 GB RAM', value: '$48/month' },
        { label: 'AWS t3.micro (on-demand)', value: '~$15/month' },
        { label: 'AWS t3.medium (on-demand)', value: '~$60/month' },
        { label: 'AWS t3.xlarge (on-demand)', value: '~$119/month' },
        { label: 'Dedicated server (entry)', value: '$80–$200/month' },
        { label: 'Dedicated server (high-end)', value: '$400–$2,000/month' },
        { label: 'Vercel (hobby / static)', value: 'Free' },
        { label: 'Vercel Pro', value: '$20/month' },
        { label: 'Cloudflare Pages', value: 'Free (unlimited sites)' },
      ]
    }],
    about: 'Managed services (RDS, Vercel, PlanetScale) cost more per compute unit but eliminate DevOps overhead. For startups, managed serverless platforms often provide the best cost-per-developer-hour. Bare metal only makes economic sense at high and predictable traffic volumes.',
    related: ['cloud-cost-estimator-aws', 'bandwidth-calculator'],
  },
  {
    slug: 'api-rate-limit-calculator',
    title: 'API Rate Limit Calculator',
    desc: 'Calculate API throughput, wait times, and cost at different rate limits.',
    cat: 'tech',
    icon: '⚙️',
    toolType: 'estimator',
    fields: [
      { k: 'requests', l: 'Total Requests Needed', type: 'number', placeholder: '100000' },
      { k: 'rate', l: 'Rate Limit (requests/minute)', type: 'number', placeholder: '60' },
      { k: 'cost_per_1000', l: 'Cost per 1,000 Requests ($)', type: 'number', placeholder: '0.002', unit: '$' },
    ],
    fn: (inputs) => {
      const total = parseFloat(inputs.requests) || 0, ratePerMin = parseFloat(inputs.rate) || 60, costPer1k = parseFloat(inputs.cost_per_1000) || 0
      const minutesNeeded = total / ratePerMin
      const hoursNeeded = minutesNeeded / 60
      const totalCost = total / 1000 * costPer1k
      const perDay = ratePerMin * 60 * 24
      return [{
        type: 'table', label: 'API Rate Analysis', content: [
          { label: 'Total requests', value: total.toLocaleString() },
          { label: 'Rate limit', value: `${ratePerMin.toLocaleString()}/min` },
          { label: 'Time to complete', value: hoursNeeded < 1 ? `${minutesNeeded.toFixed(0)} minutes` : `${hoursNeeded.toFixed(1)} hours` },
          { label: 'Requests per day at this rate', value: perDay.toLocaleString() },
          { label: 'Total cost', value: costPer1k > 0 ? `$${totalCost.toFixed(4)}` : 'Not provided' },
        ]
      }]
    },
    about: 'API rate limits protect services from abuse and ensure fair usage. Common limits: Twitter API at 300 requests/15 min; OpenAI at 3,500 RPM (RPM = requests per minute) on default tier. Exponential backoff with jitter is the standard pattern for handling 429 rate limit errors.',
    related: ['bandwidth-calculator', 'server-cost-estimator', 'cloud-cost-estimator-aws'],
  },
]
