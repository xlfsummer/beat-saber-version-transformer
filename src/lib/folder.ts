export default class Folder {
  name: string;
  children: (File | Folder)[] = [];

  constructor(name: string) {
    if(!name) throw new TypeError("Name can't be empty when creating a folder");
    this.name = name;
  }

  addItem(item: File | Folder) {
    if (item instanceof File) {
      if (this.files.some(f => f.name == item.name)) {
        throw new Error("File already exist");
      }
      this.children.push(item);
      return;
    }

    if (item instanceof Folder) {
      if (this.folders.some(f => f.name == item.name)) {
        throw new Error("Folder already exist");
      }
      this.children.push(item);
      return;
    }

    throw new TypeError("Item type invalid");
  }

  ensureAndGoTo(folderName: string) {
    let folder = this.folders.find(f => f.name == folderName);
    if (!folder) {
      folder = new Folder(folderName);
      this.addItem(folder);
    }
    return folder;
  }

  get files(): File[] {
    return this.children.filter((item): item is File => item instanceof File);
  }

  get folders(): Folder[] {
    return this.children.filter(
      (item): item is Folder => item instanceof Folder
    );
  }

  findFolder(predicate: (folder: Folder) => boolean): Folder | undefined {
    return predicate(this) ? this : this.folders.find(predicate);
  }
}
