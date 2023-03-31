import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import { Pagination } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { db } from "@/src/configs/firebaseConfig";
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
import next from "next/types";
import { useEffect, useRef, useState, Fragment } from "react";
import ReactPaginate from "react-paginate";

const notesCollectionRef = collection(db, "notes");

interface Note {
  id?: string;
  title: string;
  tagline: string;
  body: string;
  isPinned: boolean;
}

export default function Home() {
  const [data, setData] = useState<Note>({
    title: "",
    tagline: "",
    body: "",
    isPinned: false,
  });

  const [open, setOpen] = useState(false);

  const cancelButtonRef = useRef(null);

  const [fetchedNotes, setFetchedNotes] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [lastNote, setLastNote] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [firstPageNotes, setFirstPageNotes] = useState<any[]>([]);
  const [pageCount, setPageCount] = useState<any>();
  const [totalNotes, setTotalNotes] = useState<any>();
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

    // // test
    // onSnapshot(firstNotesSet, (snapshot) => {
    //   const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    //   setFirstPageNotes(data);
    // });
    // // test :up

    // Get the last visible document
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];

    setLastNote(lastVisible);
  };

  const handlePageChange = async ({ selected }: any) => {
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
    setLastNote(snapshot.docs[snapshot.docs.length - 1]);
    setCurrentPage(selected);
  };

  useEffect(() => {
    getPaginatedNotes();
  }, []);

  const onFormChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target as
      | HTMLInputElement
      | HTMLTextAreaElement;
    setData((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  const saveNote = async () => {
    console.log(data);
    await addDoc(notesCollectionRef, data);
    getPaginatedNotes();
  };

  const deleteNote = async (id: string) => {
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
          <div className="form-control">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered"
            />
          </div>
          <div>
            <label htmlFor="my-modal" className="btn">
              open modal
            </label>
          </div>
        </div>
      </div>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <div className=" flex flex-col justify-center items-center bg-violet-200 p-5 rounded-md shadow-md">
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text text-gray-600">Title</span>
              </label>
              <input
                name="title"
                onChange={onFormChange}
                value={data.title}
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
                onChange={onFormChange}
                value={data.tagline}
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
                onChange={onFormChange}
                value={data.body}
                className="textarea textarea-primary textarea-bordered text-base h-24 bg-transparent"
                placeholder="Bio"
                required={true}
              ></textarea>
            </div>
            <div className=" mt-4 flex flex-col">
              <button className=" btn btn-primary m-2" onClick={saveNote}>
                Save
              </button>
            </div>
          </div>
          <div className="modal-action">
            <label htmlFor="my-modal" className="btn">
              Yay!
            </label>
          </div>
        </div>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Deactivate account
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to deactivate your account?
                            All of your data will be permanently removed. This
                            action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={() => setOpen(false)}
                    >
                      Deactivate
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="p-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
          {firstPageNotes.map((data: any, idx: number) => (
            <div
              key={idx}
              onClick={() => setOpen((prevState) => !prevState)}
              className="p-4 bg-cyan-400 rounded-md flex items-center justify-center"
            >
              <div className="card-body">
                <h2 className="card-title">{data.title}</h2>
                <p>{data.tagline}</p>
                <p>{data.body}</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Edit</button>
                  <button
                    onClick={() => deleteNote(data.id)}
                    className="btn bg-red-600 text-white border-0 hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
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

// export const getServerSideProps = async () => {
//   let kushagra: Note[] = [];
//   try {
//     const data = await getDocs(notesCollectionRef);
//     data.forEach((doc) => {
//       console.log(doc.data().id);
//       kushagra.push({
//         id: doc.id,
//         title: doc.data().title,
//         tagline: doc.data().tagline,
//         body: doc.data().body,
//         isPinned: doc.data().isPinned,
//       });
//     });
//   } catch (error) {
//     console.log(error);
//   }

//   return {
//     props: {
//       kushagra,
//     },
//   };
// };

{
  /* <ReactPaginate
          pageCount={pageCount}
          onPageChange={handlePageChange}
          forcePage={currentPage}
          nextLabel=""
          previousLabel=""
        /> */
}
