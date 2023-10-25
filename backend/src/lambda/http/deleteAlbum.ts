import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteAlbumItem } from '../../businessLogic/albums'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const albumId = event.pathParameters.albumId
    const userId = getUserId(event)
    await deleteAlbumItem(userId, albumId)
    return {
      statusCode: 204,
      body: ''
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
    headers: true
  })
)
