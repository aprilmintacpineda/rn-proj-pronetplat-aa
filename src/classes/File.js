import { Platform } from 'react-native';
import rnfs from 'react-native-fs';
import { lookup } from 'react-native-mime-types';

class File {
  constructor (value) {
    const blockList = ['uri', 'path', 'name', 'cancelled'];

    Object.keys(value).forEach(key => {
      if (!blockList.includes(key)) this[key] = value[key];
    });

    this.uri = value.path || value.uri;
    this.name = this.uri.split('/').reverse()[0];
    this.type = lookup(this.uri);
  }

  async getSize () {
    const filePath =
      Platform.OS === 'ios'
        ? this.uri
        : this.uri.replace(/file:/, '');

    const stat = await rnfs.stat(filePath);
    this.size = stat.size / 1024 ** 2;
  }
}

export default File;
