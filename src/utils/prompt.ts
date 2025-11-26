import { Thread, Message } from '../types'

export const SYSTEM_MESSAGE = `You are an expert code reviewer and assistant. Provide actionable feedback and code suggestions.

Guidelines:
- Be specific and direct
- Focus on issues that matter (bugs, performance, security, readability)
- When suggesting code changes, provide ONLY the improved version of the SELECTED code
- Do NOT include code from the surrounding context in your suggestion
- The suggested code should be a direct replacement for the selected lines only

When you suggest code changes, use this format:
\`\`\`suggested
<improved version of ONLY the selected code>
\`\`\`

IMPORTANT: The \`\`\`suggested block must contain ONLY the improved version of the selected lines.
Do not include surrounding code, do not add new code that wasn't in the selection.
The suggestion will directly replace the selected lines in the editor.

- Keep responses focused and not overly long
- For simple feedback without code changes, use regular markdown
- If the user asks for more detail, provide it`

export function addLineNumbers(code: string, startLine: number): string {
  return code
    .split('\n')
    .map((line, idx) => `${startLine + idx}: ${line}`)
    .join('\n')
}

export function buildUserPrompt(
  thread: Thread,
  userMessage: string,
  fullCode: string,
  fileName: string
): string {
  const { startLine, endLine, selectedText, language } = thread

  // For small files, send everything
  const codeLines = fullCode.split('\n')
  const fileSize = codeLines.length

  let contextCode: string

  if (fileSize <= 500) {
    // Send full file
    contextCode = addLineNumbers(fullCode, 1)
  } else if (fileSize <= 2000) {
    // Send selection + 100 lines context
    const contextStart = Math.max(1, startLine - 100)
    const contextEnd = Math.min(fileSize, endLine + 100)
    const contextLines = codeLines.slice(contextStart - 1, contextEnd)
    contextCode = addLineNumbers(contextLines.join('\n'), contextStart)
  } else {
    // For very large files, just send selection + 50 lines context
    const contextStart = Math.max(1, startLine - 50)
    const contextEnd = Math.min(fileSize, endLine + 50)
    const contextLines = codeLines.slice(contextStart - 1, contextEnd)
    contextCode = addLineNumbers(contextLines.join('\n'), contextStart)
  }

  const selectedWithNumbers = addLineNumbers(selectedText, startLine)
  const lineCount = endLine - startLine + 1

  return `I'm reviewing code from file: **${fileName}** (${language})

**Selected lines ${startLine}-${endLine} (${lineCount} lines to improve):**
\`\`\`${language}
${selectedWithNumbers}
\`\`\`

**Context (surrounding code for reference only - do NOT include in suggestions):**
\`\`\`${language}
${contextCode}
\`\`\`

**My question:**
${userMessage}

IMPORTANT: If you suggest code changes, your \`\`\`suggested block must contain ONLY the improved version of lines ${startLine}-${endLine}. 
Do not include any code from outside this range. The suggestion will directly replace these ${lineCount} lines.`
}

export function buildConversationHistory(messages: Message[]): Array<{
  role: 'user' | 'assistant' | 'system'
  content: string
}> {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }))
}

/**
 * Extract suggested code from AI response
 * Looks for ```suggested code blocks
 */
export function extractSuggestedCode(content: string): string | null {
  const suggestedMatch = content.match(/```suggested\n([\s\S]*?)```/)
  if (suggestedMatch) {
    return suggestedMatch[1].trim()
  }
  return null
}

/**
 * Remove line numbers from code (for applying changes)
 */
export function stripLineNumbers(code: string): string {
  return code
    .split('\n')
    .map(line => {
      // Match patterns like "123: code" or "  45: code"
      const match = line.match(/^\s*\d+:\s?(.*)$/)
      return match ? match[1] : line
    })
    .join('\n')
}
