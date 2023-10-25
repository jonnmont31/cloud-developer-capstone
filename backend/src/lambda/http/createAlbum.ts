import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateAlbumRequest } from '../../requests/CreateAlbumRequest'
import { getUserId } from '../utils'
import { createAlbumItem } from '../../businessLogic/albums'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newAlbum: CreateAlbumRequest = JSON.parse(event.body)
    console.log(newAlbum)
    const userId = getUserId(event)
    try {
      const item = await createAlbumItem(newAlbum, userId)
      return {
        statusCode: 201,
        body: JSON.stringify({ item: item })
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Album Item Creation Failed' })
      }
    }
  }
)

handler.use(
  cors({
    credentials: true,
    headers: true
  })
)
