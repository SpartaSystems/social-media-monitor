export default class TweetSearchResultMapper {
    static map(items) {
        let result = '';
        if (items.length > 0) {
            result = items.map( TweetSearchResultMapper.mapItem ).join(' ');
        }
        return result;
    }

    static mapItem(item) {
        let html = '';
        if(item.embed)
            html=item.embed.html;
        return html;
    }
}
