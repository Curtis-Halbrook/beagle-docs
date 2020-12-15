import { readFile, writeFile, mkdir } from 'fs/promises'
import { dirname } from 'path'
import { glob } from 'glob'

const ENCODING: BufferEncoding = 'utf-8'

const LANGUAGE_CONFIG = {
  en: {
    source: './content/en/**/*.md',
    targetFile: './static/playground/en',
  },
  pt: {
    source: './content/pt/**/*.md',
    targetFile: './static/playground/pt',
  },
}

const WARNING = {
  duplicated: (name: string) => `WARNING: duplicated JSON identifier "${name}". Only the last entry will be considered.`,
  invalid: (name: string) => `WARNING: the JSON named "${name}" is not valid and won't be included as an example. See the details below:`,
  wrongFormat: (filename: string) => `WARNING: the file "${filename}" has a json-playground mark, but it has the wrong format. It will be ignored.`,
}

function globPromise(pattern: string) {
  return new Promise<string[]>((resolve, reject) => {
    glob(pattern, (error, files) => {
      if (error) reject(error)
      else resolve(files)
    })
  })
}

async function getMdFileList(dir: string): Promise<string[]> {
  const list = await globPromise(dir)
  return list
}

function parseCodeSection(filename: string, codeSection: string) {
  const match = codeSection.match(/<!-- json-playground:([^{]+)(.*)-->/)

  if (!match) {
    console.warn(WARNING.wrongFormat(filename))
    return null
  }

  const [_, name, code] = match
  try {
    return { name, json: JSON.stringify(JSON.parse(code)) }
  } catch (error) {
    console.warn('---------------------------')
    console.warn(WARNING.invalid(name))
    console.warn(error)
    console.warn('At', filename)
    console.warn('---------------------------')
    return null
  }
}

async function getPlaygroundCodeInFile(filename: string): Promise<Record<string, string>> {
  const content = await readFile(filename, { encoding: ENCODING })
  const codeSections = content.replace(/(?:\r\n|\r|\n)/g, '').match(/<!-- json-playground:.*?-->/g)
  if (!codeSections) return {}

  return codeSections.reduce((result, codeSection) => {
    const parsed = parseCodeSection(filename, codeSection)
    if (!parsed) return {}
    if (result[parsed.name]) console.warn(WARNING.duplicated(parsed.name))
    return { ...result, [parsed.name]: parsed.json }
  }, {})
}

function validateUniqueKeys(mapA: Record<string, any>, mapB: Record<string, any>) {
  const keysA = Object.keys(mapA)
  const keysB = Object.keys(mapB)
  keysB.forEach((key) => {
    if (keysA.includes(key)) {
      console.warn(WARNING.duplicated(key))
    }
  })
} 

async function createPlaygroundProjectFromFiles(fileNames: string[]) {
  const jsonMapArray = await Promise.all(fileNames.map(getPlaygroundCodeInFile))
  return jsonMapArray.reduce((result, jsonMap) => {
    validateUniqueKeys(result, jsonMap)
    return { ...result, ...jsonMap }
  }, {})
}

async function writePlaygroundProjectToFile(
  playgroundProject: Record<string, string>,
  targetFile: string,
) {
  mkdir(dirname(targetFile), { recursive: true })
  await writeFile(targetFile, JSON.stringify(playgroundProject), { encoding: ENCODING })
}

async function buildPlaygroundFile(language: keyof typeof LANGUAGE_CONFIG) {
  const { source, targetFile } = LANGUAGE_CONFIG[language]
  const fileNames = await getMdFileList(source)
  const playgroundProject = await createPlaygroundProjectFromFiles(fileNames)
  await writePlaygroundProjectToFile(playgroundProject, targetFile)
  console.log(`Done building playground project for "${language}"! File is at "${targetFile}".`)
}

async function start() {
  const languages = Object.keys(LANGUAGE_CONFIG)
  await Promise.all(languages.map(buildPlaygroundFile))
}

start()
