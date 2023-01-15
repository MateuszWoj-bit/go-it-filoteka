import axios from 'axios';

const save = (key, value) => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.error('Set state error: ', error.message);
  }
};

const load = key => {
  try {
    const serializedState = localStorage.getItem(key);
    return serializedState === null ? [] : JSON.parse(serializedState);
  } catch (error) {
    console.error('Get state error: ', error.message);
  }
};

const gallery = document.querySelector('.gallery');
const date = document.querySelector('.date');
const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const tester = document.querySelector('.test');
const quetester = document.querySelector('.quetest');
const background = document.querySelector('.background');
const paginBox = document.querySelector('.pagination-box');

const libra = document.querySelector('.ntest');
const home = document.querySelector('.ntest1');

const invi = document.querySelectorAll('.invi');
const homeInvi = document.querySelectorAll('.home-invi');

const hideButtonModal = document.getElementById('modalClose');
hideButtonModal.onclick = modalControl;

background.classList.toggle('background-lib');
for (let j = 0; j < homeInvi.length; j++) {
  homeInvi[j].classList.toggle('home-invi');
}

let homeCheck = true;
let watchCheck = true;

let paginationBeacon = true;

function libraryShow() {
  watchListBecon = true;
  console.log('WTF');
  console.log(homeInvi[0]);
  if (homeCheck) {
    for (let i = 0; i < invi.length; i++) {
      invi[i].classList.toggle('invi');
    }
    for (let j = 0; j < homeInvi.length; j++) {
      homeInvi[j].classList.toggle('home-invi');
    }
    if (watchCheck) {
      GalleryRefreshFromSaved();
      quetester.classList.remove('btn-back-color');
    } else {
      GalleryRefreshFromSavedQue();
    }
    homeCheck = false;
    background.classList.toggle('background-lib');
    paginBox.classList.add('pagination-hide');
  }
}
function homeShow() {
  watchListBecon = false;
  page = 1;
  setCurrentPage(1);
  if (!homeCheck) {
    for (let i = 0; i < invi.length; i++) {
      invi[i].classList.toggle('invi');
    }
    for (let j = 0; j < homeInvi.length; j++) {
      homeInvi[j].classList.toggle('home-invi');
    }
    loadData();
    homeCheck = true;
    background.classList.toggle('background-lib');
    paginBox.classList.remove('pagination-hide');
  }
}
libra.addEventListener('click', libraryShow);
home.addEventListener('click', homeShow);

const modal = document.querySelector('.mod');
const overview = document.querySelector('.overview');
const watchButton = document.querySelector('.watch');
const queButton = document.querySelector('.que');

let watchListBecon = false;

let condition = false;

const apiKey = '4e9fa3fc2487236fdff94602c5bb9552';

let page = 1;
let detailsObject = {};
let detailsObjectYouTube = {};
let savedWatchedContent = load('watched-movies');
let savedQueContent = load('qued-movies');

form.addEventListener('submit', handleSubmit);
tester.addEventListener('click', handleTest);
quetester.addEventListener('click', handleQueTest);

watchButton.addEventListener('click', handleWatchSave);
queButton.addEventListener('click', handleQueSave);

const fetchGenere = async q => {
  const params = 'A/last/66/';
  const table = await axios.get(
    `
https://youtube.googleapis.com/youtube/v3/search?q=${q}&key=AIzaSyB8TTc_5353cPL4Gqfo9xPQBbRH9hfG-YA`
  );
  return table;
};

const fetchTrending = async () => {
  const params = 'A/last/66/';
  const table = await axios.get(
    `
https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=${page}`
  );
  console.log(table);
  return table;
};

const fetchDetails = async (id = 1771) => {
  const params = 'A/last/66/';
  const table = await axios.get(
    `

https://api.themoviedb.org/3/movie/${id}?api_key=4e9fa3fc2487236fdff94602c5bb9552&language=en-US`
  );
  console.log(table);
  return table;
};

const fetchQuery = async query => {
  const params = 'A/last/66/';
  const table = await axios.get(
    `
https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${query}&page=${page}&include_adult=false`
  );
  console.log(table);
  return table;
};

const fetchProvider = async (id = 1771) => {
  const params = 'A/last/66/';
  const table = await axios.get(
    `
https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=4e9fa3fc2487236fdff94602c5bb9552`
  );
  console.log(table);
  return table;
};

function handleWatchSave() {
  const movieTableId = savedWatchedContent.findIndex(
    elem => elem.id === detailsObject.id
  );
  if (movieTableId === -1) {
    savedWatchedContent.unshift(detailsObject);
    save('watched-movies', savedWatchedContent);
    this.innerHTML = 'ADDED TO WATCHED';
    this.classList.add('btn-mod-color');
    console.log(savedWatchedContent);
    condition = true;
  } else {
    console.log(
      savedWatchedContent.findIndex(elem => elem.id === detailsObject.id)
    );
    savedWatchedContent.splice(movieTableId, 1);
    save('watched-movies', savedWatchedContent);
    this.innerHTML = 'ADD TO WATCHED';
    this.classList.remove('btn-mod-color');
    condition = false;
  }
  if (watchListBecon && watchCheck) {
    GalleryRefreshFromSaved();
  }
}

function handleQueSave() {
  const movieTableId = savedQueContent.findIndex(
    elem => elem.id === detailsObject.id
  );
  if (movieTableId === -1) {
    savedQueContent.unshift(detailsObject);
    save('qued-movies', savedQueContent);
    this.innerHTML = 'ADDED TO QUEUE';
    this.classList.add('btn-mod-color');
    console.log(savedQueContent);
    condition = true;
  } else {
    console.log(
      savedQueContent.findIndex(elem => elem.id === detailsObject.id)
    );
    savedQueContent.splice(movieTableId, 1);
    save('qued-movies', savedQueContent);
    this.innerHTML = 'ADD TO QUEUE';
    this.classList.remove('btn-mod-color');
    condition = false;
  }
  if (watchListBecon && !watchCheck) {
    GalleryRefreshFromSavedQue();
  }
}

function handleSubmit(event) {
  event.preventDefault();
  inputQuery = input.value;
  watchListBecon = false;
  paginationBeacon = false;
  page = 1;
  setCurrentPage(1);
  gallery.innerHTML = '';
  fetchQuery(inputQuery, page)
    .then(function (response) {
      // handle success
      renderVaules(response);
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}
function handleSubmitPag() {
  inputQuery = input.value;
  watchListBecon = false;
  paginationBeacon = false;

  gallery.innerHTML = '';
  fetchQuery(inputQuery, page)
    .then(function (response) {
      // handle success
      renderVaules(response);
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

function GalleryRefreshFromSaved() {
  gallery.innerHTML = '';
  renderSavedContent();
}

function handleTest() {
  watchListBecon = true;
  watchCheck = true;
  GalleryRefreshFromSaved();
  quetester.classList.remove('btn-back-color');
  tester.classList.add('btn-back-color');
}

function GalleryRefreshFromSavedQue() {
  gallery.innerHTML = '';
  renderSavedQueContent();
}

function handleQueTest() {
  watchListBecon = true;
  watchCheck = false;
  GalleryRefreshFromSavedQue();
  quetester.classList.add('btn-back-color');
  tester.classList.remove('btn-back-color');
}

function handleDetailClick(event) {
  console.log(this.target);
  console.log(event.target.nodeName);
  console.log(event.target.getAttribute('movieID'));
  console.log(event.target.getAttribute('movietitle'));
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  modalControl();
  overview.innerHTML = '';
  fetchDetails(event.target.getAttribute('movieID'))
    .then(function (response) {
      // handle success
      renderDetails(response);
      gatherDetailsForSaving(response);
      WatchButtonSet();
      console.log(response);
    })
    .then( fetchProvider(event.target.getAttribute('movieID'))
    .then(function (response) {
      // handle success
      console.log('prov');
      console.log(response);      
      gatherDetailsProv(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    }))
    .catch(function (error) {
      // handle error
      console.log(error);
    });
  fetchGenere(event.target.getAttribute('movietitle'))
    .then(function (response) {
      // handle success
      console.log(response);
      console.log(response.data.items[0].id.videoId);
      gatherDetailsForYt(response);
      YoutubeLoad(detailsObjectYouTube.snipet);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });  
}

function gatherDetailsProv(response) {
  const table = response.data.results.PL;
  console.log('test');
  if (table !== undefined && table.flatrate !== undefined) {
    // console.log(table.flatrate[0].provider_name.includes === "Netflix")
    console.log(table.flatrate[0].provider_name === 'Netflix');
    const NMark = `<a href="https://www.netflix.com/search?q=${detailsObject.title}" target="_blank" rel="noreferrer noopener"><image class="stream" src="https://www.themoviedb.org/t/p/original${table.flatrate[0].logo_path}" width="50" height="50"></a>   
   `;
    
    const markupList = table.flatrate
      .filter(image => image.provider_name !== 'Netflix')
      .map(
        image => `<image class="stream" src="https://www.themoviedb.org/t/p/original${image.logo_path}" width="50" height="50">   
   `
      )
      .join(``);    
    overview.insertAdjacentHTML('beforeend', `<p class="mod-ab">STREAM</p>`);
    if (table.flatrate[0].provider_name === 'Netflix') {
      overview.insertAdjacentHTML('beforeend', NMark);
    }
    overview.insertAdjacentHTML('beforeend', markupList);
    document
      .querySelector('.mod--buttons')
      .classList.remove('mod--buttons-alt');
  } else {
    document.querySelector('.mod--buttons').classList.add('mod--buttons-alt');
  }
}

function gatherDetailsForSaving(response) {
  const table = response.data;
  detailsObject = {
    id: table.id,
    poster_path: table.poster_path,
    title: table.title,
    genre_ids: table.genres,
    release_date: table.release_date,
    vote_average: table.vote_average,
  };
}

function gatherDetailsForYt(response) {
  const table = response.data;
  detailsObjectYouTube = {
    snipet: table.items[0].id.videoId,
  };
  console.log(detailsObjectYouTube);
}

function WatchButtonSet() {
  const movieTableWatch = savedWatchedContent.findIndex(
    elem => elem.id === detailsObject.id
  );
  if (movieTableWatch === -1) {
    watchButton.innerHTML = 'ADD TO WATCHED';
    watchButton.classList.remove('btn-mod-color');
  } else {
    watchButton.innerHTML = 'ADDED TO WATCHED';
    watchButton.classList.add('btn-mod-color');
  }
  const movieTableQue = savedQueContent.findIndex(
    elem => elem.id === detailsObject.id
  );
  if (movieTableQue === -1) {
    queButton.innerHTML = 'ADD TO QUEUE';
    queButton.classList.remove('btn-mod-color');
  } else {
    queButton.innerHTML = 'ADDED TO QUEUE';
    queButton.classList.add('btn-mod-color');
  }
}

const GT = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

function loadData() {
  gallery.innerHTML = '';
  fetchTrending(page)
    .then(function (response) {
      // handle success
      renderVaules(response);
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

function loadDataYT() {
  fetchGenere()
    .then(function (response) {
      // handle success
      console.log(response);
      console.log(response.data.items[0].id.videoId);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}
// loadDataYT();

function gen(genID) {
  for (let id of GT) {
    if (id.id === genID) {
      return id.name;
    }
  }
}

function renderVaules(response, genre) {
  const table = response;
  //   console.log(`TEST ${genre}`);

  const markupList = response.data.results
    .map(
      image => `<div class="box">
      <div class="box-shadow">
      <image class="boxID" alt="${image.title} movie poster" movieID=${
        image.id
      } movieTitle="${
        image.title + ' ' + Number.parseInt(image.release_date)
      }" srcset="https://image.tmdb.org/t/p/w500${image.poster_path}" 
      src="https://mateuszwoj-bit.github.io/GOIT-team-project-ice/squoosh-how1-desktop.b9f13a59.png">
      <div class="column"><p class = "font"><b>${image.title}</b></p>
      <p class = "font-s"> ${image.genre_ids
        .map(element => gen(element))
        .join(`, `)}  
     | ${Number.parseInt(image.release_date)}</p> 
     </div>
     </div>
     </div>
   `
    )
    .join(``);

  gallery.insertAdjacentHTML(
    'beforeend',
    markupList.replaceAll(
      'https://image.tmdb.org/t/p/w500null',
      'https://mateuszwoj-bit.github.io/GOIT-team-project-ice/squoosh-how1-desktop.b9f13a59.png'
    )
  );
}

function renderSavedContent(response, genre) {
  const table = response;
  //   console.log(`TEST ${genre}`);
  const tableForMarkUp = savedWatchedContent.filter(obj => obj.title);
  console.log(tableForMarkUp);
  console.log(tableForMarkUp.length === 0);
  if (tableForMarkUp.length === 0) {
    gallery.insertAdjacentHTML(
      'beforeend',
      `<img class="no-content" src="https://cdn.dribbble.com/users/683081/screenshots/2728654/media/7bb2b47d0574d39b20354620e4fa50c8.png?compress=1&resize=400x300&vertical=top" />`
    );
  }   
  const markupList = tableForMarkUp
    .map(
      image => `<div class="box">
      <div class="box-shadow">
      <image class="boxID" movieID=${image.id} movieTitle="${
        image.title + ' ' + Number.parseInt(image.release_date)
      }" src="https://image.tmdb.org/t/p/w500${image.poster_path}">
      <div class="column"><p class = "font"><b>${image.title}</b></p>
      <p class = "font-s"> ${image.genre_ids
        .map(element => element.name)
        .join(`, `)}  
     | ${Number.parseInt(
       image.release_date
     )} <span class="vote">${image.vote_average.toFixed(1)}</span></p> 
      </div>
      </div>
      </div>
   `
    )
    .join(``);
  gallery.insertAdjacentHTML(
    'beforeend',
    markupList.replaceAll(
      'https://image.tmdb.org/t/p/w500null',
      'https://mateuszwoj-bit.github.io/GOIT-team-project-ice/squoosh-how1-desktop.b9f13a59.png'
    )
  );
}

function renderSavedQueContent(response, genre) {
  const table = response;
  //   console.log(`TEST ${genre}`);
  const tableForMarkUp = savedQueContent.filter(obj => obj.title); 
   if (tableForMarkUp.length === 0) {
     gallery.insertAdjacentHTML(
       'beforeend',
       `<img class="no-content" src="https://cdn.dribbble.com/users/683081/screenshots/2728654/media/7bb2b47d0574d39b20354620e4fa50c8.png?compress=1&resize=400x300&vertical=top" />`
     );
   }  
  const markupList = tableForMarkUp
    .map(
      image => `<div class="box">
      <div class="box-shadow">
      <image class="boxID" movieID=${image.id} movieTitle="${
        image.title + ' ' + Number.parseInt(image.release_date)
      }" src="https://image.tmdb.org/t/p/w500${image.poster_path}">
      <div class=""><p class = "font"><b>${image.title}</b></p>
      <p class = "font-s"> ${image.genre_ids
        .map(element => element.name)
        .join(`, `)}
     | ${Number.parseInt(
       image.release_date
     )}<span class="vote">${image.vote_average.toFixed(1)}</span></p>
       </div>
       </div>
      </div>
   `
    )
    .join(``);
  gallery.insertAdjacentHTML(
    'beforeend',
    markupList.replaceAll(
      'https://image.tmdb.org/t/p/w500null',
      'https://mateuszwoj-bit.github.io/GOIT-team-project-ice/squoosh-how1-desktop.b9f13a59.png'
    )
  );
}

function renderDetails(response, genre) {
  const table = response.data;
  console.log(table);

  const markupList = `<image class="mod-img" src="https://image.tmdb.org/t/p/w500${
    table.poster_path
  }"><h2 class="mod-title">${table.title.toUpperCase()}</h2>
  <div class="row">
<div class = "columnA">
  <p>Vote / Votes</p>
  <p>Popularity</p>
  <p>Original Title</p>
  </div>
     <div class = "columnB">
     <p><span class="vote-mod">${table.vote_average.toFixed(1)}</span> / ${
    table.vote_count
  }</p>
     <p>${table.popularity.toFixed(1)}</p>
     <p>${table.original_title.toUpperCase()}</p>
      
     </div></div>
     <div class="row">
<div class="columnA"><p class="margi">Genre</p></div>
<div class="columnB"><p class="margi">${table.genres
    .map(element => gen(element.id))
    .join(`, `)}  
     </p>    </div></div>
     
  <h3 class="mod-ab">ABOUT</h3>
      <p class="mod-ab-content">${table.overview}</p>
  `;
  overview.insertAdjacentHTML(
    'afterbegin',
    markupList.replaceAll(
      'https://image.tmdb.org/t/p/w500null',
      'https://mateuszwoj-bit.github.io/GOIT-team-project-ice/squoosh-how1-desktop.b9f13a59.png'
    )
  );
  console.log(overview);
}

//Modal control
let backdropOne = false;
let c = 0;
function modalControl() {
  if (backdropOne) {
    const backdropDel = document.querySelectorAll('.backdrop');
    for (let i = 0; i < backdropDel.length; i++) {
      backdropDel[i].remove();
    }
  }
  const modal = document.querySelector('.mod');
  const backdropCreator = `<div class="backdrop hidden"></div>`;
  gallery.insertAdjacentHTML('beforeend', backdropCreator);
  const backdrop = document.querySelector('.backdrop');
  modal.classList.toggle('hidden');
  backdrop.classList.toggle('hidden');
  c++;
  if (c % 2 === 0) {
    backdrop.classList.toggle('hidden');
  }
  backdropOne = true;
  var stopVideo = function (element) {
    var iframe = element.querySelector('iframe');
    var video = element.querySelector('video');
    if (iframe) {
      var iframeSrc = iframe.src;
      iframe.src = iframeSrc;
    }
    if (video) {
      video.stop();
    }
  };
  stopVideo(vplayer[0]);
}

window.onload = loadData;
gallery.onclick = handleDetailClick;
var vplayer = document.querySelectorAll('.vplayer');

function YoutubeLoad(q) {
  var vplayer = document.querySelectorAll('.vplayer');

  for (var i = 0; i < vplayer.length; i++) {
    // console.log(vplayer[i].dataset.v);
    var source = 'https://img.youtube.com/vi/' + q + '/sddefault.jpg';

    var image = new Image();
    image.src = source;
    image.addEventListener(
      'load',
      (function () {
        vplayer[i].appendChild(image);
      })(i)
    );

    function LoadYT() {
      var iframe = document.createElement('iframe');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute(
        'src',
        'https://www.youtube.com/embed/' + q + '?rel=0&showinfo=0'
      );
      vplayer[i].innerHTML = '';
      vplayer[i].appendChild(iframe);
    }
    LoadYT();
  }
}

const paginationNumbers = document.getElementById('pagination-numbers');

const nextButton = document.getElementById('next-button');
const prevButton = document.getElementById('prev-button');

const paginationLimit = 10;
const pageCount = 5;
let currentPage = 1;

const disableButton = button => {
  button.classList.add('disabled');
  button.setAttribute('disabled', true);
};

const enableButton = button => {
  button.classList.remove('disabled');
  button.removeAttribute('disabled');
};

const handlePageButtonsStatus = () => {
  if (currentPage === 1) {
    disableButton(prevButton);
  } else {
    enableButton(prevButton);
  }

  if (pageCount === currentPage) {
    disableButton(nextButton);
  } else {
    enableButton(nextButton);
  }
};

const handleActivePageNumber = () => {
  document.querySelectorAll('.pagination-number').forEach(button => {
    button.classList.remove('active');
    const pageIndex = Number(button.getAttribute('page-index'));
    if (pageIndex == currentPage) {
      button.classList.add('active');
    }
  });
};

const appendPageNumber = index => {
  const pageNumber = document.createElement('button');
  pageNumber.className = 'pagination-number';
  pageNumber.innerHTML = index;
  pageNumber.setAttribute('page-index', index);
  pageNumber.setAttribute('aria-label', 'Page ' + index);

  paginationNumbers.appendChild(pageNumber);
};

const getPaginationNumbers = () => {
  for (let i = 1; i <= pageCount; i++) {
    appendPageNumber(i);
  }
};

const setCurrentPage = pageNum => {
  currentPage = pageNum;
  page = pageNum;

  handleActivePageNumber();
  handlePageButtonsStatus();
};

window.addEventListener('load', () => {
  getPaginationNumbers();
  setCurrentPage(1);

  prevButton.addEventListener('click', () => {
    setCurrentPage(currentPage - 1);
    page = currentPage;
    if (paginationBeacon) {
      loadData();
    } else {
      handleSubmitPag();
    }
  });

  nextButton.addEventListener('click', () => {
    setCurrentPage(currentPage + 1);
    page = currentPage;
    if (paginationBeacon) {
      loadData();
    } else {
      handleSubmitPag();
    }
  });

  document.querySelectorAll('.pagination-number').forEach(button => {
    const pageIndex = Number(button.getAttribute('page-index'));

    if (pageIndex) {
      button.addEventListener('click', () => {
        setCurrentPage(pageIndex);
        page = pageIndex;
        console.log(paginationBeacon);
        console.log(page);
        if (paginationBeacon) {
          loadData();
        } else {
          handleSubmitPag();
        }
      });
    }
  });
});
