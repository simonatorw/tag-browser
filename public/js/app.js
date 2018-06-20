import { createTagList, makeListUnique, sortList } from './api/render-api.js';
import { filterByTag } from './api/tag-list-clicked-api.js';
import { filterById } from './api/title-list-clicked-api.js';

export default class TagBrowserWidget {
  constructor(config) {
    this.config = config;
    this.prevTagClicked;
    this.prevTitleClicked;

    this.fetchData()
      //use .bind because native promises change the "this" context
      .then(this.setData.bind(this))
      .then(this.getElements.bind(this))
      .then(this.bindEventListeners.bind(this))
      .then(this.render.bind(this));

    console.log('Widget Instance Created');
  }

  fetchData() {
    return new Promise((resolve, reject) => {
      //ajax the data and resolve the promise when it comes back
      $.get('/js/data.json', resolve);
    });
  }

  setData(data) {
    this.data = data;
    console.log('Data fetched', this.data);
  }

  getElements() {
    this.tagList = this.config.element.querySelectorAll('.tag-list')[0];
    this.selectedTag = this.config.element.querySelectorAll('#selected-tag')[0];
    this.titleList = this.config.element.querySelectorAll('.matching-items-list')[0];
    this.clearButton = this.config.element.querySelectorAll('.clear-button')[0];
    this.selectedSeries = this.config.element.querySelectorAll('#selected-series')[0];
    this.selectedSeriesImg = this.config.element.querySelectorAll('#selected-series-img')[0];
    this.selectedSeriesDescription = this.config.element.querySelectorAll('#selected-series-description')[0];
    this.selectedSeriesInfo = this.config.element.querySelectorAll('#selected-series-info .info-item');
    //find and store other elements you need
  }

  bindEventListeners() {
    this.tagList.addEventListener('click', this.tagListClicked.bind(this));
    this.titleList.addEventListener('click', this.titleListClicked.bind(this));
    this.clearButton.addEventListener('click', this.clearButtonClicked.bind(this));
    //bind the additional event listener for clicking on a series title
  }

  render() {
    this.clearButtonClicked();
    //render the list of tags from this.data into this.tagList
    const sortedTags = sortList(makeListUnique(createTagList(this.data)));
    let tagsTpl = '';

    for (let i = 0; i < sortedTags.length; i++) {
      tagsTpl = `${tagsTpl}<li><span class="tag is-link">${sortedTags[i]}</span></li>`;
    }

    this.tagList.innerHTML = tagsTpl;
  }

  tagListClicked(e) {
    //console.log('tag list (or child) clicked', event);
    //check to see if it was a tag that was clicked and render
    //the list of series that have the matching tags
    const selectedTag = e.target.innerText;
    const filteredList = filterByTag(this.data, selectedTag);
    let titlesTpl = '';

    if (this.prevTagClicked) {
      $(this.prevTagClicked).removeClass('active');  
    }
    $(e.target).addClass('active');
    this.prevTagClicked = e.target;
    this.selectedTag.innerHTML = `"${selectedTag}"`;

    for (let i = 0; i < filteredList.length; i++) {
      titlesTpl = `${titlesTpl}<li class="is-link" data-id="${filteredList[i].id}">${filteredList[i].title}</li>`;
    }

    this.titleList.innerHTML = titlesTpl;
  }

  titleListClicked(e) {
    const selectedTitle = e.target.innerText;
    const selectedSeries = filterById(this.data, $(e.target).data().id);
    const infoProps = ['rating', 'nativeLanguageTitle', 'sourceCountry', 'type', 'episodes'];

    if (this.prevTitleClicked) {
      $(this.prevTitleClicked).removeClass('active');  
    }
    $(e.target).addClass('active');
    this.prevTitleClicked = e.target;
    this.selectedSeries.innerHTML = selectedSeries.title;
    this.selectedSeriesImg.src = selectedSeries.thumbnail;
    this.selectedSeriesDescription.innerHTML = selectedSeries.description;
  
    for (let i = 0; i < this.selectedSeriesInfo.length; i++) {
      this.selectedSeriesInfo[i].innerHTML = selectedSeries[infoProps[i]];
    }
    //console.log(selectedSeries);
  }

  clearButtonClicked() {
    if (this.prevTagClicked) {
      $(this.prevTagClicked).removeClass('active');  
    }    
    this.selectedTag.innerHTML = 'No Tag Selected';
    this.titleList.innerHTML = '';

    this.selectedSeries.innerHTML = 'No Series Selected';
    this.selectedSeriesImg.src = 'http://via.placeholder.com/350x350';
    this.selectedSeriesDescription.innerHTML = '';

    for (let i = 0; i < this.selectedSeriesInfo.length; i++) {
      this.selectedSeriesInfo[i].innerHTML = '';
    }
  }
}
