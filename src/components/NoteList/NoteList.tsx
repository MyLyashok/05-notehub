import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';
import { type Note } from '../../types/note';
import css from './NoteList.module.css';

interface NoteListProps {
    notes: Note[];
}

function NoteList({ notes }: NoteListProps) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteNote(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });

    // Умова з ТЗ: рендеримо список, тільки якщо є хоча б один елемент
    if (notes.length === 0) return null;

    return (
        <ul className={css.list}>
            {notes.map((note) => (
                <li key={note.id} className={css.listItem}>
                    <h2 className={css.title}>{note.title}</h2>
                    <p className={css.content}>{note.content}</p>
                    <div className={css.footer}>

                        <span className={`${css.tag} ${css[note.tag.toLowerCase()] || ''}`}>
                            {note.tag}
                        </span>
                        <button
                            className={css.button}
                            onClick={() => deleteMutation.mutate(note.id)}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? '...' : 'Delete'}
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default NoteList;