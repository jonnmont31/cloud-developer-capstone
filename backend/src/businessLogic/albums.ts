import { AlbumsAccess } from '../helpers/albumsAccess'
import { AttachmentUtils } from '../helpers/attachmentUtils'
import { AlbumItem } from '../models/AlbumItem'
import { CreateAlbumRequest } from '../requests/CreateAlbumRequest'
import { UpdateAlbumRequest } from '../requests/UpdateAlbumRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const albumAccess = new AlbumsAccess()
const logger = createLogger('AlbumsFunctions')
const attachmentUtils = new AttachmentUtils()

export async function getAlbums(userId: string): Promise<AlbumItem[]> {
  console.log('Getting all albums for a specific user')
  logger.info('Getting all albums for a specific user')
  return await albumAccess.getAlbums(userId)
}

export async function getAlbumItem(
  userId: string,
  albumId: string
): Promise<AlbumItem> {
  logger.info('Getting a specific album item')
  return await albumAccess.getAlbumItem(userId, albumId)
}

export async function createAlbumItem(
  createAlbumRequest: CreateAlbumRequest,
  userId: string
): Promise<AlbumItem> {
  logger.info('Creating a new album item')
  const albumId = uuid.v4()
  const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(albumId)
  const newAlbum: AlbumItem = {
    userId,
    albumId,
    attachmentUrl: s3AttachmentUrl,
    ...createAlbumRequest
  }

  return albumAccess.createAlbumItem(newAlbum)
}

export async function updateAlbumItem(
  updateAlbumRequest: UpdateAlbumRequest,
  userId: string,
  albumId: string
): Promise<any> {
  logger.info('Updating album item')
  return albumAccess.updateAlbumItem(updateAlbumRequest, userId, albumId)
}

export async function deleteAlbumItem(
  userId: string,
  albumId: string
): Promise<void> {
  logger.info('Deleting album item')
  return albumAccess.deleteAlbumItem(userId, albumId)
}

export async function createAttachmentPresignedUrl(
  albumId: string,
  userId: string
): Promise<string> {
  logger.info(
    'Here we will get the attachments URL and updated it in its respective album item'
  )
  const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(albumId)
  await albumAccess.updateAttachmentUrl(albumId, userId, s3AttachmentUrl)
  return attachmentUtils.getUploadUrl(albumId)
}
