import JSZip from "jszip";
import { getType } from "mime";
import Folder from "./folder";

export async function findSongFilesInZip(zip: File) {
  let jsZip = await JSZip.loadAsync(zip);
  let zipRootFolder = await new ZipFileTree().treefy(jsZip);
  let songFolder = zipRootFolder.findFolder(isSongFolder);
  if (!songFolder)
    throw new Error("Can't find a song folder in zip file: " + zip.name);
  return songFolder.files;
}

async function zipObjToFile(zipFile: JSZip.JSZipObject) {
  let fileName = zipFile.name.split("/").pop()!;

  let mimeCompatableFileName = fileName.replace(/\.egg$/, ".ogg");

  let mime = getType(mimeCompatableFileName);
  let blob = await zipFile.async("blob");
  return new File([blob], fileName, { ...(mime && { type: mime }) });
}

function isSongFolder(folder: Folder) {
  let files = folder.files;
  return files.some(file => /^info\.(dat|json)$/i.test(file.name));
}

class ZipFileTree {
  tree: Folder;

  constructor() {
    this.tree = new Folder("root");
  }

  async treefy(zip: JSZip) {
    let zipFile = zip.files;
    for (let path in zipFile) {
      let item = zipFile[path];
      if (item.dir) {
        await this.ensurePath(path);
      } else {
        await this.ensureAddFile(path, item);
      }
    }
    return this.tree;
  }

  /**
   * @param path "foo/bar/"
   */
  ensurePath(path: string) {
    return path
      .split("/")
      .slice(0, -1)
      .reduce((folder, name) => {
        return folder.ensureAndGoTo(name);
      }, this.tree);
  }

  async ensureAddFile(path: string, item: JSZip.JSZipObject) {
    const DIV = "/";
    let [basePath] = path.match(/^(.*?\/)(?=[^/]*$)/) || [null];
    let folder = this.tree;

    if (basePath) {
      folder = this.ensurePath(basePath);
    }

    folder.addItem(await zipObjToFile(item));
  }

  addItem(path: string, zipObj: JSZip.JSZipObject) {
    let pathSegements = path.split("/");
    for (let i = 0; i < pathSegements.length - 1; i++) {
      this.tree.ensureAndGoTo(pathSegements[i]);
    }
  }
}
