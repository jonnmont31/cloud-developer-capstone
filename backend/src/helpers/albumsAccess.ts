import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { AlbumItem } from '../models/AlbumItem'
import { AlbumUpdate } from '../models/AlbumUpdate'

const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('AlbumAccess')

export class AlbumsAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly albumTable = process.env.ALBUMS_TABLE
  ) {}

  //Get all todo items for a specified user
  async getAlbums(userId: string): Promise<AlbumItem[]> {
    logger.info('Getting all todo items of a particular user')
    const result = await this.docClient
      .query({
        TableName: this.albumTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        },
        ScanIndexForward: true
      })
      .promise()

    const items = result.Items
    return items as AlbumItem[]
  }

  //Get a single todo item based on its id and its user's id
  async getAlbumItem(albumId: string, userId: string): Promise<AlbumItem> {
    logger.info('Get a single album item for a specified user')

    const result = await this.docClient
      .get({
        TableName: this.albumTable,
        Key: {
          userId,
          albumId
        }
      })
      .promise()

    const item = result.Item
    return item as AlbumItem
  }

  //Create a new album item
  async createAlbumItem(albumItem: AlbumItem): Promise<AlbumItem> {
    logger.info('Creating a new album item')
    await this.docClient
      .put({
        TableName: this.albumTable,
        Item: {
          ...albumItem
        }
      })
      .promise()

    return albumItem
  }

  //Update an exisiting todo item
  async updateAlbumItem(
    updatedTodo: AlbumUpdate,
    userId: string,
    albumId: string
  ): Promise<AlbumUpdate> {
    logger.info('Updating album item')
    await this.docClient
      .update({
        TableName: this.albumTable,
        Key: {
          userId,
          albumId
        },
        UpdateExpression:
          'set #albumName=:albumName, albumArtist=:albumArtist, albumYear=:albumYear, albumGenre=:albumGenre',
        ExpressionAttributeValues: {
          ':albumName': updatedTodo.albumName,
          ':albumArtist': updatedTodo.albumArtist,
          ':albumYear': updatedTodo.albumYear,
          ':albumGenre': updatedTodo.albumGenre
        },
        ExpressionAttributeNames: {
          '#albumName': 'albumName'
        }
      })
      .promise()

    return updatedTodo as AlbumUpdate
  }

  //Delete a single album item
  async deleteAlbumItem(userId: string, albumId: string): Promise<void> {
    logger.info('Deleting a single album item')
    await this.docClient
      .delete({
        TableName: this.albumTable,
        Key: {
          userId: userId,
          albumId: albumId
        }
      })
      .promise()
  }

  //Updating attachment URL
  async updateAttachmentUrl(
    albumId: string,
    userId: string,
    attachmentUrl: string
  ): Promise<void> {
    logger.info('Updating a albums attachment URL')
    await this.docClient
      .update({
        TableName: this.albumTable,
        Key: {
          albumId,
          userId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl
        }
      })
      .promise()
  }
}
