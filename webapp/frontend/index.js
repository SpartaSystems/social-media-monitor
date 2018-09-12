import EntityListControl from './src/controls/EntityListControl.js';
import EntityTypeListControl from './src/controls/EntityTypeListControl.js';
import PhraseListControl from './src/controls/PhraseListControl.js';
import SentimentListControl from './src/controls/SentimentListControl.js';
import SearchButtonControl from './src/controls/SearchButtonControl.js'
import css from './src/styles/basis.css';
import embed from './src/styles/tweet-embed.css';
document.addEventListener("DOMContentLoaded", () => {
    let entityTypes = new EntityTypeListControl(),
    entities = new EntityListControl(entityTypes),
    phrases = new PhraseListControl(),
    sentiment = new SentimentListControl(),
	search = new SearchButtonControl({
        controls: {
            entities: entities,
            entityTypes: entityTypes,
            phrases: phrases,
            sentiment: sentiment
        }
    })
});
