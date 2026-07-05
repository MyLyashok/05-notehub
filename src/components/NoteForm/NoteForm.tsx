import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { type CreateNoteData } from "../../services/noteService";
import { type NoteTag } from "../../types/note";
import css from './NoteForm.module.css';

interface NoteFormProps {
    onSubmit: (values: CreateNoteData) => void;
}

const TAGS: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

const NoteSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, 'Too Short! Minimum 3 characters')
        .max(50, 'Too Long! Maximum 50 characters')
        .required('Title is required'),
    content: Yup.string()
        .min(10, 'Too Short! Minimum 10 characters')
        .required('Content is required'),
    tag: Yup.string()
        .oneOf(TAGS, 'Invalid Tag')
        .required('Tag is required'),
});

const initialValues: CreateNoteData = {
    title: '',
    content: '',
    tag: 'Todo',
};

function NoteForm({ onSubmit }: NoteFormProps) {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={NoteSchema}
            onSubmit={(values, { resetForm }) => {
                onSubmit(values);
                resetForm();
            }}
        >

            <Form className={css.form} autoComplete="off">

                <div className={css.fieldWrapper}>
                    <label htmlFor="title" className={css.label}>Title</label>
                    <Field id="title" name="title" type="text" className={css.input} />
                    <ErrorMessage name="title" component="div" className={css.error} />
                </div>

                <div className={css.fieldWrapper}>
                    <label htmlFor="content" className={css.label}>Content</label>
                    <Field id="content" name="content" as="textarea" rows={4} className={css.textarea} />
                    <ErrorMessage name="content" component="div" className={css.error} />
                </div>

                <div className={css.fieldWrapper}>
                    <label htmlFor="tag" className={css.label}>Tag</label>
                    <Field id="tag" name="tag" as="select" className={css.select}>
                        {TAGS.map(tag => (
                            <option key={tag} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </Field>
                    <ErrorMessage name="tag" component="div" className={css.error} />
                </div>

                <button type="submit" className={css.button}>
                    Create
                </button>
            </Form>
        </Formik>
    );
}

export default NoteForm;