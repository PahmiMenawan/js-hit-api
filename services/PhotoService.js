import { Photo } from "../models/Photo.js";

export class PhotoService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getPhotos(offset, limit) {
    const res = await fetch(
      `${this.baseUrl}/photos?offset=${offset}&limit=${limit}`
    );
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();
    return data.photos.map((photo) => new Photo(photo.url));
  }
}
