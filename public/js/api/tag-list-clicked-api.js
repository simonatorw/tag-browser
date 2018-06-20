export function filterByTag(list, selectedTag) {
    return list.filter((item) => {
        const tagStr = item.tags.toString();

        return tagStr.includes(selectedTag);
    });
}