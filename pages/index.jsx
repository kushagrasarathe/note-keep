import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import { Pagination } from "@mui/material";
import { db, notesCollectionRef } from "../src/configs/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAfter,
} from "@firebase/firestore";
import Head from "next/head";
import { useEffect, useRef, useState, Fragment } from "react";
import CreateNote from "../src/components/CreateNote";
import UpdateNote from "../src/components/UpdateNote";
import NoteCard from "../src/components/NoteCard";
import useFetchNotes from "../src/hooks/useFetchNotes";

export default function Home() {
  const [data, setData] = useState({
    title: "",
    tagline: "",
    body: "",
    isPinned: false,
  });

  const [count, setCount] = useState(0);
  const handleReRender = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const [firstPageNotes, setFirstPageNotes] = useState([]);
  const [totalNotes, setTotalNotes] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [lastNote, setLastNote] = useState({});
  const [pageCount, setPageCount] = useState();
  const notesPerPage = 6;

  const getPaginatedNotes = async () => {
    const snapshot = await getCountFromServer(notesCollectionRef);
    const totalNotes = snapshot.data().count;
    setTotalNotes(totalNotes);
    const temp = Number(Math.ceil(totalNotes / notesPerPage));
    setPageCount(temp);
    // console.log(typeof Math.ceil(totalNotes / notesPerPage));

    // Query the first page of docs
    const firstNotesSet = query(
      collection(db, "notes"),
      orderBy("title"),
      limit(notesPerPage)
    );
    const documentSnapshots = await getDocs(firstNotesSet);

    const data = documentSnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setFirstPageNotes(data);

    // Get the last visible document

    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];

    setLastNote(lastVisible);
  };

  const handlePageChange = async ({ selected }) => {
    // query for fetching next set of notes
    const nextPageNotes = query(
      collection(db, "notes"),
      orderBy("title"),
      startAfter(lastNote),
      limit(notesPerPage)
    );

    const snapshot = await getDocs(nextPageNotes);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setFirstPageNotes(data);
    // wrap this part conditionally to fix the current behaviour
    setLastNote(snapshot.docs[snapshot.docs.length - 1]);
    setCurrentPage(selected);
  };

  useEffect(() => {
    getPaginatedNotes();
  }, []);

  const deleteNote = async (id) => {
    const noteDoc = doc(db, "notes", id);
    await deleteDoc(noteDoc);
    getPaginatedNotes();
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

      <div className="navbar shadow-md">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">Note To Keep</a>
        </div>
        <div className="flex-none gap-2">
          <div>
            <CreateNote />
          </div>
        </div>
      </div>

      <div className="p-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5">
          {firstPageNotes
            .sort((a, b) => (a.isPinned ? -1 : 1))
            .map((data, idx) => (
              <div key={idx}>
                <NoteCard
                  handleReRender={handleReRender}
                  data={data}
                  deleteNote={() => deleteNote(data.id)}
                />
              </div>
            ))}
        </div>

        <div className=" fixed bottom-10 w-full flex justify-center ">
          <div>
            <Pagination
              defaultPage={1}
              count={pageCount}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        </div>
      </div>
    </>
  );
}
