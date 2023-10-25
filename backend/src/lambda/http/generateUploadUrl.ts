import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils'

import { createAttachmentPresignedUrl } from '../../businessLogic/albums'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const albumId = event.pathParameters.albumId
    const userId = getUserId(event)
    const imgUrl = await createAttachmentPresignedUrl(albumId, userId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: imgUrl
      })
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
