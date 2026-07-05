import type { ComponentType } from "react";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import css from './Pagination.module.css';

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
    ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;

interface PaginationProps {
    pageCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

function Pagination({ pageCount, currentPage, onPageChange }: PaginationProps) {
    if (pageCount <= 1) {
        return null;
    }

    const handlePageClick = (selectedItem: { selected: number }) => {
        onPageChange(selectedItem.selected + 1);
    };

    return (
        <div className={css.paginationContainer}>
            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                previousLabel="< prev"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                pageCount={pageCount}
                forcePage={currentPage - 1}
                containerClassName={css.pagination}
                activeClassName={css.active}
                pageClassName={css.pageItem}
                breakClassName={css.breakItem}
                previousClassName={css.prevItem}
                nextClassName={css.nextItem}
                disabledClassName={css.disabled}
            />
        </div>
    );
}

export default Pagination;