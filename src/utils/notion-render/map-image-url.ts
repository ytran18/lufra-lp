import { defaultSiteConfig } from '@/constants/default-site-config'
import { type Block } from 'notion-types'
import { defaultMapImageUrl } from 'notion-utils'


export const mapImageUrl = (url: string | undefined, block: Block) => {
  if (url === defaultSiteConfig.defaultPageCover || url === defaultSiteConfig.defaultPageIcon) {
    return url
  }

  return defaultMapImageUrl(url, block)
}
