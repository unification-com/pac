import styles from './pagination.module.css'
import Link from "next/link";

export default function Pagination({pageData, path, filterParams, sort}) {

    let currentPage = pageData.currentPage;
    let totalPages = pageData.totalPages;
    let prevPage = 1;
    let nextPage = 2;
    let pagesStart = 1;
    let pagesEnd = 10;
    let sortOrder = '';

    if(parseInt(sort) === 1) {
        sortOrder = '&sort=1';
    }

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

        let l = <a href={path + '?page=' + i + filterParams + sortOrder}
                   className={ i === currentPage ? styles.active : ''}
                   key={'pagination_' + i}
        >{i}</a>
        pageLinks.push(l);
    }

    return <div className={styles.pagination}>
        <a href={path + '?page=' + prevPage + filterParams + sortOrder} key='pagination_prev'> &lt; </a>
        {pageLinks}
        <a href={path + '?page=' + nextPage + filterParams + sortOrder} key='pagination_next'> &gt; </a>
    </div>
}