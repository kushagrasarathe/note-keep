import { db } from "@/src/configs/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "@firebase/firestore";
import { randomUUID } from "crypto";
import Head from "next/head";
import { useEffect, useState } from "react";

interface Note {
  title: string;
  tagline: string;
  body: string;
  isPinned: boolean;
}

export default function Home() {
  const [note, setNote] = useState<Note>({
    title: "",
    tagline: "",
    body: "",
    isPinned: false,
  });

  const [fetchedNotes, setFetchedNotes] = useState<any[]>([]);

  useEffect(() => {
    getNotes();
  }, []);

  const notesCollectionRef = collection(db, "notes");

  const onChnage = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target as
      | HTMLInputElement
      | HTMLTextAreaElement;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  const getNotes = async () => {
    const data = await getDocs(notesCollectionRef);
    // setFetchedNotes(data.docs.map((doc) => doc.data()));
    setFetchedNotes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  console.log(fetchedNotes);

  const saveNote = async () => {
    console.log(note);
    await addDoc(notesCollectionRef, note);
    getNotes();
  };

  const deleteNote = async (id: string) => {
    const noteDoc = doc(db, "notes", id);
    await deleteDoc(noteDoc);
    getNotes();
  };

  return (
    <>
      <Head>
        <title>Note Keep</title>
        <meta
          name="description"
          content="A note keeping nextjs appliction to help you organize your workflow"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex justify-center items-center min-h-screen">
        <div className=" flex flex-col justify-center items-center bg-violet-200 p-5 rounded-md shadow-md">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text text-gray-600">Title</span>
            </label>
            <input
              name="title"
              onChange={onChnage}
              value={note.title}
              type="text"
              placeholder="Type here"
              className="input input-primary input-bordered w-full max-w-xs bg-transparent"
              required={true}
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text text-gray-600">Tagline</span>
            </label>
            <input
              name="tagline"
              onChange={onChnage}
              value={note.tagline}
              type="text"
              placeholder="Type here"
              className="input input-primary input-bordered w-full max-w-xs bg-transparent"
              required={true}
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text text-gray-600">Body</span>
            </label>
            <textarea
              name="body"
              onChange={onChnage}
              value={note.body}
              className="textarea textarea-primary textarea-bordered text-base h-24 bg-transparent"
              placeholder="Bio"
              required={true}
            ></textarea>
          </div>
          <div className=" mt-4 flex flex-col">
            <button className=" btn btn-primary m-2" onClick={saveNote}>
              Save
            </button>
            <button className=" btn btn-primary m-2" onClick={getNotes}>
              getNotes
            </button>
          </div>
        </div>
      </main>

      <div className=" grid grid-cols-3 gap-10 px-10 pb-40">
        {fetchedNotes.map((note, idx) => (
          <div
            key={idx}
            className=" col-span-1 card w-96 bg-violet-300 shadow-xl"
          >
            <div className="card-body">
              <h2 className="card-title">{note.title}</h2>
              <p>{note.tagline}</p>
              <p>{note.body}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Edit</button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="btn bg-red-600 text-white border-0 hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
