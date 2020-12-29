import { lookup } from 'react-native-mime-types';

class File {
  constructor (value) {
    const blockList = ['uri', 'path', 'name', 'cancelled'];

    Object.keys(value).forEach(key => {
      if (!blockList.includes(key)) this[key] = value[key];
    });

    this.uri = value.path || value.uri;
    this.name = this.uri.split('/').reverse()[0];
    this.mimeType = lookup(this.uri);
  }
}

export default File;
