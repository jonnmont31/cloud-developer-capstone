import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils'
import { getAlbums } from '../../businessLogic/albums'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    console.log(userId)
    try {
      const userAlbums = await getAlbums(userId)
      return {
        statusCode: 201,
        body: JSON.stringify({ items: userAlbums })
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching albums' })
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
