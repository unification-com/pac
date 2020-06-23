import styles from './pagination.module.css'
import Link from "next/link";

export default function Pagination({pageData, path, filterParams}) {

    let currentPage = pageData.currentPage;
    let totalPages = pageData.totalPages;
    let prevPage = 1;
    let nextPage = 2;
    let pagesStart = 1;
    let pagesEnd = 10;

    if (currentPage > 1) {
        prevPage = currentPage - 1;
    }
    if (currentPage < totalPages) {
        nextPage = currentPage + 1;
    }
    if (currentPage > 5) {
        pagesStart = currentPage - 4;
        pagesEnd = currentPage + 5;
    }
    if (pagesEnd > totalPages) {
        pagesEnd = totalPages;
    }

    let pageLinks = [];
    for (let i = pagesStart; i <= pagesEnd; i++) {

        let l = <a href={path + '?page=' + i + filterParams}
                   className={ i === currentPage ? ('active') : ('')}
                   key={'pagination_' + i}
        >{i}</a>
        pageLinks.push(l);
    }

    return <div className={styles.pagination}>
        <a href={path + '?page=1' + filterParams} key='pagination_first'> &lt;&lt; </a>
        <a href={path + '?page=' + prevPage + filterParams} key='pagination_prev'> &lt; </a>
        {pageLinks}
        <a href={path + '?page=' + nextPage + filterParams} key='pagination_next'> &gt; </a>
        <a href={path + '?page=' + totalPages + filterParams} key='pagination_last'> &gt;&gt; </a>
    </div>
}