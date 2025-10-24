export class Post {
  constructor(id, title, category, contentText, contentHtml, photoUrl) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.contentText = contentText;
    this.contentHtml = contentHtml;
    this.photoUrl = photoUrl;
  }

  get shortContent(){
    const trim = this.contentText.substring(0, 50);
    const lastSpace = trim.lastIndexOf(" ");
    return this.contentText.length > 50
      ? trim.substring(0, lastSpace) + "..."
      : this.contentText;
  }
}