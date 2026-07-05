import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import { fetchNotes, deleteNote } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';

import css from './App.module.css'

function App() {
  const [page, setPage] = useState<number>(1);
  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
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
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleDeleteNote = (id: string) => {
    deleteMutation.mutate(id);

  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInputValue} onChange={handleSearchChange} />

        <Pagination
          pageCount={data?.pages || 0}
          currentPage={page}
          onPageChange={setPage}
        />

        <button type="button" className={css.button}>
          Create note +
        </button>
      </header>

      <main className={css.main}>
        {isLoading && <p className={css.status}>Завантаження нотаток...</p>}
        {isError && <p className={css.statusError}>Сталася помилка при завантаженні нотаток.</p>}

        {data && <NoteList notes={data.notes} onDelete={handleDeleteNote} />}
      </main>
    </div>
  );

}

export default App;

