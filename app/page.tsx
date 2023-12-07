"use client";

import styles from './page.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Search from './component/Search/page'
import ArrowLeft from './component/ArrowLeft/page';
import useDebounce from './actions/useDebounce';
import moment from 'moment';

type News = {
    abstract: string;
    web_url: string;
    snippet: string;
    lead_paragraph: string;
    source: string;
    multimedia: string[];
    headline: {
        main: string;
        kicker: string;
        content_kicker: string;
        print_headline: string;
        name: string;
        seo: string;
        sub: string;
    },
    keywords: object[];
    pub_date: string;
    document_type: string;
    news_desk: string;
    section_name: string;
    byline: {
        original: string;
        person: object[];
        organization: string;
    },
    type_of_material: string;
    _id: string;
    word_count: number,
    uri: string;
}

export default function Home() {
  const [listNews, setListNews] = useState<News[] | null>(null);
  const [searchVal, setSearchVal] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const debouncedSearch = useDebounce(searchVal, 600);

  const fetchData = async () => {    
    const allNews = await axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?page=${currentPage-1}&sort=relevance${searchVal !== '' ? '&fq='+searchVal:''}&api-key=kubIq08I8Ejy6ppr7IYpfhsSVxLvXuNx`);
    console.log('masuk', allNews);
    setListNews(allNews.data.response.docs);
    let pages = Math.ceil(allNews.data.response.meta.hits / 10);
    if (pages > 200) pages = 200;
    setTotalPages(pages);
  }
  
  useEffect(() => {
    setCurrentPage(1);
    fetchData();
  },[debouncedSearch]);

  useEffect(() => {
    fetchData();
  },[currentPage]);

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <div className={styles.boxSearch}>
            <input
              id="id"
              type="text"
              className={`form-controls ${styles.inputSearch}`}
              placeholder="Search News"
              onChange={(e) => {
                setSearchVal(e.currentTarget.value);
              }}
              value={searchVal}
            />
            <Search />
          </div>        
      </div>     

      <div className={styles.grid}>
        {listNews !== null && listNews.map((news, index) => (        
          <a
            href={news.web_url}
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
            key={index}
          >
            <h2>
              {news.headline.main}
            </h2>
            <legend>{news.byline.original}<br /> {moment(news.pub_date).format("LLL")}</legend>
            <p>{news.abstract}</p>
          </a>
        ))}
      </div>

      <div className={styles.pagination}>
        <div
          className={`${styles.wrapPgnArrow} ${currentPage === 1 || totalPages === 0 ? styles.disabled : ""}`}
          onClick={() => setCurrentPage(currentPage-1)}
        >
          <ArrowLeft />
        </div>
        <div className={`${styles.textPagination} d-flex`}>
          Page {currentPage} of {totalPages !== 0 ? totalPages : "1"}
        </div>
        <div
          className={`${styles.wrapPgnArrow} ${styles.right} ${
            currentPage === totalPages || totalPages === 0 ? styles.disabled : ""
          }`}
          onClick={() => setCurrentPage(currentPage+1)}
        >
          <ArrowLeft/>
        </div>
      </div>
    </main>
  )
}
