export function createTagList(data) {
    let tags = [];

    for (let i = 0; i < data.length; i++) {
        tags = tags.concat(data[i].tags);
    }

    return tags;
}

export function makeListUnique(list) {
  return list.filter((val, indx, item) => { 
    return item.indexOf(val) === indx;
  });
}

export function sortList(list) {
  return list.sort((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
}