import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateAlbumItem } from '../../businessLogic/albums'
import { UpdateAlbumRequest } from '../../requests/UpdateAlbumRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const albumId = event.pathParameters.albumId
    const updatedAlbum: UpdateAlbumRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    await updateAlbumItem(updatedAlbum, userId, albumId)
    return {
      statusCode: 200,
      body: ''
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
