import axios from 'axios';

class ServiceProvider {
  constructor() {
    this.baseURL = "aHR0cHM6Ly93d3cuamlvc2Fhdm4uY29tL2FwaS5waHA/X19jYWxsPQ==";
  }

  async request(dir) {
    try {
      const isServer = typeof window === 'undefined';
      let response;
      const fullURL = this.getFullURL(dir);

      if (isServer) {
        // Server-side request using axios
        response = await axios.get(fullURL, {
          headers: {
            Accept: "application/json, text/plain, */*",
            Cookie:
              "B=ffe5a4383fa531151b96f993e2586d32; CT=MjgzNjUxNTc3; DL=english; L=hindi; geo=152.58.76.33%2CIN%2CPunjab%2CLudhiana%2C141007; mm_latlong=31.0048%2C75.9463; CH=G03%2CA07%2CO00%2CL03",
          },
        });
        return response.data;
      } else {
        // Client-side request using native fetch
        response = await fetch(`/api/proxy?url=${encodeURIComponent(fullURL)}`, {
          headers: {
            Accept: "application/json, text/plain, */*",
          },
        });

        if (response.status < 400) {
          const data = await response.json();
          return data;
        }
        return null;
      }
    } catch (error) {
      console.error(error);
      if (typeof window !== 'undefined') {
        alert(`Error: ${error.message}`);
      }
    }
  }

  getFullURL(dir) {
    const decodedBaseURL = Buffer.from(this.baseURL, "base64").toString("utf-8");
    return `${decodedBaseURL}${dir}`;
  }
  
    async getLaunchData() {
      const data = await this.request(
        `webapi.getLaunchData&api_version=4&_format=json&_marker=0&ctx=web6dot0`
      );
      return data;
    }
  
    async getArtist(artist_id, song_count) {
      const data = await this.request(
        `artist.getArtistPageDetails&artistId=${artist_id}&type=songs&n_song=${song_count}&category=&sort_order=&_format=json&ctx=web6dot0`
      );
      return data;
    }
  
    async getTopSearches() {
      const data = await this.request(
        `content.getTopSearches&ctx=web6dot0&api_version=4&_format=json&_marker=0`
      );
      return data;
    }
  
    async getAlbums(count, page) {
      const data = await this.request(
        `content.getAlbums&n=${count}&p=${page}&api_version=4&_format=json&_marker=0&n=50&p=1&ctx=web6dot0`
      );
      return data;
    }
  
    async getCharts() {
      const data = await this.request(
        `content.getCharts&api_version=4&_format=json&_marker=0&ctx=web6dot0`
      );
      return data;
    }
  
    async getFeaturedPlaylists(count, page) {
      const data = await this.request(
        `content.getFeaturedPlaylists&fetch_from_serialized_files=true&p=${page}&n=${count}&_format=json&_marker=0&ctx=web6dot0`
      );
      return data;
    }
  
    async getTopShows(count, page) {
      const data = await this.request(
        `content.getTopShows&n=${count}&p=${page}&_format=json&_marker=0&ctx=web6dot0`
      );
      return data;
    }
  
    async getTopArtists() {
      const data = await this.request(
        `social.getTopArtists&_format=json&_marker=0&ctx=web6dot0`
      );
      return data;
    }
  
    async getFeaturedStations() {
      const data = await this.request(
        `webradio.getFeaturedStations&api_version=4&_format=json&_marker=0&ctx=web6dot0`
      );
      return data;
    }
  
    async getPlaylistById(id) {
      const data = await this.request(
        `playlist.getDetails&listid=${id}&_format=json`
      );
      return data;
    }
  
    async getStationById(name, count = 20) {
      const station_id = await this.request(
        `webradio.createFeaturedStation&language=hindi&pid=&query=&name=${name.replaceAll(" ", "+")}&mode=&artistid=&_format=json&_marker=0&ctx=web6dot0`
      );
      const data = await this.request(
        `webradio.getSong&stationid=${station_id.stationid}&k=${count}&next=1&_format=json&_marker=0&ctx=web6dot0&api_version=4`
      );
      return data;
    }
  
    async getAlbumById(album_id) {
      var data = await this.request(
        `webapi.get&token=${album_id}&type=album&includeMetaTags=0&ctx=web6dot0&api_version=4&_format=json&_marker=0`
      );
      return data;
    }
  
    async getSongById(id) {
      const data = await this.request(
        `song.getDetails&cc=in&_marker=0%3F_marker%3D0&_format=json&pids=${id}`
      );
      return data[id];
    }
  
    async getLyrics(id) {
      const data = await this.request(
        `lyrics.getLyrics&lyrics_id=${id}&ctx=web6dot0&api_version=4&_format=json&_marker=0`
      );
      return data;
    }
  
    async getSearch(query, page, type) {
      var command = [
        "getPlaylistResults",
        "getResults",
        "getAlbumResults",
        `getMoreResults&params=%7B%22type%22:%22podcasts%22%7D&query=${query.replaceAll(" ", "+")}`,
        "getArtistResults",
      ][type];
      const data = await this.request(
        `search.${command}&p=${page}&q=${query}&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=50`
      );
      return data;
    }
  
    async playById(id) {
      const songDetails = await this.request(
        `song.getDetails&cc=in&_marker=0%3F_marker%3D0&_format=json&pids=${id}`
      );
      const token = songDetails[id].encrypted_media_url;
      var authTokenData = await this.request(
        `song.generateAuthToken&url=${encodeURIComponent(token)}&bitrate=160&api_version=4&_format=json&ctx=web6dot0&_marker=0`
      );
      authTokenData.auth_url = authTokenData.auth_url.replace("ac.cf.", "aac.");
      const result = {
        ...songDetails[id],
        streamurl: authTokenData,
      };
  
      return result;
    }
  
    async playByMediaUrl(mediaUrl) {
      var authTokenData = await this.request(
        `song.generateAuthToken&url=${encodeURIComponent(mediaUrl)}&bitrate=160&api_version=4&_format=json&ctx=web6dot0&_marker=0`
      );
      const authUrl = await authTokenData.auth_url.replace("ac.cf.", "aac.");
      return authUrl;
    }
  }
  
  export default ServiceProvider;