import { useState } from 'react';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import { fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

import css from './App.module.css'

function App() {
  const [page, setPage] = useState<number>(1);
  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
    setPage(1);
  }, 500);

  const handleSearchChange = (value: string) => {
    setSearchInputValue(value);
    debouncedSetSearch(value);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () => fetchNotes(page, debouncedSearch),
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();


  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInputValue} onChange={handleSearchChange} />

        <Pagination
          pageCount={data?.totalPages || 0}
          currentPage={page}
          onPageChange={setPage}
        />

        <button type="button"
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      <main className={css.main}>
        {isLoading && <p className={css.status}>Завантаження нотаток...</p>}
        {isError && <p className={css.statusError}>Сталася помилка при завантаженні нотаток.</p>}

        {data && <NoteList notes={data.notes} />}
      </main>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );

}

export default App;

