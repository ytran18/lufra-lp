import { type ExtendedRecordMap } from 'notion-types'
import { getCanonicalPageId, parsePageId, uuidToId } from 'notion-utils'

const uuid = false


export interface Site {
  name: string
  domain: string

  rootNotionPageId: string
  rootNotionSpaceId: string

  // settings
  html?: string
  fontFamily?: string
  darkMode?: boolean
  previewImages?: boolean

  // opengraph metadata
  description?: string
  image?: string
}

export const mapPageUrl =
  (site: Site, recordMap: ExtendedRecordMap, searchParams: URLSearchParams) =>
    (pageId = '') => {
      const pageUuid = parsePageId(pageId, { uuid: true }) ?? ''

      if (uuidToId(pageUuid) === site.rootNotionPageId) {
        return createUrl('/', searchParams)
      } else {
        return createUrl(
          `/${getCanonicalPageId(pageUuid, recordMap, { uuid })}`,
          searchParams
        )
      }
    }

export const getCanonicalPageUrl =
  (site: Site, recordMap: ExtendedRecordMap) =>
    (pageId = '') => {
      const pageUuid = parsePageId(pageId, { uuid: true }) ?? ''

      if (uuidToId(pageId) === site.rootNotionPageId) {
        return `https://${site.domain}`
      } else {
        return `https://${site.domain}/${getCanonicalPageId(pageUuid, recordMap, {
          uuid
        })}`
      }
    }

function createUrl(path: string, searchParams: URLSearchParams) {
  return [path, searchParams.toString()].filter(Boolean).join('?')
}
