import TweetService from '../services/TweetService.js';
import TweetSearchResultMapper from '../mappers/TweetSearchResultMapper.js';

export default class SearchButtonControl {
    constructor(options) {
        this.controls = options.controls || {};
        this.draw();
    }

    onPress() {
        new TweetService().get({
            entities: this.controls.entities.value,
            entityTypes: this.controls.entityTypes.value,
            phrases: this.controls.phrases.value,
            sentiment: this.controls.sentiment.value,
            lang: ['en']
        }).then( (response) => {
            document.querySelector('#results').innerHTML = '';
            let content = TweetSearchResultMapper.map(response.data);
            if (content.length) document.querySelector('#results').innerHTML = content;
        }).catch((error)=>{
            console.error(error);
        });
    }

    draw() {
        document.querySelector('button#search')
            .addEventListener('click',
                this.onPress.bind(this));
    }
}
