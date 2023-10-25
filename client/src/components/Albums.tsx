import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Grid,
  Header,
  Icon,
  Image,
  Loader,
  Form,
  Table
} from 'semantic-ui-react'

import {
  createAlbum,
  deleteAlbum,
  getAlbums,
  patchAlbum
} from '../api/albums-api'
import Auth from '../auth/Auth'
import { Album } from '../types/Album'

interface AlbumsProps {
  auth: Auth
  history: History
}

interface AlbumsState {
  albums: Album[]
  albumName: string
  albumArtist: string
  albumYear: string
  albumGenre: string
  loadingAlbums: boolean
}

export class Albums extends React.PureComponent<AlbumsProps, AlbumsState> {
  state: AlbumsState = {
    albums: [],
    albumName: '',
    albumArtist: '',
    albumYear: '',
    albumGenre: '',
    loadingAlbums: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ albumName: event.target.value })
  }

  handleArtistChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ albumArtist: event.target.value })
  }

  handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ albumYear: event.target.value })
  }

  handleGenreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ albumGenre: event.target.value })
  }

  onAlbumEditButtonClick = (albumId: string) => {
    this.props.history.push(`/albums/${albumId}/edit`)
  }

  onAlbumCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      if (this.state.albumName.replace(/\s/g, '').length) {
        const newAlbum = await createAlbum(this.props.auth.getIdToken(), {
          albumName: this.state.albumName,
          albumArtist: this.state.albumArtist,
          albumYear: this.state.albumYear,
          albumGenre: this.state.albumGenre
        })
        this.setState({
          albums: [...this.state.albums, newAlbum],
          albumName: '',
          albumArtist: '',
          albumYear: '',
          albumGenre: ''
        })
      } else {
        alert('Album Name cannot be empty')
      }
    } catch {
      alert('Album creation failed')
    }
  }

  onAlbumDelete = async (albumId: string) => {
    try {
      await deleteAlbum(this.props.auth.getIdToken(), albumId)
      this.setState({
        albums: this.state.albums.filter((album) => album.albumId !== albumId)
      })
    } catch {
      alert('Album deletion failed')
    }
  }

  onAlbumCheck = async (pos: number) => {
    try {
      const album = this.state.albums[pos]
      await patchAlbum(this.props.auth.getIdToken(), album.albumId, {
        albumName: album.albumName,
        albumArtist: album.albumArtist,
        albumYear: album.albumYear,
        albumGenre: album.albumGenre
      })
    } catch {
      alert('Album deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const albums = await getAlbums(this.props.auth.getIdToken())
      this.setState({
        albums,
        loadingAlbums: false
      })
    } catch (e) {
      alert(`Failed to fetch albums: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Music Vault</Header>
        {this.renderAlbumForm()}
        {this.renderAlbums()}
      </div>
    )
  }

  renderAlbumForm() {
    return (
      <Form onSubmit={this.onAlbumCreate}>
        <Form.Field>
          <label>Album Title</label>
          <input
            onChange={this.handleNameChange}
            placeholder="e.g. A Night At The Opera"
          />
        </Form.Field>
        <Form.Field>
          <label>Album Artist</label>
          <input onChange={this.handleArtistChange} placeholder="e.g. Queen" />
        </Form.Field>
        <Form.Field>
          <label>Year</label>
          <input onChange={this.handleYearChange} placeholder="e.g. 1975" />
        </Form.Field>
        <Form.Field>
          <label>Genre</label>
          <input
            onChange={this.handleGenreChange}
            placeholder="e.g. Glam-Rock"
          />
        </Form.Field>
        <Button color="teal" type="submit" icon>
          Add Album
        </Button>
      </Form>
    )
  }

  renderAlbums() {
    if (this.state.loadingAlbums) {
      return this.renderLoading()
    }

    return this.renderAlbumsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Albums
        </Loader>
      </Grid.Row>
    )
  }

  renderAlbumsList() {
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Remove Album</Table.HeaderCell>
            <Table.HeaderCell>Edit Album</Table.HeaderCell>
            <Table.HeaderCell>Album Name</Table.HeaderCell>
            <Table.HeaderCell>Album Artist</Table.HeaderCell>
            <Table.HeaderCell>Year</Table.HeaderCell>
            <Table.HeaderCell>Genre</Table.HeaderCell>
            <Table.HeaderCell>Album Art</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {this.state.albums.map((album, pos) => {
          return (
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <Button
                    icon
                    color="red"
                    onClick={() => this.onAlbumDelete(album.albumId)}
                  >
                    <Icon name="delete" />
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    icon
                    color="blue"
                    onClick={() => this.onAlbumEditButtonClick(album.albumId)}
                  >
                    <Icon name="pencil" />
                  </Button>
                </Table.Cell>
                <Table.Cell>{album.albumName}</Table.Cell>
                <Table.Cell>{album.albumArtist}</Table.Cell>
                <Table.Cell>{album.albumYear}</Table.Cell>
                <Table.Cell>{album.albumGenre}</Table.Cell>
                <Table.Cell>
                  {album.attachmentUrl && (
                    <Image src={album.attachmentUrl} size="mini" wrapped />
                  )}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          )
        })}
      </Table>
    )
  }
}
