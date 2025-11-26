// Language detection based on file extension and content analysis

const EXTENSION_MAP: Record<string, string> = {
  // JavaScript/TypeScript
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.mjs': 'javascript',
  '.cjs': 'javascript',

  // Python
  '.py': 'python',
  '.pyw': 'python',
  '.pyi': 'python',

  // Java/JVM
  '.java': 'java',
  '.kt': 'kotlin',
  '.kts': 'kotlin',
  '.scala': 'scala',
  '.groovy': 'groovy',

  // C/C++
  '.c': 'c',
  '.h': 'c',
  '.cpp': 'cpp',
  '.cc': 'cpp',
  '.cxx': 'cpp',
  '.hpp': 'cpp',
  '.hxx': 'cpp',

  // C#
  '.cs': 'csharp',

  // Go
  '.go': 'go',

  // Rust
  '.rs': 'rust',

  // Ruby
  '.rb': 'ruby',
  '.rake': 'ruby',

  // PHP
  '.php': 'php',

  // Swift
  '.swift': 'swift',

  // Shell
  '.sh': 'shell',
  '.bash': 'shell',
  '.zsh': 'shell',

  // Web
  '.html': 'html',
  '.htm': 'html',
  '.css': 'css',
  '.scss': 'scss',
  '.sass': 'sass',
  '.less': 'less',

  // Data/Config
  '.json': 'json',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.xml': 'xml',
  '.toml': 'toml',

  // SQL
  '.sql': 'sql',

  // Markdown
  '.md': 'markdown',
  '.mdx': 'markdown',

  // Other
  '.lua': 'lua',
  '.r': 'r',
  '.R': 'r',
  '.pl': 'perl',
  '.pm': 'perl',
  '.dart': 'dart',
  '.ex': 'elixir',
  '.exs': 'elixir',
  '.erl': 'erlang',
  '.hrl': 'erlang',
  '.hs': 'haskell',
  '.clj': 'clojure',
  '.cljs': 'clojure',
  '.fs': 'fsharp',
  '.fsx': 'fsharp',
  '.vue': 'vue',
  '.svelte': 'svelte',
}

// Content-based patterns for language detection
const CONTENT_PATTERNS: Array<{ pattern: RegExp; language: string; weight: number }> = [
  // TypeScript
  { pattern: /\binterface\s+\w+\s*\{/m, language: 'typescript', weight: 3 },
  { pattern: /\btype\s+\w+\s*=/m, language: 'typescript', weight: 2 },
  { pattern: /:\s*(string|number|boolean|any|void)\b/, language: 'typescript', weight: 2 },
  { pattern: /<[\w\s,]+>\s*\(/, language: 'typescript', weight: 2 },

  // JavaScript/React
  { pattern: /\bfunction\s+\w+\s*\(/, language: 'javascript', weight: 1 },
  { pattern: /\bconst\s+\w+\s*=\s*\(?\s*\)?\s*=>/m, language: 'javascript', weight: 1 },
  { pattern: /\bimport\s+.*\s+from\s+['"]/, language: 'javascript', weight: 1 },
  { pattern: /<[A-Z]\w+[\s/>]/, language: 'javascript', weight: 2 }, // JSX components

  // Python
  { pattern: /^def\s+\w+\s*\(/m, language: 'python', weight: 3 },
  { pattern: /^class\s+\w+.*:/m, language: 'python', weight: 3 },
  { pattern: /^import\s+\w+/m, language: 'python', weight: 2 },
  { pattern: /^from\s+\w+\s+import/m, language: 'python', weight: 2 },
  { pattern: /^\s*if\s+.*:\s*$/m, language: 'python', weight: 1 },
  { pattern: /print\s*\(/, language: 'python', weight: 1 },

  // Java
  { pattern: /^public\s+(class|interface|enum)\s+\w+/m, language: 'java', weight: 4 },
  { pattern: /System\.out\.println/m, language: 'java', weight: 3 },
  { pattern: /\bprivate\s+\w+\s+\w+\s*;/m, language: 'java', weight: 2 },

  // Go
  { pattern: /^package\s+\w+/m, language: 'go', weight: 4 },
  { pattern: /^func\s+\w+\s*\(/m, language: 'go', weight: 3 },
  { pattern: /\bfmt\.Printf?\(/m, language: 'go', weight: 3 },
  { pattern: /\bif\s+err\s*!=\s*nil\b/, language: 'go', weight: 4 },

  // Rust
  { pattern: /^fn\s+\w+\s*\(/m, language: 'rust', weight: 3 },
  { pattern: /\blet\s+mut\s+\w+\s*=/m, language: 'rust', weight: 4 },
  { pattern: /\bimpl\s+\w+\s*(for\s+\w+)?\s*\{/m, language: 'rust', weight: 4 },
  { pattern: /->.*\{/m, language: 'rust', weight: 2 },
  { pattern: /\bprintln!\s*\(/m, language: 'rust', weight: 4 },

  // C++
  { pattern: /#include\s*<\w+>/m, language: 'cpp', weight: 3 },
  { pattern: /\bstd::\w+/, language: 'cpp', weight: 3 },
  { pattern: /\bcout\s*<</, language: 'cpp', weight: 4 },
  { pattern: /\bclass\s+\w+\s*\{/m, language: 'cpp', weight: 2 },

  // C#
  { pattern: /\bnamespace\s+\w+/m, language: 'csharp', weight: 3 },
  { pattern: /\bConsole\.WriteLine/m, language: 'csharp', weight: 4 },
  { pattern: /\bpublic\s+async\s+Task/m, language: 'csharp', weight: 4 },

  // Ruby
  { pattern: /^def\s+\w+/m, language: 'ruby', weight: 2 },
  { pattern: /\bputs\s+/, language: 'ruby', weight: 3 },
  { pattern: /\bend\s*$/m, language: 'ruby', weight: 1 },
  { pattern: /\brequire\s+['"]/, language: 'ruby', weight: 2 },

  // PHP
  { pattern: /<\?php/, language: 'php', weight: 5 },
  { pattern: /\$\w+\s*=/, language: 'php', weight: 2 },
  { pattern: /\becho\s+/, language: 'php', weight: 2 },

  // Swift
  { pattern: /^func\s+\w+\s*\(/m, language: 'swift', weight: 2 },
  { pattern: /\bvar\s+\w+\s*:\s*\w+/, language: 'swift', weight: 2 },
  { pattern: /\bguard\s+let\b/, language: 'swift', weight: 4 },
  { pattern: /\bprint\(/, language: 'swift', weight: 1 },

  // Kotlin
  { pattern: /\bfun\s+\w+\s*\(/m, language: 'kotlin', weight: 3 },
  { pattern: /\bval\s+\w+\s*=/, language: 'kotlin', weight: 2 },
  { pattern: /\bdata\s+class\b/, language: 'kotlin', weight: 4 },

  // SQL
  { pattern: /\bSELECT\s+.+\s+FROM\b/i, language: 'sql', weight: 4 },
  { pattern: /\bCREATE\s+TABLE\b/i, language: 'sql', weight: 4 },
  { pattern: /\bINSERT\s+INTO\b/i, language: 'sql', weight: 4 },

  // Shell
  { pattern: /^#!/m, language: 'shell', weight: 3 },
  { pattern: /\b(echo|export|if\s+\[)\b/, language: 'shell', weight: 2 },

  // HTML
  { pattern: /<html|<!DOCTYPE\s+html>/i, language: 'html', weight: 5 },
  { pattern: /<div|<span|<p>|<body>/i, language: 'html', weight: 2 },

  // CSS
  { pattern: /\{[\s\S]*?[a-z-]+\s*:\s*[^}]+\}/m, language: 'css', weight: 1 },
  { pattern: /\.([\w-]+)\s*\{/, language: 'css', weight: 2 },

  // JSON
  { pattern: /^\s*\{\s*"[\w-]+"\s*:/m, language: 'json', weight: 3 },

  // YAML
  { pattern: /^[\w-]+:\s*.+$/m, language: 'yaml', weight: 1 },
  { pattern: /^\s*-\s+\w+:/m, language: 'yaml', weight: 2 },
]

/**
 * Detect programming language from file extension
 */
export function detectLanguageFromExtension(fileName: string): string | null {
  const lastDotIndex = fileName.lastIndexOf('.')
  if (lastDotIndex === -1) return null

  const extension = fileName.slice(lastDotIndex).toLowerCase()
  return EXTENSION_MAP[extension] || null
}

/**
 * Detect programming language from code content using pattern matching
 */
export function detectLanguageFromContent(code: string): string | null {
  if (!code || code.trim().length < 10) return null

  const scores: Record<string, number> = {}

  for (const { pattern, language, weight } of CONTENT_PATTERNS) {
    if (pattern.test(code)) {
      scores[language] = (scores[language] || 0) + weight
    }
  }

  // Find language with highest score
  let bestLanguage: string | null = null
  let bestScore = 0

  for (const [language, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score
      bestLanguage = language
    }
  }

  // Only return if confidence is reasonable
  return bestScore >= 2 ? bestLanguage : null
}

/**
 * Auto-detect language using both file extension and content analysis
 * Priority: file extension > content analysis
 */
export function autoDetectLanguage(fileName: string, code: string): string {
  // First try file extension
  const extLanguage = detectLanguageFromExtension(fileName)
  if (extLanguage) return extLanguage

  // Fall back to content analysis
  const contentLanguage = detectLanguageFromContent(code)
  if (contentLanguage) return contentLanguage

  // Default to typescript
  return 'typescript'
}

/**
 * Get appropriate file extension for a language
 */
export function getExtensionForLanguage(language: string): string {
  const langToExt: Record<string, string> = {
    typescript: '.ts',
    javascript: '.js',
    python: '.py',
    java: '.java',
    go: '.go',
    rust: '.rs',
    cpp: '.cpp',
    c: '.c',
    csharp: '.cs',
    ruby: '.rb',
    php: '.php',
    swift: '.swift',
    kotlin: '.kt',
    scala: '.scala',
    shell: '.sh',
    html: '.html',
    css: '.css',
    json: '.json',
    yaml: '.yaml',
    sql: '.sql',
    markdown: '.md',
  }
  return langToExt[language] || '.txt'
}

