import { type Note } from "../../types/note";
import css from './NoteList.module.css';

interface NoteListProps {
    notes: Note[];
    onDelete: (id: string) => void;
}

function NoteList({ notes, onDelete }: NoteListProps) {
    if (notes.length === 0) {
        return null;
    }

    return (
        <ul className={css.list}>
            {notes.map(({ id, title, content, tag }) => (
                <li key={id} className={css.listItem}>
                    <h2 className={css.title}>{title}</h2>
                    <p className={css.content}>{content}</p>
                    <div className={css.footer}>
                        <span className={css.tag}>{tag}</span>

                        <button
                            type="button"
                            className={css.button}
                            onClick={() => onDelete(id)}
                        >
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default NoteList;